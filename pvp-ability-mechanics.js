/**
 * NEXUS Ability Mechanics System
 * Comprehensive ability implementation with unique hero mechanics
 * Based on research from LoL, OW2, Apex, Valorant, Brawl Stars, SMITE, Arena of Valor
 */

/**
 * Resource System (Mana)
 */
class ResourcePool {
    constructor(maxMana = 400, regenPerSecond = 10) {
        this.maxMana = maxMana;
        this.currentMana = maxMana;
        this.regenPerSecond = regenPerSecond;
    }

    regenerate(deltaTime) {
        this.currentMana = Math.min(this.maxMana, this.currentMana + (this.regenPerSecond * deltaTime));
    }

    consume(amount) {
        if (this.currentMana >= amount) {
            this.currentMana -= amount;
            return true;
        }
        return false;
    }

    refund(amount) {
        this.currentMana = Math.min(this.maxMana, this.currentMana + amount);
    }

    getPercent() {
        return (this.currentMana / this.maxMana) * 100;
    }
}

/**
 * Base Ability Effect System
 */
class AbilityEffect {
    constructor(type, duration = 0, magnitude = 1) {
        this.type = type; // stun, slow, buff, debuff, poison, burn, etc
        this.duration = duration;
        this.magnitude = magnitude;
        this.elapsed = 0;
    }

    update(deltaTime) {
        this.elapsed += deltaTime;
        return this.elapsed < this.duration;
    }

    apply(target) {
        switch (this.type) {
            case "stun":
                target.isStunned = true;
                target.effects.push(this);
                break;
            case "slow":
                target.slowFactor = this.magnitude;
                target.effects.push(this);
                break;
            case "damage_over_time":
                target.addDoT(this.magnitude, this.duration);
                break;
            case "shield":
                target.shield = Math.max(target.shield || 0, this.magnitude);
                target.effects.push(this);
                break;
            case "buff_damage":
                target.damageMultiplier = (target.damageMultiplier || 1) + this.magnitude;
                target.effects.push(this);
                break;
            case "heal":
                target.health = Math.min(target.maxHealth, target.health + this.magnitude);
                break;
        }
    }
}

/**
 * Enhanced Ability Instance with Cooldown Reduction support
 */
class EnhancedAbilityInstance {
    constructor(abilityData, baseCooldownReduction = 0) {
        this.data = abilityData;
        this.cooldownRemaining = 0;
        this.maxCooldown = abilityData.cooldown;
        this.baseCooldownReduction = baseCooldownReduction;
        this.isReady = true;
        this.charges = abilityData.charges || 1;
        this.maxCharges = abilityData.charges || 1;
    }

    update(deltaTime, cooldownReduction = 0) {
        // Apply CDR cap (40% max)
        const totalCDR = Math.min((this.baseCooldownReduction + cooldownReduction) / 100, 0.4);
        const cdRate = 1 - totalCDR;

        if (this.cooldownRemaining > 0) {
            this.cooldownRemaining -= deltaTime * cdRate;
            if (this.cooldownRemaining <= 0) {
                this.cooldownRemaining = 0;
                this.isReady = true;
                // Charge recovery
                if (this.charges < this.maxCharges) {
                    this.charges++;
                }
            }
        }
    }

    canUse() {
        return this.charges > 0;
    }

    use() {
        this.charges--;
        if (this.charges === 0) {
            this.cooldownRemaining = this.maxCooldown;
            this.isReady = false;
        }
        return true;
    }

    getChargePercent() {
        return (this.charges / this.maxCharges) * 100;
    }
}

/**
 * WARRIOR HEROES - GRAEL, THAXUS, ALDRIN
 */

// GRAEL - Tank/Initiator (Passive: Ironclad, Q: Dragon Slash, E: Inferno Shield, R: Meteor Storm)
const GRAEL_ABILITIES = {
    passive: {
        name: "Ironclad",
        description: "Every 3 seconds, gain a shield equal to 8% of max health. Shield persists between fights.",
        cooldown: 3,
        effect: (hero) => {
            const shieldAmount = hero.maxHealth * 0.08;
            hero.shield = (hero.shield || 0) + shieldAmount;
        }
    },
    q: {
        name: "Dragon Slash",
        description: "Dash forward, dealing 120% AD damage to all enemies hit. Applies 30% slow for 2s.",
        cooldown: 6,
        manaCost: 50,
        range: 400,
        damage: (hero) => hero.attackDamage * 1.2,
        effect: (hero, target) => {
            const slowEffect = new AbilityEffect("slow", 2, 0.7); // 30% slow
            slowEffect.apply(target);
        }
    },
    e: {
        name: "Inferno Shield",
        description: "Create a shield absorbing 200 damage for 4s. Enemies touching shield take 50% AD damage.",
        cooldown: 10,
        manaCost: 80,
        duration: 4,
        shieldAmount: (hero) => 200,
        damagePerSecond: (hero) => hero.attackDamage * 0.5
    },
    r: {
        name: "Meteor Storm",
        description: "Call down meteors on target area for 3s. Each impact deals 250% AP damage and stuns for 0.5s.",
        cooldown: 90,
        manaCost: 150,
        range: 800,
        radius: 300,
        damage: (hero) => hero.abilityPower * 2.5,
        stunDuration: 0.5,
        impactsPerSecond: 2
    }
};

// THAXUS - Off-Tank/Bruiser (Passive: Bloodlust, Q: Rend, E: War Cry, R: Rampage)
const THAXUS_ABILITIES = {
    passive: {
        name: "Bloodlust",
        description: "Attacks deal 15% bonus damage for each nearby enemy (max 3). Heal for 30% damage dealt.",
        effect: (hero, damage) => {
            const nearbyEnemies = Math.min(3, hero.nearbyEnemies || 0);
            hero.health = Math.min(hero.maxHealth, hero.health + (damage * 0.3));
        }
    },
    q: {
        name: "Rend",
        description: "Cleave forward, dealing 100% AD damage. If it hits 3+ enemies, cooldown resets.",
        cooldown: 5,
        manaCost: 40,
        damage: (hero) => hero.attackDamage * 1.0,
        hitReset: 3
    },
    e: {
        name: "War Cry",
        description: "Gain 30% movement speed and +40 AD for 4s. Team nearby also gains 15% speed.",
        cooldown: 12,
        manaCost: 70,
        duration: 4,
        damageBonus: 40,
        speedBonus: 0.3,
        teamSpeedBonus: 0.15
    },
    r: {
        name: "Rampage",
        description: "Enter rampage for 6s, gaining 50% AS and restoring 20 health per attack. Increases size by 20%.",
        cooldown: 100,
        manaCost: 120,
        duration: 6,
        attackSpeedBonus: 0.5,
        healthPerAttack: 20,
        sizeIncrease: 0.2
    }
};

// ALDRIN - Defensive Tank (Passive: Bastion, Q: Taunt, E: Fortify, R: Immovable)
const ALDRIN_ABILITIES = {
    passive: {
        name: "Bastion",
        description: "Reduce damage taken based on armor. For every 10 armor, reduce damage by additional 2%.",
        effect: (hero, incomingDamage) => {
            const armorDamageReduction = (hero.armor / 10) * 0.02;
            return incomingDamage * (1 - armorDamageReduction);
        }
    },
    q: {
        name: "Taunt",
        description: "Taunt target enemy for 1.5s, forcing them to auto-attack you. Take 20% less damage from taunted enemy.",
        cooldown: 11,
        manaCost: 60,
        range: 500,
        duration: 1.5
    },
    e: {
        name: "Fortify",
        description: "Become unmovable for 2s, gaining 40% damage reduction. Can still attack.",
        cooldown: 14,
        manaCost: 90,
        duration: 2,
        damageReduction: 0.4
    },
    r: {
        name: "Immovable",
        description: "Cannot be moved or displaced for 5s. Gain 60% damage reduction. Nearby allies gain half benefits.",
        cooldown: 120,
        manaCost: 180,
        duration: 5,
        damageReduction: 0.6,
        allyDamageReduction: 0.3
    }
};

// ALDRIN - Defender/Warden (Passive: Bastion, Q: Shieldwall, E: Counterblow, R: Fortification)
const ALDRIN_ABILITIES = {
    passive: {
        name: "Bastion",
        description: "Nearby enemies deal 20% less damage to you. Bonus increases to 40% if nearby allies present.",
        effect: (hero) => {
            hero.damageReductionAura = 0.2; // 20% damage reduction
        }
    },
    q: {
        name: "Shieldwall",
        description: "Create barrier absorbing 300 + 10% max health damage for 5s. Nearby enemies deal 30% less damage through barrier.",
        cooldown: 8,
        manaCost: 60,
        shieldAmount: (hero) => 300 + (hero.maxHealth * 0.1),
        duration: 5,
        damageReduction: 0.3
    },
    e: {
        name: "Counterblow",
        description: "Counter next attack within 3s, reflecting 50% damage back and slowing attacker 50% for 2s.",
        cooldown: 10,
        manaCost: 55,
        duration: 3,
        reflectPercent: 0.5,
        slowDuration: 2,
        slowMagnitude: 0.5
    },
    r: {
        name: "Fortification",
        description: "ULTIMATE: Protect team for 6s. You and nearby allies gain 40% damage reduction and move 20% faster. Recharge: 100s",
        cooldown: 100,
        manaCost: 160,
        duration: 6,
        damageReduction: 0.4,
        radius: 500,
        movementSpeedBonus: 0.2
    }
};

/**
 * RANGER HEROES - LYRIC, VOS, KESS
 */

// LYRIC - Marksman/Precision (Passive: Headshot, Q: Piercing Shot, E: Evasion, R: Snipe)
const LYRIC_ABILITIES = {
    passive: {
        name: "Headshot",
        description: "Every 3rd attack is a headshot, dealing 60% bonus damage. Cooldown resets per kill.",
        shotCounter: 0,
        effect: (hero) => {
            hero.shotCounter = (hero.shotCounter || 0) + 1;
            if (hero.shotCounter >= 3) {
                hero.shotCounter = 0;
                return 1.6; // 60% bonus damage
            }
            return 1.0;
        }
    },
    q: {
        name: "Piercing Shot",
        description: "Fire an arrow that pierces enemies, dealing 90% AD damage to each. Range +150%.",
        cooldown: 7,
        manaCost: 45,
        range: 1000,
        damage: (hero) => hero.attackDamage * 0.9,
        pierces: true
    },
    e: {
        name: "Evasion",
        description: "Dash backward, gaining 40% movement speed for 2s and dodge next attack.",
        cooldown: 8,
        manaCost: 55,
        duration: 2,
        movementSpeedBonus: 0.4,
        dodgesOne: true
    },
    r: {
        name: "Snipe",
        description: "Channel for 1.5s, then fire a devastating shot dealing 400% AD. Range 1500. Reveals enemy.",
        cooldown: 110,
        manaCost: 150,
        castTime: 1.5,
        range: 1500,
        damage: (hero) => hero.attackDamage * 4.0
    }
};

// VOS - Ranger/Trapper (Passive: Trap Detection, Q: Explosive Trap, E: Scatter Shot, R: Mine Field)
const VOS_ABILITIES = {
    passive: {
        name: "Trap Detection",
        description: "Detect enemy movement through walls. Traps deal 25% bonus damage.",
        effect: (hero) => {
            hero.trapDamageBonus = 1.25;
        }
    },
    q: {
        name: "Explosive Trap",
        description: "Place trap that explodes on enemy contact, dealing 120% AD damage in radius. Up to 3 traps.",
        cooldown: 6,
        manaCost: 50,
        charges: 3,
        damage: (hero) => hero.attackDamage * 1.2,
        radius: 250,
        duration: 60 // trap lasts 60 seconds
    },
    e: {
        name: "Scatter Shot",
        description: "Fire 5 arrows in cone pattern, each dealing 50% AD. Applies slow stacks.",
        cooldown: 9,
        manaCost: 70,
        damage: (hero) => hero.attackDamage * 0.5,
        projectiles: 5
    },
    r: {
        name: "Mine Field",
        description: "Create minefield covering 400 radius for 8s. Enemies take 200% AD damage on detonation, stunned 1s.",
        cooldown: 100,
        manaCost: 140,
        range: 600,
        radius: 400,
        damage: (hero) => hero.attackDamage * 2.0,
        duration: 8
    }
};

// KESS - Assassin/Burst (Passive: Ambush, Q: Shadowbolt, E: Blink, R: Death Mark)
const KESS_ABILITIES = {
    passive: {
        name: "Ambush",
        description: "First attack vs target deals 30% bonus damage. Bonus refreshes if not seen for 3s.",
        effect: (hero) => {
            return 1.3; // 30% bonus on first hit
        }
    },
    q: {
        name: "Shadowbolt",
        description: "Fire shadow projectile dealing 110% AD damage. Returns if it hits, dealing damage again.",
        cooldown: 5,
        manaCost: 45,
        damage: (hero) => hero.attackDamage * 1.1,
        returns: true
    },
    e: {
        name: "Blink",
        description: "Dash to target location, gaining 50% movement speed. Can pass through walls.",
        cooldown: 10,
        manaCost: 65,
        range: 350,
        movementSpeedBonus: 0.5,
        wallPhase: true
    },
    r: {
        name: "Death Mark",
        description: "Mark target for 6s. Attacks deal 35% bonus damage. Killing marked target resets cooldown.",
        cooldown: 80,
        manaCost: 120,
        range: 700,
        duration: 6,
        damageBonus: 0.35,
        cooldownReset: true
    }
};

/**
 * MAGE HEROES - EMBER, TALEN, ZEPHYR
 */

// EMBER - Control Mage (Passive: Ignite, Q: Fireball, E: Flame Wall, R: Inferno)
const EMBER_ABILITIES = {
    passive: {
        name: "Ignite",
        description: "Abilities apply burn, dealing 20% AP per second for 3s. Stacks up to 5 times.",
        effect: (hero, target) => {
            target.burnStacks = Math.min(5, (target.burnStacks || 0) + 1);
            target.addDoT(hero.abilityPower * 0.2, 3);
        }
    },
    q: {
        name: "Fireball",
        description: "Cast fireball dealing 150% AP damage in 250 radius. Slows by 40% for 2s.",
        cooldown: 4,
        manaCost: 50,
        range: 700,
        damage: (hero) => hero.abilityPower * 1.5,
        radius: 250,
        slowDuration: 2,
        slowPercent: 0.4
    },
    e: {
        name: "Flame Wall",
        description: "Create wall for 5s dealing 100% AP per second to enemies touching it.",
        cooldown: 12,
        manaCost: 85,
        range: 500,
        duration: 5,
        damagePerSecond: (hero) => hero.abilityPower * 1.0,
        width: 600,
        height: 150
    },
    r: {
        name: "Inferno",
        description: "Channel AOE fire for 3s, enemies in radius take 100% AP per second. Move freely.",
        cooldown: 90,
        manaCost: 150,
        radius: 400,
        duration: 3,
        damagePerSecond: (hero) => hero.abilityPower * 1.0,
        channeled: true
    }
};

// TALEN - Combo/Burst Mage (Passive: Spell Cascade, Q: Arcane Missile, E: Temporal Shift, R: Spell Overload)
const TALEN_ABILITIES = {
    passive: {
        name: "Spell Cascade",
        description: "Each ability cast increases next ability damage by 20% (stacks up to 3x). Resets after auto-attack.",
        cascadeStacks: 0,
        effect: (hero) => {
            hero.cascadeStacks = Math.min(3, (hero.cascadeStacks || 0) + 1);
            return 1 + (hero.cascadeStacks * 0.2);
        }
    },
    q: {
        name: "Arcane Missile",
        description: "Fire 3 missiles dealing 80% AP each. Each hit increases next Q damage by 25%.",
        cooldown: 3,
        manaCost: 40,
        damage: (hero) => hero.abilityPower * 0.8,
        projectiles: 3,
        damageIncrease: 0.25
    },
    e: {
        name: "Temporal Shift",
        description: "Teleport to location, gaining 50% attack speed for 3s. Enemies near exit take 120% AP damage.",
        cooldown: 11,
        manaCost: 75,
        range: 500,
        duration: 3,
        exitDamage: (hero) => hero.abilityPower * 1.2,
        attackSpeedBonus: 0.5
    },
    r: {
        name: "Spell Overload",
        description: "Next 3 abilities cost no mana and recharge 75% faster for 6s. Activates after 3 spell casts.",
        cooldown: 95,
        manaCost: 0,
        duration: 6,
        triggerAfter: 3,
        cooldownReduction: 0.75
    }
};

// ZEPHYR - Control/Utility Mage (Passive: Windburst, Q: Wind Gust, E: Cyclone, R: Tornado)
const ZEPHYR_ABILITIES = {
    passive: {
        name: "Windburst",
        description: "Abilities push enemies away. Pushed enemies take 15% bonus damage from next attack.",
        effect: (hero, target) => {
            target.pushback = 200;
            target.vulnerableToAttack = true;
        }
    },
    q: {
        name: "Wind Gust",
        description: "Push enemies away, dealing 100% AP damage and slowing by 50% for 1.5s.",
        cooldown: 6,
        manaCost: 50,
        range: 500,
        damage: (hero) => hero.abilityPower * 1.0,
        slowPercent: 0.5,
        pushDistance: 250
    },
    e: {
        name: "Cyclone",
        description: "Create rotating cyclone at location for 4s, pushing enemies away continuously.",
        cooldown: 13,
        manaCost: 90,
        range: 600,
        duration: 4,
        pushDistance: 150,
        radius: 300
    },
    r: {
        name: "Tornado",
        description: "Summon massive tornado moving in direction, knocking up all hit for 2s, dealing 300% AP damage.",
        cooldown: 105,
        manaCost: 160,
        range: 900,
        damage: (hero) => hero.abilityPower * 3.0,
        knockupDuration: 2,
        speed: 400
    }
};

/**
 * GUARDIAN HEROES - PETRA, KORA, KYRAX
 */

// PETRA - Healer/Support (Passive: Blessing, Q: Heal Burst, E: Protective Shield, R: Mass Heal)
const PETRA_ABILITIES = {
    passive: {
        name: "Blessing",
        description: "Heals grant targets 20% movement speed for 3s. Healing allies grants +5% cooldown reduction (stacks).",
        effect: (hero, target) => {
            target.speedBonus = 0.2;
            hero.cooldownReduction = Math.min(20, (hero.cooldownReduction || 0) + 5);
        }
    },
    q: {
        name: "Heal Burst",
        description: "Heal target ally for 200 + 100% AP. Nearby allies heal for 50%.",
        cooldown: 5,
        manaCost: 60,
        range: 700,
        healing: (hero) => 200 + (hero.abilityPower * 1.0),
        areaHealing: 0.5,
        radius: 300
    },
    e: {
        name: "Protective Shield",
        description: "Grant shield to target absorbing 150 + 80% AP damage for 4s. Shield+Heal=stronger effect.",
        cooldown: 10,
        manaCost: 75,
        range: 600,
        shieldAmount: (hero) => 150 + (hero.abilityPower * 0.8),
        duration: 4
    },
    r: {
        name: "Mass Heal",
        description: "Heal all team members for 300 + 120% AP. Also removes movement impairing effects.",
        cooldown: 100,
        manaCost: 180,
        healing: (hero) => 300 + (hero.abilityPower * 1.2),
        cleansesCC: true
    }
};

// KORA - Enabler/Buffer (Passive: Empowerment, Q: Boon, E: Rally, R: Heroism)
const KORA_ABILITIES = {
    passive: {
        name: "Empowerment",
        description: "Nearby allies gain +10% damage. Allies buffed by abilities gain additional +15% damage.",
        auraRadius: 400,
        auradamageBonus: 0.1,
        buffedDamageBonus: 0.15
    },
    q: {
        name: "Boon",
        description: "Grant ally +30% AS for 3s and next attack steals 30 health. Resets on kill.",
        cooldown: 7,
        manaCost: 50,
        range: 600,
        duration: 3,
        attackSpeedBonus: 0.3,
        lifeStealPerAttack: 30
    },
    e: {
        name: "Rally",
        description: "Boost team movement speed by 40% for 3s. Allies moving toward enemies get +30% damage.",
        cooldown: 12,
        manaCost: 85,
        duration: 3,
        speedBonus: 0.4,
        offensiveBonus: 0.3,
        radius: 800
    },
    r: {
        name: "Heroism",
        description: "Empower team for 5s: +50% damage, +25% speed, heal 5% max health per second.",
        cooldown: 120,
        manaCost: 200,
        duration: 5,
        damageBonus: 0.5,
        speedBonus: 0.25,
        healthRegenPercent: 0.05
    }
};

// KYRAX - Crowd Control/Disabler (Passive: Chain, Q: Shackle, E: Root, R: Lockdown)
const KYRAX_ABILITIES = {
    passive: {
        name: "Chain",
        description: "CC effects chain between nearby enemies (300 radius). Duration -25% on chained targets.",
        chainRadius: 300,
        durationReduction: 0.75
    },
    q: {
        name: "Shackle",
        description: "Stun target enemy for 1.2s, dealing 90% AP damage. Chains to nearby enemies.",
        cooldown: 8,
        manaCost: 65,
        range: 600,
        stunDuration: 1.2,
        damage: (hero) => hero.abilityPower * 0.9,
        chains: true
    },
    e: {
        name: "Root",
        description: "Root target for 2s, slowing by 60%. Allies can teleport to rooted enemy.",
        cooldown: 13,
        manaCost: 80,
        range: 500,
        duration: 2,
        slowPercent: 0.6,
        allyTeleport: true
    },
    r: {
        name: "Lockdown",
        description: "Disable target for 3s (can't move, attack, or use abilities). Nearby allies gain 40% damage vs disabled.",
        cooldown: 115,
        manaCost: 170,
        range: 700,
        duration: 3,
        damageBonus: 0.4
    }
};

/**
 * ROGUE HEROES - RAZE, VESPER, SILK
 */

// RAZE - Assassin/Burst (Passive: Executioner, Q: Backslash, E: Smokebomb, R: Execution)
const RAZE_ABILITIES = {
    passive: {
        name: "Executioner",
        description: "Attacks deal 30% bonus damage to enemies below 50% health. Killing blow triggers 50% cooldown reset.",
        lowHealthThreshold: 0.5,
        damageBonus: 0.3,
        killCooldownReset: 0.5
    },
    q: {
        name: "Backslash",
        description: "Backstab target dealing 140% AD damage. If hitting from behind, also stun 0.8s.",
        cooldown: 5,
        manaCost: 45,
        damage: (hero) => hero.attackDamage * 1.4,
        backStunDuration: 0.8,
        range: 350
    },
    e: {
        name: "Smokebomb",
        description: "Become invisible for 2s, gaining 60% movement speed. Attacks break invisibility.",
        cooldown: 11,
        manaCost: 70,
        duration: 2,
        speedBonus: 0.6,
        invisible: true
    },
    r: {
        name: "Execution",
        description: "Dash to target, dealing 200% AD damage. If target below 40% health, instantly kill.",
        cooldown: 85,
        manaCost: 130,
        range: 400,
        damage: (hero) => hero.attackDamage * 2.0,
        executionThreshold: 0.4
    }
};

// VESPER - Debuffer/Assassin (Passive: Marked, Q: Siphon, E: Void Step, R: Suppress)
const VESPER_ABILITIES = {
    passive: {
        name: "Marked",
        description: "Attacks mark target for 4s. Marked targets take +25% damage from Vesper. Stacks.",
        markDuration: 4,
        damageIncrease: 0.25
    },
    q: {
        name: "Siphon",
        description: "Drain target, dealing 100% AP per second for 1.5s, healing for 50% damage dealt.",
        cooldown: 6,
        manaCost: 55,
        range: 500,
        duration: 1.5,
        damagePerSecond: (hero) => hero.abilityPower * 1.0,
        lifesteal: 0.5,
        channeled: true
    },
    e: {
        name: "Void Step",
        description: "Dash through walls, leaving void trail for 3s that slows enemies by 50%.",
        cooldown: 10,
        manaCost: 60,
        range: 350,
        duration: 3,
        slowPercent: 0.5,
        wallPhase: true
    },
    r: {
        name: "Suppress",
        description: "Suppress target for 2s, dealing 80% AP per second. Suppressed can't be healed.",
        cooldown: 100,
        manaCost: 140,
        range: 600,
        duration: 2,
        damagePerSecond: (hero) => hero.abilityPower * 0.8,
        blocksHealing: true
    }
};

// SILK - Hybrid/Escape (Passive: Weaver, Q: Web, E: Strand, R: Cocoon)
const SILK_ABILITIES = {
    passive: {
        name: "Weaver",
        description: "Leave webs while moving (3s duration). Walk on webs for +30% speed. Webs reveal enemies nearby.",
        webDuration: 3,
        speedBonus: 0.3,
        webRadius: 250
    },
    q: {
        name: "Web",
        description: "Shoot web dealing 110% AD damage, rooting for 1.5s. Creates web at target location.",
        cooldown: 5,
        manaCost: 50,
        range: 650,
        damage: (hero) => hero.attackDamage * 1.1,
        rootDuration: 1.5,
        webDuration: 6
    },
    e: {
        name: "Strand",
        description: "Swing to target location on strand, gaining 50% movement speed for 2s.",
        cooldown: 9,
        manaCost: 65,
        range: 500,
        speedBonus: 0.5,
        duration: 2
    },
    r: {
        name: "Cocoon",
        description: "Wrap area in silk for 4s, blocking projectiles and slowing enemies by 70%.",
        cooldown: 110,
        manaCost: 165,
        range: 600,
        radius: 350,
        duration: 4,
        slowPercent: 0.7,
        blocksProjectiles: true
    }
};

/**
 * Ability Manager - Aggregates all hero abilities
 */
class HeroAbilitySystem {
    static HERO_ABILITIES = {
        "Grael": GRAEL_ABILITIES,
        "Thaxus": THAXUS_ABILITIES,
        "Aldrin": ALDRIN_ABILITIES,
        "Lyric": LYRIC_ABILITIES,
        "Vos": VOS_ABILITIES,
        "Kess": KESS_ABILITIES,
        "Ember": EMBER_ABILITIES,
        "Talen": TALEN_ABILITIES,
        "Zephyr": ZEPHYR_ABILITIES,
        "Petra": PETRA_ABILITIES,
        "Kora": KORA_ABILITIES,
        "Kyrax": KYRAX_ABILITIES,
        "Raze": RAZE_ABILITIES,
        "Vesper": VESPER_ABILITIES,
        "Silk": SILK_ABILITIES
    };

    static getHeroAbilities(heroName) {
        return this.HERO_ABILITIES[heroName] || null;
    }

    static executeAbility(hero, abilityKey, target = null, targetX = null, targetY = null, vfx = null) {
        const abilityData = hero.heroData.abilities[abilityKey];
        if (!abilityData) return false;

        const ability = hero.abilities[abilityKey];
        if (!ability.canUse()) return false;

        // Check mana
        const manaCost = abilityData.manaCost || 0;
        if (!hero.resources.consume(manaCost)) {
            console.warn(`Not enough mana for ${abilityData.name}`);
            return false;
        }

        // Use ability
        ability.use();

        // Execute ability effects
        this.applyAbilityEffects(hero, abilityKey, target, targetX, targetY, vfx);

        return true;
    }

    static applyAbilityEffects(hero, abilityKey, target, targetX, targetY, vfx = null) {
        const heroAbilities = this.HERO_ABILITIES[hero.name];
        if (!heroAbilities) return;

        const abilityData = heroAbilities[abilityKey];
        const ability = hero.abilities[abilityKey];

        // Apply specific hero ability mechanics
        switch (hero.name) {
            case "Grael":
                this.applyGraelAbility(hero, abilityKey, target, vfx);
                break;
            case "Thaxus":
                this.applyThaxusAbility(hero, abilityKey, target, vfx);
                break;
            case "Aldrin":
                this.applyAldrinAbility(hero, abilityKey, target, vfx);
                break;
            case "Lyric":
                this.applyLyricAbility(hero, abilityKey, target, vfx);
                break;
            case "Ember":
                this.applyEmberAbility(hero, abilityKey, target, targetX, targetY, vfx);
                break;
            // Add more as implemented
        }
    }

    // Ability implementations per hero
    static applyGraelAbility(hero, abilityKey, target, vfx = null) {
        const abilities = GRAEL_ABILITIES;

        switch (abilityKey) {
            case "q":
                if (target) {
                    const damage = abilities.q.damage(hero);
                    hero.dealDamage(target, damage, "ability");
                    const slowEffect = new AbilityEffect("slow", 2, 0.7);
                    slowEffect.apply(target);

                    // VFX
                    if (vfx) {
                        vfx.slash(hero.x, hero.y, target.x, target.y, "rgba(255, 80, 0, 0.8)");
                        vfx.damageNumber(target.x, target.y, Math.floor(damage), "#ff6b6b");
                    }
                }
                break;
            case "e":
                hero.shield = (hero.shield || 0) + abilities.e.shieldAmount(hero);
                if (vfx) vfx.shieldEffect(hero.x, hero.y);
                break;
            case "r":
                // Meteor storm - area damage
                if (target) {
                    const damage = abilities.r.damage(hero);
                    hero.dealDamage(target, damage, "ability");
                    const stunEffect = new AbilityEffect("stun", 0.5);
                    stunEffect.apply(target);

                    // VFX
                    if (vfx) {
                        vfx.explosion(target.x, target.y, abilities.r.radius);
                        vfx.stunEffect(target.x, target.y);
                        vfx.damageNumber(target.x, target.y, Math.floor(damage), "#ffaa00");
                    }
                }
                break;
        }
    }

    static applyLyricAbility(hero, abilityKey, target) {
        const abilities = LYRIC_ABILITIES;

        switch (abilityKey) {
            case "q":
                if (target) {
                    const damage = abilities.q.damage(hero) * (hero.shotCounter >= 3 ? 1.6 : 1.0);
                    hero.dealDamage(target, damage, "ability");
                    hero.shotCounter = (hero.shotCounter || 0) + 1;
                    if (hero.shotCounter >= 3) hero.shotCounter = 0;
                }
                break;
            case "e":
                hero.dodgeNextAttack = true;
                break;
            case "r":
                if (target) {
                    const damage = abilities.r.damage(hero);
                    hero.dealDamage(target, damage, "ability");
                }
                break;
        }
    }

    static applyEmberAbility(hero, abilityKey, target, targetX, targetY) {
        const abilities = EMBER_ABILITIES;

        switch (abilityKey) {
            case "q":
                if (target) {
                    const damage = abilities.q.damage(hero);
                    hero.dealDamage(target, damage, "ability");
                    const slowEffect = new AbilityEffect("slow", abilities.q.slowDuration, 0.6);
                    slowEffect.apply(target);
                    const burnEffect = new AbilityEffect("damage_over_time", 3, abilities.passive.effect(hero, target));
                    burnEffect.apply(target);
                }
                break;
            case "e":
                // Flame wall creation - create visual zone at targetX, targetY
                hero.activeEffects = hero.activeEffects || [];
                hero.activeEffects.push({
                    type: "flame_wall",
                    x: targetX,
                    y: targetY,
                    radius: abilities.e.width,
                    duration: abilities.e.duration,
                    damagePerSecond: abilities.e.damagePerSecond(hero)
                });
                break;
            case "r":
                // Inferno channeled ability
                hero.isChanneling = abilityKey;
                break;
        }
    }

    // ... More hero ability implementations follow same pattern

    static applyThaxusAbility(hero, abilityKey, target) {
        const abilities = THAXUS_ABILITIES;

        switch (abilityKey) {
            case "q":
                if (target) {
                    const damage = abilities.q.damage(hero);
                    hero.dealDamage(target, damage, "ability");
                    // Reset if hits 3+ enemies
                    const hitCount = hero.recentAbilityHits || 0;
                    if (hitCount >= abilities.q.hitReset) {
                        hero.abilities.q.cooldownRemaining = 0;
                    }
                }
                break;
            case "e":
                hero.warCryActive = true;
                hero.warCryDamageBonus = abilities.e.damageBonus;
                hero.warCrySpeedBonus = abilities.e.speedBonus;
                setTimeout(() => { hero.warCryActive = false; }, abilities.e.duration * 1000);
                break;
            case "r":
                hero.rampageMode = true;
                hero.rampageAttackSpeedBonus = abilities.r.attackSpeedBonus;
                setTimeout(() => { hero.rampageMode = false; }, abilities.r.duration * 1000);
                break;
        }
    }

    /**
     * ALDRIN - The Bastion (Defensive Warden)
     * Playstyle: Zone control, team protection, reducing damage
     * Difficulty: Easy - straightforward shield mechanics
     * Personality: Stoic defender - "The wall holds"
     */
    static applyAldrinAbility(hero, abilityKey, target, vfx = null) {
        const abilities = ALDRIN_ABILITIES;

        switch (abilityKey) {
            case "q":
                // Shieldwall - Create barrier absorbing damage
                hero.activeShield = hero.activeShield || {};
                hero.activeShield.shieldwall = {
                    amount: abilities.q.shieldAmount(hero),
                    duration: abilities.q.duration,
                    damageReduction: abilities.q.damageReduction,
                    elapsed: 0
                };

                if (vfx) {
                    vfx.shieldEffect(hero.x, hero.y);
                    vfx.burstEffect(hero.x, hero.y, "rgba(100, 200, 255, 0.6)", 20, 360, 0.8);
                }
                break;

            case "e":
                // Counterblow - Riposte next attack
                hero.counterBlowActive = true;
                hero.counterBlowData = {
                    duration: abilities.e.duration,
                    elapsed: 0,
                    reflectPercent: abilities.e.reflectPercent,
                    slowDuration: abilities.e.slowDuration,
                    slowMagnitude: abilities.e.slowMagnitude
                };

                if (vfx) {
                    vfx.shieldEffect(hero.x, hero.y);
                }
                break;

            case "r":
                // Fortification - Team-wide defense buff
                hero.fortificationActive = true;
                hero.fortificationData = {
                    duration: abilities.r.duration,
                    damageReduction: abilities.r.damageReduction,
                    radius: abilities.r.radius,
                    movementSpeedBonus: abilities.r.movementSpeedBonus,
                    elapsed: 0
                };

                if (vfx) {
                    vfx.burstEffect(hero.x, hero.y, "rgba(100, 200, 255, 0.8)", 30, 360, 1.2);
                    vfx.damageNumber(hero.x, hero.y - 50, "FORTIFIED", "#00d4ff");
                }
                break;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HeroAbilitySystem, AbilityEffect, EnhancedAbilityInstance, ResourcePool };
}
