# NEXUS Phase 11: Social Features & Community System
## Team/Clan Management, Chat Integration, and Spectator Mode

---

## 🎯 Phase 11 Overview

Phase 11 implements comprehensive social infrastructure enabling players to form teams, communicate, and spectate matches. This transforms NEXUS from a matchmaking-based experience to a community-driven competitive ecosystem.

### Core Features:
1. **Team/Clan System**: Create, manage, and customize teams
2. **Team Hierarchy**: Captain, Coach, Member roles with permissions
3. **Chat Integration**: Global, team, and direct messaging
4. **Voice Ready**: Integration points for voice channels
5. **Spectator Mode**: Watch ongoing matches with tactical overlays
6. **Social Profiles**: Extended profiles with team affiliation
7. **Team Customization**: Custom banners, logos, skins
8. **Team Statistics**: Aggregate team performance metrics
9. **Team Ladder**: Competitive team rankings
10. **Community Events**: Team tournaments and challenges

---

## 🏆 Team/Clan System Architecture

### Team Structure

```javascript
Team {
  id: string,                    // UUID
  name: string,                  // "Dragon Slayers"
  tag: string,                   // "DRAG" (4 chars max)
  description: string,           // Team bio

  // Branding
  branding: {
    bannerUrl: string,          // Team banner image
    logoUrl: string,            // Team logo
    primaryColor: string,       // Hex color
    secondaryColor: string,     // Hex color
    tagline: string             // "Dominate the Arena"
  },

  // Hierarchy
  leadership: {
    captainId: string,          // Team leader
    coaches: string[],          // Coach IDs (3-5)
    managers: string[]          // Manager IDs
  },

  // Roster
  roster: {
    members: {
      userId: {
        joinedAt: timestamp,
        role: "captain" | "coach" | "manager" | "member" | "reserve",
        heroSpecialization: string[],
        level: number,
        stats: {
          gamesPlayed: number,
          wins: number,
          losses: number
        }
      }
    },
    maxSize: number,            // 5, 10, 25 based on tier
    currentSize: number
  },

  // Metadata
  createdAt: timestamp,
  updatedAt: timestamp,
  tier: "bronze" | "silver" | "gold" | "platinum" | "elite",
  founded: year,
  region: string,               // "NA", "EU", "APAC"

  // Rankings
  ranking: {
    teamLP: number,
    tier: string,
    wins: number,
    losses: number,
    winRate: number,
    rank: number                 // Global ranking
  },

  // Settings
  settings: {
    joinPolicy: "open" | "invitation" | "application",
    minRank: number,            // Minimum player LP to join
    requireVerification: boolean,
    allowSpectators: boolean
  },

  // Stats
  statistics: {
    totalMatches: number,
    totalKills: number,
    totalDeaths: number,
    averageKDA: number,
    winRate: number,
    mostPlayedMode: string,
    topPerformer: string        // userId of best performing member
  }
}
```

### Role Permissions Matrix

| Permission | Captain | Coach | Manager | Member | Reserve |
|-----------|---------|-------|---------|--------|---------|
| Edit Team Info | ✓ | ✗ | ✓ | ✗ | ✗ |
| Manage Roster | ✓ | ✓ | ✗ | ✗ | ✗ |
| Invite Players | ✓ | ✓ | ✓ | ✗ | ✗ |
| Remove Members | ✓ | ✓ | ✗ | ✗ | ✗ |
| Access Chat | ✓ | ✓ | ✓ | ✓ | ✓ |
| Schedule Matches | ✓ | ✓ | ✓ | ✗ | ✗ |
| View Analytics | ✓ | ✓ | ✓ | ✓ | ✗ |
| Disband Team | ✓ | ✗ | ✗ | ✗ | ✗ |

---

## 💬 Chat System Architecture

### Message Types

#### Global Chat
- Available to all players
- Moderated for toxicity
- 1-second rate limit per player
- Searchable history (30 days)

#### Team Chat
- Private to team members + spectators of team matches
- Full message history for team
- @mention system for notifications
- Pin important messages (coach only)

#### Direct Message (DM)
- 1v1 private messaging
- Typing indicators
- Read receipts
- Block user prevents DMs

#### Party Chat
- Temporary group chat before match
- Auto-created when queuing together
- Dissolves after match ends
- Up to 5 concurrent parties

### Message Structure

```javascript
Message {
  id: string,
  sender: {
    userId: string,
    username: string,
    tier: string
  },
  content: string,             // Max 512 characters
  channel: "global" | "team" | "dm" | "party",
  channelId: string,           // team/user/party ID

  metadata: {
    timestamp: number,
    edited: boolean,
    editedAt: number,
    pinned: boolean,
    pinnedBy: string           // User who pinned
  },

  engagement: {
    likes: number,
    replies: number,
    mentions: string[]
  },

  filtering: {
    flagged: boolean,          // Auto-moderation
    flagReason: string,
    deleted: boolean
  }
}
```

### Rate Limiting & Moderation

```javascript
RateLimits {
  global: 1 message / second,
  team: 2 messages / second,
  dm: 1 message / second,
  party: 3 messages / second,

  dailyLimit: 1000 messages,
  warningThreshold: 800,
  kickThreshold: 50 toxic messages
}

Moderation {
  autoFilter: ["toxic", "racist", "hateful", ...],
  reportSystem: true,
  autoMute: { duration: 1800000 },  // 30 minutes
  ban: { duration: 86400000 }       // 24 hours
}
```

---

## 👀 Spectator Mode System

### Spectator Interface

```javascript
SpectatorView {
  // Match Info
  match: {
    id: string,
    mode: string,
    map: string,
    duration: number,
    blueTeam: string[],
    redTeam: string[]
  },

  // Camera Controls
  camera: {
    followHero: string | null,   // Hero ID or null for free cam
    position: { x, y },
    zoom: 1.0,
    isPaused: boolean
  },

  // Overlay Displays
  overlays: {
    showMinimap: boolean,
    showHeroNames: boolean,
    showDamageNumbers: boolean,
    showAbilityCooldowns: boolean,
    showTeamInfo: boolean,
    showKillFeed: boolean,
    showTimers: boolean
  },

  // Advanced Features
  features: {
    showPredictedPositions: boolean,
    highlightTeamColor: "blue" | "red" | null,
    slowmoEnabled: boolean,
    slowmoSpeed: 0.5,            // 50% speed
    replayMode: boolean,
    replayTime: number            // ms since match start
  }
}
```

### Spectator Permissions

```javascript
SpectatorAccess {
  // Friend spectating friend match
  friends: true,

  // Team member spectating team match
  teamMember: true,

  // Public spectators (tournament mode)
  public: true,

  // Coach/manager viewing team practice
  teamCoach: true,

  // Restrictions
  delayedView: 300000,           // 5-minute delay for fairness
  blockedFeatures: [
    "showPredictedPositions",    // Don't reveal enemy predictions
    "slowmoEnabled"              // Don't allow slowing for analysis during live
  ]
}
```

### Spectator UI Components

```javascript
SpectatorUI {
  // Main viewport: 80% of screen
  mainViewport: {
    arenaRenderer: true,
    heroes: true,
    projectiles: true,
    effects: true
  },

  // Left sidebar: 15%
  leftSidebar: {
    teamScores: { blue, red },
    objectiveStatus: {},
    eventLog: string[],          // Last 10 events
    playerStats: []              // Real-time KDA
  },

  // Right sidebar: 5%
  rightSidebar: {
    spectatorList: string[],
    toggleOverlays: true,
    cameraControls: true,
    replayControls: true
  },

  // Bottom bar: Match timeline
  timelineBar: {
    currentTime: number,
    totalDuration: number,
    keyFrames: [],               // Kill timestamps, objective captures
    scrubbing: true              // Seek to any point
  }
}
```

### Spectator Events

```javascript
SpectatorEvents {
  SPECTATOR_JOINED: { userId, username },
  SPECTATOR_LEFT: { userId },
  CAMERA_CHANGED: { followHero },
  OVERLAY_TOGGLED: { overlay, enabled },
  SLOW_MO_TOGGLED: { enabled, speed },
  REPLAY_SCRUBBED: { time }
}
```

---

## 👥 Social Profile Extensions

### Extended Player Profile

```javascript
ExtendedProfile {
  // Base profile (from Phase 9D)
  ...PlayerProfile,

  // Social
  social: {
    friends: string[],
    blockedPlayers: string[],
    followers: number,
    following: number,

    // New in Phase 11
    teamId: string,
    teamRole: "captain" | "coach" | "manager" | "member" | "reserve",
    teamJoinedAt: timestamp,
    friendRequests: string[],     // Pending

    // Social status
    onlineStatus: "online" | "offline" | "in-match" | "in-queue",
    lastSeen: timestamp,
    currentActivity: string       // "In queue", "In match", "Browsing"
  },

  // Community Features
  community: {
    bio: string,                  // 256 character bio
    website: string,              // Optional URL
    twitchChannel: string,        // Optional streaming
    youtubeChannel: string,       // Optional content creation

    badges: string[],             // ["veteran", "pro", "tournament_winner"],
    achievements: Achievement[],

    // Activity feed
    recentMatches: MatchRecord[],
    teamAnnouncements: string[],
    sharedClips: VideoClip[]
  },

  // Privacy Settings
  privacy: {
    profileVisibility: "public" | "friends" | "private",
    allowFriendRequests: boolean,
    allowDMs: boolean,
    showOnlineStatus: boolean,
    showActivity: boolean
  }
}
```

### Activity Feed

```javascript
ActivityFeed {
  events: [
    {
      type: "match_completed",
      data: { hero, result, kills, kda },
      timestamp
    },
    {
      type: "joined_team",
      data: { teamName, role },
      timestamp
    },
    {
      type: "achievement_unlocked",
      data: { achievementName, icon },
      timestamp
    },
    {
      type: "ranked_up",
      data: { newTier, newLP },
      timestamp
    }
  ]
}
```

---

## 🎮 Team Customization System

### Team Skins

```javascript
TeamSkin {
  id: string,
  name: string,                  // "Dark Legion"
  teamId: string,
  rarity: "common" | "rare" | "epic" | "legendary",

  // Customization
  appearance: {
    bannerDesign: string,        // Design template
    primaryColor: string,        // Hex
    secondaryColor: string,      // Hex
    accentColor: string,         // Hex
    logoStyle: "shield" | "emblem" | "crest" | "crown",
    pattern: "solid" | "stripe" | "geometric" | "tribal"
  },

  // Applied to
  appliedTo: {
    teamBanner: true,
    chatBadges: true,
    killFeed: true,
    leaderboard: true,
    playerProfiles: true        // When showing team affiliation
  },

  // Stats
  cost: number,                  // LP or premium currency
  owned: boolean,
  equippedAt: timestamp
}
```

### Team Banner Components

```javascript
BannerComponent {
  // Layer 1: Background
  background: {
    color: string,
    pattern: string,
    texture: string
  },

  // Layer 2: Logo
  logo: {
    type: string,
    size: number,
    position: { x, y },
    rotation: number
  },

  // Layer 3: Team Name
  teamName: {
    text: string,
    font: string,
    size: number,
    color: string,
    shadow: boolean,
    outline: boolean
  },

  // Layer 4: Tag
  tag: {
    text: string,
    position: "top-right" | "bottom-right",
    backgroundColor: string,
    textColor: string
  },

  // Layer 5: Accent Elements
  accents: [
    { type: "stripe", color, width, angle },
    { type: "border", color, thickness },
    { type: "emblem", icon, size }
  ]
}
```

---

## 📊 Team Statistics & Analytics

### Team Performance Dashboard

```javascript
TeamDashboard {
  overview: {
    totalMatches: number,
    wins: number,
    losses: number,
    winRate: number,
    currentStreak: number,       // Positive or negative
    teamLP: number,
    ranking: number
  },

  matchPerformance: {
    lastMatch: MatchRecord,
    lastWeek: {
      matches: number,
      wins: number,
      losses: number,
      avgKills: number,
      avgDeaths: number
    },
    lastMonth: {
      matches: number,
      wins: number,
      winRate: number,
      bestMode: string
    }
  },

  rosterStats: {
    topPerformer: {
      userId: string,
      matches: number,
      avgKDA: number,
      totalKills: number
    },
    heroDistribution: {
      "Grael": { picks: 15, wins: 12, winRate: 80 },
      "Kess": { picks: 12, wins: 9, winRate: 75 },
      ...
    },
    roleDistribution: {
      "warrior": { picks: 25, winRate: 72 },
      "ranger": { picks: 23, winRate: 70 },
      ...
    }
  },

  trends: {
    winRateTrend: "↑ +5% this week",
    performanceTrend: "↓ -2 rank",
    memberActivity: "8/10 active",
    trainingMetrics: {
      hoursLogged: 156,
      practiceMatches: 47,
      coachSessions: 8
    }
  }
}
```

---

## 🏅 Team Ladder System

### Team Rankings

```javascript
TeamLadder {
  // Seasonal rankings
  season: {
    number: 3,
    startDate: timestamp,
    endDate: timestamp,
    status: "active" | "ended"
  },

  // Tier-based brackets
  tiers: {
    bronze: {
      minLP: 0,
      maxLP: 2000,
      teams: [
        { rank: 1, teamId, teamName, teamLP, matches, wins },
        { rank: 2, teamId, teamName, teamLP, matches, wins },
        ...
      ]
    },
    silver: { /* ... */ },
    gold: { /* ... */ },
    platinum: { /* ... */ },
    elite: { /* ... */ }
  },

  // Global rankings
  global: {
    topTeams: [],               // Top 100 teams by LP
    rissingStars: [],           // Fastest climbers this season
    mostWins: [],               // Highest win count
    highestWinRate: []          // >40 games minimum
  },

  // Regional rankings
  regional: {
    "NA": { topTeams: [], region: "North America" },
    "EU": { topTeams: [], region: "Europe" },
    "APAC": { topTeams: [], region: "Asia-Pacific" }
  }
}
```

---

## 🎯 Community Events System

### Team Tournaments

```javascript
Tournament {
  id: string,
  name: string,                  // "Spring Championship 2026"
  description: string,

  format: "single-elim" | "double-elim" | "round-robin" | "league",
  maxTeams: number,
  registeredTeams: number,

  schedule: {
    registrationStart: timestamp,
    registrationEnd: timestamp,
    eventStart: timestamp,
    eventEnd: timestamp
  },

  rules: {
    bestOf: 1 | 3 | 5,
    minRank: string,            // "Gold+"
    allowSubstitutes: boolean,
    baseProtectionBan: number,  // Heroes disabled
    blacklistedHeroes: string[]
  },

  bracket: {
    rounds: [
      {
        roundNumber: 1,
        matches: [
          {
            team1: string,
            team2: string,
            winner: string | null,
            status: "pending" | "live" | "completed",
            matchIds: string[]
          }
        ]
      }
    ]
  },

  prizes: {
    prizePool: number,
    distribution: {
      "1st": 50,    // %
      "2nd": 30,
      "3rd": 20
    },
    rewards: {
      cosmetics: [],
      lp: number,
      battlePassPoints: number
    }
  },

  spectatorInfo: {
    public: true,
    streams: string[],          // URLs of official streams
    commentators: string[]
  }
}
```

### Seasonal Challenges

```javascript
TeamChallenge {
  id: string,
  name: string,                  // "Winning Streak"
  description: string,

  objective: {
    type: "wins" | "objectives" | "specific_hero" | "mode",
    target: number,
    current: number,
    progress: number             // 0-100%
  },

  duration: {
    startDate: timestamp,
    endDate: timestamp,
    remainingTime: number
  },

  rewards: {
    lpBonus: number,
    cosmetics: string[],
    bannerAccent: string,        // Unlockable team banner part
    badge: string                // Team badge for profile
  },

  participants: number,
  completion: number             // % of teams who completed
}
```

---

## 🔧 Implementation Files

### Phase 11 Deliverables

1. **pvp-team-system.js** (700+ lines)
   - Team class
   - TeamManager for CRUD operations
   - Team roster management
   - Team customization

2. **pvp-social-system.js** (600+ lines)
   - SocialManager for friends/blocking
   - Activity feed management
   - Social profile extensions
   - Friend request system

3. **pvp-chat-system.js** (600+ lines)
   - ChatManager for all message types
   - Rate limiting and moderation
   - Channel management
   - Message history

4. **pvp-spectator-system.js** (500+ lines)
   - SpectatorManager
   - Camera controls
   - Overlay system
   - Replay functionality

5. **pvp-team-ui.js** (800+ lines)
   - Team creation UI
   - Team roster display
   - Team customization panel
   - Team statistics dashboard
   - Team ladder view

6. **pvp-chat-ui.js** (600+ lines)
   - Chat interface (global, team, DM, party)
   - Message input and display
   - Typing indicators
   - Emoji and @mention support

7. **pvp-spectator-ui.js** (700+ lines)
   - Spectator view rendering
   - Camera controls UI
   - Overlay toggles
   - Timeline scrubbing
   - Replay player

---

## 🎯 Integration Points

### With Existing Systems

- **Network Manager**: Real-time sync of social events, chat, spectator data
- **Match Engine**: Spectator integration into live matches
- **Player System**: Extended profile fields, activity tracking
- **UI Manager**: Chat widget, team notifications, social sidebar

### New Event Types

```javascript
SocialEvents {
  // Team events
  TEAM_CREATED,
  TEAM_DISBANDED,
  PLAYER_JOINED_TEAM,
  PLAYER_LEFT_TEAM,
  TEAM_RANK_CHANGED,
  TEAM_CHALLENGED,

  // Social events
  FRIEND_REQUEST_SENT,
  FRIEND_REQUEST_ACCEPTED,
  FRIEND_REQUEST_DECLINED,
  PLAYER_BLOCKED,
  ACTIVITY_POSTED,

  // Chat events
  MESSAGE_SENT,
  MESSAGE_DELETED,
  PLAYER_MENTIONED,
  CHAT_MUTED,

  // Spectator events
  SPECTATOR_JOINED,
  SPECTATOR_LEFT,
  CAMERA_CHANGED,
  SLOW_MO_ENABLED
}
```

---

## 📈 Success Metrics

- **Team creation**: <5 seconds
- **Chat latency**: <200ms message delivery
- **Spectator sync**: <1 second behind live action
- **Social operations**: <500ms response time
- **Concurrent spectators**: 100+ per match
- **Team member limit**: 25 (expandable)
- **Message history**: 30 days (searchable)
- **Uptime**: 99.5% for social features

---

## 🚀 Phase 11 Roadmap

**Week 1**: Core team system + team manager
**Week 2**: Social & chat systems
**Week 3**: Spectator mode implementation
**Week 4**: UI for all systems + polish

---

**Phase 11: Social Features & Community System**
Building the social backbone for competitive team gaming.
