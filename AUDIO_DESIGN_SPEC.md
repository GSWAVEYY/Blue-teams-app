# NEXUS Audio Design Specification
## Music, Sound Effects, Voice Acting, and Audio System Architecture

---

## 🎵 Audio System Overview

NEXUS uses a **layered audio approach** combining:
1. **Dynamic Music System**: Context-aware background music
2. **Sound Effects**: 200+ ability, movement, and environmental sounds
3. **Voice Acting**: Hero voice lines and announcer callouts
4. **3D Audio Positioning**: Combat awareness through spatial audio
5. **Adaptive Audio Mixing**: Automatic volume balancing by category

---

## 🎼 Music System

### **Music Tracks by Game State**

#### **1. Main Menu Theme** (Looping)
- **Title**: "Nexus Awakens"
- **Duration**: 2:30 (seamlessly loops)
- **Mood**: Epic, mysterious, competitive
- **Instruments**: Synth orchestral, pulsing bass, ethereal strings
- **BPM**: 120 BPM
- **Purpose**: Sets competitive tone on landing page
- **Cues**: Fades in on startup, fades out on play click

#### **2. Hero Selection Theme** (Looping)
- **Title**: "Choose Your Champion"
- **Duration**: 1:45 (seamlessly loops)
- **Mood**: Exciting, tactical, decision-making
- **Instruments**: Upbeat synth, percussion emphasis, decision chimes
- **BPM**: 140 BPM
- **Purpose**: Builds tension during hero selection
- **Cues**: Plays at hero select screen, changes when team ready

#### **3. Team Lobby Theme** (Looping)
- **Title**: "Before the Storm"
- **Duration**: 2:00 (seamlessly loops)
- **Mood**: Intense, preparation, anticipation
- **Instruments**: Building orchestral, tense strings, war drums
- **BPM**: 130 BPM
- **Purpose**: Prepares players for match
- **Cues**: Plays while waiting, increases intensity as team readies

#### **4. Match Loading Theme** (Fade-in)
- **Title**: "Battle Commence"
- **Duration**: 1:20 (single play into match music)
- **Mood**: Epic, action-packed, adrenaline
- **Instruments**: Full orchestral, percussion, heroic brass
- **BPM**: 150 BPM
- **Purpose**: Transitions to match start
- **Cues**: Plays during loading screen, crossfades to match music

#### **5. Team Deathmatch Music** (Adaptive)
- **Title**: "Arena Clash"
- **Duration**: 3:00 (seamlessly loops, changes with intensity)
- **Base Mood**: Aggressive, fast-paced combat
- **Instruments**: Intense synth, pulsing beat, aggressive strings
- **BPM**: 160 BPM (base)
- **Intensity Levels**:
  - **Low** (Safe/neutral phase): Steady beat, exploration feel
  - **Medium** (Active combat): Percussion increases, tempo rises
  - **High** (Team fight): Full arrangement, max intensity
- **Purpose**: Sustains energy during 15-20 minute matches
- **Cues**: Responds to kill streaks, team fight initiation, score changes

#### **6. King of the Hill Music** (Positional)
- **Title**: "Control Point"
- **Duration**: 3:30 (adapts to control status)
- **Base Mood**: Strategic, control-focused
- **Instruments**: Synth with tactical percussion
- **BPM**: 135 BPM
- **Control Variations**:
  - **Team Controls Point**: Triumphant, ascending notes
  - **Enemy Controls Point**: Tense, descending notes
  - **Contested**: Chaotic, mixed instruments
- **Purpose**: Reinforces objective focus
- **Cues**: Changes based on control ownership

#### **7. Search & Destroy Music** (Round-based)
- **Title**: "Bomb Site"
- **Duration**: 2:45 per round (restarts each round)
- **Base Mood**: Tactical, stealth, pressure
- **Instruments**: Tense synth, subtle percussion, electronic elements
- **BPM**: 120 BPM (base)
- **Round Variations**:
  - **Plant Phase**: Steady, team-focused
  - **Defuse Phase**: Urgent, quick-tempo percussion
  - **Time Running Out**: Intense, rapid escalation
- **Purpose**: Builds tension in objective-based gameplay
- **Cues**: Matches bomb plant/defuse timers

#### **8. Victory Theme** (Single play)
- **Title**: "Champions Rise"
- **Duration**: 0:45
- **Mood**: Triumphant, celebratory, heroic
- **Instruments**: Brass fanfare, orchestral swell, victory chimes
- **BPM**: 140 BPM
- **Purpose**: Celebrates match victory
- **Cues**: Plays on victory screen, overlays stat display

#### **9. Defeat Theme** (Single play)
- **Title**: "Back to the Arena"
- **Duration**: 0:40
- **Mood**: Respectful, motivational, determined
- **Instruments**: Minor key orchestral, steady percussion
- **BPM**: 110 BPM
- **Purpose**: Acknowledges loss, motivates next match
- **Cues**: Plays on defeat screen, fades as returning to menu

---

## 🔊 Sound Effects Categories

### **Category 1: Ability Sound Effects** (60 total: 4 per hero)

**Passive Ability Sound**
- **Purpose**: Subtle indicator of passive triggers
- **Example - Grael Dragon Slash Passive**: Low resonant hum when shield regenerates
- **Duration**: 0.3-0.8 seconds
- **Frequency**: Triggers on condition met

**Q Ability Sound**
- **Purpose**: Immediate feedback on ability cast
- **Example - Grael Shieldwall**: Heavy metallic CLANG with shield shimmer
- **Volume**: Medium-High (noticeable)
- **Duration**: 0.4-1.0 seconds
- **Frequency**: Every 6-12 seconds

**E Ability Sound**
- **Purpose**: Distinct from Q to differentiate abilities
- **Example - Grael Counterblow**: Sharp electrical ZAP on reflect trigger
- **Volume**: High (attention-grabbing)
- **Duration**: 0.3-0.7 seconds
- **Frequency**: Every 9-12 seconds

**R/Ultimate Ability Sound**
- **Purpose**: Epic, memorable ultimate ability indicator
- **Example - Grael Dragon Ascension**: Roaring dragon cry + orchestral swell
- **Volume**: Very High (unmistakable)
- **Duration**: 1.0-2.0 seconds
- **Frequency**: Every 75-100 seconds (rarest)

**All 15 Heroes × 4 Ability Types = 60 Ability Sounds**

---

### **Category 2: Weapon Sound Effects** (30 total)

**Hitscan Weapon** (Instant damage)
- **Sound**: Sharp projectile SNAP or laser ZZZZT
- **Example - Sword Strike**: Metal-on-metal CLANG with impact
- **Volume**: Medium
- **Pitch Variation**: Changes based on target armor
- **Cooldown**: Quick (repeats often)

**Projectile Weapon** (Travel time)
- **Sound**: Launch sound + impact sound (2 layers)
- **Launch**: Arrow WHOOSH or magic FWOOP
- **Impact**: Collision sound (wood THUNK, metal PING)
- **Volume**: Low launch, Medium impact
- **Duration**: 0.2-0.5 seconds each

**Melee Weapon** (Close range)
- **Sound**: Close combat impacts, strikes, blocks
- **Example - Axe Swing**: Heavy WHOOSH with weight behind it
- **Volume**: High (feels impactful)
- **Duration**: 0.3-0.8 seconds
- **Pitch**: Lower = heavier weapons

---

### **Category 3: Movement Sound Effects** (12 total)

**Walking/Running Sound**
- **Purpose**: Environmental feedback on movement
- **Surface Types**:
  - Metal floor: Metallic footsteps
  - Stone: Hard echoing steps
  - Sand/dirt: Softer, muffled steps
- **Volume**: Low (background)
- **Frequency**: Continuous during movement

**Dash/Sprint Sound**
- **Purpose**: Indicates burst movement
- **Sound**: Whoosh + footsteps accelerating
- **Volume**: Medium
- **Duration**: 0.3 seconds per dash
- **Cooldown**: Every 3-5 seconds

**Jump/Leap Sound**
- **Purpose**: Vertical movement feedback
- **Sound**: Ascending whoosh on launch
- **Volume**: Low-Medium
- **Duration**: 0.2 seconds

**Landing Sound**
- **Purpose**: Impact feedback
- **Sound**: Descending impact thud
- **Volume**: Medium
- **Duration**: 0.2-0.4 seconds

---

### **Category 4: Combat Feedback Sounds** (20+ total)

**Damage Taken**
- **Light Damage**: Short beep, ascending tone
- **Medium Damage**: Sharp HIT sound, medium tone
- **Heavy Damage**: Loud THUD, descending tone
- **Volume**: Medium-High (varies by damage)
- **Frequency**: Every time damage taken

**Health Critical**
- **Purpose**: Alert player to low health
- **Sound**: Pulsing warning beep (increases speed as health lowers)
- **Volume**: High
- **Frequency**: Every 1-2 seconds when below 25% health

**Shield Generated**
- **Sound**: Shimmering WHOOSH with energy tone
- **Volume**: Medium
- **Duration**: 0.4 seconds

**Shield Broken**
- **Sound**: Shattering glass CRASH
- **Volume**: High (noticeable break)
- **Duration**: 0.5 seconds

**Kill Confirmation**
- **Sound**: Victory chime + hero callout
- **Example**: "First blood!" + brass stab
- **Volume**: High
- **Duration**: 1.0 seconds total

**Death Sound**
- **Sound**: Hero-specific death cry
- **Example - Grael**: "Noooo!" + descending orchestral fade
- **Volume**: High
- **Duration**: 0.8 seconds

**Elimination Announce**
- **Sound**: Announcer voice "ELIMINATED by [hero]"
- **Volume**: High
- **Duration**: 1.0-1.5 seconds
- **Frequency**: When you kill someone

---

### **Category 5: Environmental Sounds** (15+ total)

**Ambient Background**
- **Arena Ambience**: Subtle wind, distant sounds, electronic hum
- **Volume**: Very Low (background)
- **Continuous**: Loops throughout match

**Hazard Activation**
- **Laser Trap**: High-pitched BEEP + laser charge sound
- **Explosion Zone**: Warning beep preceding damage
- **Volume**: Medium-High (alert sound)

**Objective Sounds**
- **Bomb Plant**: Beeping pattern increasing in speed
- **Bomb Defuse**: Counter-beeping pattern
- **Point Control**: Ownership change chime
- **Volume**: Medium

**Collectible/Pickup**
- **Power-up Acquired**: Satisfying DING + ascending tone
- **Volume**: High (positive feedback)
- **Duration**: 0.4 seconds

---

## 🎤 Voice Acting & Voiceover

### **Voice Categories**

#### **1. Hero Ability Voice Lines** (45 total: 3 per hero)

Each hero has 3 personality-driven ability callouts (from CHARACTER_NARRATIVE_FRAMEWORK.md):

**Grael Example:**
- **Q (Shieldwall)**: "An unbreakable wall!"
- **E (Counterblow)**: "We shall not yield!"
- **R (Dragon Ascension)**: "BURN, FOOLS!"

**Thaxus Example:**
- **Q (Whirlwind)**: "BLOOD AND THUNDER!"
- **E (Cleave)**: "Everything falls!"
- **R (Infernal Rampage)**: "YOU DARE CHALLENGE ME?!"

**All 15 Heroes × 3 Lines = 45 Voice Lines**

**Voice Direction:**
- **Warriors**: Deep, confident, honorable tone
- **Rangers**: Sharp, precise, focused tone
- **Mages**: Mystical, powerful, otherworldly tone
- **Guardians**: Warm, protective, supportive tone
- **Rogues**: Dark, predatory, menacing tone

---

#### **2. Hero Kill Callouts** (15 total: 1 per hero)

Plays when hero gets a kill:

**Grael**: "Honor demands victory!"
**Thaxus**: "ANOTHER FALLS!"
**Lyric**: "Precise strike!"
**Kess**: "One down..."
**Petra**: "I protect my allies!"
**Raze**: "You're already dead..."

---

#### **3. Hero Death Callouts** (15 total: 1 per hero)

Plays when hero dies:

**Grael**: "I will return..."
**Thaxus**: "This... isn't... over!"
**Lyric**: "My timing was off..."
**Kess**: "Slipping away..."
**Petra**: "Forgive me..."
**Raze**: "Defeated? Impossible!"

---

#### **4. Hero Respawn Callouts** (15 total: 1 per hero)

Plays when hero respawns:

**Grael**: "Back to the arena!"
**Thaxus**: "I RETURN!"
**Lyric**: "Lessons learned..."
**Kess**: "Round two..."
**Petra**: "Reborn in light!"
**Raze**: "Not finished yet..."

---

#### **5. Announcer Voice** (10+ callouts)

Game announcer (professional, neutral voice):

- **Game Start**: "NEXUS ARENA - BEGIN!"
- **Kill Streak**: "DOUBLE KILL!", "TRIPLE KILL!", "QUADRA KILL!"
- **Team Fight**: "TEAM FIGHT INCOMING!"
- **First Blood**: "FIRST BLOOD!"
- **Objective Captured**: "POINT CAPTURED!", "BOMB PLANTED!"
- **Victory/Defeat**: "VICTORY!", "DEFEAT!"
- **Final Warning**: "30 SECONDS TO VICTORY!"

**Voice Direction**: Professional sports announcer, clear enunciation, energetic

---

#### **6. In-Match Interactions** (Multiple per matchup)

Heroes comment on fighting specific enemies (optional flavor):

**Grael vs Thaxus**:
- Grael: "Your rage blinds you!"
- Thaxus: "Your honor makes you weak!"

**Kess vs Grael**:
- Kess: "Can't catch shadows!"
- Grael: "Stand and fight like a warrior!"

---

## 🎧 3D Audio Positioning

### **Spatial Audio System**

**Purpose**: Enhance combat awareness through sound direction

**Implementation**:
- **Pan**: Sounds move left/right based on source position
- **Attenuation**: Sounds get quieter with distance
- **Reverb**: Distance affects echo/reverb characteristics

**Use Cases**:
1. **Enemy Ability Casting**: Hear direction of threat
   - Enemy casts from left → Sound pans left
   - Enemy far away → Sound is quieter

2. **Team Audio**: Easier to locate ally positions
   - Ally health critically low → Sound from their position
   - Ally ability ready → Directional cue

3. **Environmental**: Hazards and objectives
   - Bomb plant location audible from distance
   - Control point sounds from zone center

**Audio Distance Falloff**:
- **0-200 pixels** (Close combat): Full volume, sharp pan
- **200-500 pixels** (Mid-range): 70% volume, moderate pan
- **500+ pixels** (Far away): 40% volume, subtle pan

---

## 🎚️ Audio Mixing & Levels

### **Default Volume Levels** (0-100%)

| Category | Default | Min | Max | Notes |
|----------|---------|-----|-----|-------|
| **Master Volume** | 80% | 0% | 100% | Overall game volume |
| **Music** | 50% | 0% | 100% | Background music |
| **Ability SFX** | 80% | 0% | 100% | Action sounds |
| **Ambient** | 40% | 0% | 100% | Environment sounds |
| **Voice** | 90% | 0% | 100% | Hero/announcer speech |
| **UI SFX** | 70% | 0% | 100% | Menu clicks, notifications |

### **Mixing Rules** (Automatic adjustments)

**Dynamic Lowering**:
- When multiple sounds play: Reduce music volume 30%
- During team fight: Lower ambient 50%
- Hero ability casting: Lower other sounds 20%

**Priority Order** (Highest to lowest):
1. Announcer voice (critical callouts)
2. Hero voice lines (ability casts)
3. Damage feedback (health alerts)
4. Ability SFX (action feedback)
5. Weapon sounds
6. Movement sounds
7. Ambient sounds
8. Music

---

## 🎵 Audio Asset Requirements

### **Total Audio Assets Needed**

| Category | Count | Total Duration | Notes |
|----------|-------|-----------------|-------|
| **Music Tracks** | 9 | ~20 minutes | Looping + singles |
| **Ability SFX** | 60 | ~45 seconds | 4 per hero |
| **Weapon SFX** | 30 | ~30 seconds | Multiple impact types |
| **Movement SFX** | 12 | ~15 seconds | Surface variations |
| **Combat SFX** | 20+ | ~30 seconds | Damage, shields, etc |
| **Environmental SFX** | 15+ | ~20 seconds | Hazards, objectives |
| **Voice Lines - Abilities** | 45 | ~90 seconds | 3 per hero (3-4 sec each) |
| **Voice Lines - Killcalls** | 15 | ~30 seconds | Kill/death/respawn |
| **Voice Lines - Announcer** | 10+ | ~20 seconds | Game callouts |
| **Total** | **217+** | **~2.5 hours** | Complete audio package |

---

## 🎯 Audio Implementation Plan

### **Phase 7A: Music System (Week 1)**
- [ ] Create 9 music tracks (or use royalty-free equivalents)
- [ ] Implement music player system
- [ ] Adaptive music for different game states
- [ ] Smooth transitions between tracks

### **Phase 7B: Sound Effects (Week 2)**
- [ ] Record/source 60 ability sounds
- [ ] Record/source 30 weapon sounds
- [ ] Create movement and combat sounds
- [ ] Environmental and objective sounds

### **Phase 7C: Voice Acting (Week 3)**
- [ ] Record 45 hero ability voice lines
- [ ] Record hero kill/death/respawn callouts
- [ ] Professional announcer voice recording
- [ ] Processing and cleanup

### **Phase 7D: Audio System (Week 4)**
- [ ] Audio engine architecture
- [ ] 3D positioning implementation
- [ ] Dynamic mixing system
- [ ] Settings and volume controls
- [ ] Integration with gameplay

---

## 🔌 Audio System Architecture

### **Core Audio Manager**

```
AudioManager
├── Music Subsystem
│   ├── Play(track, state)
│   ├── Crossfade(fromTrack, toTrack, duration)
│   ├── SetIntensity(level)
│   └── Stop()
│
├── SFX Subsystem
│   ├── PlayAbilitySound(hero, abilityKey)
│   ├── PlayWeaponSound(weaponType, impact)
│   ├── PlayCombatSound(eventType, severity)
│   └── PlayEnvironmentSound(type, position)
│
├── Voice Subsystem
│   ├── PlayVoiceLine(hero, lineType)
│   ├── PlayAnnouncerLine(eventType)
│   └── PlayInteractionLine(hero1, hero2)
│
├── 3D Audio Subsystem
│   ├── SetListenerPosition(x, y)
│   ├── SetSourcePosition(soundId, x, y)
│   ├── UpdatePan(soundId)
│   └── UpdateAttenuation(soundId)
│
└── Mixing Subsystem
    ├── SetVolume(category, level)
    ├── GetMix(activeCategories)
    ├── ApplyDynamicMixing()
    └── SaveAudioPresets()
```

### **Audio Event System**

Game events trigger audio:
```
ABILITY_CAST → PlayAbilitySound + PlayVoiceLine
ENEMY_DAMAGE → PlayDamageSound + Pan direction
KILL → PlayKillSound + VoiceLine + Announcer
RESPAWN → PlayRespawnAnimation + VoiceLine
OBJECTIVE_CHANGE → PlayObjectiveSound + Announcer
```

---

## 🎵 Music Track Specifications

### **Musical Style**
- **Genre**: Electronic Orchestral / Cyberpunk
- **Influences**: League of Legends, Valorant, Overwatch soundtracks
- **Instrumentation**: Synth, orchestral strings, percussion, electronic elements
- **Aesthetic**: Futuristic, competitive, intense, tactical

### **Technical Specifications**
- **Format**: MP3 (compressed) for web
- **Bit Rate**: 192 kbps (quality vs file size balance)
- **Sample Rate**: 44.1 kHz (standard)
- **Channels**: Stereo (2.0)
- **Loop Points**: All looping tracks seamlessly loop

### **Music Production Pipeline**
1. **Composition**: Create original tracks matching specifications
2. **Recording**: Live instruments + digital synth layering
3. **Mixing**: Balance instruments, set levels, panning
4. **Mastering**: Optimize for game playback
5. **Encoding**: Convert to MP3 format
6. **Testing**: Verify seamless looping and transitions

---

## 🎤 Voice Acting Guidelines

### **Recording Specifications**
- **Microphone**: Professional condenser mic
- **Sample Rate**: 48 kHz
- **Bit Depth**: 24-bit
- **Environment**: Treated recording studio (minimal echo)
- **Format**: WAV (lossless for editing)

### **Voice Direction by Role**

**Warriors** (Grael, Thaxus, Aldrin)
- Depth: Deep, resonant voice tone
- Speed: Measured and powerful
- Emotion: Confident, determined, honorable
- Volume: Projected, commanding

**Rangers** (Lyric, Vos, Kess)
- Depth: Mid-range, precise articulation
- Speed: Quick, sharp delivery
- Emotion: Focused, tactical, calm
- Volume: Controlled, direct

**Mages** (Ember, Talen, Zephyr)
- Depth: Variable, ethereal quality
- Speed: Varying (slow spellcasting, fast combat)
- Emotion: Mystical, powerful, otherworldly
- Volume: Dramatic, with reverb

**Guardians** (Petra, Kora, Kyrax)
- Depth: Warm, supportive tone
- Speed: Steady, reassuring delivery
- Emotion: Protective, encouraging, strong
- Volume: Clear, inspiring

**Rogues** (Raze, Vesper, Silk)
- Depth: Dark, menacing tone
- Speed: Variable (quick assassins, slow threats)
- Emotion: Predatory, confident, dangerous
- Volume: Whispered or intense

---

## 🔧 Audio Settings UI

### **Settings Screen Options**

```
AUDIO SETTINGS
─────────────────────────────────

Master Volume:        [████████░░] 80%

CATEGORIES:
Music:                [████░░░░░░] 50%
Sound Effects:        [████████░░] 80%
Voice:                [█████████░] 90%
Ambient:              [████░░░░░░] 40%
UI Sounds:            [███████░░░] 70%

ADVANCED OPTIONS:
☐ Dynamic Mixing (Auto-balance sounds)
☐ 3D Audio Positioning
☐ Voice Line Frequency
  └─ All | Main Abilities | Minimal

☐ Announcer Voice
  └─ Enabled | Only Important | Disabled

☐ Subtitle Mode
  └─ Off | Combat Only | Always On

[RESET TO DEFAULTS]
```

---

## 🎧 Audio Quality Presets

### **Quality Tiers**

**Ultra (High-End)**
- Uncompressed WAV audio
- Full 3D positioning
- All voice lines
- Announcer enabled
- ~500MB for 2-hour session

**High**
- MP3 192kbps
- Full 3D positioning
- All voice lines
- Announcer enabled
- ~150MB for 2-hour session

**Medium** (Default)
- MP3 128kbps
- Basic 3D positioning
- Main voice lines only
- Announcer limited
- ~100MB for 2-hour session

**Low (Mobile)**
- MP3 96kbps
- Mono audio
- Limited voice lines
- Announcer disabled
- ~50MB for 2-hour session

---

## 📊 Audio Development Timeline

| Phase | Duration | Deliverables | Status |
|-------|----------|--------------|--------|
| **7A: Music** | 1 week | 9 tracks, player system | Planned |
| **7B: SFX** | 1 week | 120+ sound effects | Planned |
| **7C: Voice** | 1 week | 70+ voice lines | Planned |
| **7D: Integration** | 1 week | Full audio system | Planned |
| **Testing & Polish** | 1 week | Optimization, balancing | Planned |

**Total Estimated Time**: 5 weeks for complete implementation

---

## 🎯 Audio Roadmap (Post-Launch)

### **Phase 7.1: Enhanced Audio**
- [ ] Positional 3D audio with HRTF
- [ ] Adaptive music intensity mapping
- [ ] Environmental audio reflections
- [ ] Dynamic EQ based on mix

### **Phase 7.2: Voice Acting**
- [ ] Additional hero voice lines (emotes, interactions)
- [ ] Multiple language voice packs
- [ ] Professional voice actors (current: synthetic/budget)
- [ ] Hero-specific music themes

### **Phase 7.3: Audio Content**
- [ ] Champion skins with unique voice lines
- [ ] Seasonal music themes
- [ ] Limited-time announcer voices
- [ ] Custom soundtracks

---

## ✅ Audio Quality Checklist

- [ ] Music loops seamlessly without clicks
- [ ] SFX don't distort at any volume level
- [ ] Voice lines are clear and intelligible
- [ ] 3D positioning accurate within 30°
- [ ] No audio dropouts during intensive combat
- [ ] Mixing is balanced across all categories
- [ ] Settings persist between sessions
- [ ] Mobile audio optimization tested
- [ ] All audio licensed or royalty-free
- [ ] Subtitle system accurate and timed

