/**
 * NEXUS Spectator System
 * Phase 11: Match Watching, Camera Controls, Tactical Overlays
 *
 * Comprehensive spectator experience:
 * - Watch live matches with camera controls
 * - Multiple overlay options (minimap, damage, cooldowns)
 * - Replay functionality with timeline scrubbing
 * - Delayed viewing for competitive fairness
 * - Spectator list and permissions
 */

class SpectatorView {
    constructor(matchId, spectatorId) {
        this.matchId = matchId;
        this.spectatorId = spectatorId;

        // Match info
        this.match = {
            id: matchId,
            mode: 'tdm',
            map: 'arena-1',
            duration: 0,
            startTime: Date.now(),
            blueTeam: [],
            redTeam: [],
            status: 'live'
        };

        // Camera
        this.camera = {
            followHeroId: null,           // null = free cam
            position: { x: 500, y: 500 },
            zoom: 1.0,
            rotation: 0,
            isPaused: false,
            isFreeCamera: true
        };

        // Overlay configuration
        this.overlays = {
            showMinimap: true,
            showHeroNames: true,
            showDamageNumbers: true,
            showAbilityCooldowns: true,
            showTeamInfo: true,
            showKillFeed: true,
            showTimers: true,
            showObjectiveStatus: true
        };

        // Advanced features
        this.features = {
            showPredictedPositions: false,
            highlightTeamColor: null,     // null, 'blue', 'red'
            slowmoEnabled: false,
            slowmoSpeed: 0.5,
            replayMode: false,
            replayTime: 0                 // Current time in replay
        };

        // Data buffers
        this.gameStateHistory = [];       // Recorded states for replay
        this.eventLog = [];               // All match events
        this.spectators = [];             // Other spectators watching
    }

    /**
     * Follow specific hero
     */
    followHero(heroId) {
        this.camera.followHeroId = heroId;
        this.camera.isFreeCamera = false;
    }

    /**
     * Switch to free camera
     */
    freeCamera() {
        this.camera.followHeroId = null;
        this.camera.isFreeCamera = true;
    }

    /**
     * Pan camera
     */
    panCamera(dx, dy) {
        this.camera.position.x += dx;
        this.camera.position.y += dy;
    }

    /**
     * Zoom in/out
     */
    zoom(factor) {
        this.camera.zoom = Math.max(0.5, Math.min(3.0, this.camera.zoom * factor));
    }

    /**
     * Toggle overlay
     */
    toggleOverlay(overlay) {
        if (this.overlays.hasOwnProperty(overlay)) {
            this.overlays[overlay] = !this.overlays[overlay];
            return this.overlays[overlay];
        }
        return false;
    }

    /**
     * Set highlight team
     */
    highlightTeam(teamColor) {
        this.features.highlightTeamColor = teamColor; // null, 'blue', 'red'
    }

    /**
     * Enable slow motion
     */
    enableSlowMotion(speed = 0.5) {
        this.features.slowmoEnabled = true;
        this.features.slowmoSpeed = Math.max(0.1, Math.min(1.0, speed));
    }

    /**
     * Disable slow motion
     */
    disableSlowMotion() {
        this.features.slowmoEnabled = false;
        this.features.slowmoSpeed = 1.0;
    }

    /**
     * Pause spectation
     */
    pause() {
        this.camera.isPaused = true;
    }

    /**
     * Resume spectation
     */
    resume() {
        this.camera.isPaused = false;
    }

    /**
     * Get current view state
     */
    getViewState() {
        return {
            camera: this.camera,
            overlays: this.overlays,
            features: this.features,
            spectatorCount: this.spectators.length
        };
    }
}

class SpectatorManager {
    constructor(networkManager) {
        this.network = networkManager;

        // Spectator views
        this.spectatorViews = new Map();         // spectatorId -> SpectatorView
        this.liveMatches = new Map();            // matchId -> match info
        this.replayMatches = new Map();          // matchId -> replay data

        // Permissions
        this.spectatorAccess = {
            allowFriends: true,
            allowTeamMembers: true,
            allowPublic: true,
            delayedViewMs: 300000                // 5 min delay for fairness
        };

        // Settings
        this.maxSpectatorsPerMatch = 100;
        this.replayHistorySize = 50;

        // Setup network listeners
        this.setupNetworkListeners();

        console.log('[SpectatorManager] Initialized');
    }

    /**
     * Setup network listeners
     */
    setupNetworkListeners() {
        this.network.on('SPECTATOR_JOINED', (payload) => this.onSpectatorJoined(payload));
        this.network.on('SPECTATOR_LEFT', (payload) => this.onSpectatorLeft(payload));
        this.network.on('MATCH_STATE_BROADCAST', (payload) => this.onMatchStateBroadcast(payload));
        this.network.on('MATCH_ENDED', (payload) => this.onMatchEnded(payload));
    }

    /**
     * Create spectator view for match
     */
    createSpectatorView(matchId, spectatorId, match) {
        const view = new SpectatorView(matchId, spectatorId);
        view.match = match;

        this.spectatorViews.set(spectatorId, view);

        // Add to match spectators
        if (!this.liveMatches.has(matchId)) {
            this.liveMatches.set(matchId, {
                id: matchId,
                spectators: [],
                stateHistory: [],
                events: []
            });
        }

        this.liveMatches.get(matchId).spectators.push(spectatorId);

        // Notify server
        this.network.send('SPECTATOR_JOIN_MATCH', {
            matchId,
            spectatorId
        });

        console.log(`[SpectatorManager] ${spectatorId} joined spectating ${matchId}`);
        return view;
    }

    /**
     * Stop spectating
     */
    stopSpectating(spectatorId) {
        const view = this.spectatorViews.get(spectatorId);
        if (!view) return false;

        // Remove from match
        const match = this.liveMatches.get(view.matchId);
        if (match) {
            match.spectators = match.spectators.filter(id => id !== spectatorId);
        }

        this.spectatorViews.delete(spectatorId);

        this.network.send('SPECTATOR_LEFT_MATCH', {
            matchId: view.matchId,
            spectatorId
        });

        return true;
    }

    /**
     * Update spectator camera
     */
    updateCamera(spectatorId, cameraUpdate) {
        const view = this.spectatorViews.get(spectatorId);
        if (!view) return false;

        if (cameraUpdate.followHeroId !== undefined) {
            if (cameraUpdate.followHeroId === null) {
                view.freeCamera();
            } else {
                view.followHero(cameraUpdate.followHeroId);
            }
        }

        if (cameraUpdate.position) {
            view.camera.position = cameraUpdate.position;
        }

        if (cameraUpdate.zoom) {
            view.zoom(cameraUpdate.zoom);
        }

        return true;
    }

    /**
     * Update spectator overlays
     */
    updateOverlays(spectatorId, overlayUpdates) {
        const view = this.spectatorViews.get(spectatorId);
        if (!view) return false;

        Object.assign(view.overlays, overlayUpdates);
        return true;
    }

    /**
     * Handle match state broadcast
     */
    onMatchStateBroadcast(payload) {
        const { matchId, gameState, timestamp } = payload;
        const match = this.liveMatches.get(matchId);

        if (match) {
            // Store state for replay
            match.stateHistory.push({
                state: gameState,
                timestamp: timestamp
            });

            // Keep only recent history
            if (match.stateHistory.length > 6000) { // ~100 seconds at 60FPS
                match.stateHistory.shift();
            }
        }
    }

    /**
     * Handle match ended
     */
    onMatchEnded(payload) {
        const { matchId, result } = payload;
        const match = this.liveMatches.get(matchId);

        if (match) {
            // Move to replay storage
            this.replayMatches.set(matchId, {
                id: matchId,
                result,
                stateHistory: match.stateHistory,
                events: match.events,
                endTime: Date.now()
            });

            // Remove from live matches
            this.liveMatches.delete(matchId);

            // Clean up old replays
            if (this.replayMatches.size > this.replayHistorySize) {
                const oldestKey = this.replayMatches.keys().next().value;
                this.replayMatches.delete(oldestKey);
            }
        }
    }

    /**
     * Start replay
     */
    startReplay(replayId, spectatorId) {
        const replay = this.replayMatches.get(replayId);
        if (!replay) return null;

        const view = new SpectatorView(replayId, spectatorId);
        view.features.replayMode = true;
        view.match.status = 'replay';

        this.spectatorViews.set(spectatorId, view);

        return view;
    }

    /**
     * Scrub replay timeline
     */
    scrubReplay(spectatorId, timePercent) {
        const view = this.spectatorViews.get(spectatorId);
        if (!view || !view.features.replayMode) return false;

        const replay = this.replayMatches.get(view.matchId);
        if (!replay) return false;

        // Calculate time from percentage
        const stateCount = replay.stateHistory.length;
        const stateIndex = Math.floor((timePercent / 100) * stateCount);

        view.features.replayTime = stateIndex;

        return true;
    }

    /**
     * Get spectator view
     */
    getSpectatorView(spectatorId) {
        return this.spectatorViews.get(spectatorId);
    }

    /**
     * Get live matches
     */
    getLiveMatches() {
        return Array.from(this.liveMatches.values());
    }

    /**
     * Get recent replays
     */
    getRecentReplays(limit = 20) {
        const replays = Array.from(this.replayMatches.values());

        // Sort by end time descending
        replays.sort((a, b) => b.endTime - a.endTime);

        return replays.slice(0, limit);
    }

    /**
     * Can user spectate match
     */
    canSpectate(matchId, userId, userTeam, userFriends) {
        const match = this.liveMatches.get(matchId);
        if (!match) return false;

        // Check spectator count
        if (match.spectators.length >= this.maxSpectatorsPerMatch) {
            return false;
        }

        // Check permissions
        const teamMember = match.blueTeamMembers?.includes(userId) ||
                          match.redTeamMembers?.includes(userId);

        if (teamMember) {
            return this.spectatorAccess.allowTeamMembers;
        }

        const isFriend = userFriends?.some(f =>
            match.blueTeamMembers?.includes(f) ||
            match.redTeamMembers?.includes(f)
        );

        if (isFriend) {
            return this.spectatorAccess.allowFriends;
        }

        // Public spectating
        return this.spectatorAccess.allowPublic;
    }

    /**
     * Get spectator statistics
     */
    getStatistics() {
        let totalSpectators = 0;
        let totalMatches = this.liveMatches.size;

        this.liveMatches.forEach(match => {
            totalSpectators += match.spectators.length;
        });

        return {
            liveMatches: totalMatches,
            totalSpectators: totalSpectators,
            averageSpectatorsPerMatch: totalMatches > 0
                ? (totalSpectators / totalMatches).toFixed(1)
                : 0,
            storedReplays: this.replayMatches.size
        };
    }

    /**
     * Handle spectator joined
     */
    onSpectatorJoined(payload) {
        const { matchId, spectatorId } = payload;
        const match = this.liveMatches.get(matchId);

        if (match && !match.spectators.includes(spectatorId)) {
            match.spectators.push(spectatorId);
        }
    }

    /**
     * Handle spectator left
     */
    onSpectatorLeft(payload) {
        const { matchId, spectatorId } = payload;
        const match = this.liveMatches.get(matchId);

        if (match) {
            match.spectators = match.spectators.filter(id => id !== spectatorId);
        }

        this.spectatorViews.delete(spectatorId);
    }
}

/**
 * Global spectator manager instance
 */
let spectatorManager = null;

function initializeSpectator(networkManager) {
    if (!spectatorManager) {
        spectatorManager = new SpectatorManager(networkManager);
    }
    return spectatorManager;
}

function getSpectatorManager() {
    if (!spectatorManager) {
        console.error('[SpectatorManager] Not initialized! Call initializeSpectator first.');
        return null;
    }
    return spectatorManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SpectatorView,
        SpectatorManager,
        initializeSpectator,
        getSpectatorManager
    };
}
