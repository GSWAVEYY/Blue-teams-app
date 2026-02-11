/**
 * NEXUS - Main PvP Game Loop
 * Core game engine for mobile MOBA team deathmatch
 */

let game = null;

class PvPGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Setup canvas
        this.setupCanvas();

        // Game components
        this.matchEngine = null;
        this.controls = new MobileControls(canvas);
        this.stats = new MatchStats();

        // Local player
        this.playerId = gameState.playerId;
        this.playerHero = null;

        // Game state
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 60;

        // Start game loop
        this.startGameLoop();
    }

    /**
     * Setup canvas for mobile landscape
     */
    setupCanvas() {
        // Set canvas to fill window
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Update controls button positions
        this.controls.updateButtonPositions(this.canvas.width, this.canvas.height);

        // Handle resize
        window.addEventListener("resize", () => this.handleResize());
    }

    /**
     * Handle window resize
     */
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.controls.updateButtonPositions(this.canvas.width, this.canvas.height);
    }

    /**
     * Initialize match
     */
    initializeMatch() {
        // Create hero instances
        const blueHeroes = gameState.teams.blue.map(p => p.hero);
        const redHeroes = gameState.teams.red.map(p => p.hero);

        // Create match engine
        this.matchEngine = new MatchEngine(gameState.gameMode, gameState.teamSize);
        this.matchEngine.initializeTeams(blueHeroes, redHeroes);

        // Find player hero
        const playerIndex = gameState.teams[gameState.playerTeam].findIndex(p => p.id === gameState.playerId);
        if (gameState.playerTeam === "blue") {
            this.playerHero = this.matchEngine.blueTeam.heroes[playerIndex];
        } else {
            this.playerHero = this.matchEngine.redTeam.heroes[playerIndex];
        }

        console.log(`Game initialized. Player: ${this.playerHero.name} on ${gameState.playerTeam} team`);
    }

    /**
     * Main game loop
     */
    startGameLoop() {
        const loop = (timestamp) => {
            if (!this.isRunning) return;

            const deltaTime = (timestamp - this.lastFrameTime) / 1000; // Convert to seconds
            this.lastFrameTime = timestamp;

            // Update
            this.update(deltaTime);

            // Draw
            this.draw();

            // Update HUD
            uiManager.updateGameHUD(this);
            uiManager.updateAbilityCooldowns(this);

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        if (!this.matchEngine) return;

        // Update match
        gameState.updateMatchTime(deltaTime * 1000);
        this.matchEngine.update(deltaTime);

        // Update player hero based on input
        if (this.playerHero && this.playerHero.alive) {
            this.updatePlayerHero(deltaTime);
        }

        // Check for match end
        if (this.matchEngine.state === "finished") {
            this.endMatch();
        }
    }

    /**
     * Update player-controlled hero
     */
    updatePlayerHero(deltaTime) {
        const hero = this.playerHero;
        const moveSpeed = hero.speed * 100; // pixels per second

        // Get input
        const movement = this.controls.getMovement();

        // Apply movement
        hero.vx = movement.x * moveSpeed * deltaTime;
        hero.vy = movement.y * moveSpeed * deltaTime;

        // Handle ability inputs
        if (this.controls.getAbilityInput("q")) {
            hero.useAbility("q", this.canvas.width / 2, this.canvas.height / 2);
            this.controls.abilityButtons.q.pressed = false;
        }

        if (this.controls.getAbilityInput("e")) {
            hero.useAbility("e", this.canvas.width / 2, this.canvas.height / 2);
            this.controls.abilityButtons.e.pressed = false;
        }

        if (this.controls.getAbilityInput("r")) {
            hero.useAbility("r", this.canvas.width / 2, this.canvas.height / 2);
            this.controls.abilityButtons.r.pressed = false;
        }
    }

    /**
     * Draw game state
     */
    draw() {
        // Clear canvas
        this.ctx.fillStyle = "#0a0e27";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.matchEngine) return;

        // Save context
        this.ctx.save();

        // Draw match (arena, heroes, etc)
        this.matchEngine.draw(this.ctx);

        // Draw controls
        this.controls.draw(this.ctx);

        this.ctx.restore();

        // Debug info (FPS)
        this.drawDebugInfo();
    }

    /**
     * Draw debug information
     */
    drawDebugInfo() {
        this.ctx.fillStyle = "#00ff88";
        this.ctx.font = "12px Arial";

        if (this.playerHero) {
            const debugText = [
                `Hero: ${this.playerHero.name}`,
                `Health: ${Math.ceil(this.playerHero.health)}/${this.playerHero.maxHealth}`,
                `Level: ${this.playerHero.level}`,
                `Kills: ${this.playerHero.kills}`,
                `X: ${Math.floor(this.playerHero.x)} Y: ${Math.floor(this.playerHero.y)}`
            ];

            debugText.forEach((text, i) => {
                this.ctx.fillText(text, 10, 20 + i * 15);
            });
        }

        // Match stats
        const stats = this.matchEngine.getStats();
        this.ctx.fillStyle = "#00d4ff";
        this.ctx.fillText(
            `Blue: ${stats.blueTeam.alive}/${stats.blueTeam.total} (${stats.blueTeam.score}) | Red: ${stats.redTeam.alive}/${stats.redTeam.total} (${stats.redTeam.score})`,
            10, this.canvas.height - 10
        );
    }

    /**
     * End match
     */
    endMatch() {
        this.isRunning = false;
        const winner = this.matchEngine.roundWinner;
        uiManager.showGameOver(winner);
    }
}

/**
 * Initialize game when hero selection is complete
 */
function initializeGame() {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Canvas not found!");
        return;
    }

    // Create game instance
    game = new PvPGame(canvas);
    game.initializeMatch();

    console.log("Game initialized and ready!");
}

/**
 * Global game functions for UI
 */
window.initializeGame = initializeGame;
window.showMainMenu = showMainMenu;
window.showGameModes = showGameModes;
window.showHeroGallery = showHeroGallery;
window.startGame = startGame;
window.confirmHeroSelection = confirmHeroSelection;
window.toggleReady = toggleReady;
window.cancelMatch = cancelMatch;
window.backToMainMenu = backToMainMenu;

/**
 * Initialize UI on page load
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("NEXUS - Competitive Arena");
    console.log("Game initialized, showing main menu...");
    uiManager.showScreen("main-menu");
});
