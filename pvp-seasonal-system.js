/**
 * NEXUS Seasonal Competitive System
 * Phase 12: Season Management, Tier Rewards, Events
 *
 * Competitive season infrastructure:
 * - Seasonal ladder rankings
 * - Tier-based rewards
 * - Weekly events and challenges
 * - Season progression tracking
 */

class CompetitiveSeason {
    constructor(seasonNumber, theme = 'Season ' + seasonNumber) {
        this.id = this.generateUUID();
        this.number = seasonNumber;
        this.theme = theme;
        this.status = 'active';     // upcoming, active, ending, finished

        // Timeline (90-day season)
        this.startDate = Date.now();
        this.endDate = Date.now() + (90 * 24 * 3600 * 1000);
        this.duration = 90;
        this.daysRemaining = 90;
        this.currentWeek = 1;
        this.totalWeeks = 13;

        // Tier structure
        this.tiers = {
            'bronze': { minLP: 0, maxLP: 800, icon: '🥉', rewardLP: 100 },
            'silver': { minLP: 800, maxLP: 1200, icon: '🥈', rewardLP: 250 },
            'gold': { minLP: 1200, maxLP: 1600, icon: '🥇', rewardLP: 500 },
            'platinum': { minLP: 1600, maxLP: 2000, icon: '💎', rewardLP: 1000 },
            'elite': { minLP: 2000, maxLP: Infinity, icon: '✨', rewardLP: 2000 }
        };

        // Ladder snapshots
        this.weeklySnapshots = [];
        this.monthlySnapshots = [];
        this.finalLadder = [];

        // Rewards
        this.seasonRewards = {
            byTier: {
                'bronze': { cosmetics: ['bronze_badge'], lpBonus: 100 },
                'silver': { cosmetics: ['silver_badge', 'skin_1'], lpBonus: 250 },
                'gold': { cosmetics: ['gold_badge', 'skin_2', 'emote_1'], lpBonus: 500 },
                'platinum': { cosmetics: ['plat_badge', 'skin_3', 'border_1'], lpBonus: 1000 },
                'elite': { cosmetics: ['elite_badge', 'skin_4', 'border_2', 'spray_1'], lpBonus: 2000 }
            },
            peakRewards: {},
            participation: {}
        };

        // Weekly events
        this.weeklyEvents = [];
        this.specialEvents = [];
        this.powerUpWeeks = [];  // Bonus LP weeks
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
     * Create weekly event
     */
    createWeeklyEvent(weekNumber, name, description, bonusLP = 0) {
        const event = {
            id: this.generateUUID(),
            weekNumber: weekNumber,
            name: name,
            description: description,
            bonusLP: bonusLP,
            startTime: this.startDate + ((weekNumber - 1) * 7 * 24 * 3600 * 1000),
            endTime: this.startDate + (weekNumber * 7 * 24 * 3600 * 1000),
            active: false
        };

        this.weeklyEvents.push(event);
        return event;
    }

    /**
     * Create special event
     */
    createSpecialEvent(name, description, startDate, duration, rewards) {
        const event = {
            id: this.generateUUID(),
            name: name,
            description: description,
            startDate: startDate,
            duration: duration,
            rewards: rewards,
            active: false,
            participants: 0
        };

        this.specialEvents.push(event);
        return event;
    }

    /**
     * Get season progress
     */
    getProgress() {
        const daysElapsed = Math.floor((Date.now() - this.startDate) / (24 * 3600 * 1000));
        const progress = Math.min(100, (daysElapsed / this.duration) * 100);

        return {
            daysElapsed,
            daysRemaining: Math.max(0, this.duration - daysElapsed),
            progressPercent: progress.toFixed(1),
            currentWeek: Math.floor(daysElapsed / 7) + 1,
            nextReset: new Date(this.endDate).toISOString()
        };
    }

    /**
     * Record weekly snapshot
     */
    recordWeeklySnapshot(ladder) {
        this.weeklySnapshots.push({
            week: this.currentWeek,
            timestamp: Date.now(),
            topTeams: ladder.slice(0, 10),
            risingStars: this.identifyRisingStars(ladder)
        });
    }

    /**
     * Identify rising stars
     */
    identifyRisingStars(ladder) {
        if (this.weeklySnapshots.length < 2) return [];

        const lastWeek = this.weeklySnapshots[this.weeklySnapshots.length - 1];
        const risingStars = [];

        ladder.forEach((team, index) => {
            const lastWeekTeam = lastWeek.topTeams.find(t => t.teamId === team.teamId);
            if (lastWeekTeam) {
                const lpGain = team.teamLP - lastWeekTeam.teamLP;
                if (lpGain > 100) {
                    risingStars.push({ ...team, lpGain });
                }
            }
        });

        return risingStars.sort((a, b) => b.lpGain - a.lpGain).slice(0, 5);
    }

    /**
     * End season
     */
    endSeason(finalLadder) {
        this.status = 'finished';
        this.finalLadder = finalLadder;
        this.recordWeeklySnapshot(finalLadder);

        console.log(`[Season] Season ${this.number} ended`);
        return {
            season: this.number,
            winners: finalLadder.slice(0, 3),
            totalParticipants: finalLadder.length
        };
    }
}

class SeasonalManager {
    constructor(networkManager) {
        this.network = networkManager;
        this.currentSeason = null;
        this.seasonHistory = [];
        this.playerSeasonStats = new Map(); // playerId -> seasonal stats
        this.teamSeasonStats = new Map();   // teamId -> seasonal stats
    }

    /**
     * Start new season
     */
    startNewSeason(seasonNumber, theme = 'Season ' + seasonNumber) {
        // End previous season if exists
        if (this.currentSeason && this.currentSeason.status !== 'finished') {
            this.endCurrentSeason([]);
        }

        const season = new CompetitiveSeason(seasonNumber, theme);
        this.currentSeason = season;

        // Create default weekly events
        season.createWeeklyEvent(1, 'Opening Week', 'Start your competitive journey');
        season.createWeeklyEvent(6, 'Power Up Week', 'Double LP for all matches', 100);
        season.createWeeklyEvent(13, 'Final Push', 'Last chance to climb', 50);

        console.log(`[SeasonalManager] Started Season ${seasonNumber}: ${theme}`);

        return season;
    }

    /**
     * Get current season
     */
    getCurrentSeason() {
        return this.currentSeason;
    }

    /**
     * Add team to season
     */
    addTeamToSeason(teamId, teamName, teamLP) {
        if (!this.currentSeason) {
            console.error('[SeasonalManager] No active season');
            return false;
        }

        const seasonStats = {
            teamId,
            teamName,
            startingLP: teamLP,
            currentLP: teamLP,
            peakLP: teamLP,
            peakTier: this.getTierFromLP(teamLP),
            matches: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            totalKills: 0,
            totalDeaths: 0,
            lastUpdate: Date.now()
        };

        this.teamSeasonStats.set(teamId, seasonStats);
        return true;
    }

    /**
     * Update team season stats
     */
    updateTeamStats(teamId, matchResult) {
        const stats = this.teamSeasonStats.get(teamId);
        if (!stats) return false;

        stats.matches++;
        if (matchResult.result === 'win') {
            stats.wins++;
        } else {
            stats.losses++;
        }

        stats.currentLP = matchResult.currentLP;
        stats.peakLP = Math.max(stats.peakLP, matchResult.currentLP);
        stats.peakTier = this.getTierFromLP(stats.peakLP);
        stats.totalKills += matchResult.kills;
        stats.totalDeaths += matchResult.deaths;
        stats.winRate = ((stats.wins / stats.matches) * 100).toFixed(1);
        stats.lastUpdate = Date.now();

        return true;
    }

    /**
     * Get team season stats
     */
    getTeamSeasonStats(teamId) {
        return this.teamSeasonStats.get(teamId);
    }

    /**
     * Get tier from LP
     */
    getTierFromLP(lp) {
        if (lp < 800) return 'bronze';
        if (lp < 1200) return 'silver';
        if (lp < 1600) return 'gold';
        if (lp < 2000) return 'platinum';
        return 'elite';
    }

    /**
     * Calculate season rewards
     */
    calculateSeasonRewards(teamId, finalLP) {
        if (!this.currentSeason) return null;

        const tier = this.getTierFromLP(finalLP);
        const tierRewards = this.currentSeason.seasonRewards.byTier[tier];

        if (!tierRewards) return null;

        const rewards = {
            tier: tier,
            lpBonus: tierRewards.lpBonus,
            cosmetics: tierRewards.cosmetics,
            totalValue: tierRewards.lpBonus
        };

        return rewards;
    }

    /**
     * End current season
     */
    endCurrentSeason(finalLadder) {
        if (!this.currentSeason) return false;

        const result = this.currentSeason.endSeason(finalLadder);
        this.seasonHistory.push(this.currentSeason);

        console.log(`[SeasonalManager] Season ${this.currentSeason.number} ended`);

        return result;
    }

    /**
     * Get season history
     */
    getSeasonHistory(limit = 10) {
        return this.seasonHistory.slice(-limit).reverse();
    }

    /**
     * Get season statistics
     */
    getSeasonStatistics() {
        if (!this.currentSeason) return null;

        const progress = this.currentSeason.getProgress();
        const totalTeams = this.teamSeasonStats.size;
        let totalMatches = 0;
        let totalWins = 0;

        this.teamSeasonStats.forEach(stats => {
            totalMatches += stats.matches;
            totalWins += stats.wins;
        });

        return {
            season: this.currentSeason.number,
            theme: this.currentSeason.theme,
            ...progress,
            totalTeams,
            totalMatches,
            avgMatchesPerTeam: (totalMatches / totalTeams).toFixed(1),
            globalWinRate: totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0
        };
    }
}

/**
 * Global seasonal manager instance
 */
let seasonalManager = null;

function initializeSeasons(networkManager) {
    if (!seasonalManager) {
        seasonalManager = new SeasonalManager(networkManager);
        // Start first season
        seasonalManager.startNewSeason(1, 'Beta Season');
    }
    return seasonalManager;
}

function getSeasonalManager() {
    if (!seasonalManager) {
        console.error('[SeasonalManager] Not initialized! Call initializeSeasons first.');
        return null;
    }
    return seasonalManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CompetitiveSeason,
        SeasonalManager,
        initializeSeasons,
        getSeasonalManager
    };
}
