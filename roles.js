/**
 * Role System with Ability Integration
 * Defines role archetypes with stats and abilities
 */

const ROLES = {
    INFILTRATOR: {
        name: "Infiltrator",
        color: "#00ff88",
        symbol: "◇",
        description: "Stealth specialist. Master of lockpicking and silent takedowns.",
        stats: {
            speed: 1.2,
            crouchSpeed: 1.8,
            visibility: 0.8,
            noiseReduction: 0.9,
            interactionSpeed: 1.3,
            detectionTime: 60
        },
        equipment: ["lockpicks", "sound dampener", "disguise"],
        startingAmmo: 60,
        startingHealth: 80,
        createAbilities: () => [
            new Lockpick(),
            new SilentTakedown(),
            new ShadowStep()
        ]
    },

    OPERATOR: {
        name: "Operator",
        color: "#64a8ff",
        symbol: "◆",
        description: "Tactical coordinator. Fast interactions and objective execution.",
        stats: {
            speed: 1.0,
            crouchSpeed: 1.5,
            visibility: 1.0,
            noiseReduction: 1.0,
            interactionSpeed: 1.8,
            detectionTime: 45
        },
        equipment: ["tablet", "breaching charge", "emp device"],
        startingAmmo: 90,
        startingHealth: 100,
        createAbilities: () => [
            new FocusedAction(),
            new DeviceControl(),
            new TargetMarking()
        ]
    },

    SUPPORT: {
        name: "Support",
        color: "#ffa502",
        symbol: "◎",
        description: "Team assistant. Revives teammates and manages resources.",
        stats: {
            speed: 0.9,
            crouchSpeed: 1.3,
            visibility: 1.1,
            noiseReduction: 1.0,
            interactionSpeed: 1.2,
            detectionTime: 50
        },
        equipment: ["medkit", "ammo pouch", "smoke grenades"],
        startingAmmo: 75,
        startingHealth: 110,
        createAbilities: () => [
            new Revive(),
            new ResourceShare(),
            new SmokeGrenade()
        ]
    },

    SPECIALIST: {
        name: "Specialist",
        color: "#c14eca",
        symbol: "◈",
        description: "Hybrid operative. Balanced abilities with adaptive tactics.",
        stats: {
            speed: 1.0,
            crouchSpeed: 1.5,
            visibility: 0.95,
            noiseReduction: 0.95,
            interactionSpeed: 1.4,
            detectionTime: 50
        },
        equipment: ["hacking kit", "drone", "multi-tool"],
        startingAmmo: 80,
        startingHealth: 95,
        createAbilities: () => [
            new AdaptiveGear(),
            new HackSystem(),
            new DroneRecon()
        ]
    }
};

/**
 * Role System - Centralized role management
 */
class RoleSystem {
    static getRole(roleType) {
        return ROLES[roleType] || ROLES.SPECIALIST;
    }

    static getAllRoles() {
        return Object.keys(ROLES);
    }

    static applyRoleStats(character, role) {
        character.roleStats = role.stats;
        character.role = role;
    }

    static createAbilitiesForRole(roleType) {
        const role = this.getRole(roleType);
        if (!role || !role.createAbilities) return [];
        return role.createAbilities();
    }

    static getAbility(roleType, abilityId) {
        const abilities = this.createAbilitiesForRole(roleType);
        return abilities.find(a => a.id === abilityId);
    }

    static getRoleStats(roleType) {
        const role = this.getRole(roleType);
        return role ? role.stats : {};
    }

    static getRoleEquipment(roleType) {
        const role = this.getRole(roleType);
        return role ? role.equipment : [];
    }
}
