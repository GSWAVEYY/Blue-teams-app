/**
 * PVP Match Engine
 * Handles match logic, objectives, and win conditions
 */

class MatchEngine {
    constructor(gameMode, teamSize) {
        this.gameMode = gameMode;
        this.teamSize = teamSize;
        this.state = "running"; // running, paused, finished
        this.arena = ArenaManager.createArena(gameMode);

        // Teams
        this.blueTeam = null;
        this.redTeam = null;

        // Objectives
        this.objectives = [];
        this.objectiveState = {};

        // Match state
        this.startTime = performance.now();
        this.pausedTime = 0;
        this.roundNumber = 1;
        this.roundWinner = null;

        // Game mode specific
        this.bombPlanted = false;
        this.bombPlantedAt = 0;
        this.bombSite = null;

        this.setupObjectives();
    }

    /**
     * Setup objectives based on game mode
     */
    setupObjectives() {
        switch (this.gameMode) {
            case "search":
                // Bomb sites
                const bombA = this.arena.objectives.find(o => o.type === "bomb");
                if (bombA) {
                    this.objectiveState["bombA"] = {
                        planted: false,
                        plantedBy: null,
                        plantTime: 0,
                        defused: false
                    };
                }
                break;

            case "koth":
                // Control point
                const control = this.arena.objectives.find(o => o.type === "control");
                if (control) {
                    this.objectiveState["control"] = {
                        controller: null, // blue or red
                        controlTime: 0,
                        controlledSince: 0
                    };
                }
                break;
        }
    }

    /**
     * Initialize teams with hero instances
     */
    initializeTeams(blueHeroNames, redHeroNames) {
        const blueSpawns = this.arena.getSpawnPoints("blue");
        const redSpawns = this.arena.getSpawnPoints("red");

        this.blueTeam = new HeroTeam("blue", blueHeroNames, blueSpawns);
        this.redTeam = new HeroTeam("red", redHeroNames, redSpawns);
    }

    /**
     * Update match state
     */
    update(deltaTime) {
        if (this.state !== "running") return;

        // Update both teams
        const allHeroes = [...this.blueTeam.heroes, ...this.redTeam.heroes];
        this.blueTeam.update(deltaTime, this.arena, allHeroes);
        this.redTeam.update(deltaTime, this.arena, allHeroes);

        // Update objectives
        this.updateObjectives(deltaTime);

        // Check win condition
        const winner = this.checkWinCondition();
        if (winner) {
            this.finishMatch(winner);
        }
    }

    /**
     * Update game mode specific objectives
     */
    updateObjectives(deltaTime) {
        switch (this.gameMode) {
            case "search":
                this.updateSearchAndDestroy(deltaTime);
                break;

            case "koth":
                this.updateKingOfTheHill(deltaTime);
                break;
        }
    }

    /**
     * Update Search & Destroy objectives
     */
    updateSearchAndDestroy(deltaTime) {
        const bombObj = this.objectiveState["bombA"];
        if (!bombObj) return;

        // Check if any hero is near bomb site
        const bombSite = this.arena.objectives.find(o => o.type === "bomb");
        if (!bombSite) return;

        // Check for plant
        for (let hero of this.blueTeam.heroes) {
            if (hero.alive) {
                const distToSite = Math.hypot(hero.x - bombSite.x, hero.y - bombSite.y);
                if (distToSite < bombSite.radius && !bombObj.planted) {
                    // Hero can plant bomb here
                    // In full game, would require player input
                    bombObj.plantTime += deltaTime;
                    if (bombObj.plantTime > 3000) { // 3 second plant
                        bombObj.planted = true;
                        bombObj.plantedBy = hero;
                        gameState.matchState.blueScore++;
                    }
                }
            }
        }

        // Check for defuse
        if (bombObj.planted) {
            for (let hero of this.redTeam.heroes) {
                if (hero.alive) {
                    const distToBomb = Math.hypot(hero.x - bombSite.x, hero.y - bombSite.y);
                    if (distToBomb < bombSite.radius) {
                        bombObj.plantTime -= deltaTime * 0.5;
                        if (bombObj.plantTime <= 0) {
                            bombObj.defused = true;
                            bombObj.planted = false;
                            gameState.matchState.redScore++;
                        }
                    }
                }
            }
        }
    }

    /**
     * Update King of the Hill objectives
     */
    updateKingOfTheHill(deltaTime) {
        const control = this.objectiveState["control"];
        if (!control) return;

        const controlPoint = this.arena.objectives.find(o => o.type === "control");
        if (!controlPoint) return;

        // Count heroes in control point
        let blueInControl = 0;
        let redInControl = 0;

        for (let hero of this.blueTeam.heroes) {
            if (hero.alive) {
                const dist = Math.hypot(hero.x - controlPoint.x, hero.y - controlPoint.y);
                if (dist < controlPoint.radius) blueInControl++;
            }
        }

        for (let hero of this.redTeam.heroes) {
            if (hero.alive) {
                const dist = Math.hypot(hero.x - controlPoint.x, hero.y - controlPoint.y);
                if (dist < controlPoint.radius) redInControl++;
            }
        }

        // Update control
        if (blueInControl > redInControl) {
            control.controller = "blue";
            control.controlTime += deltaTime;
            gameState.matchState.blueScore = Math.floor(control.controlTime / 1000); // 1 point per second
        } else if (redInControl > blueInControl) {
            control.controller = "red";
            control.controlTime += deltaTime;
            gameState.matchState.redScore = Math.floor(control.controlTime / 1000);
        } else {
            control.controller = null;
        }
    }

    /**
     * Check win condition for the match
     */
    checkWinCondition() {
        // Team Deathmatch: first to target kills
        if (this.gameMode === "tdm") {
            if (gameState.matchState.blueScore >= gameState.targetKills) return "blue";
            if (gameState.matchState.redScore >= gameState.targetKills) return "red";
        }

        // Time limit
        const elapsedTime = (performance.now() - this.startTime) / 1000;
        if (elapsedTime >= gameState.matchState.maxTime) {
            if (gameState.matchState.blueScore > gameState.matchState.redScore) return "blue";
            if (gameState.matchState.redScore > gameState.matchState.blueScore) return "red";
            return "tie";
        }

        return null;
    }

    /**
     * Finish the match
     */
    finishMatch(winner) {
        this.state = "finished";
        this.roundWinner = winner;
    }

    /**
     * Get all heroes (for rendering, collision, etc)
     */
    getAllHeroes() {
        return [...this.blueTeam.heroes, ...this.redTeam.heroes];
    }

    /**
     * Get hero by ID
     */
    getHeroById(id) {
        return this.getAllHeroes().find(h => h.id === id);
    }

    /**
     * Draw match state
     */
    draw(ctx) {
        // Draw arena
        this.arena.draw(ctx);

        // Draw teams
        this.blueTeam.draw(ctx);
        this.redTeam.draw(ctx);

        // Draw minimap
        const minimapX = ctx.canvas.width - 220;
        const minimapY = 10;
        ctx.save();
        ctx.translate(minimapX, minimapY);
        const minimap = new Minimap(this.arena, 200, 150);
        minimap.draw(ctx, this.getAllHeroes());
        ctx.restore();
    }

    /**
     * Get match stats
     */
    getStats() {
        return {
            blueTeam: {
                alive: this.blueTeam.getAliveCount(),
                total: this.blueTeam.heroes.length,
                kills: this.blueTeam.getTotalKills(),
                score: gameState.matchState.blueScore
            },
            redTeam: {
                alive: this.redTeam.getAliveCount(),
                total: this.redTeam.heroes.length,
                kills: this.redTeam.getTotalKills(),
                score: gameState.matchState.redScore
            }
        };
    }
}

/**
 * Match statistics tracker
 */
class MatchStats {
    constructor() {
        this.heroDamage = {}; // damage dealt
        this.heroTaken = {}; // damage taken
        this.heroKills = {};
        this.heroDeaths = {};
        this.heroAssists = {};
        this.heroHealing = {};
    }

    /**
     * Record damage
     */
    recordDamage(fromHeroId, toHeroId, amount) {
        this.heroDamage[fromHeroId] = (this.heroDamage[fromHeroId] || 0) + amount;
        this.heroTaken[toHeroId] = (this.heroTaken[toHeroId] || 0) + amount;
    }

    /**
     * Record kill
     */
    recordKill(killerHeroId, victimHeroId) {
        this.heroKills[killerHeroId] = (this.heroKills[killerHeroId] || 0) + 1;
        this.heroDeaths[victimHeroId] = (this.heroDeaths[victimHeroId] || 0) + 1;
    }

    /**
     * Record assist
     */
    recordAssist(assistHeroId) {
        this.heroAssists[assistHeroId] = (this.heroAssists[assistHeroId] || 0) + 1;
    }

    /**
     * Get hero performance
     */
    getHeroStats(heroId) {
        return {
            damage: this.heroDamage[heroId] || 0,
            damageTaken: this.heroTaken[heroId] || 0,
            kills: this.heroKills[heroId] || 0,
            deaths: this.heroDeaths[heroId] || 0,
            assists: this.heroAssists[heroId] || 0,
            kda: `${this.heroKills[heroId] || 0}/${this.heroDeaths[heroId] || 0}/${this.heroAssists[heroId] || 0}`
        };
    }
}
