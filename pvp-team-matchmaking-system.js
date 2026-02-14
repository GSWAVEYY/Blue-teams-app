/**
 * NEXUS Team-Based Matchmaking System
 * Phase 12: Team Queue, Matching Algorithm, Scheduling
 *
 * Comprehensive team matchmaking:
 * - Queue management for team-based matches
 * - Skill-based matching with expanding ranges
 * - Region and timezone awareness
 * - Hero composition analysis
 * - Recent opponent avoidance
 */

class TeamMatchmakingQueue {
    constructor(networkManager) {
        this.network = networkManager;

        // Team queues by game mode
        this.queues = new Map(); // gameMode:teamSize -> TeamQueue[]
        this.activeMatches = new Map(); // matchId -> match info
        this.recentMatches = new Map(); // teamId -> [opponent info]

        // Team tracking
        this.queuedTeams = new Map(); // teamId -> queue info
        this.teamRatings = new Map(); // teamId -> current LP

        // Settings
        this.settings = {
            initialRange: 300,        // ±300 LP initial range
            expandRate: 50,           // Expand ±50 every 30s
            maxRange: 800,            // Max ±800 LP
            initialWait: 30000,       // 30s before expanding
            expansionInterval: 30000, // Expand every 30s
            forceMatchAfter: 180000,  // 3 min force match
            maxWaitTime: 300000,      // 5 min max
            minTeamSize: 3,
            maxTeamSize: 5,
            recentMatchCooldown: 3600000  // 1 hour
        };

        // Queue management
        this.maxQueueSize = 100;
        this.queueTimers = new Map(); // teamId -> timer references

        // Statistics
        this.stats = {
            totalMatches: 0,
            averageQueueTime: 0,
            successfulMatches: 0,
            failedMatches: 0
        };

        // Setup network listeners
        this.setupNetworkListeners();
    }

    /**
     * Setup network listeners
     */
    setupNetworkListeners() {
        this.network.on('TEAM_MATCH_FOUND', (payload) => this.onTeamMatchFound(payload));
        this.network.on('TEAM_QUEUE_UPDATED', (payload) => this.onQueueUpdated(payload));
    }

    /**
     * Join team queue
     */
    joinQueue(teamId, teamLP, gameMode, teamSize, heroAvailability = {}) {
        // Validate
        if (teamSize < this.settings.minTeamSize || teamSize > this.settings.maxTeamSize) {
            console.error('[TeamMatchmaking] Invalid team size');
            return false;
        }

        const queueKey = `${gameMode}:${teamSize}`;

        // Create queue if needed
        if (!this.queues.has(queueKey)) {
            this.queues.set(queueKey, []);
        }

        // Check if already queued
        if (this.queuedTeams.has(teamId)) {
            console.error('[TeamMatchmaking] Team already in queue');
            return false;
        }

        // Create queue entry
        const queueEntry = {
            teamId: teamId,
            teamLP: teamLP,
            gameMode: gameMode,
            teamSize: teamSize,
            heroAvailability: heroAvailability,
            queueTime: Date.now(),
            searchRange: this.settings.initialRange,
            lastExpansion: Date.now(),
            position: 0,
            estimatedWaitTime: 0
        };

        this.queues.get(queueKey).push(queueEntry);
        this.queuedTeams.set(teamId, queueEntry);
        this.teamRatings.set(teamId, teamLP);

        // Start expansion timer
        this.startRangeExpansion(teamId, queueKey);

        // Attempt to find match
        setTimeout(() => this.findMatches(queueKey), 100);

        console.log(`[TeamMatchmaking] Team ${teamId} joined queue (${gameMode} ${teamSize}v${teamSize})`);

        // Send to server
        this.network.send('TEAM_QUEUE_JOIN', {
            teamId,
            gameMode,
            teamSize,
            teamLP
        });

        return true;
    }

    /**
     * Leave queue
     */
    leaveQueue(teamId) {
        const entry = this.queuedTeams.get(teamId);
        if (!entry) return false;

        const queueKey = `${entry.gameMode}:${entry.teamSize}`;
        const queue = this.queues.get(queueKey);

        if (queue) {
            const index = queue.findIndex(q => q.teamId === teamId);
            if (index > -1) {
                queue.splice(index, 1);
            }
        }

        // Clear timers
        if (this.queueTimers.has(teamId)) {
            clearInterval(this.queueTimers.get(teamId));
            this.queueTimers.delete(teamId);
        }

        this.queuedTeams.delete(teamId);

        this.network.send('TEAM_QUEUE_LEAVE', { teamId });

        console.log(`[TeamMatchmaking] Team ${teamId} left queue`);
        return true;
    }

    /**
     * Start range expansion timer
     */
    startRangeExpansion(teamId, queueKey) {
        const timer = setInterval(() => {
            const entry = this.queuedTeams.get(teamId);
            if (!entry) {
                clearInterval(timer);
                return;
            }

            const timeSinceLastExpansion = Date.now() - entry.lastExpansion;

            if (timeSinceLastExpansion >= this.settings.expansionInterval) {
                const newRange = Math.min(
                    entry.searchRange + this.settings.expandRate,
                    this.settings.maxRange
                );

                entry.searchRange = newRange;
                entry.lastExpansion = Date.now();

                const queueDuration = Date.now() - entry.queueTime;
                console.log(
                    `[TeamMatchmaking] Team ${teamId} search range expanded to ±${newRange} LP ` +
                    `(${Math.round(queueDuration / 1000)}s in queue)`
                );

                // Try to find match again
                this.findMatches(queueKey);
            }
        }, 5000); // Check every 5s

        this.queueTimers.set(teamId, timer);
    }

    /**
     * Find matches for teams in queue
     */
    findMatches(queueKey) {
        const queue = this.queues.get(queueKey);
        if (!queue || queue.length < 2) return;

        const matched = [];

        // Simple matching: pair first team with best match
        for (let i = 0; i < queue.length - 1; i++) {
            const team1 = queue[i];
            const timeSinceQueue = Date.now() - team1.queueTime;

            // Check if should force match
            const shouldForceMatch = timeSinceQueue >= this.settings.forceMatchAfter;
            const shouldTimeout = timeSinceQueue >= this.settings.maxWaitTime;

            if (shouldTimeout) {
                this.handleQueueTimeout(team1, queue);
                matched.push(i);
                continue;
            }

            // Find best opponent
            let bestOpponent = null;
            let bestScore = -Infinity;

            for (let j = i + 1; j < queue.length; j++) {
                const team2 = queue[j];
                const score = this.calculateMatchQuality(team1, team2, shouldForceMatch);

                if (score > bestScore) {
                    bestScore = score;
                    bestOpponent = { team: team2, index: j, score };
                }
            }

            // If good match found, create match
            if (bestOpponent && (bestScore > 60 || shouldForceMatch)) {
                this.createTeamMatch(team1, bestOpponent.team, bestScore);
                matched.push(i, bestOpponent.index);
            }
        }

        // Remove matched teams from queue
        matched.sort((a, b) => b - a); // Sort descending to avoid index issues
        matched.forEach(index => queue.splice(index, 1));
    }

    /**
     * Calculate match quality score
     */
    calculateMatchQuality(team1, team2, ignoreRange = false) {
        // Skill balance (0-100)
        const lpDifference = Math.abs(team1.teamLP - team2.teamLP);
        const isInRange = lpDifference <= team1.searchRange && lpDifference <= team2.searchRange;

        if (!isInRange && !ignoreRange) {
            return -Infinity; // Out of range, skip
        }

        const skillBalance = Math.max(0, 100 - (lpDifference / team1.searchRange) * 100);

        // Recent match penalty
        let recentPenalty = 0;
        const recentOpponents = this.recentMatches.get(team1.teamId) || [];
        if (recentOpponents.some(opp => opp.teamId === team2.teamId)) {
            const timeSinceLastMatch = Date.now() - recentOpponents.find(o => o.teamId === team2.teamId).timestamp;
            if (timeSinceLastMatch < this.settings.recentMatchCooldown) {
                recentPenalty = -30; // Significant penalty for recent opponents
            }
        }

        // Time spent in queue (favor balanced waiting)
        const team1Wait = Date.now() - team1.queueTime;
        const team2Wait = Date.now() - team2.queueTime;
        const waitBalance = 10 - (Math.abs(team1Wait - team2Wait) / 30000) * 10; // 0-10 points

        // Hero composition compatibility
        const heroMismatch = this.calculateHeroMismatch(team1.heroAvailability, team2.heroAvailability);

        // Total score
        const totalScore = (
            skillBalance * 0.6 +      // Skill balance is most important
            waitBalance * 0.15 +      // Wait time balance
            -heroMismatch * 0.15 +    // Hero availability
            recentPenalty * 0.1       // Recent match penalty
        );

        return Math.max(0, totalScore);
    }

    /**
     * Calculate hero composition mismatch
     */
    calculateHeroMismatch(heroes1, heroes2) {
        let mismatchScore = 0;

        // Check for hero overlap (both teams want same heroes)
        for (const hero in heroes1) {
            if (heroes1[hero] && heroes2[hero]) {
                mismatchScore += 5; // Penalty for wanting same hero
            }
        }

        return Math.min(20, mismatchScore); // Cap at 20
    }

    /**
     * Create team match
     */
    createTeamMatch(team1, team2, qualityScore) {
        const matchId = this.generateUUID();

        const match = {
            id: matchId,
            blueTeam: { id: team1.teamId, lp: team1.teamLP },
            redTeam: { id: team2.teamId, lp: team2.teamLP },
            gameMode: team1.gameMode,
            teamSize: team1.teamSize,
            qualityScore: qualityScore,
            createdAt: Date.now(),
            status: 'found',
            estimatedStartTime: Date.now() + 10000 // 10s to load
        };

        this.activeMatches.set(matchId, match);

        // Update recent matches
        this.recordRecentMatch(team1.teamId, team2.teamId);
        this.recordRecentMatch(team2.teamId, team1.teamId);

        // Update stats
        this.stats.totalMatches++;
        const avgQueueTime = ((team1.queueTime + team2.queueTime) / 2);
        this.stats.averageQueueTime = (this.stats.averageQueueTime + avgQueueTime) / 2;
        this.stats.successfulMatches++;

        // Remove from queue
        this.leaveQueue(team1.teamId);
        this.leaveQueue(team2.teamId);

        // Send to server
        this.network.send('TEAM_MATCH_FOUND', { match });

        console.log(
            `[TeamMatchmaking] Match created: ${team1.teamId} (${team1.teamLP} LP) ` +
            `vs ${team2.teamId} (${team2.teamLP} LP) - Quality: ${qualityScore.toFixed(0)}/100`
        );

        return match;
    }

    /**
     * Record recent match for cooldown
     */
    recordRecentMatch(teamId, opponentId) {
        if (!this.recentMatches.has(teamId)) {
            this.recentMatches.set(teamId, []);
        }

        const recent = this.recentMatches.get(teamId);
        recent.unshift({ teamId: opponentId, timestamp: Date.now() });

        // Keep only recent matches
        if (recent.length > 10) {
            recent.pop();
        }
    }

    /**
     * Handle queue timeout
     */
    handleQueueTimeout(entry, queue) {
        console.warn(`[TeamMatchmaking] Queue timeout for team ${entry.teamId}`);
        this.leaveQueue(entry.teamId);
        this.stats.failedMatches++;
    }

    /**
     * Get queue status
     */
    getQueueStatus(teamId) {
        const entry = this.queuedTeams.get(teamId);
        if (!entry) return null;

        const timeSinceQueue = Date.now() - entry.queueTime;
        const estimatedWait = Math.max(0, this.settings.forceMatchAfter - timeSinceQueue);

        return {
            inQueue: true,
            gameMode: entry.gameMode,
            teamSize: entry.teamSize,
            teamLP: entry.teamLP,
            timeSinceQueue: timeSinceQueue,
            searchRange: entry.searchRange,
            estimatedWaitTime: estimatedWait,
            timeoutAt: this.settings.maxWaitTime,
            position: this.getQueuePosition(entry)
        };
    }

    /**
     * Get queue position
     */
    getQueuePosition(entry) {
        const queueKey = `${entry.gameMode}:${entry.teamSize}`;
        const queue = this.queues.get(queueKey) || [];
        return queue.findIndex(q => q.teamId === entry.teamId) + 1;
    }

    /**
     * Get queue statistics
     */
    getStatistics() {
        let totalQueued = 0;
        this.queues.forEach(queue => {
            totalQueued += queue.length;
        });

        return {
            totalMatches: this.stats.totalMatches,
            successfulMatches: this.stats.successfulMatches,
            failedMatches: this.stats.failedMatches,
            successRate: this.stats.totalMatches > 0
                ? ((this.stats.successfulMatches / this.stats.totalMatches) * 100).toFixed(1)
                : '0',
            averageQueueTime: (this.stats.averageQueueTime / 1000).toFixed(1),
            currentlyQueued: totalQueued,
            activeMatches: this.activeMatches.size
        };
    }

    /**
     * Generate UUID
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Handle team match found from server
     */
    onTeamMatchFound(payload) {
        const { matchId, blueTeamId, redTeamId } = payload;
        console.log(`[TeamMatchmaking] Server confirmed match: ${blueTeamId} vs ${redTeamId}`);
    }

    /**
     * Handle queue updated from server
     */
    onQueueUpdated(payload) {
        const { teamId, position, estimatedWait } = payload;
        const entry = this.queuedTeams.get(teamId);
        if (entry) {
            entry.position = position;
            entry.estimatedWaitTime = estimatedWait;
        }
    }

    /**
     * Get all active matches
     */
    getActiveMatches() {
        return Array.from(this.activeMatches.values());
    }

    /**
     * Get team queue info
     */
    getTeamQueueInfo(teamId) {
        return this.queuedTeams.get(teamId);
    }

    /**
     * Get recent opponent history
     */
    getRecentOpponents(teamId) {
        const recent = this.recentMatches.get(teamId) || [];
        return recent.map(r => ({
            teamId: r.teamId,
            matchedAt: new Date(r.timestamp).toISOString()
        }));
    }
}

/**
 * Global team matchmaking instance
 */
let teamMatchmakingQueue = null;

function initializeTeamMatchmaking(networkManager) {
    if (!teamMatchmakingQueue) {
        teamMatchmakingQueue = new TeamMatchmakingQueue(networkManager);
    }
    return teamMatchmakingQueue;
}

function getTeamMatchmakingQueue() {
    if (!teamMatchmakingQueue) {
        console.error('[TeamMatchmaking] Not initialized! Call initializeTeamMatchmaking first.');
        return null;
    }
    return teamMatchmakingQueue;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TeamMatchmakingQueue,
        initializeTeamMatchmaking,
        getTeamMatchmakingQueue
    };
}
