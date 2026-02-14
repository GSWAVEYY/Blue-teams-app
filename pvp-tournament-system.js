/**
 * NEXUS Tournament System
 * Phase 12: Tournament Management, Bracket Generation, Bracket Progression
 *
 * Complete tournament infrastructure:
 * - Multiple tournament formats
 * - Bracket generation and management
 * - Team registration and seeding
 * - Match scheduling and progression
 * - Prize pool distribution
 */

class Tournament {
    constructor(name, organizerId, format, maxTeams, teamSize) {
        this.id = this.generateUUID();
        this.name = name;
        this.organizerId = organizerId;
        this.status = 'registration';      // registration, active, completed

        // Format
        this.format = {
            type: format,                   // single-elim, double-elim, round-robin, league
            bestOf: 1,
            teamSize: teamSize,             // 3 or 5
            roundDuration: 3600000          // 1 hour between rounds
        };

        // Schedule
        this.schedule = {
            registrationStart: Date.now(),
            registrationEnd: Date.now() + 604800000, // 7 days
            eventStart: Date.now() + 1209600000,     // 14 days
            eventEnd: null,
            totalDuration: 0
        };

        // Roster
        this.registeredTeams = [];
        this.maxTeams = maxTeams;
        this.minTeamSize = 3;
        this.maxTeamSize = teamSize;

        // Rules
        this.rules = {
            banProtectionBans: 2,
            heroRotationBans: [],
            mapPool: ['arena-1', 'arena-2', 'arena-3'],
            minRank: 'bronze',
            allowSubstitutes: true,
            practiceAllowed: true,
            maxPracticeMatches: 10
        };

        // Bracket
        this.bracket = {
            rounds: [],
            currentRound: 0,
            matches: new Map(),            // matchId -> match info
            standings: [],
            seeding: []
        };

        // Prizes
        this.prizes = {
            prizePool: 10000,              // LP currency
            distribution: { '1st': 50, '2nd': 30, '3rd': 20 },
            rewards: {
                cosmetics: [],
                lpBonus: 100,
                titleBadges: [],
                teamSkins: []
            }
        };

        // Streaming
        this.streaming = {
            isPublic: true,
            officialStreams: [],
            commentators: [],
            spectatorAccess: true,
            delayedViewMs: 0
        };

        // Moderation
        this.moderation = {
            moderators: [organizerId],
            rulesEnforcement: 'standard',
            appealProcess: true,
            disqualifyRules: ['player_ban', 'cheating', 'no_show_3x']
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
     * Register team
     */
    registerTeam(teamId, teamName, teamLP) {
        if (this.registeredTeams.length >= this.maxTeams) {
            console.error('[Tournament] Max teams reached');
            return false;
        }

        if (this.registeredTeams.some(t => t.teamId === teamId)) {
            console.error('[Tournament] Team already registered');
            return false;
        }

        const registration = {
            teamId: teamId,
            teamName: teamName,
            teamLP: teamLP,
            registeredAt: Date.now(),
            status: 'registered',
            seed: 0
        };

        this.registeredTeams.push(registration);
        console.log(`[Tournament] ${teamName} registered for ${this.name}`);
        return true;
    }

    /**
     * Start tournament (generate bracket)
     */
    startTournament() {
        if (this.registeredTeams.length < 2) {
            console.error('[Tournament] Not enough teams registered');
            return false;
        }

        // Generate bracket based on format
        switch (this.format.type) {
            case 'single-elim':
                this.generateSingleElimination();
                break;
            case 'double-elim':
                this.generateDoubleElimination();
                break;
            case 'round-robin':
                this.generateRoundRobin();
                break;
            case 'league':
                this.generateLeague();
                break;
        }

        this.status = 'active';
        this.schedule.eventStart = Date.now();

        console.log(`[Tournament] ${this.name} started with bracket`);
        return true;
    }

    /**
     * Generate single elimination bracket
     */
    generateSingleElimination() {
        const teams = this.seedTeams();
        let currentRound = [];

        // Create first round matches
        for (let i = 0; i < teams.length; i += 2) {
            if (i + 1 < teams.length) {
                const match = {
                    matchId: this.generateUUID(),
                    roundNumber: 1,
                    team1: teams[i],
                    team2: teams[i + 1],
                    winner: null,
                    status: 'pending',
                    scheduledTime: this.schedule.eventStart + (i * this.format.roundDuration)
                };
                currentRound.push(match);
                this.bracket.matches.set(match.matchId, match);
            }
        }

        this.bracket.rounds.push({
            roundNumber: 1,
            format: 'playoffs',
            matches: currentRound
        });

        // Generate subsequent rounds
        let teamsPerRound = currentRound.length;
        let roundNumber = 2;

        while (teamsPerRound > 1) {
            teamsPerRound = Math.ceil(teamsPerRound / 2);
            const nextRound = [];

            for (let i = 0; i < teamsPerRound; i++) {
                const match = {
                    matchId: this.generateUUID(),
                    roundNumber: roundNumber,
                    team1: null,
                    team2: null,
                    winner: null,
                    status: 'pending',
                    scheduledTime: this.schedule.eventStart + (roundNumber * 86400000)
                };
                nextRound.push(match);
                this.bracket.matches.set(match.matchId, match);
            }

            this.bracket.rounds.push({
                roundNumber: roundNumber,
                format: roundNumber === this.getTotalRounds() ? 'finals' : 'playoffs',
                matches: nextRound
            });

            roundNumber++;
        }
    }

    /**
     * Generate round-robin bracket
     */
    generateRoundRobin() {
        const teams = this.seedTeams();
        const roundNumber = teams.length - 1;

        for (let round = 0; round < roundNumber; round++) {
            const roundMatches = [];

            for (let i = 0; i < Math.floor(teams.length / 2); i++) {
                const idx1 = (round + i) % teams.length;
                const idx2 = (round - i + teams.length) % teams.length;

                if (idx1 !== idx2) {
                    const match = {
                        matchId: this.generateUUID(),
                        roundNumber: round + 1,
                        team1: teams[idx1],
                        team2: teams[idx2],
                        winner: null,
                        status: 'pending',
                        score: { team1: 0, team2: 0 }
                    };
                    roundMatches.push(match);
                    this.bracket.matches.set(match.matchId, match);
                }
            }

            this.bracket.rounds.push({
                roundNumber: round + 1,
                format: 'group_stage',
                matches: roundMatches
            });
        }
    }

    /**
     * Seed teams by rating
     */
    seedTeams() {
        // Sort by LP (rating)
        const sorted = [...this.registeredTeams].sort((a, b) => b.teamLP - a.teamLP);

        // Assign seeds
        sorted.forEach((team, index) => {
            team.seed = index + 1;
        });

        return sorted;
    }

    /**
     * Get total rounds
     */
    getTotalRounds() {
        return Math.ceil(Math.log2(this.registeredTeams.length));
    }

    /**
     * Submit match result
     */
    submitMatchResult(matchId, winnerId, score) {
        const match = this.bracket.matches.get(matchId);
        if (!match) return false;

        match.winner = winnerId;
        match.score = score;
        match.status = 'completed';

        // Advance winner to next round
        this.advanceWinner(match);

        // Check if tournament complete
        if (this.bracket.rounds[this.bracket.rounds.length - 1].matches[0].status === 'completed') {
            this.completeTournament();
        }

        return true;
    }

    /**
     * Advance winner to next round
     */
    advanceWinner(match) {
        const nextRound = this.bracket.rounds[match.roundNumber];
        if (!nextRound) return; // No more rounds

        const nextMatches = nextRound.matches;
        const matchIndexInRound = nextMatches.findIndex(m => 
            (m.team1 === match.team1 && m.team2 === match.team2) ||
            (m.team1 === match.team2 && m.team2 === match.team1)
        );

        if (matchIndexInRound === -1) {
            // Find next available position
            for (let i = 0; i < nextMatches.length; i++) {
                if (!nextMatches[i].team1 || !nextMatches[i].team2) {
                    if (!nextMatches[i].team1) {
                        nextMatches[i].team1 = match.winner;
                    } else {
                        nextMatches[i].team2 = match.winner;
                    }
                    return;
                }
            }
        }
    }

    /**
     * Complete tournament
     */
    completeTournament() {
        this.status = 'completed';
        this.schedule.eventEnd = Date.now();
        this.schedule.totalDuration = this.schedule.eventEnd - this.schedule.eventStart;

        // Generate final standings
        this.generateStandings();

        console.log(`[Tournament] ${this.name} completed`);
    }

    /**
     * Generate final standings
     */
    generateStandings() {
        const standings = [];

        // Find winner (last round first match)
        const finalRound = this.bracket.rounds[this.bracket.rounds.length - 1];
        if (finalRound && finalRound.matches[0]) {
            standings.push({
                place: 1,
                teamId: finalRound.matches[0].winner,
                prizePercentage: this.prizes.distribution['1st']
            });
        }

        this.bracket.standings = standings;
    }

    /**
     * Get tournament summary
     */
    getSummary() {
        return {
            id: this.id,
            name: this.name,
            format: this.format.type,
            status: this.status,
            registeredTeams: this.registeredTeams.length,
            maxTeams: this.maxTeams,
            prizePool: this.prizes.prizePool,
            eventStart: this.schedule.eventStart,
            eventEnd: this.schedule.eventEnd
        };
    }
}

class TournamentManager {
    constructor(networkManager) {
        this.network = networkManager;
        this.tournaments = new Map();      // tournamentId -> Tournament
        this.activeTournaments = [];       // Currently running tournaments
        this.archivedTournaments = [];     // Completed tournaments
    }

    /**
     * Create tournament
     */
    createTournament(name, organizerId, format, maxTeams, teamSize) {
        const tournament = new Tournament(name, organizerId, format, maxTeams, teamSize);
        this.tournaments.set(tournament.id, tournament);
        this.activeTournaments.push(tournament.id);

        console.log(`[TournamentManager] Created tournament: ${name}`);

        return tournament;
    }

    /**
     * Get tournament
     */
    getTournament(tournamentId) {
        return this.tournaments.get(tournamentId);
    }

    /**
     * Register team for tournament
     */
    registerTeam(tournamentId, teamId, teamName, teamLP) {
        const tournament = this.tournaments.get(tournamentId);
        if (!tournament) return false;

        return tournament.registerTeam(teamId, teamName, teamLP);
    }

    /**
     * Start tournament
     */
    startTournament(tournamentId) {
        const tournament = this.tournaments.get(tournamentId);
        if (!tournament) return false;

        return tournament.startTournament();
    }

    /**
     * Submit match result
     */
    submitResult(tournamentId, matchId, winnerId, score) {
        const tournament = this.tournaments.get(tournamentId);
        if (!tournament) return false;

        const result = tournament.submitMatchResult(matchId, winnerId, score);

        // If tournament completed, move to archive
        if (tournament.status === 'completed') {
            this.activeTournaments = this.activeTournaments.filter(id => id !== tournamentId);
            this.archivedTournaments.push(tournamentId);
        }

        return result;
    }

    /**
     * Get active tournaments
     */
    getActiveTournaments() {
        return this.activeTournaments.map(id => this.tournaments.get(id));
    }

    /**
     * Get tournament bracket
     */
    getBracket(tournamentId) {
        const tournament = this.tournaments.get(tournamentId);
        if (!tournament) return null;

        return tournament.bracket;
    }

    /**
     * Get tournament standings
     */
    getStandings(tournamentId) {
        const tournament = this.tournaments.get(tournamentId);
        if (!tournament) return [];

        return tournament.bracket.standings;
    }
}

/**
 * Global tournament manager instance
 */
let tournamentManager = null;

function initializeTournaments(networkManager) {
    if (!tournamentManager) {
        tournamentManager = new TournamentManager(networkManager);
    }
    return tournamentManager;
}

function getTournamentManager() {
    if (!tournamentManager) {
        console.error('[TournamentManager] Not initialized! Call initializeTournaments first.');
        return null;
    }
    return tournamentManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Tournament,
        TournamentManager,
        initializeTournaments,
        getTournamentManager
    };
}
