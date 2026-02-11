/**
 * NEXUS Scrim (Practice Match) System
 * Phase 12 Extension: Team Practice Coordination and Analysis
 *
 * Comprehensive scrim infrastructure:
 * - Scrim request/response system
 * - Custom rule configuration
 * - Practice match statistics
 * - Coach analytics and feedback
 * - Mobile-optimized scheduling
 */

class ScrimRequest {
    constructor(challengerTeamId, opponentTeamId, challengerCaptainId) {
        this.id = this.generateUUID();
        this.challenger = {
            teamId: challengerTeamId,
            captainId: challengerCaptainId,
            accepted: false
        };
        this.opponent = {
            teamId: opponentTeamId,
            captainId: null,
            accepted: false
        };

        // Match details
        this.gameMode = 'tdm';
        this.teamSize = 5;
        this.bestOf = 1;
        this.mapPreference = 'random';
        this.mapPool = ['arena-1', 'arena-2', 'arena-3'];

        // Custom rules
        this.customRules = {
            enabled: false,
            banProtectionBans: 2,
            allowedHeroes: [],       // Empty = all allowed
            bannedHeroes: [],
            timeLimit: 0,            // 0 = no limit
            specialConditions: ''    // "Full build", "Early game only", etc.
        };

        // Scheduling
        this.proposedTime = Date.now() + 3600000; // 1 hour from now
        this.confirmedTime = null;
        this.status = 'proposed';   // proposed, confirmed, live, completed, cancelled
        this.acceptedBy = null;

        // Results
        this.matches = [];
        this.winner = null;
        this.totalDuration = 0;

        // Statistics
        this.teamStats = new Map();

        // Communication
        this.notes = '';
        this.feedback = '';
        this.createdAt = Date.now();
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
     * Accept scrim request
     */
    accept(opponentCaptainId) {
        this.opponent.captainId = opponentCaptainId;
        this.opponent.accepted = true;
        this.status = 'confirmed';
        this.acceptedBy = opponentCaptainId;
        return true;
    }

    /**
     * Decline scrim request
     */
    decline() {
        this.status = 'cancelled';
        return true;
    }

    /**
     * Add custom rule
     */
    addCustomRule(banProtection, bannedHeroes = [], allowedHeroes = []) {
        this.customRules.enabled = true;
        this.customRules.banProtectionBans = banProtection;
        this.customRules.bannedHeroes = bannedHeroes;
        this.customRules.allowedHeroes = allowedHeroes;
        return true;
    }

    /**
     * Record match result
     */
    recordMatchResult(matchNumber, winnerId, score, duration, teamStats) {
        const match = {
            matchNumber: matchNumber,
            winner: winnerId,
            score: score,
            duration: duration,
            timestamp: Date.now()
        };

        this.matches.push(match);
        this.totalDuration += duration;

        // Update team stats
        if (!this.teamStats.has(winnerId)) {
            this.teamStats.set(winnerId, { wins: 0, losses: 0, totalScore: 0 });
        }
        this.teamStats.get(winnerId).wins++;
        this.teamStats.get(winnerId).totalScore += score.winner;

        // Record loser stats
        const loserId = winnerId === this.challenger.teamId ? this.opponent.teamId : this.challenger.teamId;
        if (!this.teamStats.has(loserId)) {
            this.teamStats.set(loserId, { wins: 0, losses: 0, totalScore: 0 });
        }
        this.teamStats.get(loserId).losses++;
        this.teamStats.get(loserId).totalScore += score.loser;

        return true;
    }

    /**
     * Complete scrim
     */
    complete(winnerTeamId) {
        this.status = 'completed';
        this.winner = winnerTeamId;
        return true;
    }

    /**
     * Get summary
     */
    getSummary() {
        return {
            id: this.id,
            challenger: this.challenger.teamId,
            opponent: this.opponent.teamId,
            status: this.status,
            gameMode: this.gameMode,
            teamSize: this.teamSize,
            bestOf: this.bestOf,
            matches: this.matches.length,
            winner: this.winner,
            scheduledFor: new Date(this.proposedTime).toISOString(),
            createdAt: new Date(this.createdAt).toISOString()
        };
    }
}

class ScrimManager {
    constructor(networkManager, teamManager) {
        this.network = networkManager;
        this.teamManager = teamManager;

        // Scrim management
        this.scrims = new Map();                    // scrimId -> ScrimRequest
        this.teamScrims = new Map();                // teamId -> [scrimIds]
        this.pendingRequests = new Map();           // teamId -> [pending scrimIds]
        this.scrimHistory = new Map();              // teamId -> [completed scrims]

        // Statistics
        this.scrimStats = new Map();                // teamId -> stats object

        // Setup network listeners
        this.setupNetworkListeners();
    }

    /**
     * Setup network listeners
     */
    setupNetworkListeners() {
        this.network.on('SCRIM_REQUEST_RECEIVED', (payload) => this.onScrimRequestReceived(payload));
        this.network.on('SCRIM_ACCEPTED', (payload) => this.onScrimAccepted(payload));
        this.network.on('SCRIM_DECLINED', (payload) => this.onScrimDeclined(payload));
    }

    /**
     * Send scrim request
     */
    sendScrimRequest(challengerTeamId, opponentTeamId, captainId, gameMode = 'tdm', teamSize = 5) {
        const scrim = new ScrimRequest(challengerTeamId, opponentTeamId, captainId);
        scrim.gameMode = gameMode;
        scrim.teamSize = teamSize;

        this.scrims.set(scrim.id, scrim);

        // Track pending requests
        if (!this.pendingRequests.has(opponentTeamId)) {
            this.pendingRequests.set(opponentTeamId, []);
        }
        this.pendingRequests.get(opponentTeamId).push(scrim.id);

        // Send to server
        this.network.send('SCRIM_REQUEST_SENT', {
            scrimId: scrim.id,
            challengerTeamId,
            opponentTeamId,
            gameMode,
            teamSize
        });

        console.log(`[ScrimManager] Scrim request sent: ${challengerTeamId} → ${opponentTeamId}`);
        return scrim;
    }

    /**
     * Accept scrim request
     */
    acceptScrimRequest(scrimId, teamId, captainId) {
        const scrim = this.scrims.get(scrimId);
        if (!scrim) return false;

        if (scrim.opponent.teamId !== teamId) {
            console.error('[ScrimManager] Wrong team accepting scrim');
            return false;
        }

        scrim.accept(captainId);

        // Remove from pending
        const pending = this.pendingRequests.get(teamId) || [];
        this.pendingRequests.set(teamId, pending.filter(id => id !== scrimId));

        // Add to active scrims
        if (!this.teamScrims.has(teamId)) {
            this.teamScrims.set(teamId, []);
        }
        this.teamScrims.get(teamId).push(scrimId);

        // Send to server
        this.network.send('SCRIM_ACCEPTED', {
            scrimId,
            teamId,
            captainId
        });

        console.log(`[ScrimManager] Scrim request accepted: ${scrimId}`);
        return true;
    }

    /**
     * Decline scrim request
     */
    declineScrimRequest(scrimId, teamId, reason = '') {
        const scrim = this.scrims.get(scrimId);
        if (!scrim) return false;

        scrim.decline();

        // Remove from pending
        const pending = this.pendingRequests.get(teamId) || [];
        this.pendingRequests.set(teamId, pending.filter(id => id !== scrimId));

        this.network.send('SCRIM_DECLINED', {
            scrimId,
            teamId,
            reason
        });

        console.log(`[ScrimManager] Scrim request declined: ${scrimId}`);
        return true;
    }

    /**
     * Record scrim match result
     */
    recordScrimResult(scrimId, matchNumber, winnerId, score, duration, teamStats) {
        const scrim = this.scrims.get(scrimId);
        if (!scrim) return false;

        scrim.recordMatchResult(matchNumber, winnerId, score, duration, teamStats);

        // Update team stats
        this.updateTeamScrimStats(winnerId, true, score);
        const loserId = winnerId === scrim.challenger.teamId ? scrim.opponent.teamId : scrim.challenger.teamId;
        this.updateTeamScrimStats(loserId, false, { winner: score.loser, loser: score.winner });

        return true;
    }

    /**
     * Complete scrim
     */
    completeScrim(scrimId, winnerTeamId) {
        const scrim = this.scrims.get(scrimId);
        if (!scrim) return false;

        scrim.complete(winnerTeamId);

        // Move to history
        const challengerHistory = this.scrimHistory.get(scrim.challenger.teamId) || [];
        challengerHistory.push(scrimId);
        this.scrimHistory.set(scrim.challenger.teamId, challengerHistory);

        const opponentHistory = this.scrimHistory.get(scrim.opponent.teamId) || [];
        opponentHistory.push(scrimId);
        this.scrimHistory.set(scrim.opponent.teamId, opponentHistory);

        // Remove from active
        [scrim.challenger.teamId, scrim.opponent.teamId].forEach(teamId => {
            const active = this.teamScrims.get(teamId) || [];
            this.teamScrims.set(teamId, active.filter(id => id !== scrimId));
        });

        this.network.send('SCRIM_COMPLETED', {
            scrimId,
            winner: winnerTeamId
        });

        console.log(`[ScrimManager] Scrim completed: ${scrimId} - Winner: ${winnerTeamId}`);
        return true;
    }

    /**
     * Update team scrim statistics
     */
    updateTeamScrimStats(teamId, won, score) {
        if (!this.scrimStats.has(teamId)) {
            this.scrimStats.set(teamId, {
                scrims: 0,
                wins: 0,
                losses: 0,
                totalScore: 0,
                avgScore: 0,
                winRate: 0,
                opponents: new Map()
            });
        }

        const stats = this.scrimStats.get(teamId);
        stats.scrims++;
        if (won) {
            stats.wins++;
        } else {
            stats.losses++;
        }
        stats.totalScore += score.winner;
        stats.avgScore = (stats.totalScore / stats.scrims).toFixed(1);
        stats.winRate = ((stats.wins / stats.scrims) * 100).toFixed(1);
    }

    /**
     * Get pending scrim requests
     */
    getPendingRequests(teamId) {
        const pending = this.pendingRequests.get(teamId) || [];
        return pending.map(scrimId => this.scrims.get(scrimId)).filter(s => s);
    }

    /**
     * Get scrim history
     */
    getScrimHistory(teamId, limit = 20) {
        const history = this.scrimHistory.get(teamId) || [];
        return history
            .slice(-limit)
            .reverse()
            .map(scrimId => this.scrims.get(scrimId))
            .filter(s => s);
    }

    /**
     * Get scrim statistics
     */
    getScrimStats(teamId) {
        return this.scrimStats.get(teamId) || null;
    }

    /**
     * Get vs opponent statistics
     */
    getVsOpponentStats(teamId, opponentTeamId) {
        const history = this.getScrimHistory(teamId, 100);

        const vsStats = {
            totalMatches: 0,
            wins: 0,
            losses: 0,
            lastMatch: null,
            winRate: 0
        };

        history.forEach(scrim => {
            const isChallenger = scrim.challenger.teamId === teamId;
            const isOpponent = scrim.opponent.teamId === opponentTeamId || (isChallenger && scrim.opponent.teamId === opponentTeamId);

            if (isOpponent || (!isChallenger && scrim.challenger.teamId === opponentTeamId)) {
                vsStats.totalMatches++;
                if (scrim.winner === teamId) {
                    vsStats.wins++;
                } else {
                    vsStats.losses++;
                }
                vsStats.lastMatch = scrim.createdAt;
            }
        });

        if (vsStats.totalMatches > 0) {
            vsStats.winRate = ((vsStats.wins / vsStats.totalMatches) * 100).toFixed(1);
        }

        return vsStats;
    }

    /**
     * Get recommended opponents
     */
    getRecommendedOpponents(teamId, limit = 5) {
        const teamStats = this.getScrimStats(teamId);
        if (!teamStats) return [];

        // Find teams with similar win rates
        const recommendations = [];

        this.scrimStats.forEach((stats, opponentTeamId) => {
            if (opponentTeamId === teamId) return;

            const winRateDiff = Math.abs(parseFloat(stats.winRate) - parseFloat(teamStats.winRate));
            recommendations.push({
                teamId: opponentTeamId,
                winRate: stats.winRate,
                compatibility: 100 - (winRateDiff * 2), // Lower diff = better match
                lastScrim: this.getVsOpponentStats(teamId, opponentTeamId).lastMatch
            });
        });

        return recommendations
            .sort((a, b) => b.compatibility - a.compatibility)
            .slice(0, limit);
    }

    /**
     * Get coach analytics
     */
    getCoachAnalytics(teamId) {
        const stats = this.getScrimStats(teamId);
        if (!stats) return null;

        const history = this.getScrimHistory(teamId, 10);

        // Calculate trends
        let strengthAreas = [];
        let weaknessAreas = [];

        if (parseFloat(stats.winRate) > 65) {
            strengthAreas.push('Strong execution');
            strengthAreas.push('High coordination');
        }

        if (parseFloat(stats.winRate) < 40) {
            weaknessAreas.push('Early game transitions');
            weaknessAreas.push('Team fight coordination');
        }

        return {
            totalScrims: stats.scrims,
            winRate: stats.winRate,
            avgScore: stats.avgScore,
            recentForm: history.length > 0 ? history[0].winner === teamId ? 'Winning' : 'Losing' : 'N/A',
            strengthAreas,
            weaknessAreas,
            recommendations: [
                'Focus on early game rotations',
                'Practice objective control',
                'Improve team communication'
            ]
        };
    }

    /**
     * Handle scrim request received
     */
    onScrimRequestReceived(payload) {
        const { scrimData } = payload;
        const scrim = new ScrimRequest(scrimData.challengerTeamId, scrimData.opponentTeamId, scrimData.captainId);
        this.scrims.set(scrim.id, scrim);
        console.log(`[ScrimManager] Received scrim request: ${scrim.id}`);
    }

    /**
     * Handle scrim accepted
     */
    onScrimAccepted(payload) {
        const { scrimId } = payload;
        const scrim = this.scrims.get(scrimId);
        if (scrim) {
            scrim.status = 'confirmed';
            console.log(`[ScrimManager] Scrim confirmed: ${scrimId}`);
        }
    }

    /**
     * Handle scrim declined
     */
    onScrimDeclined(payload) {
        const { scrimId } = payload;
        const scrim = this.scrims.get(scrimId);
        if (scrim) {
            scrim.status = 'cancelled';
            console.log(`[ScrimManager] Scrim declined: ${scrimId}`);
        }
    }

    /**
     * Get all scrims for team
     */
    getTeamScrims(teamId) {
        const scrimIds = this.teamScrims.get(teamId) || [];
        return scrimIds.map(id => this.scrims.get(id)).filter(s => s);
    }
}

/**
 * Global scrim manager instance
 */
let scrimManager = null;

function initializeScrims(networkManager, teamManager) {
    if (!scrimManager) {
        scrimManager = new ScrimManager(networkManager, teamManager);
    }
    return scrimManager;
}

function getScrimManager() {
    if (!scrimManager) {
        console.error('[ScrimManager] Not initialized! Call initializeScrims first.');
        return null;
    }
    return scrimManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ScrimRequest,
        ScrimManager,
        initializeScrims,
        getScrimManager
    };
}
