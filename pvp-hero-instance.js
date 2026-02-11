/**
 * PVP Hero Instance
 * Individual hero instance during a match with live stats and abilities
 */

class HeroInstance {
    constructor(heroName, team, spawnPoint, index) {
        const heroData = HeroManager.getHero(heroName);

        // Basic info
        this.id = `${team}-${index}`;
        this.name = heroName;
        this.team = team;
        this.heroData = heroData;

        // Position and movement
        this.x = spawnPoint.x;
        this.y = spawnPoint.y;
        this.vx = 0; // velocity x
        this.vy = 0; // velocity y
        this.angle = 0; // facing angle

        // Stats (copy from hero definition)
        this.maxHealth = heroData.stats.maxHealth;
        this.health = this.maxHealth;
        this.armor = heroData.stats.armor;
        this.speed = heroData.stats.speed;
        this.attackDamage = heroData.stats.attackDamage;
        this.attackSpeed = heroData.stats.attackSpeed;
        this.abilityPower = heroData.stats.abilityPower;
        this.cooldownReduction = heroData.stats.cooldownReduction;

        // State
        this.alive = true;
        this.respawning = false;
        this.respawnTimer = 0;
        this.lastDamagedBy = null;

        // Combat
        this.kills = 0;
        this.deaths = 0;
        this.assists = 0;
        this.level = 1;
        this.experience = 0;

        // Abilities
        this.abilities = {
            q: new AbilityInstance(heroData.abilities.q),
            e: new AbilityInstance(heroData.abilities.e),
            r: new AbilityInstance(heroData.abilities.r)
        };

        // Effects
        this.effects = []; // Active effects/buffs/debuffs
        this.isStunned = false;
        this.isSlowed = false;
        this.slowFactor = 1.0;

        // Weapon
        this.primaryWeapon = heroData.primaryWeapon;
        this.secondaryWeapon = heroData.secondaryWeapon;
        this.ammo = 30;
        this.maxAmmo = 30;

        // Radius for collision
        this.radius = 20;
    }

    /**
     * Update hero each frame
     */
    update(deltaTime, arena, allHeroes) {
        if (!this.alive) {
            if (this.respawning) {
                this.respawnTimer -= deltaTime;
                if (this.respawnTimer <= 0) {
                    this.respawn(arena);
                }
            }
            return;
        }

        // Update effects
        this.updateEffects(deltaTime);

        // Update abilities
        this.updateAbilities(deltaTime);

        // Apply movement with collision
        this.updateMovement(arena);

        // Check hazard damage
        this.checkHazardDamage(arena);

        // Regenerate health slowly
        if (this.health < this.maxHealth) {
            this.health = Math.min(this.maxHealth, this.health + 0.1);
        }

        // Decay experience for next level
        this.checkLevelUp();
    }

    /**
     * Update movement and collision
     */
    updateMovement(arena) {
        let newX = this.x + this.vx * this.slowFactor;
        let newY = this.y + this.vy * this.slowFactor;

        // Collision check with walls
        if (!arena.isWall(newX, newY, this.radius)) {
            this.x = newX;
            this.y = newY;
        } else {
            // Try sliding along walls
            if (!arena.isWall(newX, this.y, this.radius)) {
                this.x = newX;
            } else if (!arena.isWall(this.x, newY, this.radius)) {
                this.y = newY;
            }
        }

        // Clamp to arena bounds
        this.x = Math.max(this.radius, Math.min(arena.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(arena.height - this.radius, this.y));

        // Update facing angle from velocity
        if (this.vx !== 0 || this.vy !== 0) {
            this.angle = Math.atan2(this.vy, this.vx);
        }
    }

    /**
     * Update ability cooldowns
     */
    updateAbilities(deltaTime) {
        Object.values(this.abilities).forEach(ability => {
            ability.update(deltaTime, this.cooldownReduction);
        });
    }

    /**
     * Update active effects
     */
    updateEffects(deltaTime) {
        this.effects = this.effects.filter(effect => {
            effect.duration -= deltaTime;
            return effect.duration > 0;
        });

        // Recalculate state from effects
        this.isStunned = this.effects.some(e => e.type === "stun");
        const slowEffect = this.effects.find(e => e.type === "slow");
        this.slowFactor = slowEffect ? slowEffect.value : 1.0;
    }

    /**
     * Check for hazard damage
     */
    checkHazardDamage(arena) {
        for (let hazard of arena.hazards) {
            const dist = Math.hypot(this.x - hazard.x, this.y - hazard.y);
            if (dist < hazard.radius) {
                this.takeDamage(hazard.damage, "environment");
            }
        }
    }

    /**
     * Check if level up
     */
    checkLevelUp() {
        const expPerLevel = 100 * this.level;
        if (this.experience >= expPerLevel) {
            this.levelUp();
        }
    }

    /**
     * Level up hero
     */
    levelUp() {
        this.level++;
        this.maxHealth += 50;
        this.health = this.maxHealth;
        this.attackDamage += 10;
        this.abilityPower += 15;
        this.experience = 0;
    }

    /**
     * Use an ability
     */
    useAbility(abilityKey, targetX, targetY) {
        if (!this.abilities[abilityKey]) return false;

        const ability = this.abilities[abilityKey];
        if (ability.canUse()) {
            ability.use();

            // Execute ability effect
            this.executeAbility(abilityKey, targetX, targetY);
            return true;
        }
        return false;
    }

    /**
     * Execute ability effect
     */
    executeAbility(abilityKey, targetX, targetY) {
        const abilityData = this.heroData.abilities[abilityKey];

        // This is a placeholder - specific abilities would be implemented differently
        // In a full game, each hero would have unique ability implementations
        console.log(`${this.name} used ${abilityData.name} at (${targetX}, ${targetY})`);

        // Add experience on ability hit
        this.experience += 5;
    }

    /**
     * Deal damage to another hero
     */
    dealDamage(target, amount, source = "ability") {
        const actualDamage = Math.max(1, amount - (target.armor * 0.1));
        target.takeDamage(actualDamage, source, this);
    }

    /**
     * Take damage
     */
    takeDamage(amount, source = "ability", attacker = null) {
        if (!this.alive) return;

        this.health -= amount;
        this.lastDamagedBy = attacker;

        if (this.health <= 0) {
            this.die(attacker);
        }
    }

    /**
     * Hero dies
     */
    die(killer = null) {
        this.alive = false;
        this.deaths++;

        if (killer) {
            killer.kills++;
            gameState.recordElimination(killer.team, this.team);
        }

        this.startRespawn();
    }

    /**
     * Start respawn timer
     */
    startRespawn() {
        this.respawning = true;
        // Respawn time scales with team level
        this.respawnTimer = 3 + (gameState.matchState.time / 30);
    }

    /**
     * Respawn at random spawn point
     */
    respawn(arena) {
        const spawn = arena.getRandomSpawnPoint(this.team);
        this.x = spawn.x;
        this.y = spawn.y;
        this.health = this.maxHealth;
        this.alive = true;
        this.respawning = false;
    }

    /**
     * Get ability cooldown value
     */
    getAbilityCooldown(abilityKey) {
        if (!this.abilities[abilityKey]) return 0;
        return this.abilities[abilityKey].cooldownRemaining;
    }

    /**
     * Draw hero on canvas
     */
    draw(ctx) {
        if (!this.alive && !this.respawning) return;

        // Hero body
        ctx.fillStyle = this.team === "blue" ? "#00d4ff" : "#ff3333";
        ctx.globalAlpha = this.respawning ? 0.5 : 1.0;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Direction indicator
        ctx.strokeStyle = this.team === "blue" ? "#00ff88" : "#ffaa00";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + Math.cos(this.angle) * 15,
            this.y + Math.sin(this.angle) * 15
        );
        ctx.stroke();

        ctx.globalAlpha = 1.0;

        // Health bar
        const barWidth = 50;
        const barHeight = 5;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 15, barWidth, barHeight);

        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? "#00ff88" : healthPercent > 0.2 ? "#ffaa00" : "#ff3333";
        ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 15, barWidth * healthPercent, barHeight);

        // Hero label
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${this.name} (${Math.ceil(this.health)})`, this.x, this.y + this.radius + 15);

        // Level indicator
        ctx.fillStyle = "#00d4ff";
        ctx.font = "bold 12px Arial";
        ctx.fillText(`L${this.level}`, this.x + this.radius, this.y - this.radius);
    }
}

/**
 * Ability instance for a hero
 */
class AbilityInstance {
    constructor(abilityData) {
        this.data = abilityData;
        this.cooldownRemaining = 0;
        this.maxCooldown = abilityData.cooldown;
        this.isReady = true;
    }

    /**
     * Update cooldown
     */
    update(deltaTime, cooldownReduction = 0) {
        if (this.cooldownRemaining > 0) {
            // Apply cooldown reduction (e.g., 10% = 0.1)
            const actualCooldownRate = 1 - cooldownReduction;
            this.cooldownRemaining -= deltaTime * actualCooldownRate;
            if (this.cooldownRemaining <= 0) {
                this.cooldownRemaining = 0;
                this.isReady = true;
            }
        }
    }

    /**
     * Check if ability can be used
     */
    canUse() {
        return this.cooldownRemaining <= 0;
    }

    /**
     * Use the ability
     */
    use() {
        this.cooldownRemaining = this.maxCooldown;
        this.isReady = false;
    }
}

/**
 * Hero collection for a team
 */
class HeroTeam {
    constructor(team, heroNames, spawnPoints) {
        this.team = team;
        this.heroes = [];

        heroNames.forEach((name, index) => {
            if (spawnPoints[index]) {
                const hero = new HeroInstance(name, team, spawnPoints[index], index);
                this.heroes.push(hero);
            }
        });
    }

    /**
     * Update all heroes in team
     */
    update(deltaTime, arena, allHeroes) {
        this.heroes.forEach(hero => hero.update(deltaTime, arena, allHeroes));
    }

    /**
     * Draw all heroes
     */
    draw(ctx) {
        this.heroes.forEach(hero => hero.draw(ctx));
    }

    /**
     * Get living heroes count
     */
    getAliveCount() {
        return this.heroes.filter(h => h.alive).length;
    }

    /**
     * Get total team kills
     */
    getTotalKills() {
        return this.heroes.reduce((sum, h) => sum + h.kills, 0);
    }
}
