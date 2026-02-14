/**
 * NEXUS Team/Clan System
 * Phase 11: Team Management, Customization, and Team Ladder
 *
 * Comprehensive team system enabling:
 * - Team creation and customization
 * - Roster management with role hierarchy
 * - Team statistics and performance tracking
 * - Team ladder rankings
 * - Team branding and skins
 */

class Team {
    constructor(name, captainId, captainName) {
        // Basic identity
        this.id = this.generateUUID();
        this.name = name;
        this.tag = this.generateTag();
        this.description = '';
        this.createdAt = Date.now();
        this.updatedAt = Date.now();

        // Branding
        this.branding = {
            bannerUrl: null,
            logoUrl: null,
            primaryColor: '#00d4ff',      // Cyan
            secondaryColor: '#0099cc',    // Darker cyan
            tagline: ''
        };

        // Leadership
        this.leadership = {
            captainId: captainId,
            coaches: [],                  // Max 5
            managers: []                  // Max 5
        };

        // Roster
        this.roster = {
            members: {
                [captainId]: {
                    joinedAt: Date.now(),
                    role: 'captain',
                    heroSpecialization: [],
                    level: 1,
                    stats: {
                        gamesPlayed: 0,
                        wins: 0,
                        losses: 0
                    }
                }
            },
            maxSize: 10,
            currentSize: 1
        };

        // Metadata
        this.tier = 'bronze';             // bronze, silver, gold, platinum, elite
        this.founded = new Date().getFullYear();
        this.region = 'NA';               // NA, EU, APAC

        // Ranking
        this.ranking = {
            teamLP: 1000,
            tier: 'bronze',
            wins: 0,
            losses: 0,
            winRate: 0,
            rank: 0                       // Global position
        };

        // Settings
        this.settings = {
            joinPolicy: 'invitation',     // open, invitation, application
            minRank: 800,
            requireVerification: false,
            allowSpectators: true,
            allowPublicChat: true
        };

        // Statistics
        this.statistics = {
            totalMatches: 0,
            totalKills: 0,
            totalDeaths: 0,
            totalDamage: 0,
            averageKDA: 0,
            winRate: 0,
            mostPlayedMode: 'tdm',
            topPerformer: null
        };

        // Team chat
        this.chat = [];               // Message history
        this.announcements = [];      // Pinned announcements

        console.log(`[Team] Created: ${name} (${this.id})`);
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
     * Generate 4-character team tag
     */
    generateTag() {
        return Math.random().toString(36).substring(2, 6).toUpperCase();
    }

    /**
     * Add member to team
     */
    addMember(userId, role = 'member') {
        if (this.roster.currentSize >= this.roster.maxSize) {
            console.warn(`[Team] ${this.name} is at max capacity`);
            return false;
        }

        if (this.roster.members[userId]) {
            console.warn(`[Team] ${userId} already in team`);
            return false;
        }

        this.roster.members[userId] = {
            joinedAt: Date.now(),
            role: role,
            heroSpecialization: [],
            level: 1,
            stats: {
                gamesPlayed: 0,
                wins: 0,
                losses: 0
            }
        };

        this.roster.currentSize++;
        this.updatedAt = Date.now();

        console.log(`[Team] Added ${userId} as ${role} to ${this.name}`);
        return true;
    }

    /**
     * Remove member from team
     */
    removeMember(userId) {
        if (!this.roster.members[userId]) {
            return false;
        }

        const role = this.roster.members[userId].role;

        if (role === 'captain') {
            console.warn(`[Team] Cannot remove captain directly`);
            return false;
        }

        delete this.roster.members[userId];
        this.roster.currentSize--;
        this.updatedAt = Date.now();

        console.log(`[Team] Removed ${userId} from ${this.name}`);
        return true;
    }

    /**
     * Promote member to coach
     */
    promoteToCoach(userId) {
        if (!this.roster.members[userId]) return false;
        if (this.leadership.coaches.length >= 5) return false;

        const member = this.roster.members[userId];
        member.role = 'coach';
        this.leadership.coaches.push(userId);
        this.updatedAt = Date.now();

        return true;
    }

    /**
     * Demote coach to member
     */
    demoteCoach(userId) {
        if (!this.leadership.coaches.includes(userId)) return false;

        this.roster.members[userId].role = 'member';
        this.leadership.coaches = this.leadership.coaches.filter(id => id !== userId);
        this.updatedAt = Date.now();

        return true;
    }

    /**
     * Transfer captain to another member
     */
    transferCaptaincy(newCaptainId) {
        if (!this.roster.members[newCaptainId]) return false;

        const oldCaptainId = this.leadership.captainId;

        // Old captain becomes coach
        this.roster.members[oldCaptainId].role = 'coach';
        this.leadership.coaches.push(oldCaptainId);

        // New captain
        this.roster.members[newCaptainId].role = 'captain';
        this.leadership.captainId = newCaptainId;

        this.updatedAt = Date.now();

        console.log(`[Team] Captaincy transferred from ${oldCaptainId} to ${newCaptainId}`);
        return true;
    }

    /**
     * Check if user has permission
     */
    hasPermission(userId, permission) {
        const member = this.roster.members[userId];
        if (!member) return false;

        const { role } = member;

        const permissions = {
            'captain': ['edit_info', 'manage_roster', 'invite', 'remove', 'schedule', 'chat', 'analytics', 'disband'],
            'coach': ['manage_roster', 'invite', 'schedule', 'chat', 'analytics'],
            'manager': ['edit_info', 'invite', 'chat', 'analytics'],
            'member': ['invite', 'chat', 'analytics'],
            'reserve': ['chat', 'analytics']
        };

        return permissions[role]?.includes(permission) || false;
    }

    /**
     * Add match result
     */
    addMatchResult(matchData) {
        const { kills, deaths, assists, damageDealt, result } = matchData;

        this.statistics.totalMatches++;
        this.statistics.totalKills += kills;
        this.statistics.totalDeaths += deaths;
        this.statistics.totalDamage += damageDealt;

        if (result === 'win') {
            this.ranking.wins++;
        } else {
            this.ranking.losses++;
        }

        // Recalculate stats
        this.recalculateStatistics();
        this.updatedAt = Date.now();
    }

    /**
     * Recalculate team statistics
     */
    recalculateStatistics() {
        if (this.statistics.totalMatches > 0) {
            this.statistics.averageKDA = (
                (this.statistics.totalKills + this.statistics.totalDeaths) /
                Math.max(1, this.statistics.totalDeaths)
            ).toFixed(2);

            this.statistics.winRate = (
                (this.ranking.wins / this.statistics.totalMatches) * 100
            ).toFixed(1);

            // Update tier based on LP
            if (this.ranking.teamLP < 1200) this.tier = 'bronze';
            else if (this.ranking.teamLP < 1600) this.tier = 'silver';
            else if (this.ranking.teamLP < 2000) this.tier = 'gold';
            else if (this.ranking.teamLP < 2400) this.tier = 'platinum';
            else this.tier = 'elite';
        }
    }

    /**
     * Get team summary for display
     */
    getSummary() {
        return {
            id: this.id,
            name: this.name,
            tag: this.tag,
            captain: this.leadership.captainId,
            memberCount: this.roster.currentSize,
            maxMembers: this.roster.maxSize,
            tier: this.tier,
            teamLP: this.ranking.teamLP,
            wins: this.ranking.wins,
            losses: this.ranking.losses,
            winRate: this.statistics.winRate,
            region: this.region,
            description: this.description,
            branding: this.branding
        };
    }

    /**
     * Get roster with details
     */
    getRoster() {
        return Object.entries(this.roster.members).map(([userId, memberData]) => ({
            userId,
            ...memberData
        }));
    }

    /**
     * Serialize for storage
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            tag: this.tag,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            branding: this.branding,
            leadership: this.leadership,
            roster: this.roster,
            tier: this.tier,
            founded: this.founded,
            region: this.region,
            ranking: this.ranking,
            settings: this.settings,
            statistics: this.statistics,
            chat: this.chat,
            announcements: this.announcements
        };
    }

    /**
     * Load from JSON
     */
    static fromJSON(data) {
        const team = Object.create(Team.prototype);
        Object.assign(team, data);
        return team;
    }
}

class TeamManager {
    constructor(networkManager) {
        this.network = networkManager;
        this.teams = new Map();              // teamId -> Team
        this.playerTeams = new Map();        // userId -> teamId
        this.teamInvitations = new Map();    // userId -> [teamId]
        this.teamApplications = new Map();   // teamId -> [userId]

        // Ladder
        this.ladder = [];                    // Teams sorted by LP
        this.seasonNumber = 1;
        this.seasonStart = Date.now();

        // Setup network listeners
        this.setupNetworkListeners();
    }

    /**
     * Setup network event listeners
     */
    setupNetworkListeners() {
        this.network.on('TEAM_CREATED', (payload) => this.onTeamCreated(payload));
        this.network.on('TEAM_UPDATED', (payload) => this.onTeamUpdated(payload));
        this.network.on('MEMBER_JOINED', (payload) => this.onMemberJoined(payload));
        this.network.on('MEMBER_LEFT', (payload) => this.onMemberLeft(payload));
    }

    /**
     * Create new team
     */
    createTeam(name, captainId, captainName) {
        // Validate team name
        if (name.length < 3 || name.length > 32) {
            console.error('[TeamManager] Invalid team name length');
            return null;
        }

        // Check if captain already in team
        if (this.playerTeams.has(captainId)) {
            console.error('[TeamManager] Player already in a team');
            return null;
        }

        // Create team
        const team = new Team(name, captainId, captainName);
        this.teams.set(team.id, team);
        this.playerTeams.set(captainId, team.id);

        // Send to server
        this.network.send('TEAM_CREATE', {
            teamId: team.id,
            name: team.name,
            tag: team.tag,
            captainId: captainId
        });

        return team;
    }

    /**
     * Disband team
     */
    disbandTeam(teamId, userId) {
        const team = this.teams.get(teamId);
        if (!team) return false;

        if (team.leadership.captainId !== userId) {
            console.error('[TeamManager] Only captain can disband team');
            return false;
        }

        // Remove all members
        Object.keys(team.roster.members).forEach(memberId => {
            this.playerTeams.delete(memberId);
        });

        this.teams.delete(teamId);

        this.network.send('TEAM_DISBAND', { teamId });

        return true;
    }

    /**
     * Invite player to team
     */
    invitePlayer(teamId, invitedUserId, invitingUserId) {
        const team = this.teams.get(teamId);
        if (!team) return false;

        if (!team.hasPermission(invitingUserId, 'invite')) {
            console.error('[TeamManager] User lacks permission to invite');
            return false;
        }

        // Add to invitations
        if (!this.teamInvitations.has(invitedUserId)) {
            this.teamInvitations.set(invitedUserId, []);
        }

        this.teamInvitations.get(invitedUserId).push(teamId);

        this.network.send('TEAM_INVITE', {
            teamId,
            invitedUserId,
            invitingUserId
        });

        return true;
    }

    /**
     * Accept team invitation
     */
    acceptInvitation(teamId, userId) {
        const team = this.teams.get(teamId);
        if (!team) return false;

        // Check if invited
        const invitations = this.teamInvitations.get(userId) || [];
        if (!invitations.includes(teamId)) {
            return false;
        }

        // Add to team
        team.addMember(userId, 'member');
        this.playerTeams.set(userId, teamId);

        // Remove invitation
        this.teamInvitations.delete(userId);

        this.network.send('TEAM_INVITATION_ACCEPTED', {
            teamId,
            userId
        });

        return true;
    }

    /**
     * Decline team invitation
     */
    declineInvitation(teamId, userId) {
        const invitations = this.teamInvitations.get(userId) || [];
        this.teamInvitations.set(userId, invitations.filter(id => id !== teamId));
        return true;
    }

    /**
     * Leave team
     */
    leaveTeam(userId) {
        const teamId = this.playerTeams.get(userId);
        if (!teamId) return false;

        const team = this.teams.get(teamId);
        if (!team) return false;

        // Captain cannot leave without transfer
        if (team.leadership.captainId === userId) {
            console.error('[TeamManager] Captain must transfer captaincy first');
            return false;
        }

        team.removeMember(userId);
        this.playerTeams.delete(userId);

        this.network.send('TEAM_MEMBER_LEFT', {
            teamId,
            userId
        });

        return true;
    }

    /**
     * Get team by ID
     */
    getTeam(teamId) {
        return this.teams.get(teamId);
    }

    /**
     * Get player's team
     */
    getPlayerTeam(userId) {
        const teamId = this.playerTeams.get(userId);
        return teamId ? this.teams.get(teamId) : null;
    }

    /**
     * Get team invitations for player
     */
    getPlayerInvitations(userId) {
        const teamIds = this.teamInvitations.get(userId) || [];
        return teamIds.map(teamId => this.teams.get(teamId)).filter(t => t);
    }

    /**
     * Update team rankings
     */
    updateLadder() {
        const teamsArray = Array.from(this.teams.values());

        // Sort by LP descending
        teamsArray.sort((a, b) => b.ranking.teamLP - a.ranking.teamLP);

        this.ladder = teamsArray;

        // Assign ranks
        teamsArray.forEach((team, index) => {
            team.ranking.rank = index + 1;
        });

        return this.ladder;
    }

    /**
     * Get team ladder
     */
    getLadder(filter = {}) {
        if (filter.tier) {
            return this.ladder.filter(team => team.tier === filter.tier);
        }

        if (filter.region) {
            return this.ladder.filter(team => team.region === filter.region);
        }

        if (filter.limit) {
            return this.ladder.slice(0, filter.limit);
        }

        return this.ladder;
    }

    /**
     * Get team statistics
     */
    getTeamStats(teamId) {
        const team = this.teams.get(teamId);
        if (!team) return null;

        const memberStats = Object.entries(team.roster.members).map(([userId, member]) => ({
            userId,
            role: member.role,
            heroSpecialization: member.heroSpecialization,
            gamesPlayed: member.stats.gamesPlayed,
            wins: member.stats.wins
        }));

        return {
            team: team.getSummary(),
            statistics: team.statistics,
            roster: memberStats,
            recentMatches: []            // Would come from match history
        };
    }

    /**
     * Handle server team created
     */
    onTeamCreated(payload) {
        const { teamId, teamData } = payload;
        if (!this.teams.has(teamId)) {
            const team = Team.fromJSON(teamData);
            this.teams.set(teamId, team);
            console.log(`[TeamManager] Team synced: ${team.name}`);
        }
    }

    /**
     * Handle server team updated
     */
    onTeamUpdated(payload) {
        const { teamId, updates } = payload;
        const team = this.teams.get(teamId);
        if (team) {
            Object.assign(team, updates);
            team.updatedAt = Date.now();
        }
    }

    /**
     * Handle member joined
     */
    onMemberJoined(payload) {
        const { teamId, userId, role } = payload;
        const team = this.teams.get(teamId);
        if (team) {
            team.addMember(userId, role);
            this.playerTeams.set(userId, teamId);
        }
    }

    /**
     * Handle member left
     */
    onMemberLeft(payload) {
        const { teamId, userId } = payload;
        const team = this.teams.get(teamId);
        if (team) {
            team.removeMember(userId);
            this.playerTeams.delete(userId);
        }
    }

    /**
     * Get all teams
     */
    getAllTeams() {
        return Array.from(this.teams.values());
    }

    /**
     * Search teams by name
     */
    searchTeams(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.teams.values()).filter(
            team => team.name.toLowerCase().includes(lowerQuery) ||
                   team.tag.toLowerCase().includes(lowerQuery)
        );
    }
}

/**
 * Global team manager instance
 */
let teamManager = null;

function initializeTeams(networkManager) {
    if (!teamManager) {
        teamManager = new TeamManager(networkManager);
    }
    return teamManager;
}

function getTeamManager() {
    if (!teamManager) {
        console.error('[TeamManager] Not initialized! Call initializeTeams first.');
        return null;
    }
    return teamManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Team,
        TeamManager,
        initializeTeams,
        getTeamManager
    };
}
