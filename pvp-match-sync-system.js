/**
 * NEXUS Match State Synchronization System
 * Phase 9B: Client-Server Game State Management
 *
 * Handles real-time synchronization of match state between server and client:
 * - Server-authoritative game state
 * - Client-side prediction for responsiveness
 * - State reconciliation when predictions differ
 * - Efficient delta compression for bandwidth optimization
 * - Interpolation for smooth visual updates
 */

class MatchSyncManager {
    constructor(networkManager) {
        this.network = networkManager;

        // Local game state
        this.localState = {
            matchId: null,
            matchTime: 0,
            gamePhase: 'waiting', // waiting, loading, playing, finished
            blueScore: 0,
            redScore: 0,
            heroStates: new Map(), // Local copy of hero states
            objectives: [],
            events: [] // Event log for this frame
        };

        // Server state (authoritative)
        this.serverState = {
            matchId: null,
            matchTime: 0,
            blueScore: 0,
            redScore: 0,
            heroStates: new Map(),
            objectives: [],
            lastUpdate: 0
        };

        // Client-side prediction
        this.predictions = {
            nextHeroPosition: new Map(), // Predicted position for next frame
            nextHeroVelocity: new Map(), // Current velocity
            correctionThreshold: 50, // pixels before correcting
            interpolationDuration: 100 // ms to smoothly correct position
        };

        // State change tracking
        this.stateChanges = {
            heroPositions: new Set(),
            heroHealth: new Set(),
            heroMana: new Set(),
            heroAbilities: new Set(),
            scores: false,
            objectives: false
        };

        // Synchronization settings
        this.syncSettings = {
            serverUpdateRate: 60, // Hz (every 16.67ms)
            clientPredictionRate: 60, // Hz
            interpolationEnabled: true,
            deltaCompressionEnabled: true,
            stateHistorySize: 30 // Keep 30 frames of history for reconciliation
        };

        // State history for rollback and reconciliation
        this.stateHistory = [];
        this.predictedHistory = [];

        // Latency compensation
        this.latencyInfo = {
            clientLatency: 0,
            estimatedServerLatency: 0,
            adjustedTime: 0
        };

        // Setup network listeners
        this.setupNetworkListeners();
    }

    /**
     * Setup listeners for network events
     */
    setupNetworkListeners() {
        this.network.on('GAME_STATE_UPDATE', (payload) => this.onServerStateUpdate(payload));
        this.network.on('MATCH_START', (payload) => this.onMatchStart(payload));
        this.network.on('ABILITY_CAST', (payload) => this.onRemoteAbilityCast(payload));
        this.network.on('DAMAGE_EVENT', (payload) => this.onRemoteDamage(payload));
        this.network.on('KILL_EVENT', (payload) => this.onRemoteKill(payload));

        // Track latency changes
        this.network.onEvent('onLatencyChange', (latency) => {
            this.latencyInfo.clientLatency = latency;
        });
    }

    /**
     * Initialize match synchronization
     */
    initializeMatch(matchData) {
        const { matchId, blueTeam, redTeam, map, mode, spawnPoints } = matchData;

        this.localState.matchId = matchId;
        this.serverState.matchId = matchId;

        // Initialize hero states from team data
        const allHeroes = [...blueTeam, ...redTeam];
        allHeroes.forEach(hero => {
            const spawn = spawnPoints[hero.id];
            const heroState = {
                id: hero.id,
                name: hero.name,
                position: spawn ? { x: spawn.x, y: spawn.y } : { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                health: 100,
                maxHealth: 100,
                mana: 100,
                maxMana: 100,
                level: 1,
                alive: true,
                respawnTime: 0,
                team: hero.team,
                abilities: {
                    q: { cooldown: 0, lastCast: 0 },
                    e: { cooldown: 0, lastCast: 0 },
                    r: { cooldown: 0, lastCast: 0 }
                }
            };

            this.localState.heroStates.set(hero.id, heroState);
            this.serverState.heroStates.set(hero.id, JSON.parse(JSON.stringify(heroState)));
            this.predictions.nextHeroPosition.set(hero.id, { ...spawn, timestamp: Date.now() });
            this.predictions.nextHeroVelocity.set(hero.id, { x: 0, y: 0 });
        });

        this.localState.gamePhase = 'loading';
        console.log(`[MatchSyncManager] Match initialized: ${matchId}`);
    }

    /**
     * Handle server state update
     */
    onServerStateUpdate(payload) {
        const { matchTime, heroStates, scoreBlue, scoreRed, objectives } = payload;

        // Store previous server state
        const previousServerState = JSON.parse(JSON.stringify(this.serverState));

        // Update server state (authoritative)
        this.serverState.matchTime = matchTime;
        this.serverState.blueScore = scoreBlue;
        this.serverState.redScore = scoreRed;
        this.serverState.lastUpdate = Date.now();

        // Update hero states from server
        if (heroStates) {
            heroStates.forEach(serverHeroState => {
                const existingState = this.serverState.heroStates.get(serverHeroState.id);

                // Track which heroes changed
                if (existingState) {
                    if (existingState.position.x !== serverHeroState.position.x ||
                        existingState.position.y !== serverHeroState.position.y) {
                        this.stateChanges.heroPositions.add(serverHeroState.id);
                    }
                    if (existingState.health !== serverHeroState.health) {
                        this.stateChanges.heroHealth.add(serverHeroState.id);
                    }
                    if (existingState.mana !== serverHeroState.mana) {
                        this.stateChanges.heroMana.add(serverHeroState.id);
                    }
                }

                this.serverState.heroStates.set(serverHeroState.id, serverHeroState);
            });
        }

        // Reconcile client predictions with server state
        this.reconcileClientState();

        // Update objectives
        if (objectives) {
            this.serverState.objectives = objectives;
        }

        // Detect score changes
        if (previousServerState.blueScore !== scoreBlue || previousServerState.redScore !== scoreRed) {
            this.stateChanges.scores = true;
        }
    }

    /**
     * Reconcile client predictions with server state
     */
    reconcileClientState() {
        const heroIds = this.serverState.heroStates.keys();

        for (const heroId of heroIds) {
            const serverState = this.serverState.heroStates.get(heroId);
            const clientState = this.localState.heroStates.get(heroId);
            const predictedPos = this.predictions.nextHeroPosition.get(heroId);

            if (!serverState || !clientState) continue;

            // Calculate position difference
            const dx = serverState.position.x - predictedPos.x;
            const dy = serverState.position.y - predictedPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If prediction error exceeds threshold, correct it
            if (distance > this.predictions.correctionThreshold) {
                console.log(`[MatchSyncManager] Correcting position for ${heroId}: ${distance.toFixed(1)}px error`);

                // Smoothly interpolate to correct position
                this.startPositionCorrection(heroId, predictedPos, serverState.position);
            }

            // Update client state from server (authoritative)
            clientState.health = serverState.health;
            clientState.mana = serverState.mana;
            clientState.level = serverState.level;
            clientState.alive = serverState.alive;
            clientState.position = { ...serverState.position };
        }

        // Sync scores
        this.localState.blueScore = this.serverState.blueScore;
        this.localState.redScore = this.serverState.redScore;
    }

    /**
     * Start smooth position correction
     */
    startPositionCorrection(heroId, currentPos, targetPos) {
        const startTime = Date.now();
        const duration = this.predictions.interpolationDuration;

        const interpolate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const correctedPos = {
                x: currentPos.x + (targetPos.x - currentPos.x) * progress,
                y: currentPos.y + (targetPos.y - currentPos.y) * progress
            };

            this.predictions.nextHeroPosition.set(heroId, correctedPos);

            if (progress < 1) {
                requestAnimationFrame(interpolate);
            }
        };

        interpolate();
    }

    /**
     * Update local prediction based on player input
     */
    updatePrediction(heroId, movement, currentState) {
        if (!this.predictions.nextHeroVelocity.has(heroId)) return;

        const velocity = this.predictions.nextHeroVelocity.get(heroId);
        const position = this.predictions.nextHeroPosition.get(heroId);
        const heroState = this.localState.heroStates.get(heroId);

        if (!position || !heroState) return;

        // Update velocity from input
        const speed = 250; // pixels per second (from game design)
        const frameTime = 16.67 / 1000; // ~60 FPS

        velocity.x = movement.x * speed;
        velocity.y = movement.y * speed;

        // Predict next position
        const nextPos = {
            x: position.x + velocity.x * frameTime,
            y: position.y + velocity.y * frameTime
        };

        this.predictions.nextHeroPosition.set(heroId, nextPos);

        // Update local state optimistically
        heroState.position = { ...nextPos };
        heroState.velocity = { ...velocity };

        return nextPos;
    }

    /**
     * Handle remote ability cast
     */
    onRemoteAbilityCast(payload) {
        const { casterId, abilityKey, targetPosition, targetHeroId } = payload;
        const caster = this.localState.heroStates.get(casterId);

        if (caster) {
            caster.abilities[abilityKey].lastCast = Date.now();
            this.stateChanges.heroAbilities.add(casterId);
        }

        // Log event for animation/VFX system
        this.localState.events.push({
            type: 'ABILITY_CAST',
            casterId,
            abilityKey,
            targetPosition,
            targetHeroId,
            timestamp: Date.now()
        });
    }

    /**
     * Handle remote damage
     */
    onRemoteDamage(payload) {
        const { sourceId, targetId, damageAmount, isCritical, isKill } = payload;
        const target = this.localState.heroStates.get(targetId);

        if (target) {
            target.health = Math.max(0, target.health - damageAmount);
            this.stateChanges.heroHealth.add(targetId);
        }

        // Log event
        this.localState.events.push({
            type: 'DAMAGE',
            sourceId,
            targetId,
            damageAmount,
            isCritical,
            isKill,
            timestamp: Date.now()
        });
    }

    /**
     * Handle remote kill
     */
    onRemoteKill(payload) {
        const { killerId, victimId, assistantIds } = payload;
        const victim = this.localState.heroStates.get(victimId);

        if (victim) {
            victim.alive = false;
            victim.health = 0;
            this.stateChanges.heroHealth.add(victimId);
        }

        // Log event
        this.localState.events.push({
            type: 'KILL',
            killerId,
            victimId,
            assistantIds,
            timestamp: Date.now()
        });
    }

    /**
     * Handle match start
     */
    onMatchStart(payload) {
        this.localState.gamePhase = 'playing';
        this.localState.matchTime = 0;
        console.log(`[MatchSyncManager] Match started`);
    }

    /**
     * Get current interpolated game state
     */
    getGameState() {
        return {
            matchTime: this.localState.matchTime,
            blueScore: this.localState.blueScore,
            redScore: this.localState.redScore,
            heroStates: Array.from(this.localState.heroStates.values()),
            objectives: this.localState.objectives,
            gamePhase: this.localState.gamePhase
        };
    }

    /**
     * Get hero state with prediction
     */
    getHeroState(heroId) {
        const state = this.localState.heroStates.get(heroId);
        const predictedPos = this.predictions.nextHeroPosition.get(heroId);

        if (!state) return null;

        return {
            ...state,
            predictedPosition: predictedPos
        };
    }

    /**
     * Get all changed heroes this frame
     */
    getChangedHeroes() {
        return {
            positionChanged: Array.from(this.stateChanges.heroPositions),
            healthChanged: Array.from(this.stateChanges.heroHealth),
            manaChanged: Array.from(this.stateChanges.heroMana),
            abilitiesChanged: Array.from(this.stateChanges.heroAbilities),
            scoresChanged: this.stateChanges.scores
        };
    }

    /**
     * Get events that happened this frame
     */
    getFrameEvents() {
        return this.localState.events;
    }

    /**
     * Clear frame events
     */
    clearFrameEvents() {
        this.localState.events = [];

        // Clear change tracking
        this.stateChanges.heroPositions.clear();
        this.stateChanges.heroHealth.clear();
        this.stateChanges.heroMana.clear();
        this.stateChanges.heroAbilities.clear();
        this.stateChanges.scores = false;
    }

    /**
     * Get state for current frame
     */
    getFrameState() {
        return {
            state: this.getGameState(),
            changes: this.getChangedHeroes(),
            events: this.getFrameEvents()
        };
    }

    /**
     * Calculate bandwidth usage
     */
    calculateBandwidth() {
        const heroes = this.serverState.heroStates.size;
        const baseBytes = 64; // Message overhead
        const perHeroBytes = 48; // Position, health, mana, level
        const objectiveBytes = 32;

        const bytesPerFrame = baseBytes + (heroes * perHeroBytes) + objectiveBytes;
        const kbPerSecond = (bytesPerFrame * 60) / 1024; // 60 FPS

        return {
            bytesPerFrame,
            kbPerSecond,
            mbPerHour: (kbPerSecond * 3600) / 1024
        };
    }

    /**
     * Get synchronization status
     */
    getStatus() {
        const heroIds = this.serverState.heroStates.keys();
        let totalError = 0;
        let maxError = 0;

        for (const heroId of heroIds) {
            const serverPos = this.serverState.heroStates.get(heroId)?.position;
            const predictedPos = this.predictions.nextHeroPosition.get(heroId);

            if (serverPos && predictedPos) {
                const dx = serverPos.x - predictedPos.x;
                const dy = serverPos.y - predictedPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                totalError += distance;
                maxError = Math.max(maxError, distance);
            }
        }

        const avgError = this.serverState.heroStates.size > 0
            ? totalError / this.serverState.heroStates.size
            : 0;

        return {
            matchId: this.localState.matchId,
            gamePhase: this.localState.gamePhase,
            clientLatency: this.latencyInfo.clientLatency,
            averagePredictionError: avgError.toFixed(1),
            maxPredictionError: maxError.toFixed(1),
            heroCount: this.serverState.heroStates.size,
            bandwidthUsage: this.calculateBandwidth()
        };
    }
}

/**
 * Global match sync manager instance
 */
let matchSyncManager = null;

function initializeMatchSync(networkManager) {
    if (!matchSyncManager) {
        matchSyncManager = new MatchSyncManager(networkManager);
    }
    return matchSyncManager;
}

function getMatchSyncManager() {
    if (!matchSyncManager) {
        console.error('[MatchSyncManager] Not initialized! Call initializeMatchSync first.');
        return null;
    }
    return matchSyncManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MatchSyncManager, initializeMatchSync, getMatchSyncManager };
}
