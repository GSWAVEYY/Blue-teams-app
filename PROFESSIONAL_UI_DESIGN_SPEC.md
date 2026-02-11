# NEXUS Professional UI Design Specification
## Landing Page & Team Lobby - Industry Best Practices Implementation

---

## 📋 Overview

This document details the professional UI/UX design for NEXUS landing page and team lobby screens, based on industry best practices from five leading competitive games: **League of Legends, Valorant, Overwatch 2, Dota 2, and Counter-Strike 2**.

---

## 🎯 Design Principles

### 1. Visual Hierarchy (3-Tier System)

**Tier 1 - Critical Information (Largest, Brightest)**
- Team rosters and hero portraits
- Player names and hero selections
- Ready/status indicators
- Match type and map

**Tier 2 - Important Information (Medium)**
- Role icons and difficulty badges
- Synergy percentages
- Player level indicators
- Voice chat status

**Tier 3 - Supporting Information (Smaller)**
- Match timers
- Team composition details
- Detailed stats (accessible via expansion)
- Communication buttons

### 2. Information Architecture

**Landing Page Layout:**
```
┌─────────────────────────────────────────────────┐
│  Header: Logo, User Profile, Settings           │ (80px)
├──────────────────┬──────────────────────────────┤
│  LEFT SIDEBAR    │  CENTER MAIN AREA            │
│  (20% width)     │  (80% width)                 │
│                  │                              │
│ • News & Updates │ • Featured Play CTA          │
│ • Match History  │ • Game Mode Selection Grid   │
│ • Main Heroes    │ • Season Progress Bar        │
│                  │                              │
└──────────────────┴──────────────────────────────┘
```

**Lobby Layout (Side-by-Side Teams):**
```
┌─────────────────────────────────────────────────┐
│  Top Bar: Match Info | Synergy Badge | Ready Btn│ (60px)
├────────────────────┬────────────────────────────┤
│  BLUE TEAM         │  RED TEAM                  │
│  SYNERGY: 78%      │  SYNERGY: 82%              │
│  ┌──────────────┐  │  ┌──────────────┐          │
│  │ 🗡️ KRAEL     │  │  │ ⚒️ THAXUS    │          │
│  │ LV12 ✓READY  │  │  │ LV11 ⏱️LOAD  │          │
│  └──────────────┘  │  └──────────────┘          │
│  ┌──────────────┐  │  ┌──────────────┐          │
│  │ 🛡️ PETRA     │  │  │ 💀 RAZE      │          │
│  │ LV10 ✓READY  │  │  │ LV9 ✓READY   │          │
│  └──────────────┘  │  └──────────────┘          │
│  ┌──────────────┐  │  ┌──────────────┐          │
│  │ 🏹 LYRIC     │  │  │ 💨 ZEPHYR    │          │
│  │ LV12 ✓READY  │  │  │ LV11 ✓READY  │          │
│  └──────────────┘  │  └──────────────┘          │
├────────────────────┴────────────────────────────┤
│  Bottom Bar: Quick Messages | Voice Chat        │ (60px)
└────────────────────────────────────────────────┘
```

---

## 🎨 Color System

### Team Colors

| Element | Blue Team | Red Team |
|---------|-----------|----------|
| Primary Background | `rgba(0, 212, 255, 0.08)` | `rgba(255, 107, 107, 0.08)` |
| Accent Border | `#00d4ff` | `#ff6b6b` |
| Glow Effect | `rgba(0, 212, 255, 0.3-0.5)` | `rgba(255, 107, 107, 0.3-0.5)` |
| Text Primary | `#00d4ff` | `#ff6b6b` |

### Role Color Coding

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Warrior** | Gold/Bronze | `#D4A574` | Tank role icon & border |
| **Ranger** | Silver | `#C0C0C0` | Precision DPS icon & border |
| **Mage** | Red | `#FF6B6B` | Spell DPS icon & border |
| **Guardian** | Teal | `#00B4A0` | Support icon & border |
| **Rogue** | Purple | `#3A0CA3` | Assassin icon & border |

### Status Colors

| Status | Color | Hex | Icon |
|--------|-------|-----|------|
| **Ready** | Green | `#4caf50` | ✓ |
| **Loading** | Amber | `#FFD700` | ⏱️ |
| **Disconnected** | Red | `#8B0000` | ❌ |
| **Locked** | Gold | `#FFD700` | 🔒 |
| **Neutral** | Gray | `#808080` | ○ |

### UI Element Colors

| Element | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| **Primary Action** | `#00d4ff` | `#00ff88` | Glow effect |
| **Secondary** | `#9d4edd` | `#00d4ff` | Subtle borders |
| **Warning** | `#ffd700` | `#ff9800` | High visibility |
| **Error** | `#ff6b6b` | `#f44336` | Bold borders |
| **Success** | `#4caf50` | `#00ff88` | Green accents |

---

## 🎮 Hero Card Design

### Card Layout (4:3 Aspect Ratio)

```
┌─────────────────────────────────────┐
│ 🗡️[✓]      Portrait (256x192)    [LV12]│
│                                     │
│         [High-Res Hero Art]         │
│           (Cyberpunk Theme)         │
│                                     │
│ PLAYER_NAME                         │
│ Krael — WARRIOR                     │
│ ★★★★☆ (4.2/5 Synergy)              │
│ 🟢 READY                            │
└─────────────────────────────────────┘
```

### Card Information Layers

**Layer 1: Hero Portrait**
- 256×192 (or 1:1 square) high-quality artwork
- Role-specific background gradient
- Visible at small sizes (readable iconography)

**Layer 2: Role Icon (Top-Left)**
- 24-32px circular badge
- Role emoji (⚔️ 🏹 🔥 🛡️ 💀)
- Role-specific color from palette
- High contrast with portrait

**Layer 3: Connection Status (Top-Right)**
- Green checkmark: Connected
- Yellow clock: Loading
- Red X: Disconnected
- Animated pulse if unstable

**Layer 4: Hero Information (Below Portrait)**
- Player identifier: "Player 1"
- Hero name: "Krael" (bold, large)
- Role + difficulty: "WARRIOR • LV12"
- Color-coded to role

**Layer 5: Ready State (Bottom)**
- Status badge: "✓ READY" (green) or "⏱️ LOADING" (yellow)
- Animated pulse on ready state
- Clear visual feedback

**Layer 6: Synergy Indicator (Optional)**
- Green badge if compatible: "✓ 2 Synergies"
- Orange badge if neutral: "~ Neutral"
- Red badge if weak: "⚠ Countered"

---

## 📊 Synergy & Team Balance Display

### Quick Synergy Badge
```
┌──────────────────────┐
│ ✓ Synergy: 78%       │  ← Always visible
└──────────────────────┘
```

**Color Coding:**
- **67-100%**: Green `#4caf50` - Excellent synergy
- **34-66%**: Orange `#ff9800` - Neutral composition
- **0-33%**: Red `#ff6b6b` - Weak composition

### Team Composition Analysis
```
ROLE DISTRIBUTION:
  Warriors: 1 (Gold icons)
  Rangers:  2 (Silver icons)
  Mages:    1 (Red icons)
  Guardians: 1 (Teal icons)

SYNERGY SCORE:
  ✓ 3 pairs detected
  - Petra + Kyrax (Guardian synergy)
  - Krael + Aldrin (Warrior synergy)
  - etc.

TEAM POWER:
  ★★★★☆ (4.2/5)
```

---

## 🖥️ Landing Page Components

### Header Section (80px)
- **Left**: Logo "⚔️ NEXUS" with glow effect
- **Right**: User info (Level, Rank, W/L record) + Settings button
- **Background**: Subtle gradient with bottom border
- **Interactivity**: Settings button links to profile page

### Left Sidebar (20% width on desktop)

#### Status Card
- Last match result (Win/Loss)
- Elapsed time since last match
- Quick stats (K/D/A)

#### Main Heroes Card
- 3 most-played heroes displayed
- Hero portraits in 1:1 squares
- Win rate % displayed
- Role indicator under each

#### News Card
- Latest patch notes preview
- Seasonal events
- Featured cosmetics
- Clickable for more details

### Center Area (80% width on desktop)

#### Featured Call-to-Action
- "READY TO PLAY?" heading
- Large button spanning width
- Prominent "PLAY NOW" button
- Suggests immediate action

#### Game Modes Grid (3 columns)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ ⚔️           │  │ ⚡           │  │ 💣           │
│ TEAM         │  │ QUICK MATCH  │  │ SEARCH &     │
│ DEATHMATCH   │  │ 3v3 • 30K    │  │ DESTROY      │
│ 5v5 • 50K    │  └──────────────┘  │ 5v5 • OBJ    │
└──────────────┘                     └──────────────┘
```

**Each Mode Card:**
- Icon (large, 28px)
- Mode name (bold, uppercase)
- Quick description (small text)
- Hover effect: Color glow + scale
- Click: Navigate to mode selection

#### Season Progress Bar
- Current rank: "Plat 2 • 67 LP"
- Progress bar showing LP toward next rank
- Next rank target: "Diamond (0/100 LP)"
- Uses primary color gradient

---

## 🎮 Team Lobby Components

### Top Bar (60px)
**Left Section:**
- Match mode: "Team Deathmatch"
- Map name: "Arena 1"
- Time remaining: "4:32" (large, prominent)

**Right Section:**
- Synergy badge (green/orange/red)
- Ready button (large, gradient, glowing)
- Changes to "✓ READY" when clicked

### Team Sections (Split Layout)

#### Blue Team (Left 50%)
- Header: "🔵 BLUE TEAM"
- Quick stats: Role distribution, power rating
- Hero cards in vertical stack

#### Red Team (Right 50%)
- Header: "🔴 RED TEAM"
- Quick stats: Role distribution, power rating
- Hero cards in vertical stack

### Hero Card in Lobby

```
┌────────┬──────────────────┬────────┐
│ Portrait│  Hero Info       │ Status │
│ (60px) │  Name, Role, Lvl │ (60px) │
│ ─────  │  Krael — WARRIOR │ [LV12] │
│ 🗡️    │  Player 1        │ ✓READY │
└────────┴──────────────────┴────────┘
```

**Grid Layout (3-column):**
1. **Portrait Column** (60px square)
   - Hero artwork
   - Role icon (top-left)
   - Connection status (top-right)

2. **Info Column** (Flexible)
   - Player identifier
   - Hero name (bold, large)
   - Role + Level
   - Optional: Synergy tags

3. **Status Column** (60px)
   - Level badge (circular, centered)
   - Ready indicator (text below)
   - Voice indicator (optional)

### Bottom Communication Bar (60px)

**Left: Quick Messages**
```
[🟢 Ready] [👍 Locked] [🛡️ Tank] [⚔️ Damage] [🤝 Support]
```
- Simple icon + text buttons
- Quick press to send team message
- No keyboard input needed
- Haptic feedback on touch

**Right: Voice Chat**
- Microphone icon with status
- "Voice: ON" indicator
- Mute button for team chat
- Green = Speaking (animated)
- Gray = Muted
- Red X = Not available

---

## 📱 Mobile Optimization (Landscape)

### Screen Breakpoints
- **Desktop**: 1200px+ (2-column team layout)
- **Tablet**: 768-1199px (adapted grid)
- **Mobile**: <768px (single column, scrollable)

### Landscape Mobile Layout
- **Aspect Ratio**: 16:9 or wider
- **Team Layout**: Side-by-side (blue left, red right)
- **Hero Cards**: 4:3 aspect ratio, fit 3 per team
- **Touch Targets**: 48-56px minimum height/width
- **No Hover States**: Use active/press states instead
- **Visual Feedback**: Haptic + color change on tap

### Touch-Friendly Interactions
- Ready button: 56px height, full width
- Quick message buttons: 44px height, 16px padding
- Hero cards: Tap to expand details (modal)
- Voice icon: 44px height for comfortable tapping

---

## 🎨 Animation & Feedback

### State Transitions
- **Card Highlight**: 300ms fade-in of border glow
- **Ready Button**: Pulse animation (500ms cycle) when ready
- **Synergy Badge**: Color transition smooth (200ms)
- **Loading Spinner**: 1s rotation, smooth easing

### Hover Effects (Desktop)
- Mode cards: Scale 1.02 + glow on hover
- Hero cards: Border brighten + shadow expand
- Buttons: Color shift + glow intensify
- All transitions: 300ms cubic-bezier ease

### Press Effects (Mobile/Touch)
- Button press: 50% opacity decrease + pulse
- Haptic feedback: Light vibration on tap
- Visual feedback: Color change immediately
- Release: Return to normal state (300ms)

### Loading States
- Spinner: Smooth continuous rotation
- Progress bar: Animated fill gradient
- Pulse effect: Subtle scale animation
- Animations disabled on low-power devices

---

## ♿ Accessibility (WCAG AAA)

### Color Contrast
- Text on background: Minimum 7:1 ratio
- Icon on icon: Minimum 4.5:1 ratio
- UI controls: Minimum 3:1 ratio
- All critical info uses color + icon/text

### Text & Fonts
- Minimum font size: 12px for lobby text
- Body text: 14-16px for comfortable reading
- Headers: 16-24px for hierarchy
- Bold weights for role/status indicators
- Sans-serif fonts (Arial, Verdana) for readability

### Icon + Text Labeling
- Never icon-only for critical info
- All icons have accompanying text
- Role colors supported by icons
- Status indicators show text labels

### Touch & Interaction
- Touch targets: Minimum 48×48px
- Button spacing: 12-16px between tappable areas
- No double-tap zoom (viewport-fit=cover)
- Focus indicators: Clear, high-contrast outlines

### Reduced Motion
- Media query: `prefers-reduced-motion`
- Disable animations for users with vestibular disorders
- Reduce pulse/scale effects
- Keep essential information visible

---

## 🚀 Implementation Priority

### Phase 1 (MVP)
1. Landing page basic layout
2. Team rosters with hero portraits
3. Role icons + color coding
4. Ready/not ready toggle
5. Basic synergy percentage

### Phase 2 (Enhanced)
6. Landing page news section
7. Match history display
8. Voice chat indicators
9. Quick message buttons
10. Animated ready state

### Phase 3 (Polish)
11. Detailed synergy panel
12. Counter warnings
13. Landing page all sections
14. Ranked progression display
15. Cosmetic/skin display

### Phase 4 (Advanced)
16. Team history & stats
17. Replay system integration
18. Social features
19. Custom themes
20. A/B testing variants

---

## 📊 Design Metrics

### Layout Grid
- 4-column (mobile) or 6-column (desktop) grid system
- Base spacing unit: 8px
- Margins: 16-24px from screen edges
- Gaps between elements: 8-16px
- Card padding: 12-20px

### Typography Scale
- H1: 32px, bold
- H2: 24px, bold
- H3: 16px, bold
- Body: 14px, regular
- Caption: 12px, regular
- Fine print: 11px, regular

### Component Sizes
- Hero portrait: 256×192px (4:3) or 128×128px (1:1)
- Role icon: 24-32px diameter
- Ready button: Full width, 44px+ height
- Status badge: 40px diameter (circular)
- Card height: 100-120px (hero cards)

---

## ✅ Best Practices Summary

| Practice | Implementation | Benefit |
|----------|----------------|---------|
| Visual Hierarchy | 3-tier priority system | Clear information flow |
| Color Coding | Role + team colors | Quick visual recognition |
| Status Indicators | Icon + text + color | Accessible feedback |
| Information Density | Collapsible sections | Reduces overwhelm |
| Touch Targets | 48px minimum | Mobile accessibility |
| Contrast Ratios | 7:1 critical, 4.5:1 body | WCAG AAA compliance |
| Responsive Grid | 4-6 column system | Works all screen sizes |
| Animation | 300ms ease transitions | Professional feel |
| Quick Actions | Communication buttons | Reduces friction |
| Real-time Feedback | Synergy updates | Informs decisions |

---

## 📚 Sources & References

- League of Legends Champion Select UI (Visual Hierarchy)
- Valorant Agent Select Screen (Information Density, Role Clarity)
- Overwatch 2 Hero Select (Team Balance Display)
- Dota 2 Draft Interface (Synergy & Counter System)
- Counter-Strike 2 Lobby (Minimalist Design, Quick Communication)
- Game UI Database (Pre-Game Lobbies, Communication)
- WCAG 2.1 Guidelines (Accessibility & Color Contrast)
- Material Design System (Touch Targets, Spacing)
- Apple HIG (Typography, Motion, Accessibility)

---

## 📝 Version History

- **v1.0** (2026-02-11): Initial professional UI specification based on 5 major competitive games
- Ready for implementation in Phase 4: Landing Page & Lobby UI Integration

