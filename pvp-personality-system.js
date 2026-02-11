/**
 * NEXUS Personality System
 * Voice lines, narrative interactions, difficulty tooltips, and matchup narratives
 */

class VoiceLineManager {
    /**
     * All hero personality voice lines by ability
     */
    static VOICE_LINES = {
        // WARRIORS
        grael: {
            q: ["For honor!", "The blade finds its mark!", "Stand your ground!"],
            e: ["An unbreakable wall!", "We shall not yield!", "My armor is absolute!"],
            r: ["BURN, FOOLS!", "The dragon unleashes!", "Feel my wrath!"]
        },
        thaxus: {
            q: ["BLOOD AND THUNDER!", "Taste my fury!", "Smash!"],
            e: ["WHIRLWIND DEATH!", "I AM UNSTOPPABLE!", "Everything falls!"],
            r: ["YOU DARE CHALLENGE ME?!", "ULTIMATE CARNAGE!", "WITNESS TRUE POWER!"]
        },
        aldrin: {
            q: ["The bastion holds!", "Shielding my allies!", "Stand with me!"],
            e: ["Defensive position!", "Absorb the impact!", "My strength protects you!"],
            r: ["ALL FORTIFICATIONS ACTIVE!", "ABSOLUTE DEFENSE!", "Nothing breaks through!"]
        },

        // RANGERS
        lyric: {
            q: ["Precision strike!", "My aim is true!", "Bullseye!"],
            e: ["Executing maneuver!", "Master of the blade!", "Flawless technique!"],
            r: ["ULTIMATE MASTERY!", "The perfect shot!", "None can match my skill!"]
        },
        vos: {
            q: ["The trap is set!", "Ambush incoming!", "Hidden danger awaits!"],
            e: ["Tactical positioning!", "This will hurt!", "Predicted your move!"],
            r: ["MINEFIELD ACTIVATED!", "The ground itself rebels!", "Nowhere to run!"]
        },
        kess: {
            q: ["Shadows embrace me!", "Vanishing!", "Phase shift!"],
            e: ["BLADE RUSH!", "Lightning speed!", "Can't catch what you can't see!"],
            r: ["SPECTRAL FORM ACTIVATED!", "I am untouchable!", "Become one with shadows!"]
        },

        // MAGES
        ember: {
            q: ["Ignite!", "Burn it down!", "Feel the heat!"],
            e: ["Inferno spread!", "The flames take all!", "Everything burns!"],
            r: ["CATACLYSM!", "ULTIMATE CONFLAGRATION!", "All shall burn!"]
        },
        talen: {
            q: ["Spark flies!", "Chain reaction!", "Theory becomes reality!"],
            e: ["Cascade forming!", "Stacking power!", "Exponential growth!"],
            r: ["CONVERGENCE!", "All power at once!", "The cascade EXPLODES!"]
        },
        zephyr: {
            q: ["Wind rises!", "Gust of fate!", "Let the air move!"],
            e: ["Cyclone forming!", "Reality bends!", "Pressure mounts!"],
            r: ["TORNADO UNLEASHED!", "The sky itself attacks!", "No mercy from the wind!"]
        },

        // GUARDIANS
        petra: {
            q: ["Blessed healing!", "Light mends!", "Be whole again!"],
            e: ["Divine shield!", "Protection flows!", "I will not let you fall!"],
            r: ["MASS BLESSING!", "ALL ARE RESTORED!", "The light protects us!"]
        },
        kora: {
            q: ["Empower!", "Strength flows!", "Rise together!"],
            e: ["RALLY CRY!", "All are strengthened!", "Together we are mighty!"],
            r: ["HEROISM RISES!", "ULTIMATE EMPOWERMENT!", "We are INVINCIBLE!"]
        },
        kyrax: {
            q: ["Binding activated!", "Entangled!", "You cannot escape!"],
            e: ["Suppressed!", "Control achieved!", "Power subdued!"],
            r: ["COMPLETE LOCKDOWN!", "ULTIMATE CONTROL!", "All are bound!"]
        },

        // ROGUES
        raze: {
            q: ["Mark applied!", "Weakness found!", "Target acquired!"],
            e: ["EXECUTE STRIKE!", "Lightning quick!", "Lethal precision!"],
            r: ["ANNIHILATION!", "ULTIMATE EXECUTION!", "You are already dead!"]
        },
        vesper: {
            q: ["Life drains!", "Sustenance flows!", "I grow stronger!"],
            e: ["DRAIN PULSE!", "Feast begins!", "Power courses through me!"],
            r: ["FEAST SUPREME!", "ULTIMATE DRAIN!", "All life is mine!"]
        },
        silk: {
            q: ["Web shot!", "Sticky fate!", "Entangled!"],
            e: ["WEB SWING!", "High ground advantage!", "Threads bind!"],
            r: ["COCOON FORMS!", "ULTIMATE WEB!", "Trapped forever!"]
        }
    };

    /**
     * Get random voice line for hero and ability
     */
    static getVoiceLine(heroName, abilityKey) {
        const lines = this.VOICE_LINES[heroName.toLowerCase()];
        if (!lines || !lines[abilityKey]) return null;

        const lineArray = lines[abilityKey];
        return lineArray[Math.floor(Math.random() * lineArray.length)];
    }

    /**
     * Display voice line on screen
     */
    static displayVoiceLine(heroName, abilityKey, screenWidth, screenHeight) {
        const line = this.getVoiceLine(heroName, abilityKey);
        if (!line) return;

        // Add to UI manager's game feed
        if (window.uiManager) {
            uiManager.addFeedMessage(`${heroName}: "${line}"`, "ability");
        }
    }
}

/**
 * Matchup Matrix System
 * Displays hero synergies and counter relationships
 */
class MatchupSystem {
    /**
     * Hero relationship data from narrative framework
     */
    static RELATIONSHIPS = {
        grael: {
            allies: ["aldrin", "petra", "kora"],
            rivals: ["thaxus"],
            counters: ["raze", "kess"]
        },
        thaxus: {
            allies: ["raze", "vesper"],
            rivals: ["grael"],
            counters: ["aldrin", "kyrax"]
        },
        aldrin: {
            allies: ["grael", "kyrax", "petra"],
            rivals: ["thaxus"],
            counters: ["raze", "thaxus"]
        },
        lyric: {
            allies: ["zephyr", "kora", "ember"],
            rivals: [],
            counters: ["kyrax", "thaxus"]
        },
        vos: {
            allies: ["kyrax", "zephyr", "talen"],
            rivals: [],
            counters: ["raze", "kess"]
        },
        kess: {
            allies: ["vesper", "talen", "raze"],
            rivals: [],
            counters: ["grael", "aldrin"]
        },
        ember: {
            allies: ["lyric", "petra", "talen"],
            rivals: [],
            counters: ["zephyr", "petra"]
        },
        talen: {
            allies: ["vos", "kyrax", "zephyr"],
            rivals: [],
            counters: ["thaxus", "raze"]
        },
        zephyr: {
            allies: ["lyric", "vos", "talen"],
            rivals: [],
            counters: ["ember", "kess"]
        },
        petra: {
            allies: ["grael", "aldrin", "kora"],
            rivals: [],
            counters: ["raze", "vesper"]
        },
        kora: {
            allies: ["grael", "lyric", "petra"],
            rivals: [],
            counters: ["thaxus", "raze"]
        },
        kyrax: {
            allies: ["aldrin", "vos", "petra"],
            rivals: [],
            counters: ["thaxus", "kess"]
        },
        raze: {
            allies: ["thaxus", "kess", "vesper"],
            rivals: [],
            counters: ["aldrin", "petra"]
        },
        vesper: {
            allies: ["thaxus", "kess", "raze"],
            rivals: [],
            counters: ["petra", "grael"]
        },
        silk: {
            allies: ["vos", "kyrax", "zephyr"],
            rivals: [],
            counters: ["kess", "thaxus"]
        }
    };

    /**
     * Faction data
     */
    static FACTIONS = {
        grael: "Crimson Order",
        thaxus: "Crimson Order",
        aldrin: "Crimson Order",
        lyric: "Silver Covenant",
        vos: "Silver Covenant",
        kess: "Silver Covenant",
        ember: "Arcane Collective",
        talen: "Arcane Collective",
        zephyr: "Arcane Collective",
        petra: "Sanctuary",
        kora: "Sanctuary",
        kyrax: "Sanctuary",
        raze: "Void Collective",
        vesper: "Void Collective",
        silk: "Void Collective"
    };

    /**
     * Get matchup info between two heroes
     */
    static getMatchup(hero1, hero2) {
        const h1 = hero1.toLowerCase();
        const h2 = hero2.toLowerCase();

        const relationship = this.RELATIONSHIPS[h1];
        if (!relationship) return null;

        let type = "neutral";
        if (relationship.allies.includes(h2)) {
            type = "ally";
        } else if (relationship.counters.includes(h2)) {
            type = "counter";
        } else if (relationship.rivals.includes(h2)) {
            type = "rival";
        }

        return {
            type,
            bonus: type === "ally" ? 0.1 : (type === "counter" ? -0.1 : 0)
        };
    }

    /**
     * Get faction of hero
     */
    static getFaction(heroName) {
        return this.FACTIONS[heroName.toLowerCase()] || "Unknown";
    }

    /**
     * Get recommended teammates for hero
     */
    static getRecommendedTeammates(heroName) {
        const relationships = this.RELATIONSHIPS[heroName.toLowerCase()];
        return relationships ? relationships.allies : [];
    }

    /**
     * Get counter heroes for hero
     */
    static getCounterHeroes(heroName) {
        const relationships = this.RELATIONSHIPS[heroName.toLowerCase()];
        return relationships ? relationships.counters : [];
    }
}

/**
 * Hero Difficulty & Learning System
 */
class HeroDifficultySystem {
    /**
     * Difficulty ratings and learning tips for each hero
     */
    static HERO_PROFILES = {
        grael: {
            difficulty: "EASY",
            difficultyScore: 2,
            archetype: "Paladin",
            playstyle: "Defensive Tank",
            tips: [
                "Use Dragon Slash to initiate team fights",
                "Position defensively to protect allies",
                "Ultimate provides invulnerability—use it to tank burst damage",
                "Good starter hero for learning tankiness"
            ],
            strengths: ["High health", "Strong defense", "Team fight initiation"],
            weaknesses: ["Low mobility", "No burst damage", "Easy to kite"]
        },
        thaxus: {
            difficulty: "HARD",
            difficultyScore: 8,
            archetype: "Berserker",
            playstyle: "Aggressive Warrior",
            tips: [
                "Manage health carefully—high damage output comes with cost",
                "Use Whirlwind to maximize damage in team fights",
                "Position aggressively but retreat before health gets critical",
                "Requires prediction and map awareness"
            ],
            strengths: ["Massive damage", "Quick healing", "CC breaker"],
            weaknesses: ["Low tankiness", "Skill-dependent", "Easy to burst"]
        },
        aldrin: {
            difficulty: "MEDIUM",
            difficultyScore: 5,
            archetype: "Knight",
            playstyle: "Defensive Supporter",
            tips: [
                "Use Shieldwall to protect teammates",
                "Counterblow reflects damage—use vs burst damage",
                "Ultimate makes team unkillable in choke points",
                "Great for defensive team compositions"
            ],
            strengths: ["Team protection", "Damage reflection", "Ultimate coverage"],
            weaknesses: ["Requires team coordination", "Slow", "Item dependent"]
        },
        lyric: {
            difficulty: "EASY",
            difficultyScore: 3,
            archetype: "Duelist",
            playstyle: "Precision Damage Dealer",
            tips: [
                "Land Piercing Shot headshots for increased damage",
                "Use Riposte to dodge and counter incoming damage",
                "Ultimate provides guaranteed hit—good for setting up kills",
                "Practice aim for maximum effectiveness"
            ],
            strengths: ["Consistent damage", "Self-defense", "Range"],
            weaknesses: ["Skill shot dependent", "Medium range", "Fragile"]
        },
        vos: {
            difficulty: "HARD",
            difficultyScore: 7,
            archetype: "Trapper",
            playstyle: "Prediction & Control",
            tips: [
                "Place traps in enemy paths before fights",
                "Minefield ultimate requires map knowledge",
                "Damage scales with enemy mistakes—punish poor positioning",
                "Think like chess—place traps 10 seconds ahead"
            ],
            strengths: ["Zone control", "Prediction", "Area denial"],
            weaknesses: ["Trap-dependent", "Weak if camps clear", "Setup time needed"]
        },
        kess: {
            difficulty: "HARD",
            difficultyScore: 8,
            archetype: "Assassin",
            playstyle: "Burst & Escape",
            tips: [
                "Use Blade Rush to get in and out quickly",
                "Chain Q → E for maximum burst damage",
                "Ultimate allows escape from ganks—use to survive",
                "Requires map awareness to avoid being caught"
            ],
            strengths: ["Burst damage", "Mobility", "Escape ability"],
            weaknesses: ["Fragile", "No sustained damage", "Team fight weak"]
        },
        ember: {
            difficulty: "MEDIUM",
            difficultyScore: 4,
            archetype: "Elementalist",
            playstyle: "Area Damage",
            tips: [
                "Scorching Flames spreads to nearby enemies—group them first",
                "Inferno Burst largest damage—save for grouped enemies",
                "Ultimate for area denial in choke points",
                "Position away from direct combat"
            ],
            strengths: ["AOE damage", "Spread effect", "Zone control"],
            weaknesses: ["Positioning dependent", "Single target weak", "Range medium"]
        },
        talen: {
            difficulty: "HARD",
            difficultyScore: 9,
            archetype: "Battlemage",
            playstyle: "Stacking Power",
            tips: [
                "Stack Spell Cascade to maximize ultimate damage",
                "Chain abilities to build stacks efficiently",
                "Convergence is strongest when stacks are high—don't rush",
                "Coordinate with team for spell-casting rotation"
            ],
            strengths: ["Scaling damage", "No mana issues", "Ultimate burst"],
            weaknesses: ["Weak early game", "Requires setup", "Stack dependent"]
        },
        zephyr: {
            difficulty: "MEDIUM",
            difficultyScore: 5,
            archetype: "Elementalist",
            playstyle: "Control & Utility",
            tips: [
                "Use Cyclone to slow groups of enemies",
                "Ultimate stun is powerful—use when enemies grouped",
                "Passive applies vulnerability—leverage team damage",
                "Control team fight pace through slows"
            ],
            strengths: ["Utility", "Crowd control", "No resource issues"],
            weaknesses: ["Lower direct damage", "Medium range", "Positioning crucial"]
        },
        petra: {
            difficulty: "EASY",
            difficultyScore: 3,
            archetype: "Cleric",
            playstyle: "Support Healer",
            tips: [
                "Keep teammates in range for healing",
                "Use Protective Shield before burst damage",
                "Mass Heal provides CC cleanse—use vs stuns",
                "Great beginner support hero"
            ],
            strengths: ["Healing", "CC cleanse", "Team focused"],
            weaknesses: ["Low damage", "Requires positioning", "Mana management"]
        },
        kora: {
            difficulty: "MEDIUM",
            difficultyScore: 4,
            archetype: "Enchanter",
            playstyle: "Buff & Empower",
            tips: [
                "Stand near teammates to provide passive buff",
                "Use Rally to increase team mobility before fights",
                "Ultimate Heroism is most powerful buff—save for key moments",
                "Position to support multiple teammates"
            ],
            strengths: ["Team buffs", "Passive aura", "Scaling with team"],
            weaknesses: ["No damage", "Support dependent", "Item reliant"]
        },
        kyrax: {
            difficulty: "MEDIUM",
            difficultyScore: 6,
            archetype: "Enchanter",
            playstyle: "Crowd Control Chain",
            tips: [
                "Chain stuns to keep enemies immobilized",
                "Suppress locks high-value targets",
                "Ultimate guarantees control over area",
                "Requires target selection skill"
            ],
            strengths: ["Crowd control", "Disable power", "Utility"],
            weaknesses: ["No damage", "Chainable to one target", "Counter-heavy meta"]
        },
        raze: {
            difficulty: "HARD",
            difficultyScore: 9,
            archetype: "Assassin",
            playstyle: "Execution & Burst",
            tips: [
                "Mark priority targets before team fights",
                "Chain Q → E for massive burst on marked targets",
                "Ultimate execute mechanics—only use on targets near 50% HP",
                "Requires excellent target priority"
            ],
            strengths: ["Execute mechanic", "Burst damage", "Target deletion"],
            weaknesses: ["Requires low targets", "Risky gameplay", "Easily burst"]
        },
        vesper: {
            difficulty: "MEDIUM",
            difficultyScore: 5,
            archetype: "Warlock",
            playstyle: "Drain & Sustain",
            tips: [
                "Drain from enemy damage—position to maximize hits",
                "Lifetap provides sustain in prolonged fights",
                "Ultimate Feast heals massively—tank damage with healing",
                "Scales with team fights"
            ],
            strengths: ["Sustain through damage", "Drain healing", "Prolonged fight win"],
            weaknesses: ["Early game weak", "Requires enemy damage", "Burst weak"]
        },
        silk: {
            difficulty: "MEDIUM",
            difficultyScore: 6,
            archetype: "Trapper",
            playstyle: "Web Control",
            tips: [
                "Place web in rotation paths to slow enemies",
                "Use Strand for mobility and repositioning",
                "Cocoon ultimate traps enemies—use vs runners",
                "Control team fight through positioning"
            ],
            strengths: ["Web control", "Mobility", "Escape potential"],
            weaknesses: ["Web dependent", "Situational ultimate", "Medium damage"]
        }
    };

    /**
     * Get difficulty info for hero
     */
    static getHeroProfile(heroName) {
        return this.HERO_PROFILES[heroName.toLowerCase()];
    }

    /**
     * Get difficulty color code
     */
    static getDifficultyColor(difficulty) {
        switch (difficulty) {
            case "EASY": return "#4caf50";      // Green
            case "MEDIUM": return "#ff9800";    // Orange
            case "HARD": return "#f44336";      // Red
            default: return "#999999";
        }
    }

    /**
     * Get learning path recommendations
     */
    static getLearningPath() {
        const easyHeroes = Object.entries(this.HERO_PROFILES)
            .filter(([_, profile]) => profile.difficulty === "EASY")
            .map(([name, _]) => name);

        const mediumHeroes = Object.entries(this.HERO_PROFILES)
            .filter(([_, profile]) => profile.difficulty === "MEDIUM")
            .map(([name, _]) => name);

        const hardHeroes = Object.entries(this.HERO_PROFILES)
            .filter(([_, profile]) => profile.difficulty === "HARD")
            .map(([name, _]) => name);

        return {
            stage1: easyHeroes,
            stage2: mediumHeroes,
            stage3: hardHeroes,
            description: [
                "Stage 1 (EASY): Learn core mechanics with simple heroes",
                "Stage 2 (MEDIUM): Master positioning and resource management",
                "Stage 3 (HARD): Perfect macro play and prediction"
            ]
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VoiceLineManager, MatchupSystem, HeroDifficultySystem };
}
