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
        abilities: [
            {
                id: "lockpick",
                name: "Lockpick",
                description: "Open locked doors",
                cooldown: 0,
                charges: 3
            },
            {
                id: "silentTakedown",
                name: "Silent Takedown",
                description: "Non-lethal takedown if behind guard",
                cooldown: 30,
                charges: 0
            },
            {
                id: "invisibleMovement",
                name: "Shadow Step",
                description: "Briefly become harder to detect",
                cooldown: 45,
                charges: 0
            }
        ],
        equipment: ["lockpicks", "sound dampener", "disguise"],
        startingAmmo: 60,
        startingHealth: 80
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
        abilities: [
            {
                id: "focusedAction",
                name: "Focused Action",
                description: "Complete objectives 80% faster",
                cooldown: 60,
                charges: 0
            },
            {
                id: "deviceControl",
                name: "Device Control",
                description: "Interact with electronic devices remotely",
                cooldown: 30,
                charges: 0
            },
            {
                id: "targetMarking",
                name: "Mark Target",
                description: "Mark guards for team visualization",
                cooldown: 0,
                charges: 0
            }
        ],
        equipment: ["tablet", "breaching charge", "emp device"],
        startingAmmo: 90,
        startingHealth: 100
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
        abilities: [
            {
                id: "revive",
                name: "Revive",
                description: "Bring down teammate back to action",
                cooldown: 60,
                charges: 0
            },
            {
                id: "resourceShare",
                name: "Share Ammo",
                description: "Give ammo or health to teammate",
                cooldown: 15,
                charges: 0
            },
            {
                id: "smokeScreen",
                name: "Smoke Grenade",
                description: "Deploy smoke for cover",
                cooldown: 45,
                charges: 3
            }
        ],
        equipment: ["medkit", "ammo pouch", "smoke grenades"],
        startingAmmo: 75,
        startingHealth: 110
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
        abilities: [
            {
                id: "adaptiveGear",
                name: "Adapt Gear",
                description: "Switch between specialist loadout roles",
                cooldown: 90,
                charges: 0
            },
            {
                id: "hacking",
                name: "Hack System",
                description: "Disable alarms and cameras",
                cooldown: 40,
                charges: 0
            },
            {
                id: "surveillance",
                name: "Drone Recon",
                description: "Scout area with mini-drone",
                cooldown: 60,
                charges: 2
            }
        ],
        equipment: ["hacking kit", "drone", "multi-tool"],
        startingAmmo: 80,
        startingHealth: 95
    }
};

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

    static getAbility(roleType, abilityId) {
        const role = ROLES[roleType];
        if (!role) return null;
        return role.abilities.find(a => a.id === abilityId);
    }
}
