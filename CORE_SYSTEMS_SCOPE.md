# NEXUS - Core Systems Completion Scope
## Strategic Focus: Character → Abilities → Weapons → Maps → Lore

### 🎯 VISION
**Create a complete, balanced, narratively-cohesive PvP MOBA where every hero feels distinct and powerful.**

Build core gameplay systems to production quality before adding AI, sound, or cosmetics.

---

## 📊 CURRENT STATE

| System | Status | Completeness | Priority |
|--------|--------|--------------|----------|
| **Characters (15)** | ✅ COMPLETE | 100% | ✅ DONE |
| **Abilities (60)** | 🟡 PARTIAL | 27% (4/15 heroes) | 🔴 CRITICAL |
| **Weapons (30)** | ✅ COMPLETE | 95% | ✅ DONE |
| **Maps (3)** | ✅ COMPLETE | 95% | ✅ DONE |
| **Lore** | 🟡 PARTIAL | 50% | 🟠 HIGH |
| **Balance** | 🟡 PARTIAL | 60% | 🟠 HIGH |

---

## 🔴 CRITICAL GAP: HERO ABILITY IMPLEMENTATIONS

**Current Reality:**
- Only **4 heroes** have full ability mechanics implemented:
  - ✅ Grael (Warrior)
  - ✅ Thaxus (Warrior)
  - ✅ Lyric (Ranger)
  - ✅ Ember (Mage)

- **11 heroes** need implementation:
  - 🔴 Aldrin, Kess, Vos (urgent)
  - 🟠 Petra, Kora, Kyrax, Talen, Zephyr
  - 🟠 Raze, Vesper, Silk

**What "Implementation" Means:**
1. Unique ability mechanics (not generic templates)
2. VFX integration (particles, projectiles, effects)
3. Status effect application
4. Proper damage calculations
5. Cooldown management

**Impact:**
- Currently only **27% of heroes are playable** with intended mechanics
- Rest use generic ability system (broken immersion)
- Estimated time to complete: **2-3 weeks** (aggressive development)

---

## ✅ COMPLETE SYSTEMS (Ready to Ship)

### CHARACTER DEVELOPMENT
**Status: GOLD** ✅

All 15 heroes fully defined:
- Unique stats with balanced role distribution
- Distinct visual themes and color schemes
- Personality/lore descriptions
- Synergies and counter matchups
- Weapon assignments (primary + secondary)

**No Changes Needed** - Characters are complete and balanced.

### WEAPON SYSTEM
**Status: GOLD** ✅

30 weapons fully implemented:
- 2 per hero (primary/secondary)
- Element system working (7 types, rock-paper-scissors)
- Damage scaling implemented (AD/AP/Health/Armor)
- Projectile/melee/hitscan mechanics working
- Integration with hero instances complete

**Minor Work:** Implement special effects for remaining 12 weapons
- Estimated: 1-2 days

### ARENA/MAP SYSTEM
**Status: GOLD** ✅

3 complete, balanced arenas:
- TDM Arena (symmetrical, 2 teams)
- Search & Destroy (asymmetrical, objectives)
- King of the Hill (control point)

All features implemented:
- Collision detection ✓
- Spawn points ✓
- Environmental hazards ✓
- Minimap rendering ✓
- Objective zones ✓

**Enhancement Opportunity:** Add 2-3 more hazard types (healing zones, slowfields, damage amplifiers)
- Estimated: 3-5 days

---

## 🟠 HIGH PRIORITY: ABILITY IMPLEMENTATIONS & BALANCE

### Phase 1: Core Ability Implementations (Week 1-2)
**Goal: Get all 15 heroes playable with unique mechanics**

**Week 1:**
- [ ] Aldrin (Warrior) - Bastion passive + defensive abilities
- [ ] Kess (Ranger) - Ambush + escape mechanics
- [ ] Vos (Ranger) - Trap system implementation
- [ ] Talen (Mage) - Spell cascade stacking mechanic

**Week 2:**
- [ ] Petra (Guardian) - Healing mechanics
- [ ] Kora (Guardian) - Team buff/aura system
- [ ] Kyrax (Guardian) - CC chain mechanics
- [ ] Zephyr (Mage) - Control abilities
- [ ] Raze (Rogue) - Assassination mechanics
- [ ] Vesper (Rogue) - Drain/suppress mechanics
- [ ] Silk (Rogue) - Web/trap mechanics

**Metrics:**
- Each hero: 4 unique ability mechanics
- Each ability: Proper VFX, cooldown, mana cost
- All abilities: Stat scaling (AD/AP/Health/Armor)
- Status effects: Applied on hit

### Phase 2: Balance & Mana System (1 week)
**Goal: Create meaningful resource management**

**Current Problem:**
- 50% of abilities cost 0 mana
- Mana resource feels irrelevant
- No strategic resource decisions

**Fix:**
- [ ] Increase Q ability costs: 40-60 mana (from 0-50)
- [ ] Increase E ability costs: 60-90 mana (from 0-90)
- [ ] Maintain R cost: 100-150 mana (ultimates expensive)
- [ ] Verify mana regen feels good (10/sec, 400 max)

**Result:** Players must choose between multiple abilities = better strategy

### Phase 3: VFX Polish (1 week)
**Goal: Make all 15 heroes feel visually distinct**

**Implementation:**
- [ ] Unique VFX for each hero's abilities
- [ ] Element-specific colors for weapons
- [ ] Status effect animations
- [ ] Impact feedback (particles, numbers, effects)

---

## 🟠 HIGH PRIORITY: LORE EXPANSION

### Current State:
- 3 heroes with epic lore (Kyrax, Raze, Grael)
- 4 heroes with basic lore
- 8 heroes with minimal/generic lore
- **No world context** - where does this all take place?
- **No faction system** - are heroes allies or rivals?
- **No interconnections** - do any heroes know each other?

### Scope:
**Week 1-2: World Building**
- [ ] Define the setting (fantasy kingdom? Post-apocalyptic? Sci-fi?)
- [ ] Create 3-4 major factions/kingdoms
- [ ] Define conflict/war context

**Week 2-3: Hero Interconnections**
- [ ] 3-4 hero pairs have story connections
- [ ] Each hero has clear faction allegiance
- [ ] 5-10 "synergy" narratives (why these heroes work together)
- [ ] 5-10 "counter" narratives (why these heroes clash)

**Week 3: Lore Expansion**
- [ ] Expand each hero's backstory to 2-3 paragraphs
- [ ] Add personality quirks/voice lines (text-based for now)
- [ ] Create hero relationship matrix

**Impact:**
- Players understand why heroes work together
- Team composition has narrative meaning
- Heroes feel part of a living world

---

## 🎯 IMPLEMENTATION PRIORITY MATRIX

| Task | Impact | Effort | Priority | Owner | Timeline |
|------|--------|--------|----------|-------|----------|
| **Implement 11 hero abilities** | CRITICAL | 2 weeks | 🔴 #1 | Dev | Week 1-2 |
| **Rebalance mana system** | HIGH | 1-2 days | 🔴 #2 | Design | Day 1 |
| **Implement weapon effects** | MEDIUM | 1-2 days | 🟠 #3 | Dev | Day 2-3 |
| **VFX polish (all heroes)** | MEDIUM | 1 week | 🟠 #4 | VFX | Week 2-3 |
| **World building/lore** | MEDIUM | 2 weeks | 🟠 #5 | Design | Week 3-4 |
| **Map enhancements** | LOW | 3-5 days | 🟡 #6 | Design | Week 4 |
| **Final balance pass** | HIGH | 1 week | 🟠 #7 | Design/QA | Week 4-5 |

---

## 📋 DEFINITION OF "COMPLETE"

### Characters ✅ COMPLETE
- [x] 15 unique heroes defined
- [x] Stats properly distributed across roles
- [x] Lore compelling (to be expanded)
- [x] Weapon assignments role-appropriate
- [x] Synergies and counters identified

### Abilities ✅ COMPLETE (When All 15 Implemented)
- [x] 60 unique abilities (4 per hero)
- [x] Each ability has specific mechanics (not generic)
- [x] Mana costs create resource pressure
- [x] Cooldowns balanced per role
- [x] VFX makes abilities feel powerful
- [x] Status effects apply correctly

### Weapons ✅ COMPLETE (When Effects Implemented)
- [x] 30 weapons (2 per hero)
- [x] Element system creates rock-paper-scissors
- [x] Damage scaling with hero stats
- [x] All special effects implemented
- [x] Projectiles/melee/hitscan all working
- [x] Weapon-ability integration seamless

### Maps ✅ COMPLETE (When Enhancements Done)
- [x] 3 arenas for 3 game modes
- [x] Balanced spawning for both teams
- [x] Environmental interaction possible
- [x] Strategic chokepoints and openings
- [x] Multiple hazard types for dynamic play

### Lore ✅ COMPLETE (When World Built)
- [x] Each hero has compelling backstory
- [x] World context clear and engaging
- [x] Faction system creates allegiances
- [x] Hero interconnections meaningful
- [x] Synergies/counters have narrative basis

### Balance ✅ COMPLETE (When Tuned)
- [x] No hero dominates (similar win rates)
- [x] Resource management matters (mana)
- [x] Team compositions have strategic variety
- [x] Matchup skill ceiling varies (Rock-Paper-Scissors)
- [x] Cooldowns feel satisfying

---

## 🚀 SUCCESS CRITERIA

### Immediate (Next 2 Weeks):
- [ ] All 15 heroes have unique ability implementations
- [ ] Mana system feels resource-constrained (not unlimited)
- [ ] VFX makes every ability feel impactful
- [ ] Game is fully playable with all heroes balanced

### Short Term (4 Weeks):
- [ ] Lore is compelling and interconnected
- [ ] Maps have 2-3 hazard types each
- [ ] Weapon effects all implemented
- [ ] No hero feels overpowered
- [ ] No hero feels useless

### Quality Gate:
Before moving to Phase 2 (Sound/AI/Cosmetics), core systems must meet:
- ✅ All heroes playable and balanced
- ✅ Abilities feel unique and satisfying
- ✅ Weapons create tactical choices
- ✅ Lore creates player investment
- ✅ Maps support diverse strategies

---

## 📝 WHAT WE'RE **NOT** DOING (Yet)

**Out of Scope Until Core Complete:**
- ❌ Sound design / music
- ❌ AI opponents
- ❌ Cosmetics / skins
- ❌ Battle pass / progression
- ❌ Networking / multiplayer
- ❌ Ranked ladder
- ❌ Social features

**These will be tackled in Phase 2-4 after core systems are locked in.**

---

## 💡 PHILOSOPHY

**"Perfect core > Incomplete everything"**

We're building:
- ✅ A fully playable, balanced 1v1 combat experience
- ✅ 15 heroes where each feels like the most fun
- ✅ Weapons that create tactical depth
- ✅ Maps that reward mastery
- ✅ Lore that creates emotional investment

We're **NOT** building:
- ❌ The most features (we're building the best features)
- ❌ Cosmetics before gameplay works
- ❌ AI before 1v1 balance is solid
- ❌ Multiplayer before single-player is perfect

---

## 📌 MEASUREMENT

**Check every 3 days:**
1. How many heroes are fully playable? (target: +2-3 per 3 days)
2. Does mana system feel meaningful? (binary: yes/no)
3. Are weapon effects implemented? (target: +5 per 3 days)
4. Is lore coherent? (test with new player)
5. Are maps interesting? (measure player engagement time)

**Red flags that indicate scope creep:**
- Working on cosmetics before all heroes are playable
- Working on sound before abilities feel good
- Working on multiplayer before 1v1 balance is solid
- Adding new heroes before existing 15 are complete

---

## 🎬 RECOMMENDED ACTION

**This Week:**
1. Implement abilities for 4 heroes (Aldrin, Kess, Vos, Talen)
2. Rebalance mana system (make costs meaningful)
3. Implement weapon effects (12 weapons)

**Result:** 27% → 53% hero implementation complete, more playable heroes, better resource management

Would you like to proceed with this focused scope? This keeps us 100% focused on the core gameplay experience before moving to secondary systems.
