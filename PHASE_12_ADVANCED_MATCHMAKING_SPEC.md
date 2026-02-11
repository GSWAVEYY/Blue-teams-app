# NEXUS Phase 12: Advanced Matchmaking & Tournament System
## Team-Based Competitive Infrastructure, Esports Ladder, and Tournament Management

---

## 🎯 Phase 12 Overview

Phase 12 transforms NEXUS from individual player matchmaking into a comprehensive team-based competitive ecosystem with tournament infrastructure, seasonal competitive play, and esports-ready systems.

### Core Features:
1. **Team-Based Matchmaking**: Match teams against similar-ranked opponents
2. **Tournament System**: Single/double elimination, round-robin, league formats
3. **Team Ladder**: Seasonal rankings with promotion/demotion
4. **Best-of Series**: BO1, BO3, BO5 match formats
5. **Bracket Generation**: Seeding algorithms and bracket management
6. **Team Scrims**: Scheduled practice matches between teams
7. **Competitive Seasons**: Time-limited ranking periods with resets
8. **Tournament Rewards**: LP, cosmetics, badges, team skins
9. **Esports Integration**: Team verification, official tournament hosting
10. **Match Scheduling**: Calendar system for competitive play

---

## 🏆 Team-Based Matchmaking Architecture

### Team Matching Algorithm

```javascript
TeamMatchmakingQueue {
  queue: {
    teamId: string,
    captainId: string,
    teamLP: number,
    teamSize: 3 | 5,
    gameMode: "tdm" | "koth" | "search",
    queueTime: timestamp,

    // Preferences
    preferredOpponents: string[],  // Team IDs to favor
    avoidOpponents: string[],      // Team IDs to avoid (recent matches)
    preferredSchedule: "immediate" | "scheduled",

    // Team composition info
    heroAvailability: {
      "Grael": true,
      "Kess": true,
      ...                          // Which heroes team can play
    },
    avgTeamLP: number,
    memberCount: number
  }

  // Matching criteria
  skillRange: {
    initialRange: ±300,            // Initial LP range
    expandRate: ±50 every 30s,     // Range expansion
    maxRange: ±800                 // Max LP difference allowed
  },

  preferences: {
    maxWaitTime: 300000,           // 5 minutes
    forceMatchAfter: 180000,       // 3 minutes force match
    minOpponentTeamSize: 3,        // Match size must be equal
    recentMatchCooldown: 3600000   // 1 hour before rematch
  }
}
```

### Team Matching Criteria

```javascript
MatchQuality {
  // Skill balance (0-100)
  skillBalance: calculateBalanceQuality(blueTeamLP, redTeamLP),

  // Region proximity
  regionMatch: bothTeamsInSameRegion ? 10 : -5,

  // Time zone compatibility
  timeZoneOffset: calculateTimezoneBalance(),

  // Recent match history
  previousMatches: recentOpponents.length,     // Prefer new opponents
  matchRecency: timeSinceLastMatch / 3600000, // Hours since last match

  // Hero availability match
  heroOverlapPenalty: calculateHeroMismatch(),

  // Overall score (weighted)
  totalScore = (
    skillBalance * 0.5 +
    regionMatch * 0.2 +
    timeZoneOffset * 0.1 +
    matchRecency * 0.1 +
    heroOverlapPenalty * 0.1
  )

  // Teams matched if score > 60
}
```

---

## 🎮 Tournament System

### Tournament Formats

```javascript
Tournament {
  id: string,
  name: string,                    // "Spring Championship 2026"
  organizer: string,               // Team or esports org
  status: "registration" | "active" | "completed" | "archived",

  // Format configuration
  format: {
    type: "single-elim" | "double-elim" | "round-robin" | "league",
    bestOf: 1 | 3 | 5,             // Single, best-of-3, best-of-5
    teamSize: 3 | 5,
    roundDuration: number          // Minutes between rounds
  },

  // Schedule
  schedule: {
    registrationStart: timestamp,
    registrationEnd: timestamp,
    qualifiersStart: timestamp,    // Optional qualifier rounds
    eventStart: timestamp,
    eventEnd: timestamp,
    totalDuration: number          // Days
  },

  // Roster
  registeredTeams: Team[],
  maxTeams: number,                // 8, 16, 32, 64, 128
  minTeamSize: number,             // Must have min players
  maxTeamSize: number,             // Can have max players

  // Rules
  rules: {
    banProtectionBans: number,     // Heroes banned for all
    heroRotationBans: string[],    // Rotating bans per round
    mapPool: string[],             // Maps in rotation
    minRank: string,               // "Gold+" or "Platinum+"
    allowSubstitutes: boolean,
    practiceAllowed: boolean,
    maxPracticeMatches: number
  },

  // Bracket & Matches
  bracket: {
    rounds: Round[],
    currentRound: number,
    matches: Match[],
    standings: Standing[]
  },

  // Prizes
  prizes: {
    prizePool: number,             // Total LP or currency
    distribution: {
      "1st": 50,                   // % of pool
      "2nd": 30,
      "3rd": 20,
      "4th": 0                      // Based on format
    },
    rewards: {
      cosmetics: string[],         // Cosmetic IDs
      lpBonus: number,             // Per-player LP
      titleBadges: string[],
      teamSkins: string[]
    }
  },

  // Streaming & spectating
  streaming: {
    isPublic: boolean,
    officialStreams: string[],     // Stream URLs
    commentators: string[],
    spectatorAccess: boolean,
    delayedViewMs: 0 | 300000     // Live or 5min delay
  },

  // Moderation
  moderation: {
    moderators: string[],
    rulesEnforcement: "strict" | "standard" | "lenient",
    appealProcess: boolean,
    disqualifyRules: string[]      // Conditions for DQ
  }
}
```

### Tournament Round Structure

```javascript
Round {
  roundNumber: number,
  format: "group_stage" | "playoffs" | "finals",
  startTime: timestamp,
  endTime: timestamp,
  duration: number,                // Minutes allowed

  // Matches in this round
  matches: {
    matchNumber: number,
    team1: Team,
    team2: Team,
    winner: Team | null,
    status: "pending" | "live" | "completed" | "paused",
    matchIds: string[],            // If best-of series
    score: { team1: number, team2: number },
    scheduledTime: timestamp,
    actualStartTime: timestamp,
    actualEndTime: timestamp
  }[]
}
```

### Bracket Generation Algorithms

```javascript
// Single Elimination (8 teams)
BracketGenerator.generateSingleElim(teams) {
  // Seed by rank: #1 vs #8, #4 vs #5, #2 vs #7, #3 vs #6
  // Winners advance in tree structure
  // 3 rounds for 8 teams
}

// Double Elimination (8 teams)
BracketGenerator.generateDoubleElim(teams) {
  // Winners bracket: standard single elim
  // Losers bracket: parallel single elim
  // Grand finals: winner1 vs winner2
  // 5 rounds total
}

// Round Robin (6 teams)
BracketGenerator.generateRoundRobin(teams) {
  // Every team plays every other team once
  // 5 rounds (each team plays 5 matches)
  // Final standings by win-loss record
}

// League (10 teams)
BracketGenerator.generateLeague(teams) {
  // Split into divisions if >8 teams
  // Round robin within division
  // Cross-division playoffs
  // Season-long standings
}

// Seeding algorithm
Seeding {
  // By rank (ELO)
  byRank: teams.sort((a, b) => b.teamLP - a.teamLP),

  // By region (geographic)
  byRegion: groupByRegion(teams),

  // Balanced (mix high/low)
  balanced: interleave(topHalf, bottomHalf.reverse()),

  // Custom seed (by organizer)
  custom: providedSeeding
}
```

---

## 🏅 Seasonal Competitive System

### Competitive Season

```javascript
CompetitiveSeason {
  id: string,
  number: number,                  // Season 1, 2, 3...
  theme: string,                   // "Frozen Kingdom", "Dragon's Ascent"

  // Timeline
  startDate: timestamp,
  endDate: timestamp,
  duration: number,                // Days (typically 90)

  // Tier structure (reset each season)
  tiers: {
    bronze: { minLP: 0, maxLP: 800, icon: "🥉" },
    silver: { minLP: 800, maxLP: 1200, icon: "🥈" },
    gold: { minLP: 1200, maxLP: 1600, icon: "🥇" },
    platinum: { minLP: 1600, maxLP: 2000, icon: "💎" },
    elite: { minLP: 2000+, icon: "✨" },
    challenger: { top: 100, icon: "👑" }
  },

  // Ladder snapshots
  weeklySnapshots: Snapshot[],     // Weekly top teams
  finalLadder: Ladder,             // End-of-season rankings

  // Rewards
  seasonRewards: {
    byTier: {
      "bronze": { cosmetics: [], badges: [] },
      "silver": { cosmetics: [], badges: [] },
      ...
    },
    peakRewards: true,             // Reward highest tier reached
    participationBadge: true,
    specialBadges: string[]        // "Top 10", "Rising Star"
  },

  // Events
  weeklyEvents: WeeklyEvent[],     // Power-up weeks, theme weeks
  specialEvents: SpecialEvent[],   // Champion's gauntlet, etc.

  // Status
  status: "upcoming" | "active" | "ending" | "finished",
  daysRemaining: number,
  currentWeek: number,
  totalWeeks: number
}
```

### Seasonal Rewards

```javascript
SeasonalRewards {
  // Rank-based rewards
  tierRewards: {
    bronze: { lpBonus: 100, cosmetics: ["bronze_badge"] },
    silver: { lpBonus: 250, cosmetics: ["silver_badge", "skin_1"] },
    gold: { lpBonus: 500, cosmetics: ["gold_badge", "skin_2", "emote_1"] },
    platinum: { lpBonus: 1000, cosmetics: ["plat_badge", "skin_3", "border_1"] },
    elite: { lpBonus: 2000, cosmetics: ["elite_badge", "skin_4", "border_2", "spray_1"] },
    challenger: { lpBonus: 5000, cosmetics: ["challenger_title", "skin_5", "border_3", "all_sprays"] }
  },

  // Peak tier rewards (best achieved during season)
  peakRewards: {
    "diamond_peak": { badge: "peaked_diamond", banner: "diamond_peak_banner" },
    "challenger_peak": { badge: "challenger_badge", banner: "challenger_banner", title: "Challenger" }
  },

  // Participation rewards
  participation: {
    played_10_matches: { badge: "season_participant" },
    played_30_matches: { cosmetic: "season_skin_part1" },
    played_50_matches: { cosmetic: "season_skin_part2", title: "Season Veteran" }
  },

  // Special achievements
  achievements: {
    "win_streak_10": { badge: "hot_streak", cosmetic: "streak_border" },
    "promoted_2_tiers": { badge: "climber" },
    "ranked_with_team": { cosmetic: "team_skin_unlock" }
  }
}
```

---

## 🎯 Team Scrim System

### Scrim (Practice Match)

```javascript
Scrim {
  id: string,
  challenger: Team,                // Team initiating scrim
  opponent: Team,                  // Opponent team
  challenger_captain: string,
  opponent_captain: string,

  // Details
  gameMode: "tdm" | "koth" | "search",
  teamSize: 3 | 5,
  mapPreference: string,           // Preference or random
  bestOf: 1 | 3 | 5,
  rules: "standard" | "custom",    // Custom = team-defined

  // Custom rules options
  customRules: {
    banProtectionBans: number,
    allowedHeroes: string[],       // Whitelist if set
    bannedHeroes: string[],        // Blacklist if set
    timeLimit: number,             // Extra rules
    specialConditions: string      // "Full build", "No abilities", etc.
  },

  // Scheduling
  proposedTime: timestamp,
  confirmedTime: timestamp | null,
  status: "proposed" | "confirmed" | "live" | "completed" | "cancelled",
  acceptedBy: string | null,       // Opponent captain

  // Results
  matches: {
    matchNumber: number,
    result: "win" | "loss" | "draw",
    duration: number,
    kills: { team1: number, team2: number },
    score: { team1: number, team2: number }
  }[],

  // Statistics
  totalDuration: number,
  teamStats: {
    teamId: {
      wins: number,
      losses: number,
      totalKills: number,
      totalDeaths: number,
      playerStats: {
        playerId: {
          kills: number,
          deaths: number,
          assists: number
        }
      }
    }
  },

  // Notes
  notes: string,                   // Coach/captain notes
  feedback: string                 // Opponent feedback
}
```

### Scrim Manager

```javascript
ScrimManager {
  // Outgoing requests
  sendScrimRequest(fromTeamId, toTeamId, details) {
    // Create scrim in "proposed" state
    // Notify opponent captain
    // Await acceptance/decline
  }

  // Incoming requests
  getScrimRequests(teamId) {
    // Return all pending scrims awaiting this team's response
  }

  acceptScrimRequest(scrimId, teamId) {
    // Move scrim to "confirmed"
    // Schedule match queue
    // Notify both teams
  }

  declineScrimRequest(scrimId, teamId, reason) {
    // Cancel scrim
    // Send reason to requesting team
  }

  getScrimHistory(teamId, limit) {
    // Return completed scrims for analysis
    // Sort by date descending
  }

  getScrimStats(teamId) {
    // Win rate vs common opponents
    // Performance metrics by game mode
    // Coach analytics
  }
}
```

---

## 📊 Advanced Statistics & Analytics

### Team Performance Tracking

```javascript
TeamAnalytics {
  overallStats: {
    totalMatches: number,
    wins: number,
    losses: number,
    draws: number,
    winRate: number,
    currentStreak: number,        // Positive or negative
    longestWinStreak: number,
    longestLossStreak: number
  },

  modeStats: {
    "tdm": {
      matches: number,
      wins: number,
      winRate: number,
      avgKills: number,
      avgDeaths: number
    },
    "koth": { /* ... */ },
    "search": { /* ... */ }
  },

  rosterStats: {
    byPlayer: {
      playerId: {
        matches: number,
        wins: number,
        avgKDA: number,
        mainHeros: { "Grael": { picks: 15, wins: 12 }, ... },
        avgDamage: number
      }
    },
    byRole: {
      "warrior": { picks: 45, wins: 32, winRate: 71.1 },
      "ranger": { /* ... */ },
      ...
    }
  },

  opponentStats: {
    vsTeam: {
      "team-id": {
        matches: number,
        wins: number,
        winRate: number,
        lastMatch: timestamp
      }
    },
    byTier: {
      "bronze": { matches: 12, wins: 11, winRate: 91.7 },
      ...
    }
  },

  trends: {
    weeklyWinRate: [72, 65, 58, 68, 74, 81, 79],  // Last 7 days
    monthlyRank: [15, 12, 8, 3],                    // Last 4 weeks
    performanceIndex: 72.5                          // 0-100 scale
  },

  coachAnalytics: {
    strengthAreas: ["High kill engagement", "Map control"],
    weaknessAreas: ["Early game coordination", "Position discipline"],
    recommendations: ["Practice early rotations", "Study vision control"]
  }
}
```

---

## 🎪 Tournament Spectator Features

### Tournament Viewing Experience

```javascript
TournamentSpectator {
  // Bracket view
  bracketView: {
    currentRound: number,
    visibleMatches: Match[],
    expandedMatch: Match,          // Detailed view
    navigation: "bracket" | "standings" | "schedule"
  },

  // Live match viewing
  liveMatch: {
    matchId: string,
    blueTeam: Team,
    redTeam: Team,
    score: { blue: number, red: number },
    gameState: GameState,
    spectators: number,
    commentators: string[]
  },

  // Tournament info
  info: {
    currentRound: number,
    totalRounds: number,
    format: string,
    schedule: MatchSchedule[],
    standings: Standing[],
    prizePool: number
  },

  // Stats
  stats: {
    mostKills: Player,
    highestDamage: Player,
    bestTeamwork: Team,
    nearestGameRatio: Match
  }
}
```

---

## 🔧 Implementation Files for Phase 12

### Deliverables:

1. **pvp-team-matchmaking-system.js** (700+ lines)
   - TeamMatchmakingQueue class
   - Team matching algorithm
   - Region/timezone awareness
   - Skill balancing

2. **pvp-tournament-system.js** (800+ lines)
   - Tournament management
   - Bracket generation algorithms
   - Tournament lifecycle (registration → completion)
   - Rules enforcement

3. **pvp-scrim-system.js** (500+ lines)
   - Scrim request/response system
   - Custom rule configuration
   - Scrim history and statistics
   - Coach analytics

4. **pvp-seasonal-system.js** (600+ lines)
   - Competitive season management
   - Tier-based rewards
   - Seasonal event coordination
   - Rank reset handling

5. **pvp-tournament-ui.js** (700+ lines)
   - Tournament bracket rendering
   - Team registration UI
   - Standings display
   - Scrim request interface

6. **pvp-analytics-system.js** (600+ lines)
   - Detailed match analytics
   - Team statistics tracking
   - Opponent analysis
   - Coach intelligence dashboard

---

## 🎯 Integration Points

### With Existing Systems:

- **MatchmakingQueue** (Phase 9C): Extended for team-based matching
- **TeamManager** (Phase 11): Teams participate in tournaments/scrims
- **ChatManager** (Phase 11): Team chat for scrim coordination
- **SpectatorManager** (Phase 11): Tournament match spectating
- **PlayerManager** (Phase 9D): Player statistics aggregation
- **NetworkManager** (Phase 9A): Real-time bracket/standings sync

### New Event Types:

```javascript
TournamentEvents {
  TOURNAMENT_CREATED,
  TOURNAMENT_STARTED,
  ROUND_STARTED,
  MATCH_SCHEDULED,
  MATCH_BEGUN,
  MATCH_COMPLETED,
  BRACKET_UPDATED,
  TEAM_ELIMINATED,
  TOURNAMENT_FINISHED,
  SEASON_STARTED,
  SEASON_ENDED,
  RANK_UPDATED,
  SCRIM_REQUESTED,
  SCRIM_ACCEPTED,
  SCRIM_COMPLETED
}
```

---

## 📈 Success Metrics

- **Team matchmaking**: <2 minute average queue time
- **Bracket generation**: <1 second for 64 teams
- **Statistics computation**: <500ms for 10-team tournament
- **Concurrent tournaments**: 10+ active tournaments
- **Tournament teams**: 1000+ total teams across all tournaments
- **Scrim acceptance rate**: >70% of requests
- **Season participation**: >40% of teams

---

## 🏆 Post-Phase 12 Features

- **Esports league integration** with official tournament hosting
- **Sponsorship system** for professional teams
- **Coaching/analyst tools** with detailed match replays
- **Live bracket API** for streaming overlays
- **Mobile tournament companion app**
- **AI-powered opponent analysis**
- **Team salary caps** for competitive balance
- **Trading deadline** for mid-season roster changes

---

**Phase 12: Advanced Matchmaking & Tournament System**
Bringing esports-ready competitive infrastructure to NEXUS.
