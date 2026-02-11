/**
 * NEXUS Element System
 * Rock-paper-scissors damage type interactions for balanced counter-play
 */

const ELEMENT_TYPE = {
    SLASHING: "slashing",      // Sharp blades - weak to armor
    PIERCING: "piercing",      // Arrows/spears - ignore armor
    CRUSHING: "crushing",      // Hammers - breaks shields
    ARCANE: "arcane",          // Magic - ignores physical resistance
    FIRE: "fire",              // Burn damage - weak to frost
    FROST: "frost",            // Freeze - weak to fire
    POISON: "poison"           // DoT - weak to purge
};

const ELEMENT_EFFECTIVENESS = {
    // Slashing is weak against armor and shields
    [ELEMENT_TYPE.SLASHING]: {
        [ELEMENT_TYPE.CRUSHING]: 0.8,   // Crush counters slash
        [ELEMENT_TYPE.PIERCING]: 1.2    // Slash beats other physical
    },

    // Piercing ignores armor (bypasses defenses)
    [ELEMENT_TYPE.PIERCING]: {
        [ELEMENT_TYPE.CRUSHING]: 1.2,   // Pierce beats crush
        [ELEMENT_TYPE.SLASHING]: 0.8    // Crushed shields stop pierce
    },

    // Crushing is strong against shields
    [ELEMENT_TYPE.CRUSHING]: {
        [ELEMENT_TYPE.SLASHING]: 1.2,   // Crush beats slash
        [ELEMENT_TYPE.PIERCING]: 0.8    // Pierce beats crush
    },

    // Arcane bypasses all physical types
    [ELEMENT_TYPE.ARCANE]: {
        [ELEMENT_TYPE.SLASHING]: 1.1,
        [ELEMENT_TYPE.PIERCING]: 1.1,
        [ELEMENT_TYPE.CRUSHING]: 1.1,
        [ELEMENT_TYPE.POISON]: 0.9      // Poison resists magic
    },

    // Fire is weak to frost
    [ELEMENT_TYPE.FIRE]: {
        [ELEMENT_TYPE.FROST]: 0.6,      // Frost counters fire
        [ELEMENT_TYPE.FIRE]: 1.0,       // Fire neutral to fire
        [ELEMENT_TYPE.POISON]: 1.1      // Fire burns poison away
    },

    // Frost is weak to fire
    [ELEMENT_TYPE.FROST]: {
        [ELEMENT_TYPE.FIRE]: 0.6,       // Fire counters frost
        [ELEMENT_TYPE.FROST]: 1.0,      // Frost neutral to frost
        [ELEMENT_TYPE.ARCANE]: 1.2      // Arcane dispels frost
    },

    // Poison is weak to arcane/fire
    [ELEMENT_TYPE.POISON]: {
        [ELEMENT_TYPE.FIRE]: 0.6,       // Fire burns poison
        [ELEMENT_TYPE.ARCANE]: 0.7,     // Arcane purges poison
        [ELEMENT_TYPE.POISON]: 1.0      // Poison neutral to poison
    }
};

/**
 * Status Effect from weapon/element
 */
class WeaponEffect {
    constructor(type, magnitude, duration) {
        this.type = type; // burn, slow, stun, bleed, poison
        this.magnitude = magnitude; // damage/second or reduction percentage
        this.duration = duration; // seconds
    }

    apply(target) {
        const effect = new AbilityEffect(this.type, this.duration, this.magnitude);
        effect.apply(target);
    }
}

/**
 * Element System Manager
 */
class ElementSystem {
    /**
     * Calculate damage multiplier based on element matchup
     */
    static getElementalMultiplier(attackerElement, targetElement, targetArmor = 0) {
        // Base multiplier
        let multiplier = 1.0;

        // Check element interactions
        if (ELEMENT_EFFECTIVENESS[attackerElement]) {
            const interactions = ELEMENT_EFFECTIVENESS[attackerElement];
            if (interactions[targetElement]) {
                multiplier = interactions[targetElement];
            }
        }

        // Armor reduction varies by element
        let armorReduction = 1.0;
        switch (attackerElement) {
            case ELEMENT_TYPE.SLASHING:
                armorReduction = 0.8 + (targetArmor / 1000); // Armor helps
                break;
            case ELEMENT_TYPE.PIERCING:
                armorReduction = 0.5; // Ignore most armor
                break;
            case ELEMENT_TYPE.CRUSHING:
                armorReduction = 0.9; // Armor helps slightly
                break;
            case ELEMENT_TYPE.ARCANE:
                armorReduction = 1.0; // Ignore all armor
                break;
            case ELEMENT_TYPE.FIRE:
            case ELEMENT_TYPE.FROST:
            case ELEMENT_TYPE.POISON:
                armorReduction = 1.0; // Magic ignores armor
                break;
        }

        return multiplier * armorReduction;
    }

    /**
     * Get element color for VFX
     */
    static getElementColor(element) {
        const colors = {
            [ELEMENT_TYPE.SLASHING]: "rgba(255, 100, 100, 0.8)",    // Red
            [ELEMENT_TYPE.PIERCING]: "rgba(200, 200, 255, 0.8)",    // Light blue
            [ELEMENT_TYPE.CRUSHING]: "rgba(139, 69, 19, 0.8)",      // Brown
            [ELEMENT_TYPE.ARCANE]: "rgba(200, 100, 255, 0.8)",      // Purple
            [ELEMENT_TYPE.FIRE]: "rgba(255, 150, 0, 0.8)",          // Orange
            [ELEMENT_TYPE.FROST]: "rgba(100, 200, 255, 0.8)",       // Cyan
            [ELEMENT_TYPE.POISON]: "rgba(100, 255, 100, 0.8)"       // Green
        };
        return colors[element] || "rgba(255, 255, 255, 0.8)";
    }

    /**
     * Check if element is physical (affected by armor)
     */
    static isPhysical(element) {
        return [ELEMENT_TYPE.SLASHING, ELEMENT_TYPE.PIERCING, ELEMENT_TYPE.CRUSHING].includes(element);
    }

    /**
     * Check if element is magical (ignores armor)
     */
    static isMagical(element) {
        return [ELEMENT_TYPE.ARCANE, ELEMENT_TYPE.FIRE, ELEMENT_TYPE.FROST, ELEMENT_TYPE.POISON].includes(element);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ElementSystem, WeaponEffect, ELEMENT_TYPE, ELEMENT_EFFECTIVENESS };
}
