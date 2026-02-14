/**
 * PVP Game State Manager
 * Centralized state management for the game
 */

class GameState {
    constructor() {
        this.screen = "mainMenu"; // mainMenu, gameMode, heroSelect, teamLobby, game, gameOver
        this.gameMode = null; // tdm, search, koth
        this.teamSize = 3; // 3 or 5
        this.targetKills = null; // Mode-specific
        this.playerId = null;
        this.selectedHero = null;
        this.playerTeam = "blue"; // blue or red
        this.teams = {
            blue: [],
            red: []
        };
        this.matchState = {
            started: false,
            time: 0,
            maxTime: 0, // Mode-specific
            blueScore: 0,
            redScore: 0,
            blueEliminations: 0,
            redEliminations: 0
        };
        this.gameSettings = {
            masterVolume: 80,
            touchSensitivity: 5,
            hapticFeedback: true,
            controlLayout: "default" // default or southpaw
        };
    }

    /**
     * Initialize a game session
     */
    initGame(gameMode, teamSize) {
        this.gameMode = gameMode;
        this.teamSize = teamSize;

        // Set mode-specific parameters
        switch (gameMode) {
            case "tdm":
                this.targetKills = teamSize === 5 ? 50 : 30;
                this.matchState.maxTime = 600; // 10 minutes
                break;
            case "search":
                this.targetKills = 6; // First to 6 rounds won
                this.matchState.maxTime = 900; // 15 minutes
                break;
            case "koth":
                this.targetKills = 100; // Control points
                this.matchState.maxTime = 600; // 10 minutes
                break;
        }

        this.screen = "heroSelect";
    }

    /**
     * Confirm hero selection
     */
    confirmHero(heroName, team) {
        this.selectedHero = heroName;
        this.playerTeam = team;
        this.playerId = `${team}-${this.teams[team].length}`;

        // Add to team roster
        this.teams[team].push({
            id: this.playerId,
            hero: heroName,
            ready: false,
            alive: true
        });

        this.screen = "teamLobby";
    }

    /**
     * Toggle player ready status
     */
    toggleReady() {
        const playerIndex = this.teams[this.playerTeam].findIndex(p => p.id === this.playerId);
        if (playerIndex >= 0) {
            this.teams[this.playerTeam][playerIndex].ready = !this.teams[this.playerTeam][playerIndex].ready;
        }
    }

    /**
     * Check if all players are ready
     */
    allPlayersReady() {
        const allBlueReady = this.teams.blue.every(p => p.ready);
        const allRedReady = this.teams.red.every(p => p.ready);
        return this.teams.blue.length > 0 && this.teams.red.length > 0 && allBlueReady && allRedReady;
    }

    /**
     * Start the match
     */
    startMatch() {
        this.matchState.started = true;
        this.matchState.time = 0;
        this.screen = "game";
    }

    /**
     * Update match time
     */
    updateMatchTime(deltaTime) {
        if (this.matchState.started) {
            this.matchState.time += deltaTime;
        }
    }

    /**
     * Get formatted time
     */
    getFormattedTime() {
        const remaining = Math.max(0, this.matchState.maxTime - this.matchState.time);
        const minutes = Math.floor(remaining / 60);
        const seconds = Math.floor(remaining % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    /**
     * Record an elimination
     */
    recordElimination(killerTeam, victimTeam) {
        if (killerTeam === "blue") {
            this.matchState.blueEliminations++;
            this.matchState.blueScore++;
        } else {
            this.matchState.redEliminations++;
            this.matchState.redScore++;
        }
    }

    /**
     * Check win condition
     */
    checkWinCondition() {
        const blueWins = this.matchState.blueScore >= this.targetKills;
        const redWins = this.matchState.redScore >= this.targetKills;
        const timeUp = this.matchState.time >= this.matchState.maxTime;

        if (blueWins) return "blue";
        if (redWins) return "red";
        if (timeUp) {
            // Higher score wins, or tie
            if (this.matchState.blueScore > this.matchState.redScore) return "blue";
            if (this.matchState.redScore > this.matchState.blueScore) return "red";
            return "tie";
        }
        return null;
    }

    /**
     * Reset to main menu
     */
    reset() {
        this.screen = "mainMenu";
        this.gameMode = null;
        this.teamSize = 3;
        this.playerId = null;
        this.selectedHero = null;
        this.playerTeam = "blue";
        this.teams = { blue: [], red: [] };
        this.matchState = {
            started: false,
            time: 0,
            maxTime: 0,
            blueScore: 0,
            redScore: 0,
            blueEliminations: 0,
            redEliminations: 0
        };
    }

    /**
     * Get current team roster
     */
    getTeamRoster(team) {
        return this.teams[team] || [];
    }

    /**
     * Get opponent team
     */
    getOpponentTeam() {
        return this.playerTeam === "blue" ? "red" : "blue";
    }

    /**
     * Save settings
     */
    saveSettings() {
        localStorage.setItem("gameSettings", JSON.stringify(this.gameSettings));
    }

    /**
     * Load settings
     */
    loadSettings() {
        const saved = localStorage.getItem("gameSettings");
        if (saved) {
            this.gameSettings = JSON.parse(saved);
        }
    }
}

// Global game state instance
const gameState = new GameState();
gameState.loadSettings();
