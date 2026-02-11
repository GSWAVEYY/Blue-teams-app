/**
 * Hero System - Character definitions and progression
 * Fantasy PvP MOBA with 5 roles and 15 unique heroes
 */

const HERO_ROLE = {
    WARRIOR: "warrior",
    RANGER: "ranger",
    MAGE: "mage",
    GUARDIAN: "guardian",
    ROGUE: "rogue"
};

const HERO_DATA = {
    // ========== WARRIORS ==========
    GRAEL: {
        name: "Grael",
        role: HERO_ROLE.WARRIOR,
        title: "The Ironheart",
        lore: "A ancient warrior reborn, Grael commands flame and fury in battle. Once fell to darkness, now rises as protector.",
        color: "#ff4444",
        icon: "⚔",

        stats: {
            maxHealth: 650,
            armor: 35,
            speed: 5.0,
            attackDamage: 75,
            attackSpeed: 0.8,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Bloodthorn",
        secondaryWeapon: "Inferno Surge",

        abilities: {
            passive: {
                name: "Ironclad",
                description: "Every 3 attacks, next hit grants 30% damage reduction for 2s",
                icon: "🛡"
            },
            q: {
                name: "Dragon Slash",
                description: "Slash forward dealing 100 damage in cone. Enemies hit gain 25% slow for 2s.",
                cooldown: 6,
                cost: 0,
                icon: "⚔"
            },
            e: {
                name: "Inferno Shield",
                description: "Create protective barrier absorbing 200 damage for 4s. Nearby allies get 50% of shield value.",
                cooldown: 12,
                cost: 0,
                icon: "🔥"
            },
            r: {
                name: "Meteor Storm",
                description: "ULTIMATE: Call meteors in large area, dealing 250 damage and stunning for 1.5s. Recharge: 90s",
                cooldown: 90,
                cost: 0,
                icon: "☄"
            }
        },

        playstyle: "Tank/Initiator - Leads fights, absorbs damage, enables team",
        counters: ["Raze", "Vos"],
        synergies: ["Kora", "Ember"]
    },

    THAXUS: {
        name: "Thaxus",
        role: HERO_ROLE.WARRIOR,
        title: "The Berserker",
        lore: "Thaxus channels raw primal rage. The more he fights, the stronger he becomes. Dangerous when wounded.",
        color: "#ff6633",
        icon: "🔱",

        stats: {
            maxHealth: 700,
            armor: 25,
            speed: 5.5,
            attackDamage: 95,
            attackSpeed: 1.0,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Ravenclaw",
        secondaryWeapon: "Storm Nexus",

        abilities: {
            passive: {
                name: "Bloodlust",
                description: "Gain 3% attack damage for each enemy nearby (max 30%). Resets when out of combat.",
                icon: "🩸"
            },
            q: {
                name: "Whirlwind",
                description: "Spin rapidly hitting nearby enemies 5 times, 20 damage each. Movement speed +50% during spin.",
                cooldown: 8,
                cost: 0,
                icon: "🌪"
            },
            e: {
                name: "Execute",
                description: "Leap to target enemy, dealing 120 damage. If target below 40% health, deal 200 damage instead.",
                cooldown: 10,
                cost: 0,
                icon: "⚡"
            },
            r: {
                name: "Rampage",
                description: "ULTIMATE: Massive damage increase (100% bonus) for 8s. Each enemy kill extends duration by 2s. Recharge: 75s",
                cooldown: 75,
                cost: 0,
                icon: "🔥"
            }
        },

        playstyle: "Damage/Off-tank - High risk/reward, scales with aggression",
        counters: ["Aldrin", "Kora"],
        synergies: ["Raze", "Vesper"]
    },

    LYRIC: {
        name: "Lyric",
        role: HERO_ROLE.WARRIOR,
        title: "The Blade Dancer",
        lore: "Lyric defies warrior stereotypes with grace and precision. Every movement is a dance, every strike is a performance.",
        color: "#ff8844",
        icon: "✨",

        stats: {
            maxHealth: 580,
            armor: 20,
            speed: 6.2,
            attackDamage: 65,
            attackSpeed: 1.3,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Nightbane",
        secondaryWeapon: "Celestial Wrath",

        abilities: {
            passive: {
                name: "Rhythm",
                description: "Every 5th attack is empowered, dealing 150% damage and restoring 100 health.",
                icon: "🎵"
            },
            q: {
                name: "Swift Strike",
                description: "Dash forward through enemies, hitting up to 3 targets for 80 damage each. Can chain dashes (max 2).",
                cooldown: 7,
                cost: 0,
                icon: "💨"
            },
            e: {
                name: "Counterpose",
                description: "Dodge next attack within 2s, reflecting damage to attacker. Movement speed +40% for 1.5s.",
                cooldown: 9,
                cost: 0,
                icon: "🛡"
            },
            r: {
                name: "Dance of Blades",
                description: "ULTIMATE: Unleash flurry of attacks, hitting enemies 8 times rapidly (40 damage each). Untargetable during cast. Recharge: 85s",
                cooldown: 85,
                cost: 0,
                icon: "⚔"
            }
        },

        playstyle: "Mobility/Burst - High skill ceiling, excellent for outplays",
        counters: ["Petra", "Stormcaller"],
        synergies: ["Kess", "Vos"]
    },

    // ========== RANGERS ==========
    KESS: {
        name: "Kess",
        role: HERO_ROLE.RANGER,
        title: "The Beast Master",
        lore: "Kess hunts with primal instinct and summons creatures to aid her. The wilderness bends to her will.",
        color: "#44ff44",
        icon: "🐺",

        stats: {
            maxHealth: 480,
            armor: 15,
            speed: 5.8,
            attackDamage: 60,
            attackSpeed: 1.1,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Wildshot",
        secondaryWeapon: "Frostbow",

        abilities: {
            passive: {
                name: "Pack Hunting",
                description: "Gain 15% attack speed for each nearby ally. Summons gain same benefit.",
                icon: "🐾"
            },
            q: {
                name: "Summon Wolf",
                description: "Summon wolf ally lasting 8s. Wolves attack nearby enemies (30 damage). Max 2 wolves active.",
                cooldown: 5,
                cost: 0,
                icon: "🐺"
            },
            e: {
                name: "Primal Roar",
                description: "Roar in large radius, slowing enemies 40% and giving nearby allies 30% attack speed for 3s.",
                cooldown: 11,
                cost: 0,
                icon: "🗣"
            },
            r: {
                name: "Alpha Strike",
                description: "ULTIMATE: Summon alpha wolf joining next 3 attacks, each dealing 150 damage. Lasts 10s or until attacks used. Recharge: 80s",
                cooldown: 80,
                cost: 0,
                icon: "👑"
            }
        },

        playstyle: "Support/Summons - Teamfight presence with minions",
        counters: ["Kyrax", "Null Forge"],
        synergies: ["Grael", "Aldrin"]
    },

    VOS: {
        name: "Vos",
        role: HERO_ROLE.RANGER,
        title: "The Sharpshooter",
        lore: "Vos never misses. Cold precision, faster than thought. Every bullet finds its mark.",
        color: "#4444ff",
        icon: "🎯",

        stats: {
            maxHealth: 420,
            armor: 10,
            speed: 5.5,
            attackDamage: 85,
            attackSpeed: 0.95,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Shatterer",
        secondaryWeapon: "Deathwhisper",

        abilities: {
            passive: {
                name: "Steady Aim",
                description: "Each consecutive hit on same target increases damage by 10% (max 50%). Resets on target switch.",
                icon: "🔍"
            },
            q: {
                name: "Headshot",
                description: "Next attack deals 200% damage and applies 2s stun if hitting head region.",
                cooldown: 8,
                cost: 0,
                icon: "💥"
            },
            e: {
                name: "Tactical Reload",
                description: "Instantly reload all ammunition and gain 40% attack speed for 3s.",
                cooldown: 10,
                cost: 0,
                icon: "🔄"
            },
            r: {
                name: "Executioner",
                description: "ULTIMATE: Fire massive shot dealing 300 damage. If target below 30% health, instant kill. Otherwise applies 3s execute window. Recharge: 90s",
                cooldown: 90,
                cost: 0,
                icon: "💀"
            }
        },

        playstyle: "Precision/Burst - High risk high reward, requires aim",
        counters: ["Silk", "Raze"],
        synergies: ["Petra", "Bastion"]
    },

    TALEN: {
        name: "Talen",
        role: HERO_ROLE.RANGER,
        title: "The Swift Scout",
        lore: "Talen sees everything first. Speed and stealth are his weapons. Information is power.",
        color: "#44ccff",
        icon: "👁",

        stats: {
            maxHealth: 450,
            armor: 8,
            speed: 6.5,
            attackDamage: 55,
            attackSpeed: 1.2,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Stormcaller",
        secondaryWeapon: "Viper's Kiss",

        abilities: {
            passive: {
                name: "Scout",
                description: "Gain 20% movement speed. Enemies hit are revealed for 3s.",
                icon: "🗺"
            },
            q: {
                name: "Dash Strike",
                description: "Dash forward up to 2 targets, hitting each for 70 damage. Can chain up to 3 times before cooldown.",
                cooldown: 6,
                cost: 0,
                icon: "💨"
            },
            e: {
                name: "Recon",
                description: "Place vision ward revealing area for 60s. Can have 2 active. Allies see through wards.",
                cooldown: 12,
                cost: 0,
                icon: "👀"
            },
            r: {
                name: "Phantom Rush",
                description: "ULTIMATE: Become invisible and gain 100% movement speed for 5s. First hit breaks invisibility with 200% damage. Recharge: 75s",
                cooldown: 75,
                cost: 0,
                icon: "👻"
            }
        },

        playstyle: "Info/Mobility - Information advantage, roaming threat",
        counters: ["Cyrax", "Void Whisper"],
        synergies: ["Vos", "Kess"]
    },

    // ========== MAGES ==========
    ZEPHYR: {
        name: "Zephyr",
        role: HERO_ROLE.MAGE,
        title: "The Storm Sage",
        lore: "Zephyr commands lightning and wind. Every spell crackles with atmospheric power. Nature's fury given form.",
        color: "#ffff44",
        icon: "⚡",

        stats: {
            maxHealth: 500,
            armor: 12,
            speed: 5.0,
            attackDamage: 45,
            attackSpeed: 0.8,
            ability_power: 80,
            cooldownReduction: 10,
        },

        primaryWeapon: "Storm Nexus",
        secondaryWeapon: "Stormcaller",

        abilities: {
            passive: {
                name: "Overcharge",
                description: "Spells generate charges. At 3 charges, next spell hits nearby enemies and refunds 50% cooldown.",
                icon: "🔋"
            },
            q: {
                name: "Lightning Bolt",
                description: "Shoot bolt dealing 100 damage. Chains to up to 2 nearby enemies (50% damage each).",
                cooldown: 4,
                cost: 0,
                icon: "⚡"
            },
            e: {
                name: "Wind Barrier",
                description: "Create shield for self and 1 nearby ally (150 absorption). Slows enemies who hit shield 40%.",
                cooldown: 10,
                cost: 0,
                icon: "💨"
            },
            r: {
                name: "Tempest",
                description: "ULTIMATE: Massive storm in area dealing 200 damage and stunning all enemies for 1s. Allies gain immunity. Recharge: 80s",
                cooldown: 80,
                cost: 0,
                icon: "🌩"
            }
        },

        playstyle: "Teamfight/Control - AoE damage with defensive utility",
        counters: ["Petra", "Bastion"],
        synergies: ["Kora", "Aldrin"]
    },

    KYRAX: {
        name: "Kyrax",
        role: HERO_ROLE.MAGE,
        title: "The Void Weaver",
        lore: "Kyrax walks between realities, manipulating the void itself. Reality bends where chaos dwells.",
        color: "#aa44ff",
        icon: "🌀",

        stats: {
            maxHealth: 480,
            armor: 10,
            speed: 4.8,
            attackDamage: 40,
            attackSpeed: 0.75,
            ability_power: 95,
            cooldownReduction: 15,
        },

        primaryWeapon: "Void Whisper",
        secondaryWeapon: "Chaos Rend",

        abilities: {
            passive: {
                name: "Reality Fracture",
                description: "Enemies hit by spells take 15% increased damage from your next spell for 4s.",
                icon: "💔"
            },
            q: {
                name: "Void Sphere",
                description: "Throw sphere dealing 90 damage. Enemy hit silenced for 2s (can't use abilities).",
                cooldown: 5,
                cost: 0,
                icon: "⚫"
            },
            e: {
                name: "Void Step",
                description: "Teleport short distance, leaving behind damaging void zone (80 damage, lasts 3s).",
                cooldown: 9,
                cost: 0,
                icon: "🚀"
            },
            r: {
                name: "Annihilation",
                description: "ULTIMATE: Destroy enemy in area with 250 damage. If kills target, teleport to another enemy nearby. Recharge: 85s",
                cooldown: 85,
                cost: 0,
                icon: "💥"
            }
        },

        playstyle: "Control/Burst - Silencing crowd control, high burst",
        counters: ["Silk", "Ember"],
        synergies: ["Raze", "Vesper"]
    },

    EMBER: {
        name: "Ember",
        role: HERO_ROLE.MAGE,
        title: "The Pyromancer",
        lore: "Ember burns with eternal flame. Fire is her language, destruction her poetry. Beware her wrath.",
        color: "#ff3300",
        icon: "🔥",

        stats: {
            maxHealth: 520,
            armor: 14,
            speed: 5.1,
            attackDamage: 50,
            attackSpeed: 0.85,
            ability_power: 85,
            cooldownReduction: 12,
        },

        primaryWeapon: "Inferno Surge",
        secondaryWeapon: "Entropy Wave",

        abilities: {
            passive: {
                name: "Burnout",
                description: "Spells apply burn, dealing 30 damage per second for 4s. Stacks up to 3 times.",
                icon: "🔥"
            },
            q: {
                name: "Fireball",
                description: "Throw fireball dealing 110 damage in area. Burns enemies hit for 5s.",
                cooldown: 5,
                cost: 0,
                icon: "🔴"
            },
            e: {
                name: "Flame Shield",
                description: "Protect self absorbing 200 damage. Burning enemies who hit shield take 50 reflection damage.",
                cooldown: 11,
                cost: 0,
                icon: "🛡"
            },
            r: {
                name: "Inferno",
                description: "ULTIMATE: Ignite area with massive flames dealing 250 damage and applying 8s burn. Recharge: 82s",
                cooldown: 82,
                cost: 0,
                icon: "🌋"
            }
        },

        playstyle: "Damage/Persistence - DoT damage, burns enemies over time",
        counters: ["Kora", "Pulse Shaper"],
        synergies: ["Grael", "Thaxus"]
    },

    // ========== GUARDIANS ==========
    ALDRIN: {
        name: "Aldrin",
        role: HERO_ROLE.GUARDIAN,
        title: "The Paladin",
        lore: "Aldrin channels holy light to protect his allies. Guardian by oath, healer by nature. Light against darkness.",
        color: "#ffff99",
        icon: "✨",

        stats: {
            maxHealth: 750,
            armor: 40,
            speed: 4.5,
            attackDamage: 55,
            attackSpeed: 0.7,
            ability_power: 70,
            cooldownReduction: 20,
        },

        primaryWeapon: "Aegis Matrix",
        secondaryWeapon: "Celestial Wrath",

        abilities: {
            passive: {
                name: "Holy Protection",
                description: "Allies near you take 20% reduced damage. You heal for 50% of damage prevented.",
                icon: "⛪"
            },
            q: {
                name: "Holy Heal",
                description: "Heal target ally for 150 health. Nearby allies gain 75 healing.",
                cooldown: 6,
                cost: 0,
                icon: "💚"
            },
            e: {
                name: "Divine Guard",
                description: "Protect ally with shield (250 absorption) and grant 30% movement speed for 4s.",
                cooldown: 9,
                cost: 0,
                icon: "🛡"
            },
            r: {
                name: "Sanctuary",
                description: "ULTIMATE: Create safe zone healing all allies 200hp/s for 8s. Enemies in zone slowed 60%. Recharge: 90s",
                cooldown: 90,
                cost: 0,
                icon: "🏰"
            }
        },

        playstyle: "Support/Tank - Healer and protector, aura-based",
        counters: ["Kyrax", "Vos"],
        synergies: ["Kora", "Zephyr"]
    },

    PETRA: {
        name: "Petra",
        role: HERO_ROLE.GUARDIAN,
        title: "The Golem",
        lore: "Petra is living stone given consciousness. Immovable guardian, her body is fortress. Ancient and eternal.",
        color: "#999999",
        icon: "🗿",

        stats: {
            maxHealth: 850,
            armor: 50,
            speed: 4.0,
            attackDamage: 65,
            attackSpeed: 0.6,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Null Forge",
        secondaryWeapon: "Abyssal Mark",

        abilities: {
            passive: {
                name: "Stone Form",
                description: "Gain 1 armor for each nearby enemy. Max 5 armor from passive.",
                icon: "🪨"
            },
            q: {
                name: "Ground Slam",
                description: "Slam ground stunning nearby enemies 1.5s and dealing 80 damage.",
                cooldown: 7,
                cost: 0,
                icon: "💢"
            },
            e: {
                name: "Stone Wall",
                description: "Create wall blocking projectiles and slowing enemies 50% for 4s.",
                cooldown: 10,
                cost: 0,
                icon: "🧱"
            },
            r: {
                name: "Earthshaker",
                description: "ULTIMATE: Massive tremor stunning all enemies for 2s and dealing 200 damage. Recharge: 85s",
                cooldown: 85,
                cost: 0,
                icon: "⚡"
            }
        },

        playstyle: "Tank/Control - CC-heavy tank, crowd control specialist",
        counters: ["Lyric", "Talen"],
        synergies: ["Vos", "Grael"]
    },

    KORA: {
        name: "Kora",
        role: HERO_ROLE.GUARDIAN,
        title: "The Healer",
        lore: "Kora's wisdom spans millennia. She heals not just body but spirit. Ancient matriarch of life magic.",
        color: "#44ff99",
        icon: "🍃",

        stats: {
            maxHealth: 700,
            armor: 32,
            speed: 4.8,
            attackDamage: 45,
            attackSpeed: 0.8,
            ability_power: 90,
            cooldownReduction: 18,
        },

        primaryWeapon: "Ethereal Conduit",
        secondaryWeapon: "Pulse Shaper",

        abilities: {
            passive: {
                name: "Life Aura",
                description: "All nearby allies regenerate 30 health per second when not in combat.",
                icon: "💚"
            },
            q: {
                name: "Healing Wave",
                description: "Send wave healing target and allies in path for 120 health each.",
                cooldown: 5,
                cost: 0,
                icon: "〰"
            },
            e: {
                name: "Root",
                description: "Root enemy in place for 2s. Teammates gain 40% movement speed towards rooted enemy.",
                cooldown: 11,
                cost: 0,
                icon: "🌿"
            },
            r: {
                name: "Rebirth",
                description: "ULTIMATE: Revive all dead allies nearby with 300 health. Self-heal 400. Recharge: 100s",
                cooldown: 100,
                cost: 0,
                icon: "♻"
            }
        },

        playstyle: "Support/Healing - Primary healer, aura-based sustain",
        counters: ["Ember", "Kyrax"],
        synergies: ["Aldrin", "Petra"]
    },

    // ========== ROGUES ==========
    RAZE: {
        name: "Raze",
        role: HERO_ROLE.ROGUE,
        title: "The Reaper",
        lore: "Raze is swift destruction. In and out before enemies know what hit them. Death wears a smile.",
        color: "#ff1111",
        icon: "💀",

        stats: {
            maxHealth: 420,
            armor: 8,
            speed: 6.8,
            attackDamage: 90,
            attackSpeed: 1.1,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Voidfang",
        secondaryWeapon: "Deathwhisper",

        abilities: {
            passive: {
                name: "Shadow Dancer",
                description: "Gain 15% movement speed. After 3s out of combat, become partially invisible (60% opacity).",
                icon: "👻"
            },
            q: {
                name: "Backstab",
                description: "Jump behind target dealing 150 damage. If behind enemy, stun for 1s.",
                cooldown: 7,
                cost: 0,
                icon: "🗡"
            },
            e: {
                name: "Evade",
                description: "Dodge next attack and gain 80% movement speed for 2s. Immunity to CC.",
                cooldown: 8,
                cost: 0,
                icon: "💨"
            },
            r: {
                name: "Death Mark",
                description: "ULTIMATE: Mark enemy for death. All next hits deal 300% damage. Lasts 6s or until killed. Recharge: 75s",
                cooldown: 75,
                cost: 0,
                icon: "⚔"
            }
        },

        playstyle: "Assassin/Burst - One-shot potential, high skill",
        counters: ["Petra", "Kora"],
        synergies: ["Kyrax", "Vesper"]
    },

    VESPER: {
        name: "Vesper",
        role: HERO_ROLE.ROGUE,
        title: "The Twilight",
        lore: "Vesper dwells between day and night. Shadow and light dance at her fingertips. Neither here nor there.",
        color: "#9944ff",
        icon: "🌙",

        stats: {
            maxHealth: 450,
            armor: 6,
            speed: 6.6,
            attackDamage: 75,
            attackSpeed: 1.0,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Nightbane",
        secondaryWeapon: "Chaos Rend",

        abilities: {
            passive: {
                name: "Fade",
                description: "Take 30% reduced damage from ranged attacks. Can see enemies within 300 range even in fog of war.",
                icon: "🌫"
            },
            q: {
                name: "Shadow Clone",
                description: "Leave behind shadow clone lasting 4s. Enemies hit by clone take 80 damage and are confused.",
                cooldown: 6,
                cost: 0,
                icon: "👤"
            },
            e: {
                name: "Night Vision",
                description: "Gain true sight for 5s, seeing enemies through walls and stealth. Movement speed +30%.",
                cooldown: 10,
                cost: 0,
                icon: "👁"
            },
            r: {
                name: "Shadow Realm",
                description: "ULTIMATE: Step into shadow realm becoming untargetable for 4s. Nearby enemies slowed 80%. Recharge: 80s",
                cooldown: 80,
                cost: 0,
                icon: "⚫"
            }
        },

        playstyle: "Stealth/Confusion - Mind games, utility assassin",
        counters: ["Talen", "Zephyr"],
        synergies: ["Raze", "Kyrax"]
    },

    SILK: {
        name: "Silk",
        role: HERO_ROLE.ROGUE,
        title: "The Weaver",
        lore: "Silk weaves deadly traps and binds enemies in place. Patient hunter waiting for perfect moment.",
        color: "#ff99ff",
        icon: "🕸",

        stats: {
            maxHealth: 460,
            armor: 10,
            speed: 6.2,
            attackDamage: 70,
            attackSpeed: 0.95,
            ability_power: 0,
            cooldownReduction: 0,
        },

        primaryWeapon: "Ravenclaw",
        secondaryWeapon: "Void Whisper",

        abilities: {
            passive: {
                name: "Web",
                description: "Attacks apply web, slowing enemies 25%. Stacks up to 5. At 5 stacks, enemy immobilized for 2s.",
                icon: "🕸"
            },
            q: {
                name: "Snare",
                description: "Throw snare immobilizing target for 3s. Cannot be broken. Resets on kills.",
                cooldown: 8,
                cost: 0,
                icon: "🔗"
            },
            e: {
                name: "Web Shield",
                description: "Create web barrier absorbing 180 damage. Enemies who touch lose 50% movement speed.",
                cooldown: 10,
                cost: 0,
                icon: "🛡"
            },
            r: {
                name: "Cocoon",
                description: "ULTIMATE: Wrap target in cocoon immobilizing for 5s. Allies gain 50% movement speed near cocoon. Recharge: 85s",
                cooldown: 85,
                cost: 0,
                icon: "🔴"
            }
        },

        playstyle: "Control/Trapper - Immobilization specialist, setup master",
        counters: ["Lyric", "Kess"],
        synergies: ["Vos", "Petra"]
    }
};

/**
 * Hero Manager System
 */
class HeroManager {
    static getHero(heroName) {
        return HERO_DATA[heroName];
    }

    static getAllHeroes() {
        return Object.keys(HERO_DATA);
    }

    static getHeroesByRole(role) {
        return Object.keys(HERO_DATA).filter(heroName => {
            return HERO_DATA[heroName].role === role;
        });
    }

    static getHeroStats(heroName) {
        const hero = this.getHero(heroName);
        return hero ? hero.stats : null;
    }

    static getHeroAbilities(heroName) {
        const hero = this.getHero(heroName);
        return hero ? hero.abilities : null;
    }

    /**
     * Check if two heroes synergize
     */
    static hassynergy(hero1, hero2) {
        const h1 = this.getHero(hero1);
        const h2 = this.getHero(hero2);

        if (!h1 || !h2) return false;

        return h1.synergies.includes(hero2) || h2.synergies.includes(hero1);
    }

    /**
     * Check hero matchups
     */
    static isCountered(hero, againstHero) {
        const h = this.getHero(hero);
        return h ? h.counters.includes(againstHero) : false;
    }
}
