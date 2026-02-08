class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.level = new Level();
        this.player = new Player(this.level, this.level.spawnPoints.player);
        this.guards = [];

        // Create guards
        for (let spawnPoint of this.level.spawnPoints.guards) {
            this.guards.push(new Guard(this.level, spawnPoint));
        }

        this.gameState = "playing"; // playing, won, lost
        this.heatLevel = 0;
        this.maxHeat = 100;
        this.detectionCooldown = 0;

        this.gameTime = 0;
        this.alarmTriggered = false;

        this.run();
    }

    update() {
        if (this.gameState !== "playing") return;

        // Update player
        this.player.update();

        // Update guards
        let maxAlert = 0;
        for (let guard of this.guards) {
            guard.update(this.player);
            maxAlert = Math.max(maxAlert, guard.getAlertLevel());
        }

        // Update heat level based on guard alert
        this.heatLevel = maxAlert;

        // Check if player is caught
        if (this.heatLevel >= 100) {
            this.gameState = "lost";
            this.displayStatus("CAUGHT! Mission failed.", "#ff4444");
        }

        // Check objectives
        let allObjectivesComplete = true;
        for (let obj of this.level.objectives) {
            if (!obj.completed) {
                allObjectivesComplete = false;
            }
        }

        if (allObjectivesComplete && this.heatLevel < 50) {
            this.gameState = "won";
            this.displayStatus("Mission complete! Escaped undetected.", "#00ff00");
        }

        // Update UI
        this.updateUI();
        this.gameTime++;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = "#0f3460";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw level
        this.level.draw(this.ctx);

        // Draw guards
        for (let guard of this.guards) {
            guard.draw(this.ctx);
        }

        // Draw player
        this.player.draw(this.ctx);

        // Draw HUD overlay
        this.drawHUD();
    }

    drawHUD() {
        const padding = 10;
        const boxHeight = 120;

        // Semi-transparent HUD background
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.ctx.fillRect(padding, padding, 250, boxHeight);

        // Draw debug info
        this.ctx.fillStyle = "#00ff88";
        this.ctx.font = "12px Arial";
        this.ctx.textAlign = "left";

        let y = padding + 15;
        this.ctx.fillText(`Player Pos: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`, padding + 10, y);
        y += 18;
        this.ctx.fillText(`Visibility: ${Math.round(this.player.getVisibility())}%`, padding + 10, y);
        y += 18;
        this.ctx.fillText(`Noise: ${Math.round(this.player.getNoiseLevel())}%`, padding + 10, y);
        y += 18;

        // Guard info
        this.ctx.fillStyle = "#ffaa44";
        this.ctx.fillText(`Guards: ${this.guards.length}`, padding + 10, y);
        y += 18;

        // State info
        this.ctx.fillStyle = this.player.isHiding ? "#00ff00" : "#ffaa44";
        const stateText = this.player.isHiding ? "Status: HIDDEN" : this.player.isCrouching ? "Status: CROUCHING" : "Status: EXPOSED";
        this.ctx.fillText(stateText, padding + 10, y);
    }

    updateUI() {
        document.getElementById("heatLevel").textContent = Math.round(this.heatLevel) + "%";

        let objectiveCount = 0;
        for (let obj of this.level.objectives) {
            if (obj.completed) objectiveCount++;
        }
        document.getElementById("objectiveText").textContent = `(${objectiveCount}/${this.level.objectives.length}) Complete`;
    }

    displayStatus(message, color) {
        const statusEl = document.getElementById("statusText");
        statusEl.textContent = message;
        statusEl.style.color = color;
    }

    run() {
        const gameLoop = () => {
            this.update();
            this.render();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Start game when page loads
window.addEventListener("load", () => {
    new Game();
});
