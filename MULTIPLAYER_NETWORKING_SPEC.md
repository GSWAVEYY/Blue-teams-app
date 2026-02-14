# NEXUS Multiplayer & Networking Specification
## Real-Time PvP, Matchmaking, State Synchronization, and Server Architecture

---

## 🌐 Networking Architecture Overview

NEXUS uses a **client-server model** with WebSocket communication for real-time multiplayer:

1. **Client Layer**: Game client running in browser (HTML5/JS)
2. **Network Layer**: WebSocket for bidirectional real-time communication
3. **Server Layer**: Node.js server managing game state and validation
4. **Database Layer**: Player profiles, match history, rankings
5. **Matchmaking Layer**: Queue-based matchmaking with ELO rating

---

## 📡 Network Protocol & Message System

### **Message Types & Structure**

```json
{
  "type": "MESSAGE_TYPE",
  "payload": {
    "data": "varies by type"
  },
  "timestamp": 1707081600000,
  "clientId": "uuid-string"
}
```

### **Connection Lifecycle Messages**

**CLIENT → SERVER**

```
1. CONNECT
   - playerName: "Grael"
   - sessionToken: "jwt-token"
   - version: "1.0.0"

2. AUTHENTICATE
   - token: "auth-token"
   - userId: "user-123"

3. HEARTBEAT (every 30s)
   - clientTimestamp: 1707081600000

4. DISCONNECT
   - reason: "user-initiated" | "network-error" | "idle"
```

**SERVER → CLIENT**

```
1. CONNECT_ACK
   - serverId: "server-uuid"
   - clientId: "assigned-uuid"
   - timestamp: 1707081600000

2. AUTHENTICATE_SUCCESS
   - userId: "user-123"
   - playerProfile: {...}

3. HEARTBEAT_ACK
   - serverTimestamp: 1707081600000
   - latency: 45 (ms)

4. DISCONNECT
   - reason: "server-maintenance" | "session-timeout"
```

---

### **Matchmaking Messages**

**CLIENT → SERVER**

```
1. QUEUE_JOIN
   - gameMode: "tdm" | "koth" | "search"
   - teamSize: 3 | 5
   - preferredRoles: ["warrior", "ranger"]
   - estimatedRank: 1200

2. QUEUE_LEAVE
   - reason: "user-cancelled" | "timeout"

3. HERO_SELECT
   - heroName: "Grael"
   - alternates: ["Aldrin", "Petra"]
```

**SERVER → CLIENT**

```
1. QUEUE_JOINED
   - queueId: "queue-123"
   - position: 5
   - estimatedWaitTime: 120 (seconds)

2. MATCH_FOUND
   - matchId: "match-456"
   - players: [
       { playerId, playerName, rank, hero },
       ...
     ]
   - blueTeam: ["player1", "player2", "player3"]
   - redTeam: ["player4", "player5", "player6"]
   - map: "arena-1"
   - mode: "tdm"

3. MATCH_CANCELLED
   - reason: "not-enough-players" | "timeout"
   - requeuingAt: 1707081700000

4. HERO_SELECT_REQUEST
   - availableHeroes: ["Grael", "Aldrin", "Thaxus", ...]
   - timeoutSeconds: 30
```

---

### **Match State Messages**

**SERVER → CLIENT (Continuous during match)**

```
1. MATCH_START
   - matchId: "match-456"
   - mapId: "arena-1"
   - gameState: "loading" | "starting" | "running"
   - blueTeam: [hero objects]
   - redTeam: [hero objects]
   - spawnPoints: { x, y per hero }

2. GAME_STATE_UPDATE (60 Hz)
   - matchTime: 45.2 (seconds)
   - heroStates: [
       {
         heroId: "player1-hero",
         position: { x, y },
         health: 150,
         mana: 320,
         level: 5,
         isDead: false,
         respawnTime: null
       }
     ]
   - scoreBlue: 12
   - scoreRed: 8
   - objectives: [
       { type: "koth-point", controlledBy: "blue", progress: 0.65 }
     ]

3. ABILITY_CAST
   - casterId: "player1-hero"
   - abilityKey: "q"
   - targetPosition: { x, y }
   - targetHeroId: null

4. DAMAGE_EVENT
   - sourceId: "player1-hero"
   - targetId: "player2-hero"
   - damageAmount: 45
   - damageType: "ability" | "weapon"
   - isCritical: false
   - isKill: false

5. KILL_EVENT
   - killerId: "player1-hero"
   - victimId: "player2-hero"
   - assistantIds: ["player3-hero"]
   - timestamp: 45.2

6. RESPAWN_EVENT
   - heroId: "player2-hero"
   - respawnLocation: { x, y }
   - timestamp: 52.1

7. OBJECTIVE_UPDATE
   - objectiveId: "bomb-site-a"
   - status: "planted" | "defused" | "exploded"
   - controlledBy: "blue"
   - progress: 0.75
```

**CLIENT → SERVER (Player Actions)**

```
1. MOVEMENT_INPUT
   - direction: { x, y }
   - timestamp: 1707081645123

2. ABILITY_USE
   - abilityKey: "q" | "e" | "r"
   - targetPosition: { x, y }
   - targetHeroId: "optional-hero-id"
   - timestamp: 1707081645123

3. EMOTE_USE
   - emoteType: "victory" | "taunt" | "dance"
   - timestamp: 1707081645123

4. PLAYER_STATS
   - kills: 5
   - deaths: 2
   - assists: 3
   - damageDealt: 1250
   - damageReceived: 450
```

---

### **Match End Messages**

**SERVER → CLIENT**

```
1. MATCH_END
   - matchId: "match-456"
   - winnerId: "blue" | "red"
   - blueStats: {
       kills: 50,
       deaths: 15,
       objectiveScore: 100,
       players: [ { playerId, kills, deaths, assists, damage } ]
     }
   - redStats: { ... }
   - matchDuration: 1245 (seconds)
   - rewards: {
       lp: 25,
       experience: 150,
       cosmetics: []
     }

2. MATCH_REPLAY_AVAILABLE
   - replayId: "replay-789"
   - replayUrl: "https://nexus.game/replay/replay-789"
```

---

## 🎮 Matchmaking System

### **Queue Tiers**

```
TIER 0: Unranked (0-800 LP)
TIER 1: Bronze (800-1200 LP)
TIER 2: Silver (1200-1600 LP)
TIER 3: Gold (1600-2000 LP)
TIER 4: Platinum (2000-2400 LP)
TIER 5: Diamond (2400+ LP)
TIER 6: Challenger (Top 1% by region)
```

### **Matchmaking Algorithm**

**Rating-Based Matching:**
```
1. Place player in queue
2. Set acceptable rank range:
   - Tier 0-1: ±400 LP range
   - Tier 2-3: ±300 LP range
   - Tier 4+: ±200 LP range
3. Search for opponents in range
4. After 30s: Expand range by ±100 LP
5. After 60s: Expand range by ±200 LP
6. After 120s: Expand range to any rank
7. After 180s: Create match with available players
```

**Team Balancing:**
```
- Prefer even skill distribution
- Avoid stacking high-rank players on one team
- Balance team LP totals within 100 points
- Consider role preferences
- Avoid repeat matchups (if recently played)
```

### **Queue Types**

| Mode | Team Size | Rating | Duration | Population |
|------|-----------|--------|----------|------------|
| **Casual** | 3v3 / 5v5 | Unranked | 5-15 min | High |
| **Ranked** | 3v3 / 5v5 | Rated | 10-20 min | Medium |
| **Tournament** | 5v5 | Invite-only | 20-30 min | Low |

---

## 👥 Player State Management

### **Player Profile Structure**

```javascript
{
  userId: "uuid-string",
  username: "PlayerName",
  level: 15,
  totalMatches: 342,
  ranking: {
    tier: "Gold",
    lp: 1850,
    wins: 185,
    losses: 157
  },
  statistics: {
    kills: 5234,
    deaths: 2145,
    assists: 3421,
    totalDamage: 524000,
    mainHeroes: ["Grael", "Petra", "Lyric"],
    mainRoles: ["Warrior", "Guardian"],
    averageKDA: 2.74,
    winRate: 0.541
  },
  cosmetics: {
    heroSkins: {
      grael: ["default", "celestial", "obsidian"],
      petra: ["default", "nature"]
    },
    equippedSkins: {
      grael: "celestial",
      petra: "nature"
    }
  },
  lastOnline: 1707081600000,
  friends: ["friend-id-1", "friend-id-2"],
  blockedPlayers: [],
  matchHistory: [
    {
      matchId: "match-456",
      timestamp: 1707081000000,
      gameMode: "tdm",
      hero: "Grael",
      team: "blue",
      result: "win",
      kills: 8,
      deaths: 2,
      assists: 5,
      damage: 1250,
      lpGain: 25
    }
  ]
}
```

---

## 🔄 State Synchronization

### **Server Authority Model**

**Philosophy**: Server is source of truth for all game state
- Client performs optimistic updates (shows immediately)
- Server validates and authorizes all actions
- Mismatch detection triggers client state correction
- Replay system preserves authoritative state

### **Update Frequency**

| Event Type | Frequency | Latency Impact |
|-----------|-----------|-----------------|
| **Heartbeat** | 30s | Presence detection |
| **Movement** | 60 Hz | Real-time position |
| **Ability Cast** | On-demand | <50ms critical |
| **Damage/Kill** | On-demand | <100ms acceptable |
| **UI Updates** | 1 Hz | 1s acceptable |

### **Bandwidth Optimization**

**Delta Updates** (only changed values):
```javascript
// Full update (every 10 frames)
{ x: 500, y: 300, health: 150, mana: 320 }

// Delta update (frames between full updates)
{ Δx: +5, Δhealth: -15 }  // Only changed values
```

**Compression**:
- Pack multiple game objects into single message
- Use binary encoding for frequently-sent data
- Prioritize critical information
- Throttle non-critical updates

**Expected Bandwidth** (5v5 match):
- Server → Client: ~50 KB/s (full quality)
- Client → Server: ~5 KB/s (sparse input)
- Total: ~55 KB/s per player (~3.3 MB per 1-hour session)

---

## 🌍 Server Architecture

### **Server Components**

```
NEXUS Game Server
├── Connection Manager
│   ├── WebSocket handler
│   ├── Connection pooling
│   ├── Heartbeat monitor
│   └── Graceful disconnect
│
├── Authentication Service
│   ├── JWT token validation
│   ├── Session management
│   ├── Rate limiting
│   └── Security auditing
│
├── Matchmaking Engine
│   ├── Queue manager
│   ├── Rating system (ELO)
│   ├── Team balancing
│   └── Match creation
│
├── Match Simulator
│   ├── Game loop (60 Hz server time)
│   ├── Game state manager
│   ├── Action validator
│   ├── Damage calculator
│   └── Replay recorder
│
├── Player Manager
│   ├── Profile storage
│   ├── Statistics tracker
│   ├── Cosmetics manager
│   └── Friend system
│
└── Database Layer
    ├── Player profiles
    ├── Match history
    ├── Statistics
    ├── Cosmetics
    └── Replay storage
```

### **Server Technologies**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Node.js + Express | API and server logic |
| **Real-time** | Socket.IO / WebSocket | Player communication |
| **Database** | PostgreSQL / MongoDB | Persistent storage |
| **Caching** | Redis | Session + rate limit |
| **Storage** | S3 / Cloud Storage | Replay files, assets |
| **Monitoring** | Prometheus + Grafana | Performance tracking |
| **CDN** | CloudFlare / AWS CDN | Asset delivery |

---

## 🔐 Security & Validation

### **Client-Side Validation** (UX feedback only)
- Input validation (hero exists, ability available)
- Movement bounds checking
- UI constraint enforcement

### **Server-Side Validation** (Authoritative)
- Verify player has hero selected
- Validate ability cooldowns
- Check mana/resource requirements
- Confirm ability is castable
- Validate target is in range
- Calculate actual damage server-side
- Prevent cheating (speed hacks, teleport)

### **Anti-Cheat Measures**

1. **Movement Validation**:
   - Detect impossible speed (teleporting)
   - Check collision detection server-side
   - Flag suspicious patterns

2. **Combat Validation**:
   - Verify damage calculations
   - Check ability ranges
   - Validate cooldowns

3. **Data Integrity**:
   - Sign all critical messages
   - Use HTTPS/TLS for all communication
   - Encrypt sensitive player data

4. **Detection System**:
   - Log suspicious activity
   - ML-based pattern detection
   - Manual review process
   - Automatic bans for confirmed cheaters

---

## 🛜 Network Conditions & Resilience

### **Latency Handling**

**Client-Side Prediction:**
```
Player presses move button
├─ Local: Update position immediately (60 Hz)
├─ Send: Movement input to server (30 Hz sampling)
├─ Receive: Server-authoritative position
├─ Reconcile: Correct local if needed
└─ Display: Smooth interpolation
```

**Expected Latencies:**
- Excellent: <50ms (LAN)
- Good: 50-100ms (Same region)
- Acceptable: 100-200ms (Different region)
- Poor: >200ms (Satellite/distant regions)

### **Packet Loss Handling**

**Redundancy:**
- Critical messages: Resend until ACK
- Non-critical: Drop if lost
- Queue-based reliability: Ability casts always arrive

**Graceful Degradation:**
- At 5% loss: Smooth gameplay continues
- At 10% loss: Occasional position correction
- At 20% loss: Noticeable interpolation
- At 30%+ loss: Game becomes unplayable (disconnect)

### **Disconnection Recovery**

```
Disconnection Detected
├─ Attempt reconnect (exponential backoff)
│  ├─ Try 1: Immediately
│  ├─ Try 2: After 1s
│  ├─ Try 3: After 2s
│  ├─ Try 4: After 4s
│  └─ Try 5: After 8s
├─ Reconnect successful
│  ├─ Resume match (if <5 min disconnected)
│  ├─ Request state sync
│  └─ Continue playing
└─ Reconnect failed after 40s
    ├─ Leave match (mark as AFK)
    ├─ Show disconnect screen
    └─ Allow rejoin if <10 min
```

---

## 📊 Matchmaking Statistics

### **Queue Wait Times** (Target)

| Tier | Queue Type | Wait Time |
|------|-----------|-----------|
| **Casual** | Any | <30s (90th percentile) |
| **Ranked Bronze** | 3v3 | <60s |
| **Ranked Silver** | 3v3 | <90s |
| **Ranked Gold+** | 3v3 | <120s |
| **Ranked 5v5** | Any | <180s |

### **Population Metrics**

**Healthy Server**:
- Concurrent players: 5,000+
- Queue depth: 500+ (all modes)
- Average match time: 12 min
- Daily active: 50,000+

**Queue Times by Population**:
- 100+ players: <30s
- 10-100 players: 30-120s
- <10 players: Unbalanced matches/no match

---

## 🎯 Matchmaking Rating System

### **ELO Rating Algorithm**

```
New Rating = Old Rating + K × (Actual - Expected)

Where:
- K = 32 (normal) / 16 (high MMR) / 48 (new player)
- Actual = 1 (win) / 0.5 (draw) / 0 (loss)
- Expected = 1 / (1 + 10^((opponent_rating - your_rating)/400))
```

**Examples**:
- Win vs equal skill: +16 LP
- Win vs higher skill: +24 LP
- Loss vs equal skill: -16 LP
- Loss vs lower skill: -24 LP

### **Decay System**

- Inactivity >7 days: Slow decay (-10 LP/day)
- Inactivity >14 days: Pause decay (reset after 1 win)
- Prevents idle high-rank players

---

## 📡 Network Protocol Implementation

### **WebSocket Events**

```javascript
// Client emits
socket.emit('queue:join', { mode, teamSize })
socket.emit('ability:cast', { abilityKey, targetPos })
socket.emit('movement:update', { direction })

// Server emits
socket.on('match:found', (matchData) => {...})
socket.on('gameState:update', (state) => {...})
socket.on('ability:cast', (data) => {...})

// Both directions
socket.on('error', (error) => {...})
socket.on('disconnect', () => {...})
```

### **Message Validation Schema**

```javascript
QUEUE_JOIN: {
  gameMode: 'enum[tdm|koth|search]',
  teamSize: 'enum[3|5]',
  preferredRoles: 'array<string>',
  estimatedRank: 'number[0-3000]'
}

ABILITY_USE: {
  abilityKey: 'enum[q|e|r]',
  targetPosition: 'object{x:number, y:number}',
  targetHeroId: 'string?',
  timestamp: 'number'
}
```

---

## 🚀 Deployment Architecture

### **Server Regions** (Initial)

```
Region          | Location        | Players/Server | Servers
─────────────────────────────────────────────────────────
North America   | us-east-1       | 5,000         | 3
Europe          | eu-west-1       | 5,000         | 3
Asia-Pacific    | ap-southeast-1  | 5,000         | 3
```

### **Scaling Strategy**

- **Horizontal**: Add servers as player count grows
- **Vertical**: Increase per-server capacity
- **Regional**: Add servers in high-demand regions
- **Auto-scaling**: Spin up servers during peak hours

---

## 📋 Implementation Roadmap

### **Phase 9A: WebSocket & Basic Networking** (Week 1)
- [ ] WebSocket server setup (Node.js + Socket.IO)
- [ ] Connection/authentication system
- [ ] Message protocol definition
- [ ] Client WebSocket implementation

### **Phase 9B: Match Synchronization** (Week 2)
- [ ] Server-side match engine
- [ ] Game state broadcast system
- [ ] Client state reconciliation
- [ ] Latency handling and prediction

### **Phase 9C: Matchmaking System** (Week 3)
- [ ] Queue management
- [ ] ELO rating system
- [ ] Team balancing algorithm
- [ ] Queue UI integration

### **Phase 9D: Player Management** (Week 4)
- [ ] Player profile system
- [ ] Match history storage
- [ ] Statistics tracking
- [ ] Friend system basics

### **Phase 9E: Security & Testing** (Week 5)
- [ ] Anti-cheat validation
- [ ] Load testing
- [ ] Stress testing
- [ ] Security audit

---

## ✅ Success Metrics

- **Latency**: <100ms average, <200ms 95th percentile
- **Uptime**: 99.5% availability
- **Matchmaking**: <90s average queue time
- **Concurrency**: 10,000+ concurrent players
- **Stability**: <1% disconnect rate during match
- **Data Integrity**: 100% accurate match results

---

## 🔮 Post-Launch Networking Features

### **Phase 9.1: Advanced Matchmaking**
- [ ] Skill-based matchmaking refinement
- [ ] Role-based team composition
- [ ] Placement matches for new players
- [ ] Tournament/competitive queue

### **Phase 9.2: Social Features**
- [ ] Friend invites and parties
- [ ] Squad/clan system
- [ ] Social ladder (friends only)
- [ ] Match replays and spectating

### **Phase 9.3: Global Infrastructure**
- [ ] Additional server regions
- [ ] Cross-region play (if desired)
- [ ] Server migration/load balancing
- [ ] Latency optimization (AWS Localzone)

### **Phase 9.4: Competitive Features**
- [ ] Tournament system
- [ ] Professional league support
- [ ] Seasonal ranking resets
- [ ] Competitive cosmetics

