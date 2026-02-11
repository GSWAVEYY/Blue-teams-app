/**
 * NEXUS Multiplayer Networking System
 * Phase 9: Client-Server WebSocket Implementation
 *
 * Handles real-time communication with game server including:
 * - Connection lifecycle (connect, authenticate, heartbeat, disconnect)
 * - Matchmaking queue management
 * - Game state synchronization
 * - Latency compensation
 * - Network resilience
 */

class NetworkManager {
    constructor(serverUrl = 'ws://localhost:3000') {
        this.serverUrl = serverUrl;
        this.ws = null;
        this.clientId = this.generateUUID();
        this.userId = null;
        this.sessionToken = null;

        // Connection state
        this.isConnected = false;
        this.isAuthenticated = false;
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 4;
        this.reconnectDelays = [1000, 2000, 4000, 8000]; // Exponential backoff in ms

        // Matchmaking state
        this.inQueue = false;
        this.queueId = null;
        this.queuePosition = null;
        this.estimatedWaitTime = null;
        this.currentMatch = null;

        // Game state
        this.gameState = null;
        this.lastGameStateUpdate = 0;
        this.heroStates = new Map(); // Map of heroId -> hero state

        // Latency & timing
        this.latency = 0;
        this.lastHeartbeat = 0;
        this.heartbeatInterval = 30000; // 30 seconds
        this.heartbeatTimeout = null;
        this.messageTimestamps = new Map(); // Track message send times for latency

        // Message handling
        this.messageQueue = [];
        this.messageHandlers = new Map();
        this.responseCallbacks = new Map();
        this.messageId = 0;

        // Client-side prediction
        this.clientPrediction = {
            enabled: true,
            lastPredictedPosition: new Map(), // heroId -> {x, y, timestamp}
            correctionThreshold: 50 // pixels
        };

        // Event handlers
        this.eventHandlers = {
            onConnect: null,
            onDisconnect: null,
            onGameStateUpdate: null,
            onMatchFound: null,
            onMatchStart: null,
            onMatchEnd: null,
            onError: null,
            onLatencyChange: null
        };

        // Setup default message handlers
        this.setupDefaultHandlers();
    }

    /**
     * Generate UUID for client identification
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Setup default message handlers
     */
    setupDefaultHandlers() {
        this.on('CONNECT_ACK', (payload) => this.handleConnectAck(payload));
        this.on('AUTHENTICATE_SUCCESS', (payload) => this.handleAuthSuccess(payload));
        this.on('HEARTBEAT_ACK', (payload) => this.handleHeartbeatAck(payload));
        this.on('GAME_STATE_UPDATE', (payload) => this.handleGameStateUpdate(payload));
        this.on('MATCH_FOUND', (payload) => this.handleMatchFound(payload));
        this.on('MATCH_START', (payload) => this.handleMatchStart(payload));
        this.on('MATCH_END', (payload) => this.handleMatchEnd(payload));
        this.on('ABILITY_CAST', (payload) => this.handleAbilityCast(payload));
        this.on('DAMAGE_EVENT', (payload) => this.handleDamageEvent(payload));
        this.on('KILL_EVENT', (payload) => this.handleKillEvent(payload));
        this.on('ERROR', (payload) => this.handleError(payload));
    }

    /**
     * Establish WebSocket connection to server
     */
    async connect(playerName, sessionToken = null) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`[NetworkManager] Connecting to ${this.serverUrl}...`);

                this.ws = new WebSocket(this.serverUrl);

                this.ws.onopen = () => {
                    console.log('[NetworkManager] WebSocket connected');
                    this.isConnected = true;
                    this.connectionAttempts = 0;

                    // Send initial CONNECT message
                    this.send('CONNECT', {
                        playerName: playerName,
                        sessionToken: sessionToken || 'guest-' + this.clientId,
                        version: '1.0.0'
                    });

                    resolve();
                };

                this.ws.onmessage = (event) => {
                    this.handleMessage(JSON.parse(event.data));
                };

                this.ws.onerror = (error) => {
                    console.error('[NetworkManager] WebSocket error:', error);
                    this.handleConnectionError(error);
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.log('[NetworkManager] WebSocket disconnected');
                    this.isConnected = false;
                    this.isAuthenticated = false;
                    this.handleDisconnect();
                };

                // Set connection timeout
                setTimeout(() => {
                    if (!this.isConnected) {
                        reject(new Error('Connection timeout'));
                    }
                }, 10000);

            } catch (error) {
                console.error('[NetworkManager] Connection error:', error);
                reject(error);
            }
        });
    }

    /**
     * Authenticate with server
     */
    authenticate(token, userId) {
        this.sessionToken = token;
        this.userId = userId;

        this.send('AUTHENTICATE', {
            token: token,
            userId: userId
        });
    }

    /**
     * Start heartbeat to maintain connection
     */
    startHeartbeat() {
        this.heartbeatTimeout = setInterval(() => {
            if (this.isConnected && this.isAuthenticated) {
                const clientTimestamp = Date.now();
                this.messageTimestamps.set('heartbeat', clientTimestamp);

                this.send('HEARTBEAT', {
                    clientTimestamp: clientTimestamp
                });
            }
        }, this.heartbeatInterval);

        console.log('[NetworkManager] Heartbeat started');
    }

    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatTimeout) {
            clearInterval(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }

    /**
     * Join matchmaking queue
     */
    queueJoin(gameMode, teamSize, preferredRoles = [], estimatedRank = 1000) {
        if (!this.isAuthenticated) {
            console.error('[NetworkManager] Not authenticated, cannot join queue');
            return;
        }

        this.send('QUEUE_JOIN', {
            gameMode: gameMode, // 'tdm', 'koth', 'search'
            teamSize: teamSize, // 3 or 5
            preferredRoles: preferredRoles,
            estimatedRank: estimatedRank
        });

        this.inQueue = true;
        console.log(`[NetworkManager] Joined queue: ${gameMode} ${teamSize}v${teamSize}`);
    }

    /**
     * Leave matchmaking queue
     */
    queueLeave(reason = 'user-cancelled') {
        if (!this.inQueue) return;

        this.send('QUEUE_LEAVE', {
            reason: reason
        });

        this.inQueue = false;
        console.log('[NetworkManager] Left queue');
    }

    /**
     * Select hero during hero selection phase
     */
    selectHero(heroName, alternates = []) {
        this.send('HERO_SELECT', {
            heroName: heroName,
            alternates: alternates
        });

        console.log(`[NetworkManager] Selected hero: ${heroName}`);
    }

    /**
     * Send movement input to server
     */
    sendMovement(direction, timestamp = Date.now()) {
        if (!this.currentMatch) return;

        // Normalize direction
        const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (magnitude > 0) {
            direction.x /= magnitude;
            direction.y /= magnitude;
        }

        this.send('MOVEMENT_INPUT', {
            direction: direction,
            timestamp: timestamp
        }, false); // Don't wait for response
    }

    /**
     * Send ability cast to server
     */
    sendAbilityCast(abilityKey, targetPosition, targetHeroId = null, timestamp = Date.now()) {
        if (!this.currentMatch) return;

        this.send('ABILITY_USE', {
            abilityKey: abilityKey,
            targetPosition: targetPosition,
            targetHeroId: targetHeroId,
            timestamp: timestamp
        }, false); // Don't wait for response
    }

    /**
     * Send emote to server
     */
    sendEmote(emoteType) {
        if (!this.currentMatch) return;

        this.send('EMOTE_USE', {
            emoteType: emoteType,
            timestamp: Date.now()
        }, false); // Don't wait for response
    }

    /**
     * Send message to server
     */
    send(type, payload = {}, waitForResponse = false) {
        if (!this.isConnected) {
            console.warn(`[NetworkManager] Not connected, queuing message: ${type}`);
            this.messageQueue.push({ type, payload });
            return waitForResponse ? Promise.reject('Not connected') : null;
        }

        const messageId = ++this.messageId;
        const message = {
            id: messageId,
            type: type,
            payload: payload,
            timestamp: Date.now(),
            clientId: this.clientId
        };

        try {
            this.ws.send(JSON.stringify(message));
            console.log(`[NetworkManager] Sent: ${type} (ID: ${messageId})`);

            if (waitForResponse) {
                return new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error(`Message timeout: ${type}`));
                        this.responseCallbacks.delete(messageId);
                    }, 5000);

                    this.responseCallbacks.set(messageId, { resolve, reject, timeout });
                });
            }
        } catch (error) {
            console.error(`[NetworkManager] Send error:`, error);
            this.messageQueue.push({ type, payload });
        }

        return null;
    }

    /**
     * Process queued messages after reconnection
     */
    processQueue() {
        while (this.messageQueue.length > 0) {
            const { type, payload } = this.messageQueue.shift();
            this.send(type, payload);
        }
    }

    /**
     * Handle incoming message
     */
    handleMessage(message) {
        const { id, type, payload, timestamp } = message;

        console.log(`[NetworkManager] Received: ${type} (ID: ${id})`);

        // Check for response callback
        if (id && this.responseCallbacks.has(id)) {
            const { resolve, timeout } = this.responseCallbacks.get(id);
            clearTimeout(timeout);
            resolve(payload);
            this.responseCallbacks.delete(id);
            return;
        }

        // Call handler if exists
        if (this.messageHandlers.has(type)) {
            this.messageHandlers.get(type)(payload, timestamp);
        }
    }

    /**
     * Register message handler
     */
    on(type, handler) {
        this.messageHandlers.set(type, handler);
    }

    /**
     * Register event handler
     */
    onEvent(eventName, callback) {
        if (this.eventHandlers.hasOwnProperty(eventName)) {
            this.eventHandlers[eventName] = callback;
        }
    }

    /**
     * Handler: Connection acknowledged
     */
    handleConnectAck(payload) {
        const { serverId, clientId } = payload;
        this.clientId = clientId;
        console.log(`[NetworkManager] Connected to server ${serverId} as client ${clientId}`);
    }

    /**
     * Handler: Authentication successful
     */
    handleAuthSuccess(payload) {
        const { userId, playerProfile } = payload;
        this.isAuthenticated = true;
        this.userId = userId;

        console.log(`[NetworkManager] Authenticated as ${userId}`);
        this.startHeartbeat();

        if (this.eventHandlers.onConnect) {
            this.eventHandlers.onConnect(playerProfile);
        }
    }

    /**
     * Handler: Heartbeat acknowledgment
     */
    handleHeartbeatAck(payload) {
        const { serverTimestamp, latency } = payload;
        this.latency = latency;
        this.lastHeartbeat = serverTimestamp;

        if (this.eventHandlers.onLatencyChange) {
            this.eventHandlers.onLatencyChange(latency);
        }
    }

    /**
     * Handler: Game state update
     */
    handleGameStateUpdate(payload) {
        const { matchTime, heroStates, scoreBlue, scoreRed, objectives } = payload;

        this.gameState = {
            matchTime,
            scoreBlue,
            scoreRed,
            objectives
        };

        // Update hero states
        if (heroStates) {
            heroStates.forEach(heroState => {
                this.heroStates.set(heroState.id, heroState);
            });
        }

        this.lastGameStateUpdate = Date.now();

        if (this.eventHandlers.onGameStateUpdate) {
            this.eventHandlers.onGameStateUpdate(this.gameState);
        }
    }

    /**
     * Handler: Match found
     */
    handleMatchFound(payload) {
        const { matchId, players, blueTeam, redTeam, map, mode } = payload;

        this.currentMatch = {
            id: matchId,
            players,
            blueTeam,
            redTeam,
            map,
            mode
        };

        console.log(`[NetworkManager] Match found: ${matchId}`);

        if (this.eventHandlers.onMatchFound) {
            this.eventHandlers.onMatchFound(this.currentMatch);
        }
    }

    /**
     * Handler: Match started
     */
    handleMatchStart(payload) {
        const { matchId, mapId, gameState, spawnPoints } = payload;

        this.gameState = gameState;
        this.currentMatch.mapId = mapId;
        this.currentMatch.spawnPoints = spawnPoints;

        console.log(`[NetworkManager] Match started: ${matchId}`);

        if (this.eventHandlers.onMatchStart) {
            this.eventHandlers.onMatchStart(this.currentMatch);
        }
    }

    /**
     * Handler: Match ended
     */
    handleMatchEnd(payload) {
        const { matchId, winnerId, stats, rewards } = payload;

        console.log(`[NetworkManager] Match ended: ${matchId}, Winner: ${winnerId}`);

        this.currentMatch = null;
        this.gameState = null;
        this.heroStates.clear();

        if (this.eventHandlers.onMatchEnd) {
            this.eventHandlers.onMatchEnd({
                matchId,
                winnerId,
                stats,
                rewards
            });
        }
    }

    /**
     * Handler: Ability cast by another player
     */
    handleAbilityCast(payload) {
        const { casterId, abilityKey, targetPosition, targetHeroId } = payload;
        // Game logic will handle visual/mechanical effects
        console.log(`[NetworkManager] Ability cast: ${casterId} used ${abilityKey}`);
    }

    /**
     * Handler: Damage event
     */
    handleDamageEvent(payload) {
        const { sourceId, targetId, damageAmount, isCritical, isKill } = payload;
        // Game logic will handle damage visualization
        console.log(`[NetworkManager] Damage: ${sourceId} → ${targetId} (${damageAmount} HP)`);
    }

    /**
     * Handler: Kill event
     */
    handleKillEvent(payload) {
        const { killerId, victimId, assistantIds } = payload;
        // Game logic will handle kill notifications
        console.log(`[NetworkManager] Kill: ${killerId} killed ${victimId}`);
    }

    /**
     * Handler: Error from server
     */
    handleError(payload) {
        const { code, message } = payload;
        console.error(`[NetworkManager] Server error (${code}): ${message}`);

        if (this.eventHandlers.onError) {
            this.eventHandlers.onError(code, message);
        }
    }

    /**
     * Handle connection errors
     */
    handleConnectionError(error) {
        console.error('[NetworkManager] Connection error:', error);

        if (this.connectionAttempts < this.maxConnectionAttempts) {
            const delay = this.reconnectDelays[this.connectionAttempts];
            this.connectionAttempts++;

            console.log(`[NetworkManager] Reconnecting in ${delay}ms (attempt ${this.connectionAttempts}/${this.maxConnectionAttempts})`);

            setTimeout(() => {
                this.connect('reconnecting').catch(err => {
                    console.error('[NetworkManager] Reconnection failed:', err);
                });
            }, delay);
        } else {
            console.error('[NetworkManager] Max reconnection attempts exceeded');
            if (this.eventHandlers.onError) {
                this.eventHandlers.onError('CONNECTION_FAILED', 'Failed to reconnect after multiple attempts');
            }
        }
    }

    /**
     * Handle disconnection
     */
    handleDisconnect() {
        this.stopHeartbeat();
        this.inQueue = false;
        this.currentMatch = null;

        if (this.eventHandlers.onDisconnect) {
            this.eventHandlers.onDisconnect();
        }
    }

    /**
     * Disconnect from server
     */
    disconnect(reason = 'user-initiated') {
        if (this.isConnected) {
            this.send('DISCONNECT', { reason: reason });
            this.stopHeartbeat();

            if (this.ws) {
                this.ws.close();
            }
        }

        this.isConnected = false;
        this.isAuthenticated = false;
        this.currentMatch = null;
    }

    /**
     * Get current game state
     */
    getGameState() {
        return this.gameState;
    }

    /**
     * Get hero state
     */
    getHeroState(heroId) {
        return this.heroStates.get(heroId);
    }

    /**
     * Get all hero states
     */
    getAllHeroStates() {
        return Array.from(this.heroStates.values());
    }

    /**
     * Get latency
     */
    getLatency() {
        return this.latency;
    }

    /**
     * Get connection status
     */
    getStatus() {
        return {
            connected: this.isConnected,
            authenticated: this.isAuthenticated,
            inQueue: this.inQueue,
            inMatch: this.currentMatch !== null,
            latency: this.latency,
            clientId: this.clientId,
            userId: this.userId
        };
    }
}

/**
 * Global network manager instance
 */
let networkManager = null;

function initializeNetworkManager(serverUrl = 'ws://localhost:3000') {
    if (!networkManager) {
        networkManager = new NetworkManager(serverUrl);
    }
    return networkManager;
}

function getNetworkManager() {
    if (!networkManager) {
        networkManager = new NetworkManager();
    }
    return networkManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NetworkManager, initializeNetworkManager, getNetworkManager };
}
