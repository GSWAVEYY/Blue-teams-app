/**
 * NEXUS Weapon Database
 * Comprehensive weapon definitions for all 15 heroes
 * Each weapon has unique damage type, scaling, attack speed, and special effects
 */

const ATTACK_TYPE = {
    HITSCAN: "hitscan",         // Instant hit (melee, hitscan guns)
    PROJECTILE: "projectile",   // Traveling projectile
    MELEE: "melee"              // Close range instant
};

const WEAPON_CATEGORY = {
    MELEE: "melee",
    RANGED: "ranged",
    MAGIC: "magic"
};

/**
 * Weapon Template
 */
class Weapon {
    constructor(name, category, attackType, element, damageBase, damageScaling, attackSpeed, effects = {}) {
        this.name = name;
        this.category = category;
        this.attackType = attackType;
        this.element = element;

        // Damage calculation: baseDamage + (stat * scaling%)
        this.damageBase = damageBase;
        this.damageScaling = damageScaling; // { ad: 0.8, ap: 0.3, health: 0.05 }

        // Attack speed affects cooldown between attacks
        this.attackSpeed = attackSpeed; // 1.0 = 1 attack/sec, 2.0 = 2 attacks/sec
        this.range = effects.range || 100;
        this.projectileSpeed = effects.projectileSpeed || 500;

        // Special effects
        this.effectType = effects.effectType || null; // burn, slow, stun, etc
        this.effectMagnitude = effects.effectMagnitude || 0;
        this.effectDuration = effects.effectDuration || 0;

        // Ammo-free (MOBA model - cooldown based)
        this.maxAmmo = -1; // -1 = infinite
        this.ammo = -1;
    }

    calculateDamage(hero) {
        let damage = this.damageBase;

        // Apply stat scaling
        if (this.damageScaling.ad) damage += hero.attackDamage * this.damageScaling.ad;
        if (this.damageScaling.ap) damage += hero.abilityPower * this.damageScaling.ap;
        if (this.damageScaling.health) damage += hero.maxHealth * this.damageScaling.health;
        if (this.damageScaling.armor) damage += hero.armor * this.damageScaling.armor;

        return Math.floor(damage);
    }

    getAttackCooldown() {
        return 1 / this.attackSpeed; // seconds between attacks
    }
}

/**
 * WARRIOR WEAPONS
 */

const GRAEL_PRIMARY = new Weapon(
    "Bloodthorn",                      // Melee sword
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.SLASHING,
    60,                                 // Base damage
    { ad: 0.9, ap: 0, health: 0.05 },  // 90% AD scaling + 5% health
    1.0,                                // 1 attack per second
    { range: 80, effectType: "bleed", effectMagnitude: 15, effectDuration: 3 }
);

const GRAEL_SECONDARY = new Weapon(
    "Inferno Lance",
    WEAPON_CATEGORY.RANGED,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.FIRE,
    45,
    { ad: 0.6, ap: 0.4 },
    0.8,
    { range: 400, projectileSpeed: 600, effectType: "burn", effectMagnitude: 10, effectDuration: 4 }
);

const THAXUS_PRIMARY = new Weapon(
    "Bloodreaver",
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.CRUSHING,
    70,
    { ad: 1.0, health: 0.08 },
    1.2,
    { range: 100, effectType: "stun", effectMagnitude: 0, effectDuration: 0.5 }
);

const THAXUS_SECONDARY = new Weapon(
    "War Horn",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    40,
    { ad: 0.3, ap: 0.7 },
    0.9,
    { range: 500, projectileSpeed: 700 }
);

const ALDRIN_PRIMARY = new Weapon(
    "Shieldbreaker",
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.CRUSHING,
    55,
    { ad: 0.7, armor: 0.15 },
    0.8,
    { range: 120, effectMagnitude: 0 }
);

const ALDRIN_SECONDARY = new Weapon(
    "Holy Wrath",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    35,
    { ap: 0.9 },
    0.7,
    { range: 600, projectileSpeed: 550 }
);

/**
 * RANGER WEAPONS
 */

const LYRIC_PRIMARY = new Weapon(
    "Precision Bow",
    WEAPON_CATEGORY.RANGED,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.PIERCING,
    50,
    { ad: 1.1 },
    1.3,
    { range: 700, projectileSpeed: 800, effectMagnitude: 0 }
);

const LYRIC_SECONDARY = new Weapon(
    "Arcane Arrows",
    WEAPON_CATEGORY.RANGED,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    40,
    { ad: 0.5, ap: 0.8 },
    1.0,
    { range: 650, projectileSpeed: 750 }
);

const VOS_PRIMARY = new Weapon(
    "Trap Launcher",
    WEAPON_CATEGORY.RANGED,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.PIERCING,
    35,
    { ad: 0.8 },
    1.5,
    { range: 600, projectileSpeed: 600 }
);

const VOS_SECONDARY = new Weapon(
    "Poison Blowgun",
    WEAPON_CATEGORY.RANGED,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.POISON,
    25,
    { ad: 0.3, ap: 0.5 },
    2.0,
    { range: 500, projectileSpeed: 800, effectType: "poison", effectMagnitude: 8, effectDuration: 5 }
);

const KESS_PRIMARY = new Weapon(
    "Shadowblade",
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.PIERCING,
    65,
    { ad: 1.0 },
    1.4,
    { range: 90 }
);

const KESS_SECONDARY = new Weapon(
    "Void Spike",
    WEAPON_CATEGORY.RANGED,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    45,
    { ad: 0.5, ap: 0.6 },
    1.1,
    { range: 550, projectileSpeed: 700 }
);

/**
 * MAGE WEAPONS
 */

const EMBER_PRIMARY = new Weapon(
    "Flame Wand",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.FIRE,
    40,
    { ap: 1.0 },
    1.0,
    { range: 500, projectileSpeed: 600, effectType: "burn", effectMagnitude: 12, effectDuration: 4 }
);

const EMBER_SECONDARY = new Weapon(
    "Inferno Orb",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.FIRE,
    55,
    { ap: 1.2, ad: 0.2 },
    0.6,
    { range: 400, projectileSpeed: 500 }
);

const TALEN_PRIMARY = new Weapon(
    "Arcane Grimoire",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    45,
    { ap: 0.9 },
    1.2,
    { range: 600, projectileSpeed: 700 }
);

const TALEN_SECONDARY = new Weapon(
    "Mana Bolt",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    35,
    { ap: 0.7 },
    1.5,
    { range: 550, projectileSpeed: 800 }
);

const ZEPHYR_PRIMARY = new Weapon(
    "Wind Staff",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    40,
    { ap: 0.8 },
    1.0,
    { range: 500, projectileSpeed: 600 }
);

const ZEPHYR_SECONDARY = new Weapon(
    "Frost Shard",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.FROST,
    45,
    { ap: 0.9 },
    0.9,
    { range: 450, projectileSpeed: 650, effectType: "slow", effectMagnitude: 0.5, effectDuration: 3 }
);

/**
 * GUARDIAN WEAPONS
 */

const PETRA_PRIMARY = new Weapon(
    "Holy Mace",
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.CRUSHING,
    50,
    { ap: 0.6, armor: 0.1 },
    0.9,
    { range: 100 }
);

const PETRA_SECONDARY = new Weapon(
    "Healing Light",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    30,
    { ap: 0.7 },
    0.8,
    { range: 600, projectileSpeed: 500 }
);

const KORA_PRIMARY = new Weapon(
    "Empowerment Blade",
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.ARCANE,
    55,
    { ad: 0.7, ap: 0.4 },
    1.0,
    { range: 100 }
);

const KORA_SECONDARY = new Weapon(
    "Blessing Orb",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    35,
    { ap: 0.8 },
    0.7,
    { range: 550, projectileSpeed: 500 }
);

const KYRAX_PRIMARY = new Weapon(
    "Chain Whip",
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.SLASHING,
    45,
    { ad: 0.7 },
    1.1,
    { range: 120, effectType: "stun", effectMagnitude: 0, effectDuration: 0.3 }
);

const KYRAX_SECONDARY = new Weapon(
    "Binding Hex",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    40,
    { ap: 0.9 },
    0.8,
    { range: 500, projectileSpeed: 600 }
);

/**
 * ROGUE WEAPONS
 */

const RAZE_PRIMARY = new Weapon(
    "Assassin Daggers",
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.PIERCING,
    70,
    { ad: 1.1 },
    1.5,
    { range: 80 }
);

const RAZE_SECONDARY = new Weapon(
    "Poison Shank",
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.POISON,
    50,
    { ad: 0.7 },
    1.3,
    { range: 85, effectType: "poison", effectMagnitude: 15, effectDuration: 4 }
);

const VESPER_PRIMARY = new Weapon(
    "Shadow Claw",
    WEAPON_CATEGORY.MELEE,
    ATTACK_TYPE.MELEE,
    ELEMENT_TYPE.PIERCING,
    60,
    { ad: 0.9, ap: 0.3 },
    1.2,
    { range: 90 }
);

const VESPER_SECONDARY = new Weapon(
    "Void Drain",
    WEAPON_CATEGORY.MAGIC,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    45,
    { ap: 0.8 },
    0.9,
    { range: 500, projectileSpeed: 600 }
);

const SILK_PRIMARY = new Weapon(
    "Silk Spinner",
    WEAPON_CATEGORY.RANGED,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.SLASHING,
    40,
    { ad: 0.8 },
    1.1,
    { range: 600, projectileSpeed: 650 }
);

const SILK_SECONDARY = new Weapon(
    "Sticky Web",
    WEAPON_CATEGORY.RANGED,
    ATTACK_TYPE.PROJECTILE,
    ELEMENT_TYPE.ARCANE,
    30,
    { ap: 0.5 },
    1.0,
    { range: 550, projectileSpeed: 550, effectType: "slow", effectMagnitude: 0.6, effectDuration: 3 }
);

/**
 * Weapon Manager
 */
class WeaponDatabase {
    static WEAPONS = {
        // Warriors
        "Bloodthorn": GRAEL_PRIMARY,
        "Inferno Lance": GRAEL_SECONDARY,
        "Bloodreaver": THAXUS_PRIMARY,
        "War Horn": THAXUS_SECONDARY,
        "Shieldbreaker": ALDRIN_PRIMARY,
        "Holy Wrath": ALDRIN_SECONDARY,

        // Rangers
        "Precision Bow": LYRIC_PRIMARY,
        "Arcane Arrows": LYRIC_SECONDARY,
        "Trap Launcher": VOS_PRIMARY,
        "Poison Blowgun": VOS_SECONDARY,
        "Shadowblade": KESS_PRIMARY,
        "Void Spike": KESS_SECONDARY,

        // Mages
        "Flame Wand": EMBER_PRIMARY,
        "Inferno Orb": EMBER_SECONDARY,
        "Arcane Grimoire": TALEN_PRIMARY,
        "Mana Bolt": TALEN_SECONDARY,
        "Wind Staff": ZEPHYR_PRIMARY,
        "Frost Shard": ZEPHYR_SECONDARY,

        // Guardians
        "Holy Mace": PETRA_PRIMARY,
        "Healing Light": PETRA_SECONDARY,
        "Empowerment Blade": KORA_PRIMARY,
        "Blessing Orb": KORA_SECONDARY,
        "Chain Whip": KYRAX_PRIMARY,
        "Binding Hex": KYRAX_SECONDARY,

        // Rogues
        "Assassin Daggers": RAZE_PRIMARY,
        "Poison Shank": RAZE_SECONDARY,
        "Shadow Claw": VESPER_PRIMARY,
        "Void Drain": VESPER_SECONDARY,
        "Silk Spinner": SILK_PRIMARY,
        "Sticky Web": SILK_SECONDARY
    };

    static getWeapon(weaponName) {
        return this.WEAPONS[weaponName] || null;
    }

    static getWeaponsByCategory(category) {
        return Object.values(this.WEAPONS).filter(w => w.category === category);
    }

    static getAllWeapons() {
        return Object.values(this.WEAPONS);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeaponDatabase, Weapon, ATTACK_TYPE, WEAPON_CATEGORY };
}
