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

        // Abilities (Enhanced with cooldown reduction support)
        this.abilities = {
            q: new EnhancedAbilityInstance(heroData.abilities.q, this.cooldownReduction),
            e: new EnhancedAbilityInstance(heroData.abilities.e, this.cooldownReduction),
            r: new EnhancedAbilityInstance(heroData.abilities.r, this.cooldownReduction)
        };

        // Resource system (Mana)
        this.resources = new ResourcePool(400, 10); // 400 max mana, 10 per second regen

        // Effects
        this.effects = []; // Active effects/buffs/debuffs
        this.isStunned = false;
        this.isSlowed = false;
        this.slowFactor = 1.0;
        this.shield = 0; // Shield pool (absorbs damage)
        this.activeEffects = []; // Active ability effects (walls, zones, etc)

        // Weapon System Integration
        this.primaryWeapon = heroData.primaryWeapon;
        this.secondaryWeapon = heroData.secondaryWeapon;
        this.ammo = 30;
        this.maxAmmo = 30;

        // Initialize weapon instances (will be set by WeaponSystem)
        this.primaryWeaponInstance = null;
        this.secondaryWeaponInstance = null;
        this.activeWeapon = null;

        // Initialize weapons after creation
        WeaponSystem.attachWeaponsToHero(this, this.primaryWeapon, this.secondaryWeapon);

        // Radius for collision
        this.radius = 20;

        // Ability-specific state
        this.shotCounter = 0; // For Lyric's headshot passive
        this.cascadeStacks = 0; // For Talen's spell cascade
        this.markStacks = 0; // For marked/debuff tracking
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

        // Regenerate resources
        this.resources.regenerate(deltaTime);

        // Update effects
        this.updateEffects(deltaTime);

        // Update abilities
        this.updateAbilities(deltaTime);

        // Update weapons and projectiles
        WeaponSystem.updateHeroWeapons(this, deltaTime);

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
     * Update ability cooldowns (with cooldown reduction)
     */
    updateAbilities(deltaTime) {
        // Cap cooldown reduction at 40%
        const cdRCap = Math.min(this.cooldownReduction, 40);
        Object.values(this.abilities).forEach(ability => {
            ability.update(deltaTime, cdRCap);
        });
    }

    /**
     * Update active effects
     */
    updateEffects(deltaTime) {
        // Update old-style effects
        this.effects = this.effects.filter(effect => {
            effect.duration -= deltaTime;
            return effect.duration > 0;
        });

        // Recalculate state from effects
        this.isStunned = this.effects.some(e => e.type === "stun");
        const slowEffect = this.effects.find(e => e.type === "slow");
        this.slowFactor = slowEffect ? slowEffect.magnitude : 1.0;

        // Update new AbilityEffect instances
        const validEffects = [];
        for (let effect of this.effects) {
            if (effect.update && typeof effect.update === 'function') {
                if (effect.update(deltaTime)) {
                    validEffects.push(effect);
                }
            } else {
                validEffects.push(effect);
            }
        }
        this.effects = validEffects;
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
     * Use an ability (integrated with HeroAbilitySystem)
     */
    useAbility(abilityKey, targetX = null, targetY = null, target = null, vfx = null) {
        if (!this.alive || this.isStunned) return false;
        if (!this.abilities[abilityKey]) return false;

        // Execute ability through the HeroAbilitySystem
        const success = HeroAbilitySystem.executeAbility(this, abilityKey, target, targetX, targetY, vfx);

        if (success) {
            // Add experience on ability use
            this.experience += 5;

            // Play ability feedback (will be replaced with actual VFX/SFX)
            const abilityData = this.heroData.abilities[abilityKey];
            console.log(`[${this.name}] Used ${abilityData.name}`);

            // Trigger personality voice line
            if (window.VoiceLineManager) {
                VoiceLineManager.displayVoiceLine(this.name, abilityKey, 1920, 1080);
            }
        }

        return success;
    }

    /**
     * Execute ability effect (legacy, now delegated to HeroAbilitySystem)
     */
    executeAbility(abilityKey, targetX, targetY) {
        console.log(`[${this.name}] Executed ${abilityKey} at (${targetX}, ${targetY})`);
    }

    /**
     * Deal damage to another hero
     */
    dealDamage(target, amount, source = "ability") {
        const actualDamage = Math.max(1, amount - (target.armor * 0.1));
        target.takeDamage(actualDamage, source, this);
    }

    /**
     * Take damage (with armor and shield mitigation)
     */
    takeDamage(amount, source = "ability", attacker = null) {
        if (!this.alive) return;

        // Calculate actual damage based on armor
        const armorReduction = 1 - (this.armor / 100) * 0.1; // Each armor = 0.1% reduction
        let actualDamage = Math.max(1, amount * armorReduction);

        // Apply shield first
        if (this.shield > 0) {
            const shieldAbsorbed = Math.min(this.shield, actualDamage);
            this.shield -= shieldAbsorbed;
            actualDamage -= shieldAbsorbed;
        }

        // Apply remaining damage to health
        this.health -= actualDamage;
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

        // Health bar with shield
        const barWidth = 50;
        const barHeight = 5;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 15, barWidth, barHeight);

        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? "#00ff88" : healthPercent > 0.2 ? "#ffaa00" : "#ff3333";
        ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 15, barWidth * healthPercent, barHeight);

        // Shield bar (over health)
        if (this.shield > 0) {
            const maxShield = this.maxHealth * 0.3; // Shield cap relative to health
            const shieldPercent = Math.min(this.shield / maxShield, 1);
            ctx.fillStyle = "#00d4ff";
            ctx.fillRect(this.x - barWidth / 2 + (barWidth * healthPercent), this.y - this.radius - 15, barWidth * shieldPercent, barHeight);
        }

        // Mana bar (if exists)
        if (this.resources) {
            const manaPercent = this.resources.getPercent() / 100;
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 8, barWidth, 3);
            ctx.fillStyle = "#9d4edd";
            ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 8, barWidth * manaPercent, 3);
        }

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
