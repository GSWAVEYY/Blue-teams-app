# NEXUS - Competitive Mobile PvP MOBA
**15-Hero Fantasy Battle Arena | Cyberpunk Aesthetic | 3v3 & 5v5 Modes**

A competitive mobile-first PvP MOBA with tactical team combat, 15 unique fantasy heroes, real-time ability system, and multiple competitive game modes.

---

## 🎮 Game Overview

**NEXUS** is a fast-paced team-based PvP arena game where:
- **Compete in 3v3 or 5v5** team deathmatch, objective-based combat
- **Choose from 15 unique heroes** across 5 roles (Warrior, Ranger, Mage, Guardian, Rogue)
- **Master abilities** - Each hero has Passive + Q + E + R (Ultimate) abilities
- **Win through tactics** - Teamwork, positioning, and ability combos lead to victory
- **Play on mobile or desktop** - Optimized for landscape mobile with keyboard/mouse support

---

## 🎯 Game Modes

### Team Deathmatch (TDM)
- **3v3**: First team to 30 kills wins (or time limit)
- **5v5**: First team to 50 kills wins (or time limit)
- Pure combat focused - eliminate opponents to win

### Search & Destroy (S&D)
- **5v5 Bomb Plant/Defuse**
- One team plants bomb at site, other team defuses
- 15-minute round-based gameplay
- Strategic objective control

### King of the Hill (KotH)
- **3v3 Control Point**
- Capture and hold central zone to accumulate points
- First team to point threshold wins
- Dynamic objective gameplay

---

## 🦸 Hero System

### 15 Unique Heroes (5 per role)

#### **Warriors** (Tank/Melee)
- **Thaxus** - Bloodlust Berserker (High damage, low defense)
- **Aldrin** - Bastion Warden (Defensive tank, crowd control)
- **Grael** - Flame Guardian (Fire tanking, support)

#### **Rangers** (Precision/Ranged)
- **Kess** - Phantom Assassin (Burst damage, mobility)
- **Vos** - Trap Master (Area denial, control)
- **Lyric** - Swift Archer (Attack speed, sustained damage)

#### **Mages** (Spellcasting/Control)
- **Ember** - Flame Elementalist (AoE damage, crowd control)
- **Talen** - Cascade Mage (Stacking effects, burst)
- **Zephyr** - Wind Weaver (Movement control, utility)

#### **Guardians** (Support/Utility)
- **Petra** - Holy Healer (Team healing, protection)
- **Kora** - Empowerer (Buff support, synergy)
- **Kyrax** - Crowd Controller (CC chains, zone denial)

#### **Rogues** (Assassin/Burst)
- **Raze** - Divine Executioner (Burst damage, execute)
- **Vesper** - Drain Specialist (Lifesteal, sustain)
- **Silk** - Web Weaver (Web mobility, territory control)

### Hero Stats
Each hero has unique:
- **Health** - Base health pool
- **Armor** - Damage reduction (0.1% per point)
- **Speed** - Movement velocity
- **Damage** - Physical attack power
- **Ability Power** - Magic damage scaling
- **Cooldown Reduction** - Ability cooldown efficiency (40% hard cap)

### Ability System
Each hero has **4 abilities**:
1. **Passive** - Always active trait
2. **Q Ability** - 6-12 second cooldown
3. **E Ability** - 9-12 second cooldown
4. **R Ability (Ultimate)** - 75-100 second cooldown

**Special mechanics**:
- Mana resource system (400 base, 10/sec regen)
- Status effects (Stun, Slow, Shield, Burn, Buff, Debuff)
- Scaling with hero stats (AD, AP, Health, Armor)
- Charge system for multi-cast abilities

---

## 🗺️ Arenas

### TDM Arena
- Symmetrical layout with center obstacles
- 8 safe spawn zones (4 per team)
- Collision walls and environmental hazards
- Minimap for tactical awareness

### Search & Destroy Arena
- Asymmetrical layout with bomb sites A and B
- Team spawns separated
- Objective zones for bomb planting
- Multiple flanking routes

### King of the Hill Arena
- Central control point
- Elevated terrain with multiple routes
- Flanking opportunities
- Zone radius for point capture

**Features**:
- Real-time minimap system
- Collision detection
- Environmental hazards (damage zones)
- Objective zone visualization

---

## 📱 Controls

### Mobile (Touch)
- **Left Joystick** - Move character (drag)
- **Q Button** - Ability Q (top-left)
- **E Button** - Ability E (top-middle)
- **R Button** - Ultimate R (top-right)

### Desktop (Keyboard/Mouse)
- **WASD** - Move character
- **Q** - Ability Q
- **E** - Ability E
- **R** - Ultimate R
- **Mouse** - Look around (optional)

---

## 🎨 Art & Design

### Visual Aesthetic
- **Cyberpunk Fantasy** - Neon accents on medieval/fantasy themes
- **Bold Silhouettes** - Clear character shapes for mobile visibility
- **Color-Coded Roles** - Visual role identification (Warriors orange, Rangers silver, etc.)

### Character Design
All 15 heroes feature:
- Unique silhouettes and proportions
- Role-specific design language
- Personality-driven ability effects
- 2 cosmetic variants per hero (light/dark paths)

### Cosmetic System
- **Light Path** - Redemption, enlightenment, divine themes
- **Dark Path** - Corruption, void, sanctioned themes
- Examples:
  - Thaxus: "Enlightened" (zen warrior) vs "Bloodthirsty" (enraged)
  - Petra: "Angel" (divine wings) vs "Fallen" (dark power)
  - Raze: "Sanctioned" (divine justice) vs "Void" (annihilation)

---

## 🚀 Features

### Core Systems ✅
- 60fps Canvas rendering with delta-time updates
- Real-time match engine with scoring system
- Hero instance management with stat tracking
- Touch joystick + ability button controls (mobile-optimized)
- Respawn system with scaling timers
- Experience and leveling progression

### Combat ✅
- 15 unique hero ability implementations
- Full ability mechanic system (passives, cooldowns, mana)
- Damage calculation with stat scaling
- Status effect system (stun, slow, shield, burn, buff, debuff)
- Projectile collision and rendering
- Visual effects (particles, damage numbers, auras)

### Game Features ✅
- 3 complete game modes (TDM, S&D, KotH)
- 3 arena layouts with collision detection
- Hero selection and team configuration
- Match lobby system
- Game over screen with statistics
- Real-time HUD with ability cooldowns

---

## 🛠️ Technical Stack

- **Language**: Vanilla JavaScript (no frameworks)
- **Rendering**: HTML5 Canvas (60fps)
- **Architecture**: Class-based (modular, extensible)
- **Dependencies**: Zero external libraries
- **Design**: CSS Grid for responsive UI
- **Mobile**: Landscape orientation, touch-optimized, 48px+ touch targets

---

## 📂 File Structure

### Core Engine
- `pvp-game.js` - Main game loop (60fps), input handling
- `pvp-game-state.js` - Centralized game state, match config
- `pvp-controls.js` - Touch joystick + button system

### Gameplay
- `pvp-match-engine.js` - Match logic, scoring, respawns
- `pvp-hero-instance.js` - Hero instances, combat, abilities
- `pvp-arena.js` - Map layouts, collision, objectives
- `pvp-ability-mechanics.js` - Ability system and mechanics

### Systems
- `hero-system.js` - 15 heroes, stats, weapons, lore
- `pvp-element-system.js` - Element matchups, damage types
- `pvp-weapon-system.js` - 30 weapons, damage calculation
- `pvp-vfx-system.js` - Visual effects, particles, projectiles
- `pvp-personality-system.js` - Voice lines, personality, matchups

### UI & Display
- `pvp-ui-manager.js` - Screen management, HUD, game feeds
- `pvp-hero-info-ui.js` - Hero cards, synergies, learning paths
- `index-pvp.html` - Main game page structure
- `styles-pvp.css` - Cyberpunk theme, responsive design
- `hero-guide.html` - Interactive learning hub

### Documentation
- `CHARACTER_DESIGN_SPEC.md` - Hero design framework
- `CHARACTER_VISUAL_DESIGN_GUIDE.md` - Visual specifications
- `CONCEPT_ART_BRIEFS_TOP_5_HEROES.md` - Artist briefs
- `CHARACTER_NARRATIVE_FRAMEWORK.md` - Lore and relationships

---

## 🎮 How to Play

### Launch Game
1. Open `index-pvp.html` in a modern web browser
2. Desktop: Use WASD + Q/E/R keys
3. Mobile: Use left joystick + right ability buttons

### Game Flow
1. **Main Menu** - Select "Play" to start
2. **Game Mode** - Choose TDM/S&D/KotH and 3v3/5v5
3. **Hero Selection** - Pick your hero, view abilities
4. **Team Lobby** - Confirm team composition
5. **Match Loading** - Arena initializes, heroes spawn
6. **Gameplay** - Combat with HUD showing health, cooldowns, score
7. **Game Over** - View match statistics and winner

### Win Conditions
- **TDM**: First team to kill threshold (30 kills for 3v3, 50 for 5v5)
- **S&D**: Plant bomb or defend bomb site for 15 minutes
- **KotH**: Control center point to accumulate points

---

## 📊 Project Statistics

- **18,983 Lines of Code** across 31 files
- **15 Unique Heroes** with complete ability systems
- **30 Weapons** with element-based matchups
- **3 Game Modes** with unique mechanics
- **3 Arena Layouts** with collision and objectives
- **100+ Ability Implementations** (Q, E, R per hero)
- **50+ Voice Lines** for personality
- **7-Tier Architecture** (foundation → advanced systems)

---

## 🔄 Development Phases

### Phase 1-4: Foundation ✅
- Mobile PvP game engine (v4.1)
- Arena and map system (v4.2)
- Hero and ability system (v4.3)

### Phase 5: Systems ✅
- Complete hero ability implementations (v5.1)
- Visual effects system (v5.2)
- Comprehensive weapon system (v5.3)
- Personality and learning system (v5.5)

### Phase 6: Production Quality (In Progress)
- AI art generation for hero concepts
- Codebase audit and optimization
- Scalability analysis and infrastructure planning

### Phase 7-12: Advanced Features (Planned)
- Backend infrastructure (database, auth, multiplayer)
- FOMO cosmetics and battle pass
- Story events and seasonal content
- Creator affiliate program
- Esports integration

---

## 📈 Scalability & Roadmap

### Current Capacity
- Single-player/local testing mode
- 1-50 concurrent players (single server)
- No networked multiplayer yet

### Target Capacity (Phases 7-12)
- 10,000+ concurrent players (scalable infrastructure)
- Ranked competitive system
- Global matchmaking
- Esports tournaments

### Planned Infrastructure
- PostgreSQL database
- Node.js + Express backend
- Redis caching layer
- WebSocket multiplayer
- Kubernetes orchestration
- Anti-cheat system

---

## 💡 Strategic Differentiators

1. **Narrative-Driven Design** - Story tied to cosmetics and seasonal events
2. **Mobile-First Architecture** - Optimized for touch, no compromises
3. **Unique Hero Roster** - Fantasy themes not tied to single IP
4. **Learning-Focused** - Hero guides, difficulty tiers, synergy system
5. **Community-Controlled Story** - Pro tournament outcomes shape narrative

---

## 🎯 Revenue Model (Planned)

- **Battle Pass** - $60K/month potential
- **FOMO Cosmetics** - $50K/month potential
- **Creator Program** - $30K/month potential
- **Esports Integration** - $40K/month potential
- **Live Events** - $20K/month potential
- **Prestige Items** - $50K/month potential
- **Total Potential** - $250K/month at scale

---

## 📚 Learning Resources

### For Players
- **hero-guide.html** - Interactive learning hub
- **Hero profiles** - Difficulty ratings, synergies, counters
- **Learning paths** - Beginner → Intermediate → Advanced

### For Developers
- `CHARACTER_DESIGN_SPEC.md` - Design philosophy
- `CHARACTER_VISUAL_DESIGN_GUIDE.md` - Visual specifications
- `CONCEPT_ART_BRIEFS_TOP_5_HEROES.md` - Artist references
- `CODEBASE_AUDIT_AND_SCALABILITY_ANALYSIS.md` - Technical analysis
- `STRATEGIC_GAME_ANALYSIS_AND_DIFFERENTIATION.md` - Market analysis

---

## 🚀 Running the Game

### Local Development
```bash
# Option 1: Open directly in browser
open index-pvp.html
# or
firefox index-pvp.html

# Option 2: Local server (for better compatibility)
python -m http.server 8000
# Then visit http://localhost:8000/index-pvp.html
```

### Desktop Testing
- Use WASD to move
- Press Q/E/R for abilities
- Click buttons for UI navigation

### Mobile Testing
- Rotate browser to landscape
- Use left joystick to move
- Tap Q/E/R buttons for abilities

---

## 🎨 AI Art Generation

All hero concept art generated using:
- **Stable Diffusion** with DreamShaper 7.0 model
- **Fooocus** or **AUTOMATIC1111** WebUI (local, unrestricted)
- **Cyberpunk fantasy aesthetic** matching game design

See `BATCH_HERO_GENERATION_WORKFLOW.md` for:
- Copy-paste ready prompts for all 10 images
- Batch generation setup (5 minutes for all)
- Quality checklist and troubleshooting

---

## 📝 Credits & References

- **Game Design**: MOBA-style competitive gameplay
- **Visual Aesthetic**: Cyberpunk fantasy
- **Architecture**: Modular class-based systems
- **Inspiration**: Valorant, League of Legends, Apex Legends

---

## 📞 Support

For issues or questions:
1. Check `hero-guide.html` for gameplay help
2. Review relevant design documents in project root
3. Examine code comments in JavaScript files
4. Test with `index-pvp.html` in browser

---

## 📄 License

This project is developed as an independent game title.

---

**Latest Update**: Phase 6 - Production Quality (AI Art & Analysis)
**Branch**: `claude/continue-game-development-6RMMI`
**Latest Commit**: Batch hero generation workflow ready
