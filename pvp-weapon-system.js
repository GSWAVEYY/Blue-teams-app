/**
 * NEXUS Weapon System
 * Handles attack mechanics, damage calculation, projectiles, and weapon switching
 */

class AttackInstance {
    constructor(attacker, weapon, targetHero = null, targetX = null, targetY = null) {
        this.attacker = attacker;
        this.weapon = weapon;
        this.targetHero = targetHero;
        this.targetX = targetX || attacker.x;
        this.targetY = targetY || attacker.y;

        // Calculate damage with all modifiers
        this.baseDamage = weapon.calculateDamage(attacker);
        this.elementalType = weapon.element;

        // Apply element effectiveness multiplier
        const elementalMultiplier = ElementSystem.getElementalMultiplier(
            this.elementalType,
            targetHero ? "physical" : "neutral",
            targetHero ? targetHero.armor : 0
        );

        this.finalDamage = Math.floor(this.baseDamage * elementalMultiplier);

        // Special effects from weapon
        this.effect = weapon.effectType ? {
            type: weapon.effectType,
            magnitude: weapon.effectMagnitude,
            duration: weapon.effectDuration
        } : null;

        this.id = Math.random(); // Unique identifier for this attack
    }

    apply(vfx = null) {
        if (!this.targetHero) return;

        // Deal damage
        this.attacker.dealDamage(this.targetHero, this.finalDamage, "weapon");

        // Apply status effect from weapon if exists
        if (this.effect) {
            const statusEffect = new AbilityEffect(this.effect.type, this.effect.duration, this.effect.magnitude);
            statusEffect.apply(this.targetHero);
        }

        // Visual feedback
        if (vfx) {
            const color = ElementSystem.getElementColor(this.elementalType);

            switch (this.weapon.attackType) {
                case ATTACK_TYPE.MELEE:
                    vfx.slash(this.attacker.x, this.attacker.y, this.targetHero.x, this.targetHero.y, color);
                    break;

                case ATTACK_TYPE.PROJECTILE:
                    vfx.projectile(this.attacker.x, this.attacker.y, this.targetHero.x, this.targetHero.y, color, this.weapon.projectileSpeed);
                    break;

                case ATTACK_TYPE.HITSCAN:
                    vfx.slash(this.attacker.x, this.attacker.y, this.targetHero.x, this.targetHero.y, color);
                    break;
            }

            vfx.damageNumber(this.targetHero.x, this.targetHero.y, this.finalDamage, "#ff6b6b");
        }
    }
}

/**
 * Weapon Instance - Per-hero weapon state
 */
class WeaponInstance {
    constructor(weaponName, hero) {
        this.weapon = WeaponDatabase.getWeapon(weaponName);
        if (!this.weapon) {
            console.error(`Weapon not found: ${weaponName}`);
            return;
        }

        this.hero = hero;
        this.attackCooldownRemaining = 0;
        this.projectiles = []; // Active projectiles from this weapon

        // Attack speed based on hero stats
        this.baseAttackSpeed = this.weapon.attackSpeed;
    }

    /**
     * Update weapon state and projectiles
     */
    update(deltaTime) {
        // Update cooldown
        if (this.attackCooldownRemaining > 0) {
            this.attackCooldownRemaining -= deltaTime;
        }

        // Update projectiles
        this.projectiles = this.projectiles.filter(p => {
            if (p.update && typeof p.update === 'function') {
                const alive = p.update(deltaTime);
                if (!alive && p.onImpact) {
                    p.onImpact();
                }
                return alive;
            }
            return true;
        });
    }

    /**
     * Can hero attack with this weapon
     */
    canAttack() {
        return this.attackCooldownRemaining <= 0;
    }

    /**
     * Execute attack on target
     */
    attack(targetHero = null, targetX = null, targetY = null, vfx = null) {
        if (!this.canAttack()) return false;
        if (!targetHero && !targetX && !targetY) return false;

        // Create attack instance
        const attack = new AttackInstance(this.hero, this.weapon, targetHero, targetX, targetY);

        // Handle different attack types
        switch (this.weapon.attackType) {
            case ATTACK_TYPE.MELEE:
                // Instant hit
                attack.apply(vfx);
                break;

            case ATTACK_TYPE.HITSCAN:
                // Instant line of sight hit
                attack.apply(vfx);
                break;

            case ATTACK_TYPE.PROJECTILE:
                // Create projectile
                if (targetHero) {
                    const projectile = new WeaponProjectile(
                        this.hero.x,
                        this.hero.y,
                        targetHero.x,
                        targetHero.y,
                        this.weapon,
                        attack,
                        vfx
                    );
                    this.projectiles.push(projectile);
                } else {
                    attack.apply(vfx);
                }
                break;
        }

        // Start cooldown (affected by attack speed stat)
        const baseCD = this.weapon.getAttackCooldown();
        const attackSpeedMultiplier = 1.0; // Can be modified by hero stats or buffs
        this.attackCooldownRemaining = baseCD / attackSpeedMultiplier;

        return true;
    }

    /**
     * Get damage for this weapon (for UI display)
     */
    getDamage() {
        return this.weapon.calculateDamage(this.hero);
    }

    /**
     * Get remaining cooldown as percentage
     */
    getCooldownPercent() {
        const baseCD = this.weapon.getAttackCooldown();
        return Math.max(0, this.attackCooldownRemaining / baseCD);
    }

    /**
     * Draw weapon projectiles
     */
    drawProjectiles(ctx) {
        for (let projectile of this.projectiles) {
            if (projectile.draw && typeof projectile.draw === 'function') {
                projectile.draw(ctx);
            }
        }
    }
}

/**
 * Weapon Projectile
 */
class WeaponProjectile {
    constructor(fromX, fromY, toX, toY, weapon, attack, vfx) {
        this.x = fromX;
        this.y = fromY;
        this.toX = toX;
        this.toY = toY;
        this.weapon = weapon;
        this.attack = attack;
        this.vfx = vfx;

        // Calculate direction and speed
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.hypot(dx, dy);

        this.vx = (dx / distance) * weapon.projectileSpeed;
        this.vy = (dy / distance) * weapon.projectileSpeed;
        this.distance = distance;
        this.traveled = 0;

        this.radius = 8;
        this.hasHit = false;

        // Color based on element type
        this.color = ElementSystem.getElementColor(weapon.element);
    }

    update(deltaTime) {
        const moveAmount = Math.hypot(this.vx, this.vy) * deltaTime;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.traveled += moveAmount;

        // Check if reached target
        if (this.traveled >= this.distance) {
            if (!this.hasHit && this.attack.targetHero) {
                this.hit();
                this.hasHit = true;
            }
            return false;
        }

        return true;
    }

    hit() {
        if (this.attack.targetHero) {
            this.attack.apply(this.vfx);

            // Impact effect
            if (this.vfx) {
                this.vfx.burstEffect(this.x, this.y, this.color, 15, 360, 0.8);
            }
        }
    }

    onImpact() {
        // Called when projectile expires
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Trail
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 0.05, this.y - this.vy * 0.05);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}

/**
 * Weapon System Manager
 */
class WeaponSystem {
    static attachWeaponsToHero(hero, primaryWeaponName, secondaryWeaponName) {
        hero.primaryWeaponInstance = new WeaponInstance(primaryWeaponName, hero);
        hero.secondaryWeaponInstance = new WeaponInstance(secondaryWeaponName, hero);
        hero.activeWeapon = hero.primaryWeaponInstance; // Default to primary
    }

    /**
     * Update all weapons and projectiles for a hero
     */
    static updateHeroWeapons(hero, deltaTime) {
        if (hero.primaryWeaponInstance) hero.primaryWeaponInstance.update(deltaTime);
        if (hero.secondaryWeaponInstance) hero.secondaryWeaponInstance.update(deltaTime);
    }

    /**
     * Execute basic attack (weapon attack)
     */
    static executeBasicAttack(hero, targetHero = null, targetX = null, targetY = null, vfx = null) {
        if (!hero.activeWeapon) return false;

        // Find nearest enemy if none specified
        if (!targetHero && targetX && targetY) {
            // Use specified coordinates
        } else if (!targetHero) {
            return false;
        }

        return hero.activeWeapon.attack(targetHero, targetX, targetY, vfx);
    }

    /**
     * Switch active weapon
     */
    static switchWeapon(hero) {
        if (!hero.primaryWeaponInstance || !hero.secondaryWeaponInstance) return;

        hero.activeWeapon = hero.activeWeapon === hero.primaryWeaponInstance ?
            hero.secondaryWeaponInstance :
            hero.primaryWeaponInstance;
    }

    /**
     * Draw weapon projectiles for all heroes
     */
    static drawAllProjectiles(ctx, allHeroes) {
        for (let hero of allHeroes) {
            if (hero.primaryWeaponInstance) hero.primaryWeaponInstance.drawProjectiles(ctx);
            if (hero.secondaryWeaponInstance) hero.secondaryWeaponInstance.drawProjectiles(ctx);
        }
    }

    /**
     * Get weapon info for UI display
     */
    static getWeaponInfo(hero) {
        if (!hero.activeWeapon) return null;

        const weapon = hero.activeWeapon.weapon;
        return {
            name: weapon.name,
            element: weapon.element,
            damage: hero.activeWeapon.getDamage(),
            attackSpeed: weapon.attackSpeed,
            range: weapon.range,
            cooldown: hero.activeWeapon.attackCooldownRemaining,
            maxCooldown: weapon.getAttackCooldown(),
            cooldownPercent: hero.activeWeapon.getCooldownPercent()
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeaponSystem, WeaponInstance, WeaponProjectile, AttackInstance };
}
