# Heist Master - Stealth Strategy Game

A Hitman/Payday-style crime heist game built with vanilla JavaScript and HTML5 Canvas. Sneak through a facility, avoid detection, and complete objectives without being caught.

## Game Overview

You are a master thief infiltrating a high-security facility. Your mission is to:
- **Avoid detection** by guards with patrol patterns and vision cones
- **Complete objectives** like accessing servers or grabbing valuable items
- **Use stealth** - crouching and hiding in shadows to stay undetected
- **Escape** the facility with a low heat level (alertness)

## Controls

- **WASD** - Move around the facility
- **SHIFT** - Crouch (move slower but less visible)
- **SPACE** - Hide in nearby hiding spots (cabinet, shadows, etc.)
- **E** - Interact with objectives

## Game Mechanics

### Stealth System
- **Visibility** - How visible you are to guards (affected by movement and crouching)
- **Heat Level** - Guard alertness. If it reaches 100%, you're caught and fail the mission
- **Hiding** - Use hiding spots (green dashed areas) to become invisible
- **Noise Level** - Guards can hear you moving; crouch to reduce noise

### Guard AI
- **Patrol** - Guards walk set patrol routes when calm
- **Alert** - If suspicious, guards will search the area
- **Hunt** - If they see you, they chase you down

Guards have vision cones shown in light red. Stay out of sight and maintain low visibility.

### Objectives
- Red squares are your mission targets
- Get close (30 pixels) and press **E** to complete them
- Complete all objectives and escape with heat level below 50% to win

## Winning & Losing

**Win:** Complete all objectives AND maintain heat level below 50%
**Lose:** Heat level reaches 100% (guards catch you)

## File Structure

- `index.html` - Main game page
- `game.js` - Main game loop and controller
- `level.js` - Level/map system with walls and objectives
- `player.js` - Player character and controls
- `guard.js` - Guard AI and behavior
- `styles.css` - Game styling
- `package.json` - Project metadata

## Running the Game

Open `index.html` in a web browser to play. For local development with a server:

```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

## Future Features

- [ ] Multiple difficulty levels
- [ ] Different guard types (stationary, aggressive, etc.)
- [ ] Equipment system (lockpicks, disguises, etc.)
- [ ] Dynamic objective types
- [ ] Multiple levels/missions
- [ ] Sound effects and music
- [ ] Leaderboard/score system
- [ ] Advanced guard AI (memory, communication)
- [ ] Environmental hazards (alarms, cameras)
- [ ] Item pickups (tools, keys, etc.)

## Development Notes

The game uses:
- **Vanilla JavaScript** - No external libraries
- **HTML5 Canvas** - For rendering
- **Class-based architecture** - Modular, easy to extend

Each class (Game, Level, Player, Guard) is self-contained and can be easily modified or extended.
