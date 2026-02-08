class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.level = new Level();
        this.level.game = this; // Reference for guards

        // Create squad
        this.squad = new Squad(this.level, 4);
        const spawnPoint = this.level.spawnPoints.player;

        // Add squad members with different roles
        this.squad.addMember("INFILTRATOR", spawnPoint);
        this.squad.addMember("OPERATOR", { x: spawnPoint.x + 40, y: spawnPoint.y });
        this.squad.addMember("SUPPORT", { x: spawnPoint.x - 40, y: spawnPoint.y });
        this.squad.addMember("SPECIALIST", { x: spawnPoint.x, y: spawnPoint.y + 40 });

        // Set first member as controlled
        this.squad.switchToMember(0);

        // Create guards
        this.guards = [];
        for (let spawnPoint of this.level.spawnPoints.guards) {
            this.guards.push(new Guard(this.level, spawnPoint));
        }

        // Command wheel
        this.commandWheel = new CommandWheel(this.canvas);

        this.gameState = "playing"; // playing, won, lost
        this.heatLevel = 0;
        this.maxHeat = 100;

        this.gameTime = 0;

        // Setup input
        this.setupInput();
        window.gameInstance = this; // For command wheel

        this.run();
    }

    setupInput() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "c" || e.key === "C") {
                e.preventDefault();
                this.commandWheel.toggleCommandWheel();
                return;
            }

            // Ability hotkeys (if command wheel is not open)
            if (!this.commandWheel.isActive && this.squad) {
                const active = this.squad.getActiveMember();
                if (!active) return;

                const abilityMap = {
                    "z": 0, // First ability
                    "x": 1, // Second ability
                    "v": 2  // Third ability
                };

                const abilityIndex = abilityMap[e.key.toLowerCase()];
                if (abilityIndex !== undefined) {
                    e.preventDefault();
                    const abilities = active.abilityManager.abilities;
                    if (abilities[abilityIndex]) {
                        active.useAbility(abilities[abilityIndex].id);
                    }
                }
            }
        });

        document.addEventListener("mousemove", (e) => {
            if (this.commandWheel.isActive) {
                this.commandWheel.handleMouseMove(e.clientX, e.clientY);
            }
        });

        document.addEventListener("click", (e) => {
            if (this.commandWheel.isActive) {
                this.commandWheel.handleMouseClick(e.clientX, e.clientY);
            }
        });
    }

    update() {
        if (this.gameState !== "playing") return;

        // Update squad
        this.squad.update();

        // Update guards (check all squad members for detection)
        let maxAlert = 0;
        for (let guard of this.guards) {
            let nearestMember = null;
            let nearestDist = Infinity;

            for (let member of this.squad.members) {
                if (!member.isDown) {
                    const dist = Math.hypot(member.x - guard.x, member.y - guard.y);
                    if (dist < nearestDist) {
                        nearestMember = member;
                        nearestDist = dist;
                    }
                }
            }

            if (nearestMember) {
                guard.update(nearestMember);
            }
            maxAlert = Math.max(maxAlert, guard.getAlertLevel());
        }

        // Update heat level based on guard alert
        this.heatLevel = maxAlert;
        this.squad.sharedResources.heatLevel = this.heatLevel;

        // Check if squad is caught
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

        // Draw squad
        this.squad.draw(this.ctx);

        // Draw HUD overlay
        this.drawHUD();

        // Draw command wheel
        this.commandWheel.draw();
    }

    drawHUD() {
        const padding = 10;
        const active = this.squad.getActiveMember();
        if (!active) return;

        // Draw squad members panel
        let panelY = padding;
        const panelHeight = this.squad.members.length * 30 + 20;

        // Squad panel background
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(padding, panelY, 200, panelHeight);

        // Squad label
        this.ctx.fillStyle = "#00ff88";
        this.ctx.font = "12px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText("SQUAD STATUS", padding + 10, panelY + 15);

        // Draw each member status
        let memberY = panelY + 25;
        for (let i = 0; i < this.squad.members.length; i++) {
            const member = this.squad.members[i];
            const isActive = i === this.squad.activeIndex;

            // Background highlight for active member
            if (isActive) {
                this.ctx.fillStyle = "rgba(0, 255, 136, 0.2)";
                this.ctx.fillRect(padding, memberY - 8, 200, 22);
            }

            // Member info
            this.ctx.fillStyle = member.role.color;
            this.ctx.font = "11px Arial";
            const statusIcon = member.isDown ? "✕" : "●";
            const healthText = member.isDown ? "DOWN" : `${Math.round(member.health)}HP`;
            this.ctx.fillText(`${statusIcon} ${member.role.name.substr(0, 3)} [${i + 1}] ${healthText}`, padding + 10, memberY);

            memberY += 25;
        }

        // Draw active member detailed HUD
        const detailedY = padding + panelHeight + 20;
        const detailedHeight = 100;

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(padding, detailedY, 200, detailedHeight);

        this.ctx.fillStyle = active.role.color;
        this.ctx.font = "12px Arial";
        this.ctx.fillText(active.role.name.toUpperCase(), padding + 10, detailedY + 15);

        this.ctx.fillStyle = "#00ff88";
        this.ctx.font = "10px Arial";
        let detY = detailedY + 28;
        this.ctx.fillText(`Pos: (${Math.round(active.x)}, ${Math.round(active.y)})`, padding + 10, detY);
        detY += 14;
        this.ctx.fillText(`Visibility: ${Math.round(active.visibility)}%`, padding + 10, detY);
        detY += 14;
        this.ctx.fillText(`Ammo: ${active.ammo} | Med: ${active.medkits}`, padding + 10, detY);
        detY += 14;

        const stateText = active.isHiding ? "HIDDEN" : active.isCrouching ? "CROUCHING" : "EXPOSED";
        this.ctx.fillStyle = active.isHiding ? "#00ff00" : active.isCrouching ? "#64a8ff" : "#ff6b6b";
        this.ctx.fillText(`Status: ${stateText}`, padding + 10, detY);

        // Formation info
        this.ctx.fillStyle = "#4ecdc4";
        this.ctx.font = "10px Arial";
        detY += 14;
        this.ctx.fillText(`Formation: ${this.squad.formation.toUpperCase()}`, padding + 10, detY);

        // Draw abilities panel
        const abilitiesY = detailedY + detailedHeight + 20;
        const abilitiesHeight = 110;
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(padding, abilitiesY, 200, abilitiesHeight);

        this.ctx.fillStyle = "#c14eca";
        this.ctx.font = "11px Arial";
        this.ctx.fillText("ABILITIES (Z/X/V):", padding + 10, abilitiesY + 15);

        const abilities = active.abilityManager.abilities;
        let abilityY = abilitiesY + 28;
        for (let i = 0; i < Math.min(3, abilities.length); i++) {
            const ability = abilities[i];
            const hotkey = ["Z", "X", "V"][i];
            const isReady = ability.state === ABILITY_STATE.READY;
            const cooldownPercent = ability.currentCooldown / ability.cooldown;

            // Ability background
            this.ctx.fillStyle = isReady ? "rgba(193, 78, 202, 0.2)" : "rgba(0, 0, 0, 0.3)";
            this.ctx.fillRect(padding + 5, abilityY - 10, 190, 24);

            // Ability name and hotkey
            this.ctx.fillStyle = isReady ? "#c14eca" : "#888888";
            this.ctx.font = "9px Arial";
            this.ctx.fillText(`[${hotkey}] ${ability.name}`, padding + 10, abilityY);

            // Cooldown bar
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            this.ctx.fillRect(padding + 115, abilityY - 6, 75, 8);
            this.ctx.fillStyle = isReady ? "#00ff88" : "#ff6b6b";
            this.ctx.fillRect(padding + 115, abilityY - 6, 75 * (1 - cooldownPercent), 8);

            abilityY += 25;
        }

        // Draw formation selector
        const formationY = abilitiesY + abilitiesHeight + 10;
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(padding, formationY, 200, 60);

        this.ctx.fillStyle = "#4ecdc4";
        this.ctx.font = "11px Arial";
        this.ctx.fillText("FORMATIONS (1-5):", padding + 10, formationY + 15);

        const formations = ["wedge", "column", "line", "spread", "hold"];
        this.ctx.font = "9px Arial";
        let formX = padding + 10;
        for (let i = 0; i < formations.length; i++) {
            const isActive = formations[i] === this.squad.formation;
            this.ctx.fillStyle = isActive ? "#00ff88" : "rgba(0, 255, 136, 0.5)";
            this.ctx.fillText(`[${i + 1}] ${formations[i]}`, formX, formationY + 32);
            formX += 38;
        }

        // Controls info
        const controlY = formationY + 65;
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(padding, controlY, 200, 80);

        this.ctx.fillStyle = "#00ff88";
        this.ctx.font = "10px Arial";
        this.ctx.fillText("CONTROLS:", padding + 10, controlY + 13);

        const controls = [
            "TAB - Switch member",
            "C - Command wheel",
            "Q - Regroup",
            "E - Hold position",
            "R - Revive",
            "F - Change formation"
        ];

        let ctrlY = controlY + 25;
        for (let ctrl of controls) {
            this.ctx.fillStyle = "rgba(0, 255, 136, 0.7)";
            this.ctx.font = "8px Arial";
            this.ctx.fillText(ctrl, padding + 10, ctrlY);
            ctrlY += 10;
        }
    }

    updateUI() {
        document.getElementById("heatLevel").textContent = Math.round(this.heatLevel) + "%";

        let objectiveCount = 0;
        for (let obj of this.level.objectives) {
            if (obj.completed) objectiveCount++;
        }

        const active = this.squad.getActiveMember();
        const activeName = active ? active.role.name : "Unknown";
        document.getElementById("objectiveText").textContent = `${activeName} | (${objectiveCount}/${this.level.objectives.length}) Complete`;
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
