/**
 * NEXUS Player Management System
 * Phase 9D: Player Profiles, Statistics, Match History, and Social Features
 *
 * Comprehensive player data management:
 * - Player profiles with statistics tracking
 * - Match history and replay metadata
 * - Achievement system
 * - Friend list and social features
 * - Cosmetics and item ownership
 */

class PlayerProfile {
    constructor(userId, username, createdAt = Date.now()) {
        // Basic identity
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.lastLoginAt = Date.now();
        this.platformId = null; // Steam, Discord, etc.

        // Ranking
        this.ranking = {
            lp: 1000,
            tier: { id: 0, name: 'Unranked' },
            wins: 0,
            losses: 0,
            gamesPlayed: 0,
            winRate: 0,
            peakLP: 1000,
            peakTier: { id: 0, name: 'Unranked' },
            lastUpdateAt: Date.now()
        };

        // Overall statistics
        this.statistics = {
            totalMatches: 0,
            totalPlaytime: 0, // seconds
            totalKills: 0,
            totalDeaths: 0,
            totalAssists: 0,
            totalDamageDealt: 0,
            totalDamageTaken: 0,
            averageKDA: 0,
            averageDamagePerGame: 0,
            averageDamageTakenPerGame: 0,
            mostPlayedHero: null,
            heroMastery: new Map() // hero -> { games, wins, kills, damage }
        };

        // Match history (last 100 matches)
        this.matchHistory = [];
        this.maxHistorySize = 100;

        // Cosmetics and items
        this.cosmetics = {
            heroSkins: new Map(), // hero -> [skin keys]
            equippedSkins: new Map(), // hero -> equipped skin key
            emotes: new Map(), // emote key -> owned
            sprays: new Map(), // spray key -> owned
            borders: new Map(), // border key -> owned
            mainHeroes: [] // 3 favorite heroes
        };

        // Social features
        this.social = {
            friends: [],
            blockedPlayers: [],
            followers: 0,
            following: 0,
            teamId: null,
            teamRole: null // Captain, Member
        };

        // Achievements and rewards
        this.achievements = {
            unlocked: new Map(), // achievement id -> timestamp
            progress: new Map() // achievement id -> current progress
        };

        // Preferences
        this.preferences = {
            preferredRoles: [],
            preferredGameMode: 'tdm',
            autoAcceptMatches: false,
            communicationLevel: 'all', // all, team, none
            language: 'en'
        };

        // Account status
        this.status = {
            active: true,
            verified: false,
            premiumTier: 0, // 0=none, 1=standard, 2=premium, 3=elite
            banStatus: null, // null or { reason, expiresAt }
            reportCount: 0
        };
    }

    /**
     * Update player statistics from match result
     */
    addMatchResult(matchData) {
        const {
            matchId,
            gameMode,
            hero,
            team,
            result, // win, loss, draw
            kills,
            deaths,
            assists,
            damageDealt,
            damageTaken,
            duration,
            timestamp
        } = matchData;

        // Add to match history
        const matchRecord = {
            matchId,
            gameMode,
            hero,
            team,
            result,
            kills,
            deaths,
            assists,
            damageDealt,
            damageTaken,
            duration,
            timestamp,
            kda: ((kills + assists) / Math.max(1, deaths)).toFixed(2)
        };

        this.matchHistory.unshift(matchRecord);
        if (this.matchHistory.length > this.maxHistorySize) {
            this.matchHistory.pop();
        }

        // Update overall statistics
        this.statistics.totalMatches++;
        this.statistics.totalPlaytime += duration;
        this.statistics.totalKills += kills;
        this.statistics.totalDeaths += deaths;
        this.statistics.totalAssists += assists;
        this.statistics.totalDamageDealt += damageDealt;
        this.statistics.totalDamageTaken += damageTaken;

        // Update hero mastery
        if (!this.statistics.heroMastery.has(hero)) {
            this.statistics.heroMastery.set(hero, {
                games: 0,
                wins: 0,
                kills: 0,
                damage: 0,
                winRate: 0
            });
        }

        const heroStats = this.statistics.heroMastery.get(hero);
        heroStats.games++;
        heroStats.kills += kills;
        heroStats.damage += damageDealt;
        if (result === 'win') {
            heroStats.wins++;
        }
        heroStats.winRate = ((heroStats.wins / heroStats.games) * 100).toFixed(1);

        // Update most played hero
        let maxGames = 0;
        for (const stats of this.statistics.heroMastery.values()) {
            if (stats.games > maxGames) {
                maxGames = stats.games;
                this.statistics.mostPlayedHero = hero;
            }
        }

        // Recalculate averages
        this.recalculateStatistics();
    }

    /**
     * Recalculate derived statistics
     */
    recalculateStatistics() {
        if (this.statistics.totalMatches > 0) {
            this.statistics.averageKDA =
                ((this.statistics.totalKills + this.statistics.totalAssists) /
                    Math.max(1, this.statistics.totalDeaths)).toFixed(2);

            this.statistics.averageDamagePerGame =
                (this.statistics.totalDamageDealt / this.statistics.totalMatches).toFixed(0);

            this.statistics.averageDamageTakenPerGame =
                (this.statistics.totalDamageTaken / this.statistics.totalMatches).toFixed(0);
        }
    }

    /**
     * Get match history with filtering
     */
    getMatchHistory(filter = {}) {
        let history = [...this.matchHistory];

        if (filter.hero) {
            history = history.filter(m => m.hero === filter.hero);
        }

        if (filter.gameMode) {
            history = history.filter(m => m.gameMode === filter.gameMode);
        }

        if (filter.result) {
            history = history.filter(m => m.result === filter.result);
        }

        if (filter.limit) {
            history = history.slice(0, filter.limit);
        }

        return history;
    }

    /**
     * Get hero-specific statistics
     */
    getHeroStats(heroName) {
        return this.statistics.heroMastery.get(heroName) || null;
    }

    /**
     * Unlock cosmetic item
     */
    unlockCosmetic(type, key) {
        if (type === 'skin') {
            // Assuming key is "hero_skinName"
            const [hero, skinName] = key.split('_');
            if (!this.cosmetics.heroSkins.has(hero)) {
                this.cosmetics.heroSkins.set(hero, []);
            }
            this.cosmetics.heroSkins.get(hero).push(skinName);
        } else if (type === 'emote') {
            this.cosmetics.emotes.set(key, true);
        } else if (type === 'spray') {
            this.cosmetics.sprays.set(key, true);
        } else if (type === 'border') {
            this.cosmetics.borders.set(key, true);
        }
    }

    /**
     * Equip cosmetic
     */
    equipCosmetic(type, heroName, key) {
        if (type === 'skin') {
            this.cosmetics.equippedSkins.set(heroName, key);
        }
    }

    /**
     * Add friend
     */
    addFriend(friendId) {
        if (!this.social.friends.includes(friendId)) {
            this.social.friends.push(friendId);
        }
    }

    /**
     * Remove friend
     */
    removeFriend(friendId) {
        this.social.friends = this.social.friends.filter(id => id !== friendId);
    }

    /**
     * Block player
     */
    blockPlayer(playerId) {
        if (!this.social.blockedPlayers.includes(playerId)) {
            this.social.blockedPlayers.push(playerId);
        }
    }

    /**
     * Unblock player
     */
    unblockPlayer(playerId) {
        this.social.blockedPlayers = this.social.blockedPlayers.filter(id => id !== playerId);
    }

    /**
     * Unlock achievement
     */
    unlockAchievement(achievementId) {
        if (!this.achievements.unlocked.has(achievementId)) {
            this.achievements.unlocked.set(achievementId, Date.now());
        }
    }

    /**
     * Update achievement progress
     */
    updateAchievementProgress(achievementId, progress) {
        this.achievements.progress.set(achievementId, progress);
    }

    /**
     * Get profile summary for display
     */
    getProfileSummary() {
        return {
            userId: this.userId,
            username: this.username,
            level: this.calculateLevel(),
            ranking: this.ranking,
            statistics: {
                totalMatches: this.statistics.totalMatches,
                winRate: this.ranking.gamesPlayed > 0
                    ? ((this.ranking.wins / this.ranking.gamesPlayed) * 100).toFixed(1)
                    : '0.0',
                averageKDA: this.statistics.averageKDA,
                mostPlayedHero: this.statistics.mostPlayedHero,
                totalPlaytime: this.statistics.totalPlaytime
            },
            social: {
                friends: this.social.friends.length,
                followers: this.social.followers,
                teamId: this.social.teamId
            },
            status: this.status.active ? 'online' : 'offline',
            premiumTier: this.status.premiumTier
        };
    }

    /**
     * Calculate player level (1-100 based on playtime)
     */
    calculateLevel() {
        const hoursPlayed = this.statistics.totalPlaytime / 3600;
        return Math.min(100, Math.floor(hoursPlayed / 10) + 1);
    }

    /**
     * Get serializable profile data
     */
    toJSON() {
        return {
            userId: this.userId,
            username: this.username,
            createdAt: this.createdAt,
            ranking: this.ranking,
            statistics: {
                ...this.statistics,
                heroMastery: Array.from(this.statistics.heroMastery.entries())
            },
            matchHistory: this.matchHistory,
            cosmetics: {
                ...this.cosmetics,
                heroSkins: Array.from(this.cosmetics.heroSkins.entries()),
                equippedSkins: Array.from(this.cosmetics.equippedSkins.entries()),
                emotes: Array.from(this.cosmetics.emotes.entries()),
                sprays: Array.from(this.cosmetics.sprays.entries()),
                borders: Array.from(this.cosmetics.borders.entries())
            },
            social: this.social,
            achievements: {
                unlocked: Array.from(this.achievements.unlocked.entries()),
                progress: Array.from(this.achievements.progress.entries())
            },
            preferences: this.preferences,
            status: this.status
        };
    }

    /**
     * Load profile from serialized data
     */
    static fromJSON(data) {
        const profile = new PlayerProfile(data.userId, data.username, data.createdAt);

        if (data.ranking) profile.ranking = data.ranking;
        if (data.statistics) {
            profile.statistics = data.statistics;
            if (Array.isArray(data.statistics.heroMastery)) {
                profile.statistics.heroMastery = new Map(data.statistics.heroMastery);
            }
        }
        if (data.matchHistory) profile.matchHistory = data.matchHistory;
        if (data.cosmetics) {
            if (Array.isArray(data.cosmetics.heroSkins)) {
                profile.cosmetics.heroSkins = new Map(data.cosmetics.heroSkins);
            }
            if (Array.isArray(data.cosmetics.equippedSkins)) {
                profile.cosmetics.equippedSkins = new Map(data.cosmetics.equippedSkins);
            }
            if (Array.isArray(data.cosmetics.emotes)) {
                profile.cosmetics.emotes = new Map(data.cosmetics.emotes);
            }
            if (Array.isArray(data.cosmetics.sprays)) {
                profile.cosmetics.sprays = new Map(data.cosmetics.sprays);
            }
            if (Array.isArray(data.cosmetics.borders)) {
                profile.cosmetics.borders = new Map(data.cosmetics.borders);
            }
        }
        if (data.social) profile.social = data.social;
        if (data.achievements) {
            if (Array.isArray(data.achievements.unlocked)) {
                profile.achievements.unlocked = new Map(data.achievements.unlocked);
            }
            if (Array.isArray(data.achievements.progress)) {
                profile.achievements.progress = new Map(data.achievements.progress);
            }
        }
        if (data.preferences) profile.preferences = data.preferences;
        if (data.status) profile.status = data.status;

        return profile;
    }
}

class PlayerManager {
    constructor(networkManager) {
        this.network = networkManager;
        this.localProfile = null;
        this.cachedProfiles = new Map(); // userId -> PlayerProfile

        // Setup network listeners for profile updates
        this.network.onEvent('onConnect', (playerProfile) => {
            if (playerProfile) {
                this.localProfile = PlayerProfile.fromJSON(playerProfile);
            }
        });
    }

    /**
     * Get local player profile
     */
    getLocalProfile() {
        return this.localProfile;
    }

    /**
     * Set local player profile (after authentication)
     */
    setLocalProfile(profileData) {
        this.localProfile = PlayerProfile.fromJSON(profileData);
        return this.localProfile;
    }

    /**
     * Get cached profile
     */
    getProfile(userId) {
        return this.cachedProfiles.get(userId) || null;
    }

    /**
     * Cache profile data
     */
    cacheProfile(userId, profileData) {
        const profile = PlayerProfile.fromJSON(profileData);
        this.cachedProfiles.set(userId, profile);
        return profile;
    }

    /**
     * Add match to player history
     */
    recordMatch(matchData) {
        if (this.localProfile) {
            this.localProfile.addMatchResult(matchData);
        }
    }

    /**
     * Get player statistics
     */
    getStatistics(userId = null) {
        const profile = userId ? this.getProfile(userId) : this.localProfile;
        if (!profile) return null;

        return {
            totalMatches: profile.statistics.totalMatches,
            winRate: profile.ranking.gamesPlayed > 0
                ? ((profile.ranking.wins / profile.ranking.gamesPlayed) * 100).toFixed(1)
                : '0.0',
            averageKDA: profile.statistics.averageKDA,
            averageDamagePerGame: profile.statistics.averageDamagePerGame,
            mostPlayedHero: profile.statistics.mostPlayedHero,
            heroStats: Array.from(profile.statistics.heroMastery.entries()).map(([hero, stats]) => ({
                hero,
                ...stats
            }))
        };
    }

    /**
     * Get match history
     */
    getMatchHistory(userId = null, options = {}) {
        const profile = userId ? this.getProfile(userId) : this.localProfile;
        if (!profile) return [];

        return profile.getMatchHistory(options);
    }

    /**
     * Get friend list
     */
    getFriends(userId = null) {
        const profile = userId ? this.getProfile(userId) : this.localProfile;
        if (!profile) return [];

        return profile.social.friends;
    }

    /**
     * Add friend
     */
    addFriend(friendId) {
        if (this.localProfile) {
            this.localProfile.addFriend(friendId);
            // Send to server
            this.network.send('ADD_FRIEND', { friendId });
        }
    }

    /**
     * Remove friend
     */
    removeFriend(friendId) {
        if (this.localProfile) {
            this.localProfile.removeFriend(friendId);
            this.network.send('REMOVE_FRIEND', { friendId });
        }
    }

    /**
     * Get cosmetic inventory
     */
    getCosmeticInventory(userId = null) {
        const profile = userId ? this.getProfile(userId) : this.localProfile;
        if (!profile) return null;

        return {
            heroSkins: Object.fromEntries(profile.cosmetics.heroSkins),
            equippedSkins: Object.fromEntries(profile.cosmetics.equippedSkins),
            emotes: Object.fromEntries(profile.cosmetics.emotes),
            sprays: Object.fromEntries(profile.cosmetics.sprays),
            borders: Object.fromEntries(profile.cosmetics.borders)
        };
    }

    /**
     * Get achievements
     */
    getAchievements(userId = null) {
        const profile = userId ? this.getProfile(userId) : this.localProfile;
        if (!profile) return { unlocked: [], progress: [] };

        return {
            unlocked: Array.from(profile.achievements.unlocked.entries()).map(([id, timestamp]) => ({
                id,
                unlockedAt: timestamp
            })),
            progress: Array.from(profile.achievements.progress.entries()).map(([id, progress]) => ({
                id,
                progress
            }))
        };
    }
}

/**
 * Global player manager instance
 */
let playerManager = null;

function initializePlayerSystem(networkManager) {
    if (!playerManager) {
        playerManager = new PlayerManager(networkManager);
    }
    return playerManager;
}

function getPlayerManager() {
    if (!playerManager) {
        console.error('[PlayerManager] Not initialized! Call initializePlayerSystem first.');
        return null;
    }
    return playerManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PlayerProfile,
        PlayerManager,
        initializePlayerSystem,
        getPlayerManager
    };
}
