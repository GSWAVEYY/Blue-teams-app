/**
 * NEXUS Matchmaking & Ranking System
 * Phase 9C: ELO Rating, Queue Management, and Team Balancing
 *
 * Implements competitive ranking and fair matchmaking:
 * - ELO rating system with K-factor adjustment
 * - Skill-based queue with expanding range
 * - Team balancing algorithm
 * - Queue management and estimated wait times
 */

class ELORatingSystem {
    constructor() {
        // ELO system constants
        this.K_FACTOR_NORMAL = 32;
        this.K_FACTOR_HIGH_RATING = 16; // For players above 2400 LP
        this.K_FACTOR_NEW_PLAYER = 48; // For new players (first 30 games)

        // Tier definitions
        this.TIERS = [
            { id: 0, name: 'Unranked', minLP: 0, maxLP: 800 },
            { id: 1, name: 'Bronze', minLP: 800, maxLP: 1200 },
            { id: 2, name: 'Silver', minLP: 1200, maxLP: 1600 },
            { id: 3, name: 'Gold', minLP: 1600, maxLP: 2000 },
            { id: 4, name: 'Platinum', minLP: 2000, maxLP: 2400 },
            { id: 5, name: 'Diamond', minLP: 2400, maxLP: Infinity },
            { id: 6, name: 'Challenger', minLP: 2800, maxLP: Infinity } // Top 1%
        ];
    }

    /**
     * Get K-factor based on player stats
     */
    getKFactor(currentRating, gamesPlayed) {
        if (gamesPlayed < 30) {
            return this.K_FACTOR_NEW_PLAYER; // 48 for new players
        }
        if (currentRating > 2400) {
            return this.K_FACTOR_HIGH_RATING; // 16 for high rating
        }
        return this.K_FACTOR_NORMAL; // 32 standard
    }

    /**
     * Calculate expected win probability (0-1)
     */
    calculateExpectedScore(playerRating, opponentRating) {
        return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    }

    /**
     * Calculate new rating after match
     */
    calculateNewRating(currentRating, gamesPlayed, result, opponentRating) {
        const kFactor = this.getKFactor(currentRating, gamesPlayed);
        const expectedScore = this.calculateExpectedScore(currentRating, opponentRating);

        // result: 1 = win, 0.5 = draw, 0 = loss
        const actualScore = result;

        const newRating = currentRating + kFactor * (actualScore - expectedScore);
        return Math.round(newRating);
    }

    /**
     * Get tier for LP rating
     */
    getTier(lp) {
        const tier = this.TIERS.find(t => lp >= t.minLP && lp < t.maxLP);
        return tier || this.TIERS[5]; // Default to Diamond
    }

    /**
     * Get LP within tier (0-100%)
     */
    getLPProgress(lp) {
        const tier = this.getTier(lp);
        const tierRange = tier.maxLP - tier.minLP;
        const lpInTier = lp - tier.minLP;
        return Math.min(100, Math.max(0, (lpInTier / tierRange) * 100));
    }
}

class MatchmakingQueue {
    constructor(networkManager, eloSystem) {
        this.network = networkManager;
        this.eloSystem = eloSystem;

        // Queue state
        this.queues = new Map(); // gameMode -> { players array, startTime }
        this.playerQueue = null; // Current player's queue info
        this.estimatedWaitTime = 0;

        // Matchmaking config
        this.config = {
            minTeamSize: 3,
            maxTeamSize: 5,
            initialRange: 400, // Initial LP range for queue expansion
            rangeExpansion: 100, // Expand range by this each expansion interval
            expansionInterval: 30000, // 30s between expansions
            maxWaitTime: 300000, // 5 minutes max wait before forcing match
            maxRangeDeviation: 1000 // Don't go beyond ±1000 LP
        };

        // Queue timing
        this.queueStartTime = 0;
        this.lastRangeExpansion = 0;
        this.currentSearchRange = this.config.initialRange;

        // Players waiting in queue
        this.queuedPlayers = [];

        // Setup network listeners
        this.network.on('QUEUE_JOINED', (payload) => this.onQueueJoined(payload));
        this.network.on('QUEUE_LEFT', (payload) => this.onQueueLeft(payload));
        this.network.on('QUEUE_UPDATED', (payload) => this.onQueueUpdated(payload));
        this.network.on('MATCH_FOUND', (payload) => this.onMatchFound(payload));
    }

    /**
     * Join matchmaking queue
     */
    joinQueue(gameMode, teamSize, preferredRoles = [], playerRating = 1000) {
        console.log(`[Matchmaking] Joining ${gameMode} ${teamSize}v${teamSize} queue at ${playerRating} LP`);

        this.playerQueue = {
            gameMode,
            teamSize,
            preferredRoles,
            playerRating,
            queueTime: Date.now(),
            player: {
                id: this.network.clientId,
                name: 'Player',
                rating: playerRating,
                tier: this.eloSystem.getTier(playerRating),
                team: null
            }
        };

        this.queueStartTime = Date.now();
        this.currentSearchRange = this.config.initialRange;
        this.lastRangeExpansion = this.queueStartTime;

        // Send join request to server
        this.network.queueJoin(gameMode, teamSize, preferredRoles, playerRating);

        // Start range expansion timer
        this.startRangeExpansion();
    }

    /**
     * Leave matchmaking queue
     */
    leaveQueue(reason = 'user-cancelled') {
        console.log(`[Matchmaking] Leaving queue: ${reason}`);

        if (this.playerQueue) {
            this.network.queueLeave(reason);
            this.playerQueue = null;
        }

        this.stopRangeExpansion();
    }

    /**
     * Start automatic range expansion
     */
    startRangeExpansion() {
        this.expansionTimer = setInterval(() => {
            const timeSinceLastExpansion = Date.now() - this.lastRangeExpansion;

            if (timeSinceLastExpansion >= this.config.expansionInterval) {
                this.currentSearchRange = Math.min(
                    this.currentSearchRange + this.config.rangeExpansion,
                    this.config.maxRangeDeviation
                );

                this.lastRangeExpansion = Date.now();

                const queueDuration = Date.now() - this.queueStartTime;
                console.log(
                    `[Matchmaking] Expanding search range to ±${this.currentSearchRange} LP ` +
                    `(${Math.round(queueDuration / 1000)}s in queue)`
                );
            }
        }, 5000); // Check every 5s
    }

    /**
     * Stop range expansion
     */
    stopRangeExpansion() {
        if (this.expansionTimer) {
            clearInterval(this.expansionTimer);
        }
    }

    /**
     * Handle queue joined response
     */
    onQueueJoined(payload) {
        const { queueId, position, estimatedWaitTime } = payload;

        if (this.playerQueue) {
            this.playerQueue.queueId = queueId;
            this.playerQueue.position = position;
            this.estimatedWaitTime = estimatedWaitTime;

            console.log(
                `[Matchmaking] Queue joined - Position: ${position}, ` +
                `Estimated wait: ${Math.round(estimatedWaitTime / 1000)}s`
            );
        }
    }

    /**
     * Handle queue updated
     */
    onQueueUpdated(payload) {
        const { position, estimatedWaitTime } = payload;

        if (this.playerQueue) {
            this.playerQueue.position = position;
            this.estimatedWaitTime = estimatedWaitTime;
        }
    }

    /**
     * Handle queue left
     */
    onQueueLeft(payload) {
        this.playerQueue = null;
        this.stopRangeExpansion();
    }

    /**
     * Handle match found
     */
    onMatchFound(payload) {
        const { matchId, players, blueTeam, redTeam } = payload;

        console.log(`[Matchmaking] Match found: ${matchId}`);

        // Determine if player is on blue or red team
        const playerTeam = blueTeam.find(h => h.id === this.network.clientId)
            ? 'blue'
            : 'red';

        console.log(`[Matchmaking] Player assigned to ${playerTeam} team`);

        this.playerQueue = null;
        this.stopRangeExpansion();
    }

    /**
     * Get queue status
     */
    getQueueStatus() {
        if (!this.playerQueue) {
            return {
                inQueue: false
            };
        }

        const timeSinceQueueStart = Date.now() - this.queueStartTime;

        return {
            inQueue: true,
            gameMode: this.playerQueue.gameMode,
            teamSize: this.playerQueue.teamSize,
            position: this.playerQueue.position,
            estimatedWaitTime: this.estimatedWaitTime,
            timeSinceQueueStart,
            currentSearchRange: this.currentSearchRange,
            playerRating: this.playerQueue.playerRating,
            tier: this.playerQueue.player.tier
        };
    }
}

class TeamBalancer {
    constructor(eloSystem) {
        this.eloSystem = eloSystem;
    }

    /**
     * Balance teams to have equal skill
     */
    balanceTeams(players, teamSize) {
        // Sort by rating descending
        const sorted = [...players].sort((a, b) => b.rating - a.rating);

        const blueTeam = [];
        const redTeam = [];

        // Distribute players to balance total team rating
        for (let i = 0; i < sorted.length; i++) {
            const player = sorted[i];

            const blueTotal = blueTeam.reduce((sum, p) => sum + p.rating, 0);
            const redTotal = redTeam.reduce((sum, p) => sum + p.rating, 0);

            // Add to team with lower total
            if (blueTeam.length < teamSize && (redTeam.length >= teamSize || blueTotal <= redTotal)) {
                blueTeam.push(player);
            } else if (redTeam.length < teamSize) {
                redTeam.push(player);
            }
        }

        // Calculate balance quality
        const balanceQuality = this.calculateBalanceQuality(blueTeam, redTeam);

        return {
            blueTeam,
            redTeam,
            balanceQuality, // 0-100, higher is more balanced
            blueTeamRating: blueTeam.reduce((sum, p) => sum + p.rating, 0),
            redTeamRating: redTeam.reduce((sum, p) => sum + p.rating, 0),
            ratingDifference: Math.abs(
                blueTeam.reduce((sum, p) => sum + p.rating, 0) -
                redTeam.reduce((sum, p) => sum + p.rating, 0)
            )
        };
    }

    /**
     * Calculate how balanced the teams are (0-100)
     */
    calculateBalanceQuality(blueTeam, redTeam) {
        const blueTotal = blueTeam.reduce((sum, p) => sum + p.rating, 0);
        const redTotal = redTeam.reduce((sum, p) => sum + p.rating, 0);

        const difference = Math.abs(blueTotal - redTotal);
        const maxDifference = Math.max(blueTotal, redTotal) * 0.2; // 20% allowed difference

        const quality = Math.max(0, 100 - (difference / maxDifference) * 100);
        return Math.round(quality);
    }

    /**
     * Get win prediction for blue team (0-100)
     */
    predictWinner(blueTeam, redTeam) {
        const blueTotal = blueTeam.reduce((sum, p) => sum + p.rating, 0);
        const redTotal = redTeam.reduce((sum, p) => sum + p.rating, 0);

        // Average ELO calculation
        const blueAvg = blueTotal / blueTeam.length;
        const redAvg = redTotal / redTeam.length;

        // Use ELO expected score formula
        const expectedScore = 1 / (1 + Math.pow(10, (redAvg - blueAvg) / 400));

        return Math.round(expectedScore * 100);
    }
}

class RankingManager {
    constructor(eloSystem, networkManager) {
        this.eloSystem = eloSystem;
        this.network = networkManager;

        // Player ranking data
        this.playerStats = {
            rating: 1000,
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            tier: null,
            lpProgress: 0
        };

        // Update player stats from network
        this.network.onEvent('onConnect', (profile) => {
            if (profile && profile.ranking) {
                this.playerStats.rating = profile.ranking.lp;
                this.playerStats.gamesPlayed = profile.ranking.gamesPlayed || 0;
                this.playerStats.wins = profile.ranking.wins || 0;
                this.playerStats.losses = profile.ranking.losses || 0;
                this.playerStats.tier = this.eloSystem.getTier(this.playerStats.rating);
                this.playerStats.lpProgress = this.eloSystem.getLPProgress(this.playerStats.rating);
            }
        });
    }

    /**
     * Update rating after match
     */
    updateRating(result, opponentAverageRating = 1000) {
        const previousRating = this.playerStats.rating;

        const newRating = this.eloSystem.calculateNewRating(
            this.playerStats.rating,
            this.playerStats.gamesPlayed,
            result,
            opponentAverageRating
        );

        const ratingChange = newRating - previousRating;

        // Update stats
        this.playerStats.rating = newRating;
        this.playerStats.gamesPlayed++;

        if (result === 1) {
            this.playerStats.wins++;
        } else if (result === 0) {
            this.playerStats.losses++;
        }

        this.playerStats.tier = this.eloSystem.getTier(newRating);
        this.playerStats.lpProgress = this.eloSystem.getLPProgress(newRating);

        console.log(`[Ranking] Rating: ${previousRating} → ${newRating} (${ratingChange > 0 ? '+' : ''}${ratingChange})`);

        return {
            previousRating,
            newRating,
            ratingChange,
            wins: this.playerStats.wins,
            losses: this.playerStats.losses,
            winRate: (this.playerStats.wins / this.playerStats.gamesPlayed * 100).toFixed(1),
            tier: this.playerStats.tier,
            lpProgress: this.playerStats.lpProgress
        };
    }

    /**
     * Get player stats
     */
    getStats() {
        return {
            rating: this.playerStats.rating,
            tier: this.playerStats.tier,
            lpProgress: this.playerStats.lpProgress,
            gamesPlayed: this.playerStats.gamesPlayed,
            wins: this.playerStats.wins,
            losses: this.playerStats.losses,
            winRate: this.playerStats.gamesPlayed > 0
                ? (this.playerStats.wins / this.playerStats.gamesPlayed * 100).toFixed(1)
                : '0.0'
        };
    }
}

/**
 * Global matchmaking manager instance
 */
let matchmakingSystem = null;

function initializeMatchmaking(networkManager) {
    if (!matchmakingSystem) {
        const eloSystem = new ELORatingSystem();
        const queue = new MatchmakingQueue(networkManager, eloSystem);
        const balancer = new TeamBalancer(eloSystem);
        const ranking = new RankingManager(eloSystem, networkManager);

        matchmakingSystem = {
            eloSystem,
            queue,
            balancer,
            ranking,
            getQueueStatus: () => queue.getQueueStatus(),
            getStats: () => ranking.getStats()
        };
    }
    return matchmakingSystem;
}

function getMatchmaking() {
    if (!matchmakingSystem) {
        console.error('[Matchmaking] Not initialized! Call initializeMatchmaking first.');
        return null;
    }
    return matchmakingSystem;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ELORatingSystem,
        MatchmakingQueue,
        TeamBalancer,
        RankingManager,
        initializeMatchmaking,
        getMatchmaking
    };
}
