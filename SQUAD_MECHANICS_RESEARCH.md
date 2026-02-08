# Squad Mechanics Research Document
## A Comprehensive Analysis of Squad Systems Across Premium Games

**Created for:** Heist Master - Stealth Strategy Game
**Date:** February 2026
**Scope:** Ghost Recon, Tarkov, PAYDAY, Hitman, Rainbow Six Siege, SWAT Games

---

## TABLE OF CONTENTS
1. [Game-by-Game Analysis](#game-by-game-analysis)
2. [UI Patterns & Implementation](#ui-patterns--implementation)
3. [Best-in-Class Mechanics](#best-in-class-mechanics)
4. [Role Archetypes](#role-archetypes)
5. [Command Systems](#command-systems)
6. [Progression & Loadouts](#progression--loadouts)
7. [Coordination Mechanics](#coordination-mechanics)
8. [Communication Systems](#communication-systems)
9. [Resource Management](#resource-management)
10. [Recommendations for Heist Master](#recommendations-for-heist-master)

---

## GAME-BY-GAME ANALYSIS

### 1. GHOST RECON: WILDLANDS

**Squad Size:** 4-player (1 player + 3 AI, or solo option)

#### Teammate Switching
- **No direct player swapping** - Players always control the primary protagonist
- Limited customization of AI loadouts through menu system
- Team responds to player's stance (standing/crouching affects behavior)

#### Formation & Positioning
- **Limitation:** No explicit formation system or stance selection
- AI teammates follow player's lead reactively
- Best positioning is manual tactical placement

#### Command Structure
- **Command Wheel Interface** - Radial menu providing options:
  - **Regroup** - Teammates return to player position
  - **Hold Position** - Teammates maintain current location
  - **Go To** - Direct teammates to specific map location
  - **Engage** (Cleared Hot) - Teammates take out all enemies
- Commands apply to **entire squad at once** (no individual targeting)
- Can issue commands via binoculars, scope, or drone sight

#### Squad Roles/Classes
- Minimal class differentiation
- Loadout customization available (weapons, attachments)
- No distinct skill trees or role specialization

#### Communication/Callouts
- Limited AI communication
- No player-to-player callout system visible in single-player
- Reliant on command wheel for coordination

**Key Insight:** Wildlands emphasizes **player agency over squad complexity** - teammates are tools for the player to direct rather than independent agents.

---

### 2. GHOST RECON: BREAKPOINT

**Squad Size:** 4-player (same structure as Wildlands)

#### Improvements Over Wildlands
- **More robust command options:**
  - Cleared Hot (Engage all enemies)
  - Regroup (Return to player)
  - Hold Position (Stay put)
  - Go To (Move to location)

#### Tactical Coordination
- AI teammates now **follow player stance** dynamically:
  - Standing position
  - Crouching position
  - Prone position
- Synchronized shots possible through coordination
- Better tactical positioning assistance

#### Squad Command Enhancement
- Commands still apply to entire squad
- Can override previous orders instantly
- Better visual feedback for squad status

**Key Insight:** Breakpoint refined the formula with better stance synchronization and visual clarity, but maintained the "command whole squad" philosophy.

---

### 3. ESCAPE FROM TARKOV

**Squad Size:** 2-5 PMC players (or mixed Scav squads)

#### Squad Formation Mechanics
- **No built-in formation system**
- Squad members spawn near each other but operate independently
- Players must manually coordinate positioning
- No HUD icons for squad identification initially (friendly fire possible)

#### Shared Resources/Economy
- **No automatic loot sharing**
- Items must be manually transferred between players
- Each player manages their own inventory
- Common strategy: One player loots while others overwatch

#### Extraction Coordination
- **Shared extraction zones** at designated points
- Limited extraction time creates urgency
- Squad members must reach same extraction point within time window
- Tactical consideration: Extract when activity is low, not post-combat

#### Friendly Fire & Teamwork
- **Full friendly fire enabled** - Core mechanic
- Creates high-stakes cooperation requirement
- Risk of accidental kills adds tension and communication pressure
- Players must be extremely cautious around teammates

#### Squad Communication
- **Voice communication essential** (external VOIP)
- Visual communication limited (no in-game callout system)
- Map knowledge sharing critical for extraction planning
- No built-in ping or marking system

**Key Insight:** Tarkov's squad mechanics emphasize **high-risk cooperation** - teammates are both assets and threats, creating tension that drives communication and planning.

---

### 4. PAYDAY 2

**Squad Size:** 4-player co-op heists

#### Role-Based Classes (5 Skill Trees)
1. **Mastermind** - Support and control
   - Ammo bag distribution
   - Remote revives
   - Crowd control
   - Intimidation

2. **Enforcer** - Tank and damage
   - Heavy armor
   - Melee combat
   - Self-healing
   - High ammo generation

3. **Technician** - Equipment and gadgets
   - Sentry guns
   - Trip mines
   - Hacking equipment
   - Equipment deployment

4. **Ghost** - Stealth specialist
   - Lockpicking
   - Silenced weapons
   - Visibility reduction
   - Stealth movement bonuses

5. **Fugitive** - Hybrid (Stealth + Combat)
   - Tactical positioning
   - Dodge mechanics
   - Balanced skill access
   - Versatility

#### Skill Trees & Team Synergies
- **Hybrid builds required** - Players spec across multiple trees
- **Team synergies critical:**
  - Ammo supply chain (multiple ammo bag users)
  - Medical chain (health distribution from teammates)
  - Equipment overlap creates redundancy
  - Buff/debuff stacking for superior performance

- **Example synergy:**
  - Mastermind with ammo + Enforcer tank = Sustained firepower
  - Technician sentries + Ghost stealth = Area control
  - Multiple healing sources = Team survival

#### Revive/Downs System
- **Downed state** - Player falls when health depleted
- **Revive mechanic** - Teammates must get close to revive (5 second window)
- **Bleed-out timer** - Downed players die if not revived in time
- **Special case:** Mastermind can revive from distance
- Creates tactical decisions about revive positioning

#### Team Resources (Ammo, Health, Consumables)
- **Ammo bags** - Placed on map, teammates pick up
- **Health kits** - Limited supply, must be rationed
- **Throwables** - Grenades shared resource pool
- **Equipment ammo** - Sentry guns, mines require management
- **Optimal distribution:** 2 ammo providers, 1 health provider, 1 flexible

#### Loud vs Stealth Coordination
- **Stealth approach:**
  - Ghost/Fugitive builds
  - Low noise generation
  - Positioning for camera/guard avoidance
  - Requires high precision and coordination

- **Loud approach:**
  - Enforcer tank takes damage
  - Mastermind supports with ammo
  - Technician controls with sentries
  - Medical support essential

**Key Insight:** PAYDAY 2 creates **emergent team dynamics** through overlapping skill trees and shared resources - success requires complementary builds and constant team awareness.

---

### 5. HITMAN 3 - CO-OP MODE

**Squad Size:** Up to 2 players (Agent 47 + one partner)

#### Playable Characters
- **Agent 47** - Main protagonist, full ability set
- **Stone** - Partner character with unique mechanics
- **Knight** - Second partner option
- **Not clones** - Each character has unique:
  - Gadgets and equipment
  - Disguise rules
  - Behavioral patterns
  - Limitations

#### Co-op Synchronized Objectives
- **Simultaneous mission execution** - Both players in same mission instance
- **Multiple approach strategies:**
  - One player stays in stealth while other distracts
  - Coordinated assassinations on multiple targets
  - Environmental manipulation by one player supporting other
  - Synchronized objective timing

#### Independent But Coordinated Gameplay
- Players operate **semi-independently** with shared mission goals
- Each player can pursue own approach to objectives
- Success requires tacit coordination (not explicit orders)
- Flexibility in how objectives are completed

#### Distraction/Cover Tactics
- **Distraction** - One player creates situation drawing guard attention
- **Cover** - Other player acts while focus is diverted
- **Environmental setup** - One player positions targets for other's elimination
- **Guard manipulation** - Coordinated positioning of NPCs

**Key Insight:** Hitman co-op emphasizes **cooperative flexibility** - players collaborate on goals but have freedom in methods, creating emergent tactical scenarios rather than scripted team roles.

---

### 6. RAINBOW SIX SIEGE

**Squad Size:** 5-player teams (Attackers vs Defenders)

#### Operator Selection & Counter-Picking
- **50+ Operators** with unique gadgets
- **Pre-round selection** - Visible operator lineup for both teams
- **Counter-picking strategy:**
  - Pick operators that counter enemy composition
  - Thatcher's EMP disables gadgets of defenders
  - IQ sees through Pulse's gadget
  - Strategy depth through operator matchups

#### Gadget Synergies
- **Example synergies:**
  - **Thermite + Thatcher:** Thatcher's EMP disables defenses, Thermite breaches reinforced walls
  - **Mira + Kaid:** Mira's black mirrors protected by Kaid's electrified reinforcements
  - **Ash + Thermite:** Ash creates entry points, Thermite finishes breaches
  - **Valkyrie + Maestro:** Valkyrie cameras pair with Maestro's turrets for overlapping fire

- **Gadget timing:** Success requires gadgets used in specific order
- **Map position dependency:** Synergies only work in specific locations

#### Callout System & Map Knowledge
- **Extreme importance of communication**
- **Callout terminology** - Specific room names, door references, positions
- **Intel is "precious loot"** - Drone intel shared to entire team
- **Spotting mechanic** - Mark enemies for team to track
- **Prediction callouts** - Experienced teams predict enemy rotations

#### Role Flexibility
- **Loose role structure:**
  - Hard Breacher (Thermite, Ace)
  - Soft Breacher (Ash, Sledge)
  - Support (Rook, Tachanka)
  - Intel (Twitch, IQ)
  - Flex (can adapt to team needs)

- **No enforced roles** - Team composition is flexible
- **Map-dependent roles** - Role usefulness changes per map

**Key Insight:** Siege's strength is in **information economy and gadget synergy** - success comes from knowing what to communicate, timing gadget use, and building synergistic operator compositions.

---

## UI PATTERNS & IMPLEMENTATION

### Pattern 1: Radial Command Wheel

**Used by:** Ghost Recon (both), PAYDAY 2, many tactical games

**Advantages:**
- All options equidistant from center (Fitts' Law advantage)
- Faster to access than list menus
- Builds muscle memory over time
- Works well for 3-12 options

**Implementation Details:**
- Center point at cursor/crosshair
- Options radiating outward at equal distances
- Typically 4-8 options per wheel (avoid clustering)
- Can support sub-menus (hierarchical)

**Example Layout (Ghost Recon):**
```
        Regroup
          |
    Hold ← • → Engage
          |
       Go To
```

**Best For:** Real-time squad commands during active gameplay

---

### Pattern 2: Squad Status HUD

**Used by:** Ghost Recon, PAYDAY 2, Siege, most tactical games

**Display Elements:**
- **Teammate names** with portrait/icon
- **Health bars** showing current vitality
- **Status indicators:**
  - Downed/bleeding out
  - Incapacitated
  - In combat/suppressed
  - Distance from player
- **Equipment readiness** (ammo count, gadget cooldown)
- **Position indicators** (arrow pointing to teammate location)

**Typical Layout:**
```
Top-left corner: Squad HUD
┌─────────────────────────┐
│ [Portrait] Operator A   │
│ ████████░░ 85 HP        │
├─────────────────────────┤
│ [Portrait] Operator B   │
│ ██░░░░░░░░ 25 HP ⚠️     │
├─────────────────────────┤
│ [Portrait] Operator C   │
│ ████████░░ 80 HP        │
└─────────────────────────┘
```

**Best For:** Real-time awareness of team status without stopping gameplay

---

### Pattern 3: Equipment/Loadout Menu

**Used by:** Ghost Recon, PAYDAY 2, Tarkov

**Structure:**
- **Pre-mission setup** - Configure before heist begins
- **Hierarchical options:**
  - Primary weapon selection
  - Secondary weapon
  - Equipment/gadgets
  - Consumables (ammo, health)
  - Armor/gear

**Interface Style:**
- Grid-based weapon previews
- Stat comparison panels
- Loadout templates/presets
- Quick-swap between saved builds

**Best For:** Strategic planning between missions/phases

---

### Pattern 4: Objective/Task Tracking

**Used by:** All games analyzed

**Elements:**
- **Primary objective** - Main goal for current phase
- **Secondary objectives** - Optional bonus tasks
- **Waypoints** - Visual/navigation markers
- **Progress indicators** - How close to completion
- **Team progress** - What other squad members need to do

**Typical Location:** Top-right or center-top of screen

---

## BEST-IN-CLASS MECHANICS

### Mechanic 1: Synergistic Role System (PAYDAY 2)

**Why it works:**
- Forces team composition choices
- Rewards planning ahead (not just in-mission)
- Creates asymmetric dependencies (need multiple ammo sources)
- Encourages role specialization without hard locks

**Implementation approach:**
- Create 3-4 role archetypes
- Each role excels at different team functions
- Build overlapping skill trees
- Resources balanced so multiple roles needed
- No role is completely useless in any situation

---

### Mechanic 2: Synchronized Objectives (Hitman 3)

**Why it works:**
- Maintains player agency and creativity
- Cooperation emerges naturally from shared goals
- Allows different approaches to same objective
- Reduces "follow the leader" gameplay

**Implementation approach:**
- Define end states (what success looks like)
- Allow multiple paths to success
- Design objectives that benefit from coordination
- Avoid scripting "correct" solution
- Support both solo and cooperative approaches

---

### Mechanic 3: Gadget Synergy (Rainbow Six Siege)

**Why it works:**
- Encourages team communication and planning
- Creates skill expression through gadget timing
- Counter-play and strategy evolution
- Operator selection becomes strategic choice

**Implementation approach:**
- Design gadgets with interaction potential
- Create hard counters (Thatcher vs electronic gadgets)
- Support gadgets (Thatcher enables Thermite)
- Make timing matter (order of operations)
- Balance so no single combo is "mandatory"

---

### Mechanic 4: Stance Synchronization (Ghost Recon: Breakpoint)

**Why it works:**
- Creates visual cohesion (team looks coordinated)
- Reduces command overhead (auto-sync saves orders)
- Improves tactical positioning naturally
- Feels intuitive to player

**Implementation approach:**
- Player stance automatically followed by AI
- Smooth transitions between stances
- Visual feedback of squad's current stance
- Balanced detection per stance (stealth bonus for crouch/prone)

---

### Mechanic 5: Information Economy (Rainbow Six Siege)

**Why it works:**
- Prioritizes communication skill
- Creates decision-making depth
- Rewards game knowledge
- Generates emergent gameplay

**Implementation approach:**
- Limit information provided automatically
- Reward players for gathering intel
- Create mechanisms to share information
- Make information decay over time
- Balanced so information gathering isn't mandatory

---

## ROLE ARCHETYPES

### Stealth-Focused Game Context

For Heist Master, consider these role archetypes that support stealth while maintaining synergy:

#### 1. **Infiltrator** (Stealth Specialist)
**Primary Functions:**
- Lockpicking/hacking objectives
- Guard avoidance
- Stealth navigation
- Creating silent distractions

**Key Abilities:**
- Lock bypass tools
- Movement speed bonus (crouch)
- Disguise access
- Sound masking

**Ideal Team Position:** Lead scout

**Synergies with:**
- Support (provides backup in fallback position)
- Operator (creates opportunities)

---

#### 2. **Operator** (Tactical Coordinator)
**Primary Functions:**
- Objective execution
- Guard manipulation
- Equipment deployment
- Secondary targets

**Key Abilities:**
- Faster interaction speed
- Device manipulation
- Distraction tools
- Multiple weapon options

**Ideal Team Position:** Objective executor

**Synergies with:**
- Infiltrator (leverages opened paths)
- Support (cover during execution)

---

#### 3. **Support** (Team Assistant)
**Primary Functions:**
- Resource management
- Revive capability
- Information gathering
- Fallback coverage

**Key Abilities:**
- Ammo/health distribution
- Healing gadgets
- Reconnaissance tools
- Crowd control (non-lethal)

**Ideal Team Position:** Rear guard/backup

**Synergies with:**
- Everyone (support enables all roles)
- Particularly Infiltrator and Operator

---

#### 4. **Specialist** (Hybrid Role)
**Primary Functions:**
- Adaptation to mission needs
- Equipment operation
- Alternative objectives
- Tactical flexibility

**Key Abilities:**
- Flexible skill selection
- Multiple equipment options
- Average stats across board
- Versatile gadgets

**Ideal Team Position:** Flexible (mission-dependent)

**Synergies with:**
- Any composition (fills gaps)

---

### Role Skill Tree Structure (PAYDAY 2 Model)

```
┌─────────────────────┐
│  Infiltrator Tree   │
├─────────────────────┤
│ • Lock bypass        │
│ • Silent movement    │
│ • Disguise access    │
│ • Stealth detection  │
│ • Area coverage      │
└─────────────────────┘

┌─────────────────────┐
│   Operator Tree     │
├─────────────────────┤
│ • Fast interaction   │
│ • Device control     │
│ • Distraction tools  │
│ • Objective tracking │
│ • Weapon variety     │
└─────────────────────┘

┌─────────────────────┐
│   Support Tree      │
├─────────────────────┤
│ • Ammo distribution  │
│ • Health sharing     │
│ • Revive distance    │
│ • Intel sharing      │
│ • Non-lethal options │
└─────────────────────┘
```

---

## COMMAND SYSTEMS

### System 1: Radial Wheel Command (Recommended for Stealth)

**Command Categories:**

**Movement Orders:**
- Go To [waypoint]
- Regroup [return to player]
- Hold Position
- Follow Me
- Spread Out [maintain formation]

**Combat/Alert Orders:**
- Engage
- Hold Fire
- Suppress Area
- Cover [protect location]

**Tactical Orders:**
- Await Signal
- Synchronize (for coordinated actions)
- Fallback [retreat to position]
- Hold Stealth [maintain stealth posture]

**Information Orders:**
- Report Status
- Mark Target
- Check Area

**Implementation (JavaScript Canvas):**

```javascript
class CommandWheel {
  constructor() {
    this.commands = [
      { angle: 0,    label: 'Go To',      icon: 'waypoint' },
      { angle: 45,   label: 'Hold Fire',  icon: 'silence' },
      { angle: 90,   label: 'Regroup',    icon: 'gather' },
      { angle: 135,  label: 'Engage',     icon: 'attack' },
      { angle: 180,  label: 'Fallback',   icon: 'retreat' },
      { angle: 225,  label: 'Await',      icon: 'wait' },
      { angle: 270,  label: 'Sync Shot',  icon: 'sync' },
      { angle: 315,  label: 'Status',     icon: 'info' }
    ];
  }

  draw(ctx, centerX, centerY, radius = 100) {
    // Draw center circle
    ctx.fillStyle = 'rgba(100, 150, 200, 0.8)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw command options
    this.commands.forEach(cmd => {
      const rad = (cmd.angle * Math.PI) / 180;
      const x = centerX + Math.cos(rad) * radius;
      const y = centerY + Math.sin(rad) * radius;

      // Draw option circle
      ctx.fillStyle = 'rgba(100, 150, 200, 0.6)';
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cmd.label, x, y);
    });
  }

  getCommandAt(mouseX, mouseY, centerX, centerY) {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 20) return null; // Center deadzone
    if (distance > 150) return null; // Outer limit

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

    // Find closest command within 22.5 degree tolerance
    return this.commands.find(cmd =>
      Math.abs(cmd.angle - angle) < 22.5 ||
      Math.abs(cmd.angle - angle) > 337.5
    );
  }
}
```

**Advantages for Heist Master:**
- Fast command execution (important in tense situations)
- Minimal UI disruption (small circle overlay)
- Fits stealth game aesthetic
- Scales from 1-8 players well

---

### System 2: Quick Command Hotkeys

**Alternative for fast-paced moments:**

```javascript
// Suggested keyboard layout
const quickCommands = {
  'Q': 'Go To Waypoint',
  'E': 'Regroup',
  'R': 'Hold Fire',
  'T': 'Engage',
  'F': 'Hold Position',
  'G': 'Fallback',
  'Z': 'Sync Shot',
  'X': 'Await Signal'
};
```

**Advantages:**
- Fastest execution
- No visual menu needed
- Works well for experienced players
- Stealth-friendly (no cursor movement)

**Disadvantages:**
- Steep learning curve
- Not discoverable for new players
- Limited to ~8 commands

---

### System 3: Context Menu (Right-Click Selection)

**For more complex games:**

```
Right-click on teammate →
  └─ Movement
     ├─ Go To
     ├─ Regroup
     ├─ Hold Position
     └─ Spread Out
  └─ Combat
     ├─ Hold Fire
     ├─ Engage
     └─ Suppress Area
  └─ Tactical
     ├─ Await Signal
     ├─ Synchronize
     └─ Fallback
```

**Advantages:**
- Hierarchical (more options)
- Context-aware (showing relevant options)
- Self-documenting

**Disadvantages:**
- Slower than wheel (multi-click)
- Takes up screen space
- Not ideal for in-mission use

---

## PROGRESSION & LOADOUT SYSTEMS

### System 1: Skill Tree Progression (PAYDAY 2 Model)

**Structure for Heist Master:**

```
INFILTRATOR SKILL TREE
├─ Tier 1 (Unlock at Level 5)
│  ├─ Swift Hands (15% faster lockpicking)
│  ├─ Silent Step (20% quieter movement)
│  └─ Shadow Merge (15% stealth visibility reduction)
│
├─ Tier 2 (Unlock at Level 15)
│  ├─ Master Locksmith (30% faster + picks harder locks)
│  ├─ Phantom (40% stealth visibility reduction)
│  └─ Ghost Routes (see optimal stealth paths)
│
└─ Tier 3 (Unlock at Level 25)
   ├─ Key Master (instant lockpick on any door)
   ├─ One with Shadows (invisible while crouch-moving)
   └─ Pathfinder (mark guard patterns for team)

OPERATOR SKILL TREE
├─ Tier 1 (Unlock at Level 5)
│  ├─ Swift Hands (15% faster interactions)
│  ├─ Lockbreaker (alternate lock-bypass method)
│  └─ System Hacker (basic device control)
│
├─ Tier 2 (Unlock at Level 15)
│  ├─ Expert Operator (40% faster interactions)
│  ├─ Master Hacker (full device network access)
│  └─ Distraction Tactics (create diversions)
│
└─ Tier 3 (Unlock at Level 25)
   ├─ Instant Override (bypass any system)
   ├─ Coordinated Assault (synchronized objectives)
   └─ Blacksmith (modify weapons for situations)

SUPPORT SKILL TREE
├─ Tier 1 (Unlock at Level 5)
│  ├─ Ammo Scavenger (collect 20% more ammo)
│  ├─ First Aid (basic healing others)
│  └─ Eyes in the Sky (enhanced callouts)
│
├─ Tier 2 (Unlock at Level 15)
│  ├─ Quartermaster (distribute ammo to team)
│  ├─ Combat Medicine (revive teammates from distance)
│  └─ Tactical Intel (shared vision through walls)
│
└─ Tier 3 (Unlock at Level 25)
   ├─ Supply Chain (unlimited ammo provisioning)
   ├─ Emergency Extraction (team revival + escape)
   └─ Battle Coordinator (all teammates see your markers)
```

**Progression Mechanics:**
- Earn points per mission completion
- Points split among 3 roles (choose distribution)
- Can respec at end of campaign
- Some skills unlock new options (not just stat increases)
- Tier-gating prevents power creeping

---

### System 2: Loadout Presets

**Structure:**

```javascript
// Loadout system for Heist Master
const loadoutTemplate = {
  name: "Classic Stealth",
  role: "Infiltrator",
  weapons: {
    primary: "silenced_pistol",
    secondary: "lockpick_kit",
    throwables: ["gas_pellets"]
  },
  equipment: {
    gadget1: "motion_detector",
    gadget2: "disguise_kit",
    armor: "light_suit"
  },
  skillSelections: [
    "Swift Hands",
    "Silent Step",
    "Ghost Routes"
  ],
  favoriteExtracts: ["roof_access"]
};

// Player can save 3-5 presets
class LoadoutManager {
  constructor() {
    this.presets = [];
    this.maxPresets = 5;
  }

  saveLoadout(loadout) {
    if (this.presets.length < this.maxPresets) {
      this.presets.push(loadout);
    }
  }

  quickSwitch(presetIndex) {
    // Load loadout between missions
    return this.presets[presetIndex];
  }
}
```

**UI Implementation:**
- 5 preset slots shown before mission start
- Click to select, shows full loadout details
- Quick-edit within mission setup screen
- Can save/load from mission failures

---

### System 3: Equipment Unlocks

**Progression-Based Equipment:**

```
EARLY GAME (Missions 1-5)
• Basic silenced pistol
• Simple lockpick tools
• Light armor
• Basic gadgets (distraction)

MID GAME (Missions 6-15)
• Advanced lockpicks
• Secondary weapons (shotgun variants)
• Medium armor
• Intermediate gadgets (motion sensors)

LATE GAME (Missions 16-25)
• Master key override
• Specialty weapons
• Heavy armor options
• Advanced gadgets (EMP, false identities)

ENDGAME (Missions 25+)
• Exotic equipment
• Legendary weapons
• Unique gadgets
• Cosmetic variants
```

---

## COORDINATION MECHANICS

### Mechanic 1: Synchronized Actions

**Implementation for stealth heists:**

```javascript
class SynchronizedAction {
  constructor(actionName, teamMembers) {
    this.actionName = actionName; // "Synchronized Takedown"
    this.teamMembers = teamMembers; // Array of squad members
    this.readyStates = new Map();
    this.executeTime = null;
  }

  initialize() {
    // Ask each team member if they're in position
    this.teamMembers.forEach(member => {
      this.readyStates.set(member.id, false);
    });
  }

  markReady(memberId) {
    this.readyStates.set(memberId, true);

    // Check if all members ready
    const allReady = Array.from(this.readyStates.values()).every(v => v === true);
    if (allReady) {
      this.canExecute = true;
      this.showExecutePrompt(); // Press X to execute
    }
  }

  execute() {
    // All team members perform action simultaneously
    // E.g., synchronized takedowns on multiple guards
    // Or coordinated objective interactions

    this.teamMembers.forEach(member => {
      member.performAction(this.actionName);
    });

    // Success bonus: +10% heat reduction for perfect coordination
  }
}

// Example usage
const syncTakedown = new SynchronizedAction(
  "Synchronized Takedown",
  [playerOne, playerTwo, playerThree]
);

syncTakedown.initialize(); // Ask players to get in position
// Wait for all players to be ready...
syncTakedown.execute(); // All perform action at once
```

**Benefits:**
- Encourages cooperation
- Creates climactic moments
- Rewards perfect coordination
- Reduces heat on successful sync

---

### Mechanic 2: Formation Movement

**For tactical stealth coordination:**

```javascript
class Formation {
  constructor(type, members) {
    this.type = type; // "wedge", "line", "column", "spread"
    this.members = members;
    this.leader = members[0];
  }

  static FORMATION_TYPES = {
    WEDGE: {
      offsets: [
        {x: 0, y: 0},      // Leader (center)
        {x: -50, y: 30},   // Left back
        {x: 50, y: 30}     // Right back
      ],
      stealth: 'medium',
      firepower: 'good'
    },
    LINE: {
      offsets: [
        {x: -100, y: 0},
        {x: -50, y: 0},
        {x: 0, y: 0},
        {x: 50, y: 0}
      ],
      stealth: 'low',
      firepower: 'excellent'
    },
    COLUMN: {
      offsets: [
        {x: 0, y: 0},
        {x: 0, y: 40},
        {x: 0, y: 80},
        {x: 0, y: 120}
      ],
      stealth: 'excellent',
      firepower: 'low'
    },
    SPREAD: {
      offsets: [
        {x: -100, y: -100},
        {x: 100, y: -100},
        {x: -100, y: 100},
        {x: 100, y: 100}
      ],
      stealth: 'good',
      firepower: 'medium'
    }
  };

  updatePositions() {
    const formationType = this.FORMATION_TYPES[this.type];

    this.members.forEach((member, index) => {
      if (index < formationType.offsets.length) {
        const offset = formationType.offsets[index];
        member.targetX = this.leader.x + offset.x;
        member.targetY = this.leader.y + offset.y;
      }
    });
  }

  switchFormation(newType) {
    this.type = newType;
    this.updatePositions();
  }

  getStealthBonus() {
    return this.FORMATION_TYPES[this.type].stealth;
  }
}
```

**Formation Effects:**
- **WEDGE** - Balanced, good for tactical movement
- **LINE** - Aggressive, good fire coverage (loud)
- **COLUMN** - Single file, best stealth (quiet)
- **SPREAD** - Area denial, good for covering multiple routes

---

### Mechanic 3: Role-Specific Objectives

**Dependent objectives that require coordination:**

```javascript
class ObjectiveChain {
  // "Vault Heist" requires:
  // 1. Infiltrator hacks security panel (30 seconds)
  // 2. Operator opens main vault (locked during hack)
  // 3. Support watches for guards
  // 4. All extract together

  objectives = [
    {
      assignedRole: "Infiltrator",
      description: "Hack security panel",
      duration: 30,
      blocking: ["operatorVaultOpen"],
      reward: 50 // heat points
    },
    {
      assignedRole: "Operator",
      description: "Open vault door",
      duration: 15,
      blockedBy: ["infiltratorHack"],
      reward: 100
    },
    {
      assignedRole: "Support",
      description: "Provide overwatch",
      duration: 45,
      concurrent: true,
      reward: 30
    }
  ];
}
```

**Benefits:**
- Forces cooperation
- Makes each role valuable
- Increases tension (overlapping timings)
- Creates narrative flow

---

## COMMUNICATION SYSTEMS

### System 1: Ping/Marking System

**Visual communication without voice:**

```javascript
class PingSystem {
  static PING_TYPES = {
    ATTENTION: { color: 'red', sound: 'ding_high' },
    CLEAR: { color: 'green', sound: 'ding_low' },
    ENEMY: { color: 'red', icon: 'skull' },
    WAYPOINT: { color: 'blue', icon: 'flag' },
    OBJECTIVE: { color: 'gold', icon: 'star' }
  };

  ping(type, x, y, duration = 5000) {
    // Display ping on map and in 3D world
    const pingObject = {
      type,
      x,
      y,
      createdAt: Date.now(),
      duration,
      alpha: 1
    };

    this.activePings.push(pingObject);

    // Notify all teammates
    this.broadcastToTeam({
      event: 'ping',
      from: this.player.name,
      type,
      position: {x, y}
    });
  }

  // Visual feedback in game world
  drawPing(ctx, ping) {
    const age = Date.now() - ping.createdAt;
    const progress = age / ping.duration;
    ping.alpha = 1 - progress;

    ctx.globalAlpha = ping.alpha;
    ctx.fillStyle = this.PING_TYPES[ping.type].color;
    ctx.beginPath();
    ctx.arc(ping.x, ping.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
```

**Ping Types:**
- **Enemy Ping** - Alert team to guard position
- **Waypoint Ping** - Suggest meeting location
- **Clear Ping** - Indicate safe area
- **Objective Ping** - Mark task target
- **Guard Route Ping** - Track patrol pattern

---

### System 2: Audio Callouts

**Contextual voice lines for silent coordination:**

```javascript
class CalloutSystem {
  // Automatic callouts reduce voice comms need

  callouts = {
    detection: [
      "Guard spotted!",
      "Visual on enemy",
      "Contact right"
    ],
    objective: [
      "Objective acquired",
      "Hacking in progress",
      "Vault secured"
    ],
    coordination: [
      "Moving to position",
      "Standing by",
      "In position",
      "Ready on signal"
    ],
    alert: [
      "We're made!",
      "Heat rising!",
      "Guards incoming",
      "Pull back!"
    ]
  };

  triggerCallout(category, context) {
    // Context: who, where, what
    const callout = this.selectCallout(category, context);
    this.playAudioLine(callout);

    // Notify team of spoken message (for hearing impaired)
    this.displayCalloutSubtitle(callout, 3000);
  }

  // Automatic triggers
  onGuardDetected() {
    this.triggerCallout('detection', {
      location: 'north',
      count: 1
    });
  }

  onObjectiveComplete() {
    this.triggerCallout('objective', {
      type: 'vault',
      status: 'complete'
    });
  }
}
```

**Automatic Callouts Trigger:**
- Guard sightings
- Objective completion
- Alert level changes
- Team member down
- Extraction ready

---

### System 3: Heat/Alert Indicators

**Shared awareness of detection state:**

```javascript
class AlertSystem {
  heatLevel = 0; // 0-100

  indicators = {
    // Visual in UI
    heatBar: {
      green: '0-25%',
      yellow: '25-50%',
      orange: '50-75%',
      red: '75-100%'
    },

    // Audio queues
    soundIntensity: {
      calm: 'quiet_ambient',
      alert: 'warning_tone',
      danger: 'sirens'
    },

    // Guard behavior
    guardState: {
      calm: 'patrol',
      suspicious: 'investigation',
      hostile: 'lockdown'
    }
  };

  updateHeat(change) {
    this.heatLevel = Math.max(0, Math.min(100, this.heatLevel + change));

    // Broadcast to team
    this.team.forEach(member => {
      member.updateAlertness(this.heatLevel);
    });

    // Trigger audio/visual effects
    this.triggerAlertResponse();
  }

  triggerAlertResponse() {
    if (this.heatLevel > 75) {
      // Red alert - guards searching actively
      // Teammates move to fallback positions
      // Escape is primary objective
    } else if (this.heatLevel > 50) {
      // Orange alert - guards suspicious
      // Teammates increase caution
      // Some actions unavailable (loud)
    } else if (this.heatLevel > 25) {
      // Yellow alert - guards wary
      // Teammates more defensive
      // Stealth still primary
    }
  }
}
```

**Heat Mechanics:**
- Visible to entire team (shared resource)
- Affects all players' movement/visibility
- Impacts guard behavior globally
- Creates tension as team (stealth degrades)

---

## RESOURCE MANAGEMENT

### Resource System for Heist Master

```javascript
class TeamResources {
  constructor() {
    // Team-wide pools, not individual
    this.sharedResources = {
      ammo: 100,           // Total rounds for team
      medkits: 5,          // Healing items
      disguises: 3,        // Identity masks
      gadgetCharges: 20,   // Hackables/electronics
      timers: {}           // Mission timers
    };

    // Per-member resources
    this.memberResources = new Map();
  }

  distributeAmmo(infiltrator, operator, support) {
    // Strategic distribution
    // Infiltrator needs ammo for emergencies
    // Operator needs steady supply
    // Support shares remaining

    const distribution = {
      infiltrator: Math.floor(this.sharedResources.ammo * 0.3),
      operator: Math.floor(this.sharedResources.ammo * 0.4),
      support: this.sharedResources.ammo * 0.3
    };

    return distribution;
  }

  consumeResource(type, amount) {
    if (this.sharedResources[type] >= amount) {
      this.sharedResources[type] -= amount;

      // Inform team of depletion
      if (this.sharedResources[type] < amount * 2) {
        this.broadcastWarning(`Low ${type}: ${this.sharedResources[type]} remaining`);
      }

      return true;
    }
    return false; // Not enough resources
  }

  scavengeResource(type, amount) {
    // Found items during heist
    this.sharedResources[type] += amount;

    // Notify team
    this.broadcastEvent(`Found ${amount} ${type}!`);
  }
}
```

**Resource System Features:**
- **Team pools** - Everyone shares (not individual inventories)
- **Strategic distribution** - Choose how to split ammo/health
- **Scavenging** - Find more resources during mission
- **Consumables** - Gadgets have limited charges
- **Penalties** - Running out mid-objective is dangerous

---

### Heat/Alertness as Resource

```javascript
class HeatManagement {
  heatMechanics = {
    // Actions that increase heat
    actions: {
      guard_sighting: 15,
      combat: 25,
      loud_noise: 10,
      alarm_triggered: 50,
      detection_time: 3 // Per second detected
    },

    // Actions that reduce heat
    recovery: {
      hiding: -2, // Per second in hiding spot
      time_elapsed: -1, // Per 5 seconds without detection
      objective_complete: -10, // Task completion "resets"
      stealth_takedown: -5, // Silent action
    },

    // Heat thresholds
    thresholds: {
      50: "Mission failure if not careful",
      100: "Instant mission failure",
      25: "Guards searching actively"
    }
  };

  // Heat affects gameplay
  heatEffects(currentHeat) {
    return {
      25: { guards: 'alert', movement: 'restricted' },
      50: { guards: 'searching', movement: 'very_restricted' },
      75: { guards: 'hostile', movement: 'lockdown' },
      100: { status: 'caught', mission: 'failed' }
    };
  }
}
```

---

## RECOMMENDATIONS FOR HEIST MASTER

### Priority 1: Foundation Systems (Phase 1 - MVP)

**Implement First:**

1. **Basic Squad Commands (Radial Wheel)**
   - Go To (waypoint)
   - Regroup (gather position)
   - Hold (maintain location)
   - Engage (attack)
   - Hold Fire (suppress fire)

2. **Squad Status HUD**
   - Health bars for each teammate
   - Position indicators
   - Basic status (alive/down/downed)
   - Located top-left corner

3. **AI Teammate System**
   - Follow player with stance sync
   - Respond to basic commands
   - Basic tactical positioning
   - Don't require extensive micromanagement

4. **Shared Heat System**
   - Single heat bar for entire team
   - All guards react to team detection
   - Heat visible to all players
   - Creates shared tension

**Estimated Implementation Time:** 2-3 weeks

---

### Priority 2: Stealth-Specific Mechanics (Phase 2)

**Add After MVP:**

1. **Role Archetypes (3 types)**
   - **Infiltrator** - Lockpicking, stealth, movement speed
   - **Operator** - Fast interaction, objective completion
   - **Support** - Resource management, revives, callouts

2. **Coordinated Actions**
   - Synchronized takedowns (multiple guards at once)
   - Distraction/cover mechanics (one acts, other distracts)
   - Requires both players in position

3. **Formation System**
   - Column (single file, best stealth)
   - Wedge (balanced)
   - Spread (area coverage)
   - Formation affects detection range

4. **Resource Sharing**
   - Shared ammo pool
   - Shared medkit supply
   - Tactical distribution pre-mission

**Estimated Implementation Time:** 2-3 weeks

---

### Priority 3: Communication & Awareness (Phase 3)

**Add After Mechanics Polish:**

1. **Ping System**
   - Mark enemy positions
   - Suggest waypoints
   - Signal "clear" areas
   - Ping lasts 5 seconds

2. **Audio Callouts**
   - Automatic lines on detection
   - Role-specific warnings
   - Objective status updates
   - Non-intrusive audio cues

3. **Advanced HUD Elements**
   - Guard detection indicators
   - Hearing zones visualization
   - Stealth score per player
   - Team coordination meter

4. **Chat/Quick Commands**
   - Quick callout hotkeys
   - In-mission text chat (optional)
   - Preset messages (stealth games work better with minimal text)

**Estimated Implementation Time:** 1-2 weeks

---

### Priority 4: Polish & Depth (Phase 4+)

**Long-term additions:**

1. **Progression System**
   - Skill trees for each role
   - Unlock new abilities/gadgets
   - Cosmetic rewards
   - Prestige/challenge modes

2. **Advanced Loadouts**
   - Save/load preset builds
   - Role-specific equipment
   - Weapon variant customization
   - Specialty gadgets per role

3. **Tactical Depth**
   - Guard pattern learning
   - Environmental interaction
   - Objective variety
   - Dynamic mission modifiers

---

### Key Design Principles for Heist Master

**1. Stealth First**
- Commands must not interrupt stealth
- UI should be minimal/unobtrusive
- Coordination happens naturally, not through menus

**2. Asymmetric Roles**
- Each role excels at different tasks
- No role is "best" (situational)
- Roles create interesting team compositions
- Skill trees provide specialization

**3. Cooperative Tension**
- Heat is shared resource creating pressure
- Mistakes affect entire team
- Success requires coordination
- Communication is essential

**4. Scalable from 1-8 Players**
- Start with 2-player co-op (easier)
- Expand to 4-player squads
- Support up to 8-player raids
- Scale objectives accordingly

---

### UI Implementation Checklist

```javascript
// Phase 1 - MVP UI
const mvpUI = [
  '☐ Radial command wheel (8 commands)',
  '☐ Squad health HUD (top-left)',
  '☐ Heat level indicator (top-center)',
  '☐ Objective tracker (top-right)',
  '☐ Team position minimap markers',
  '☐ Basic prompt system ("Press X to...")'
];

// Phase 2 - Role System
const roleUI = [
  '☐ Role selection screen (pre-mission)',
  '☐ Skill tree display',
  '☐ Loadout customization menu',
  '☐ Equipment preview',
  '☐ Role-specific ability indicators'
];

// Phase 3 - Communication
const commsUI = [
  '☐ Ping system with indicators',
  '☐ Callout subtitles',
  '☐ Guard detection warnings',
  '☐ Coordination readiness indicator',
  '☐ Formation display indicator'
];

// Phase 4 - Polish
const polishUI = [
  '☐ Animation refinements',
  '☐ Audio cue clarity',
  '☐ Color-blind mode',
  '☐ Accessibility options',
  '☐ Custom UI scaling'
];
```

---

### Code Architecture Recommendation

**Suggested class structure:**

```javascript
// Core systems
class SquadManager {
  constructor() {
    this.members = [];
    this.heatLevel = 0;
    this.sharedResources = new TeamResources();
    this.commandQueue = new CommandQueue();
  }

  addMember(player) { /* ... */ }
  issueCommand(command, target) { /* ... */ }
  updateHeat(amount) { /* ... */ }
  executeCoordinatedAction(action) { /* ... */ }
}

class TeamMember {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.skills = new SkillTree(role);
    this.equipment = new EquipmentSlots();
    this.state = new MemberState();
  }

  followCommand(command) { /* ... */ }
  getPosition() { /* ... */ }
  performAction(action) { /* ... */ }
}

class CommandSystem {
  static COMMANDS = {
    GO_TO: 'go_to',
    REGROUP: 'regroup',
    HOLD: 'hold',
    ENGAGE: 'engage',
    HOLD_FIRE: 'hold_fire',
    AWAIT_SIGNAL: 'await_signal',
    SYNC_SHOT: 'sync_shot',
    FALLBACK: 'fallback'
  };

  issueCommand(type, target) { /* ... */ }
}

// UI system
class UIManager {
  drawCommandWheel(x, y) { /* ... */ }
  drawSquadHUD() { /* ... */ }
  drawHeatIndicator() { /* ... */ }
  drawPings() { /* ... */ }
}
```

---

## SOURCES & REFERENCES

The analysis in this document is based on research from:

- [Ghost Recon Wildlands Squad Mechanics](https://steamcommunity.com/app/460930/discussions)
- [Ghost Recon Breakpoint AI Teammates](https://www.ubisoft.com/en-us/help/ghost-recon-breakpoint/)
- [Escape from Tarkov Squad Mechanics](https://escapefromtarkov.fandom.com/wiki/Combat_groups)
- [PAYDAY 2 Class System Guide](https://steamcommunity.com/sharedfiles/filedetails/?id=262139982)
- [Rainbow Six Siege Operator Synergy](https://steamcommunity.com/sharedfiles/filedetails/?id=3264194884)
- [Hitman 3 Co-op Mode](https://gamertweak.com/hitman-3-co-op-multiplayer/)
- [Radial Menu UI Patterns](https://www.stirlingweir.com/radial-menus)
- [Resource Management in Games](https://www.linkedin.com/pulse/resource-management-optimizing-fun-jannick-hynding-lund)
- [Stealth Game Design Patterns](https://gamedesignskills.com/game-design/stealth/)

---

## CONCLUSION

For **Heist Master**, the optimal squad system combines:

1. **Simple command interface** (radial wheel) for fast, non-disruptive coordination
2. **Role-based progression** (Infiltrator, Operator, Support) for team synergy
3. **Shared resources** (heat, ammo, health) creating cooperative tension
4. **Synchronized actions** rewarding perfect coordination with mechanical benefits
5. **Minimal UI** keeping focus on stealth gameplay, not menu management

**Start with MVP (Phase 1)** and iterate based on player feedback. The best squad mechanics feel invisible - players coordinate naturally without thinking about systems.

**Success metric:** Players feel like they're playing with a team, not commanding NPCs.
