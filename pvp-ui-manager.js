/**
 * PVP UI Manager
 * Handles all screen transitions, hero displays, and UI updates
 */

class UIManager {
    constructor() {
        this.currentScreen = "main-menu";
        this.selectedHeroIndex = null;
        this.heroCache = {};
    }

    /**
     * Show specific screen
     */
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
        });

        // Show target screen
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add("active");
            this.currentScreen = screenId;
        }
    }

    /**
     * Populate hero grid for selection
     */
    populateHeroGrid() {
        const heroes = HeroManager.getAllHeroes();
        const grid = document.getElementById("hero-grid");
        grid.innerHTML = "";

        heroes.forEach((hero, index) => {
            const card = document.createElement("div");
            card.className = "hero-card";
            card.innerHTML = `
                <div class="hero-avatar">${hero.icon}</div>
                <div class="hero-name">${hero.name}</div>
                <div class="hero-role">${hero.role}</div>
            `;
            card.onclick = () => this.selectHero(index);
            grid.appendChild(card);
        });
    }

    /**
     * Populate hero gallery
     */
    populateHeroGallery() {
        const heroes = HeroManager.getAllHeroes();
        const gallery = document.getElementById("hero-gallery-grid");
        gallery.innerHTML = "";

        heroes.forEach(hero => {
            const card = document.createElement("div");
            card.className = "gallery-card";
            card.innerHTML = `
                <div class="gallery-avatar">${hero.icon}</div>
                <div class="gallery-name">${hero.name}</div>
                <div class="gallery-role">${hero.role}</div>
                <div class="gallery-stat">HP: ${hero.stats.maxHealth}</div>
                <div class="gallery-stat">DMG: ${hero.stats.attackDamage}</div>
                <div class="gallery-stat">SPD: ${hero.stats.speed.toFixed(1)}</div>
            `;
            card.onclick = () => this.showHeroDetails(hero);
            gallery.appendChild(card);
        });
    }

    /**
     * Select a hero for the match
     */
    selectHero(index) {
        const heroes = HeroManager.getAllHeroes();
        const hero = heroes[index];

        // Update UI
        document.querySelectorAll(".hero-card").forEach((card, i) => {
            card.classList.toggle("selected", i === index);
        });

        this.selectedHeroIndex = index;

        // Show hero details
        this.showHeroDetailsInPanel(hero);

        // Enable confirm button
        const confirmBtn = document.getElementById("confirm-hero-btn");
        confirmBtn.disabled = false;
    }

    /**
     * Show hero details in the selection panel
     */
    showHeroDetailsInPanel(hero) {
        const panel = document.getElementById("hero-details");
        const abilities = hero.abilities;

        panel.innerHTML = `
            <div class="hero-details">
                <div style="text-align: center; margin-bottom: 1rem;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${hero.icon}</div>
                    <div class="hero-name" style="color: ${hero.color};">${hero.name}</div>
                    <div class="hero-role">${hero.role} • ${hero.title}</div>
                </div>

                <div class="ability-desc">
                    <div class="ability-name">Passive: ${abilities.passive.name}</div>
                    <p>${abilities.passive.description}</p>
                </div>

                <div class="ability-desc">
                    <div class="ability-name">Q: ${abilities.q.name}</div>
                    <p>${abilities.q.description}</p>
                    <p>CD: ${abilities.q.cooldown}s</p>
                </div>

                <div class="ability-desc">
                    <div class="ability-name">E: ${abilities.e.name}</div>
                    <p>${abilities.e.description}</p>
                    <p>CD: ${abilities.e.cooldown}s</p>
                </div>

                <div class="ability-desc">
                    <div class="ability-name">R: ${abilities.r.name} (ULTIMATE)</div>
                    <p>${abilities.r.description}</p>
                    <p>CD: ${abilities.r.cooldown}s</p>
                </div>

                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <p style="color: ${hero.color}; font-weight: bold;">Playstyle</p>
                    <p style="font-size: 0.85rem;">${hero.playstyle}</p>
                </div>
            </div>
        `;
    }

    /**
     * Show hero details in gallery
     */
    showHeroDetails(hero) {
        const panel = document.getElementById("hero-details");
        const stats = hero.stats;

        if (!panel) {
            // Create details panel if in gallery view
            const gallery = document.getElementById("hero-gallery-grid");
            const details = document.createElement("div");
            details.className = "hero-details";
            details.id = "hero-details";
            details.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${hero.icon}</div>
                    <div class="hero-name" style="color: ${hero.color}; font-size: 1.5rem;">${hero.name}</div>
                    <div class="hero-role" style="font-size: 1.1rem;">${hero.role}</div>
                    <p style="margin: 1rem 0; color: var(--text-secondary);">${hero.lore}</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div>
                        <p style="color: var(--primary-blue); font-weight: bold;">Stats</p>
                        <p>HP: ${stats.maxHealth}</p>
                        <p>ARM: ${stats.armor}</p>
                        <p>SPD: ${stats.speed.toFixed(1)}</p>
                    </div>
                    <div>
                        <p style="color: var(--primary-blue); font-weight: bold;">Damage</p>
                        <p>ATK: ${stats.attackDamage}</p>
                        <p>ASP: ${stats.attackSpeed.toFixed(2)}</p>
                        <p>AP: ${stats.abilityPower}</p>
                    </div>
                </div>
            `;
            gallery.parentElement.insertBefore(details, gallery);
        }
    }

    /**
     * Update team lobby with current roster
     */
    updateTeamLobby() {
        const blueRoster = gameState.getTeamRoster("blue");
        const redRoster = gameState.getTeamRoster("red");

        const blueElement = document.getElementById("blue-roster");
        const redElement = document.getElementById("red-roster");

        blueElement.innerHTML = blueRoster.map(player => `
            <div class="roster-player">
                <div class="player-hero">${HeroManager.getHero(player.hero).icon} ${player.hero}</div>
                <div class="player-status ${player.ready ? 'ready' : ''}">
                    ${player.ready ? '✓ Ready' : '○ Not Ready'}
                </div>
            </div>
        `).join("");

        redElement.innerHTML = redRoster.map(player => `
            <div class="roster-player">
                <div class="player-hero">${HeroManager.getHero(player.hero).icon} ${player.hero}</div>
                <div class="player-status ${player.ready ? 'ready' : ''}">
                    ${player.ready ? '✓ Ready' : '○ Not Ready'}
                </div>
            </div>
        `).join("");
    }

    /**
     * Update game HUD during match
     */
    updateGameHUD(game) {
        // Update score
        document.querySelector(".score-blue").textContent = gameState.matchState.blueScore;
        document.querySelector(".score-red").textContent = gameState.matchState.redScore;

        // Update timer
        document.getElementById("game-timer").textContent = gameState.getFormattedTime();

        // Update player health
        if (game && game.playerHero) {
            const hero = game.playerHero;
            const healthPercent = (hero.health / hero.maxHealth) * 100;
            document.getElementById("health-fill").style.width = healthPercent + "%";
            document.getElementById("health-text").textContent = `${Math.ceil(hero.health)}/${hero.maxHealth}`;
        }
    }

    /**
     * Update ability cooldowns on HUD
     */
    updateAbilityCooldowns(game) {
        if (!game || !game.playerHero) return;

        const hero = game.playerHero;
        const abilities = ["q", "e", "r"];

        abilities.forEach(abilityKey => {
            const cooldown = hero.getAbilityCooldown(abilityKey);
            const cdElement = document.getElementById(`cd-${abilityKey}`);

            if (cdElement) {
                if (cooldown > 0) {
                    cdElement.classList.add("active");
                    cdElement.textContent = Math.ceil(cooldown) + "s";
                } else {
                    cdElement.classList.remove("active");
                    cdElement.textContent = "";
                }
            }
        });
    }

    /**
     * Add message to game feed
     */
    addFeedMessage(text, type = "normal") {
        const feed = document.getElementById("game-feed");
        const item = document.createElement("div");
        item.className = `feed-item ${type}`;
        item.textContent = text;
        feed.appendChild(item);

        // Auto-remove after 5 seconds
        setTimeout(() => item.remove(), 5000);
    }

    /**
     * Show game over screen
     */
    showGameOver(winner) {
        const gameScreen = document.getElementById("game-screen");
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            z-index: 100;
            font-size: 2rem;
            text-align: center;
        `;

        const message = winner === gameState.playerTeam ?
            "VICTORY!" : winner === "tie" ? "TIE GAME" : "DEFEAT";
        const color = winner === gameState.playerTeam ? "#00ff88" : "#ff3333";

        overlay.innerHTML = `
            <div style="color: ${color}; font-size: 3rem; margin-bottom: 1rem; font-weight: bold;">
                ${message}
            </div>
            <div style="margin: 2rem 0;">
                <p>Blue Team: ${gameState.matchState.blueScore}</p>
                <p>Red Team: ${gameState.matchState.redScore}</p>
            </div>
            <button class="btn-primary" onclick="backToMainMenu()" style="margin-top: 2rem; pointer-events: auto;">
                Back to Menu
            </button>
        `;

        gameScreen.appendChild(overlay);
    }

    /**
     * Clear all UI elements
     */
    clear() {
        this.selectedHeroIndex = null;
    }
}

// Global UI manager instance
const uiManager = new UIManager();

// Global UI functions
function showMainMenu() {
    gameState.reset();
    uiManager.showScreen("main-menu");
}

function showGameModes() {
    uiManager.showScreen("game-mode-screen");
}

function showHeroGallery() {
    uiManager.populateHeroGallery();
    uiManager.showScreen("hero-gallery-screen");
}

function showSettings() {
    uiManager.showScreen("settings-screen");
}

function startGame(gameMode, blueSize, redSize) {
    gameState.initGame(gameMode, Math.max(blueSize, redSize));
    uiManager.populateHeroGrid();
    uiManager.showScreen("hero-select-screen");
}

function confirmHeroSelection() {
    if (uiManager.selectedHeroIndex !== null) {
        const heroes = HeroManager.getAllHeroes();
        const selectedHero = heroes[uiManager.selectedHeroIndex].name;
        gameState.confirmHero(selectedHero, gameState.playerTeam);
        uiManager.updateTeamLobby();
        uiManager.showScreen("team-lobby-screen");
    }
}

function cancelHeroSelect() {
    uiManager.selectedHeroIndex = null;
    showGameModes();
}

function toggleReady() {
    gameState.toggleReady();
    uiManager.updateTeamLobby();

    // Check if all players ready (in real game, would wait for other players)
    if (gameState.allPlayersReady() && gameState.teams.red.length > 0) {
        setTimeout(() => {
            gameState.startMatch();
            initializeGame();
            uiManager.showScreen("game-screen");
        }, 1000);
    }
}

function cancelMatch() {
    gameState.reset();
    uiManager.showScreen("game-mode-screen");
}

function backToMainMenu() {
    gameState.reset();
    uiManager.showScreen("main-menu");
}
