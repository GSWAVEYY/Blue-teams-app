/**
 * NEXUS Cosmetics System
 * Skins, emotes, weapon skins, and cosmetics management
 */

class CosmeticsManager {
    /**
     * All hero skins organized by hero
     */
    static HERO_SKINS = {
        // WARRIORS
        grael: {
            default: {
                name: "Paladin",
                rarity: "default",
                colors: { primary: "#D4A574", secondary: "#FFFFFF", accent: "#0066CC" },
                description: "Classic Paladin of Ironhold",
                owned: true,
                cost: 0
            },
            obsidian: {
                name: "Obsidian Warden",
                rarity: "epic",
                colors: { primary: "#2A2A2A", secondary: "#A020F0", accent: "#C0C0C0" },
                description: "Corrupted dark variant",
                owned: false,
                cost: 1350
            },
            celestial: {
                name: "Celestial Guardian",
                rarity: "legendary",
                colors: { primary: "#FFFFFF", secondary: "#FFD700", accent: "#00D4FF" },
                description: "Heavenly light manifestation",
                owned: false,
                cost: 1820
            },
            deepforge: {
                name: "Deepforge Sentinel",
                rarity: "epic",
                colors: { primary: "#1A7F7E", secondary: "#8B6914", accent: "#00FF00" },
                description: "Abyssal technology fusion",
                owned: false,
                cost: 1350
            },
            crimson: {
                name: "Crimson Tyrant",
                rarity: "epic",
                colors: { primary: "#8B0000", secondary: "#FFD700", accent: "#2A2A2A" },
                description: "Battle-hardened warlord",
                owned: false,
                cost: 1350
            }
        },
        thaxus: {
            default: {
                name: "Barbarian",
                rarity: "default",
                colors: { primary: "#8B0000", secondary: "#2A2A2A", accent: "#8B4513" },
                description: "Barbarian of the Wastes",
                owned: true,
                cost: 0
            },
            frost: {
                name: "Frost Giant",
                rarity: "epic",
                colors: { primary: "#E0FFFF", secondary: "#00BFFF", accent: "#00FFFF" },
                description: "Icy tundra warrior",
                owned: false,
                cost: 1350
            },
            infernal: {
                name: "Infernal Ravager",
                rarity: "legendary",
                colors: { primary: "#FF4500", secondary: "#FFD700", accent: "#2A2A2A" },
                description: "Demonic flame beast",
                owned: false,
                cost: 1820
            },
            void: {
                name: "Void Reaver",
                rarity: "epic",
                colors: { primary: "#4B0082", secondary: "#2A2A2A", accent: "#00FF00" },
                description: "Otherworldly predator",
                owned: false,
                cost: 1350
            },
            viking: {
                name: "Viking Warlord",
                rarity: "epic",
                colors: { primary: "#C0C0C0", secondary: "#00BFFF", accent: "#8B4513" },
                description: "Norse raider legend",
                owned: false,
                cost: 1350
            }
        },
        aldrin: {
            default: {
                name: "Knight",
                rarity: "default",
                colors: { primary: "#C0C0C0", secondary: "#00BFFF", accent: "#FFFFFF" },
                description: "Knight of Disciplined Power",
                owned: true,
                cost: 0
            },
            iron: {
                name: "Iron Sentinel",
                rarity: "epic",
                colors: { primary: "#808080", secondary: "#2A2A2A", accent: "#C0C0C0" },
                description: "Mechanical fortress knight",
                owned: false,
                cost: 1350
            },
            starlight: {
                name: "Starlight Protector",
                rarity: "legendary",
                colors: { primary: "#FFFFFF", secondary: "#FFD700", accent: "#00FFFF" },
                description: "Cosmic guardian manifestation",
                owned: false,
                cost: 1820
            },
            plague: {
                name: "Plague Doctor",
                rarity: "epic",
                colors: { primary: "#228B22", secondary: "#808080", accent: "#9932CC" },
                description: "Corrupted healer knight",
                owned: false,
                cost: 1350
            },
            temple: {
                name: "Temple Guardian",
                rarity: "epic",
                colors: { primary: "#FFD700", secondary: "#FFFFFF", accent: "#8B4513" },
                description: "Ancient monastery warrior",
                owned: false,
                cost: 1350
            }
        },

        // RANGERS
        lyric: {
            default: {
                name: "Archer",
                rarity: "default",
                colors: { primary: "#C0C0C0", secondary: "#FFFFFF", accent: "#228B22" },
                description: "Precision Archer",
                owned: true,
                cost: 0
            },
            sniper: {
                name: "Sniper Elite",
                rarity: "epic",
                colors: { primary: "#2A2A2A", secondary: "#808080", accent: "#FF0000" },
                description: "High-tech tactical operative",
                owned: false,
                cost: 1350
            },
            celestial: {
                name: "Celestial Marksman",
                rarity: "legendary",
                colors: { primary: "#FFFFFF", secondary: "#FFD700", accent: "#00BFFF" },
                description: "Heavenly precision archer",
                owned: false,
                cost: 1820
            },
            shadow: {
                name: "Shadow Assassin",
                rarity: "epic",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#808080" },
                description: "Cloak of darkness ranger",
                owned: false,
                cost: 1350
            },
            pirate: {
                name: "Pirate Captain",
                rarity: "epic",
                colors: { primary: "#8B4513", secondary: "#D2B48C", accent: "#FFD700" },
                description: "Swashbuckling adventurer",
                owned: false,
                cost: 1350
            }
        },
        vos: {
            default: {
                name: "Trapper",
                rarity: "default",
                colors: { primary: "#808080", secondary: "#228B22", accent: "#8B4513" },
                description: "Strategic Trap Master",
                owned: true,
                cost: 0
            },
            scientist: {
                name: "Mad Scientist",
                rarity: "epic",
                colors: { primary: "#FFFFFF", secondary: "#9932CC", accent: "#00FF00" },
                description: "Experimental gadget inventor",
                owned: false,
                cost: 1350
            },
            steampunk: {
                name: "Steampunk Engineer",
                rarity: "legendary",
                colors: { primary: "#CD853F", secondary: "#8B4513", accent: "#D2B48C" },
                description: "Clockwork mechanism master",
                owned: false,
                cost: 1820
            },
            void: {
                name: "Void Architect",
                rarity: "epic",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#00FF00" },
                description: "Otherworldly trap constructor",
                owned: false,
                cost: 1350
            },
            tinkerer: {
                name: "Rogue Tinkerer",
                rarity: "epic",
                colors: { primary: "#A0522D", secondary: "#8B4513", accent: "#D2B48C" },
                description: "Jury-rigged equipment specialist",
                owned: false,
                cost: 1350
            }
        },
        kess: {
            default: {
                name: "Phantom",
                rarity: "default",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#00FFFF" },
                description: "Shadow Dancer",
                owned: true,
                cost: 0
            },
            neon: {
                name: "Neon Specter",
                rarity: "epic",
                colors: { primary: "#FF00FF", secondary: "#2A2A2A", accent: "#00FF00" },
                description: "Retro-futuristic phantom",
                owned: false,
                cost: 1350
            },
            empress: {
                name: "Shadow Empress",
                rarity: "legendary",
                colors: { primary: "#FFD700", secondary: "#2A2A2A", accent: "#9932CC" },
                description: "Royal phantom of darkness",
                owned: false,
                cost: 1820
            },
            fox: {
                name: "Spirit Fox",
                rarity: "epic",
                colors: { primary: "#FF6347", secondary: "#2A2A2A", accent: "#00BFFF" },
                description: "Kitsune-inspired spirit",
                owned: false,
                cost: 1350
            },
            thief: {
                name: "Midnight Thief",
                rarity: "epic",
                colors: { primary: "#2A2A2A", secondary: "#808080", accent: "#C0C0C0" },
                description: "Classic master burglar",
                owned: false,
                cost: 1350
            }
        },

        // MAGES
        ember: {
            default: {
                name: "Elementalist",
                rarity: "default",
                colors: { primary: "#FF8C00", secondary: "#FF0000", accent: "#FFD700" },
                description: "Flame Dancer",
                owned: true,
                cost: 0
            },
            solar: {
                name: "Solar Ascendant",
                rarity: "legendary",
                colors: { primary: "#FFFF00", secondary: "#FFFFFF", accent: "#FFD700" },
                description: "Sun-like radiant appearance",
                owned: false,
                cost: 1820
            },
            infernal: {
                name: "Infernal Witch",
                rarity: "epic",
                colors: { primary: "#FF0000", secondary: "#2A2A2A", accent: "#9932CC" },
                description: "Demonic fire magic",
                owned: false,
                cost: 1350
            },
            phoenix: {
                name: "Phoenix Reborn",
                rarity: "epic",
                colors: { primary: "#FFD700", secondary: "#FF0000", accent: "#00BFFF" },
                description: "Phoenix flame resurrection",
                owned: false,
                cost: 1350
            },
            forgemaster: {
                name: "Forgemaster",
                rarity: "epic",
                colors: { primary: "#FF0000", secondary: "#8B4513", accent: "#2A2A2A" },
                description: "Lava and molten metal mage",
                owned: false,
                cost: 1350
            }
        },
        talen: {
            default: {
                name: "Theorist",
                rarity: "default",
                colors: { primary: "#00BFFF", secondary: "#9932CC", accent: "#FFFFFF" },
                description: "Brilliant Theorist",
                owned: true,
                cost: 0
            },
            scholar: {
                name: "Void Scholar",
                rarity: "legendary",
                colors: { primary: "#2A2A2A", secondary: "#9932CC", accent: "#00FF00" },
                description: "Interdimensional knowledge seeker",
                owned: false,
                cost: 1820
            },
            artificer: {
                name: "Artificer",
                rarity: "epic",
                colors: { primary: "#FFFFFF", secondary: "#00BFFF", accent: "#C0C0C0" },
                description: "Magical technology master",
                owned: false,
                cost: 1350
            },
            timekeeper: {
                name: "Time Keeper",
                rarity: "epic",
                colors: { primary: "#FFD700", secondary: "#FFFFFF", accent: "#00BFFF" },
                description: "Temporal magic specialist",
                owned: false,
                cost: 1350
            },
            chaos: {
                name: "Chaos Mage",
                rarity: "epic",
                colors: { primary: "#FF0000", secondary: "#9932CC", accent: "#2A2A2A" },
                description: "Uncontrolled chaotic magic",
                owned: false,
                cost: 1350
            }
        },
        zephyr: {
            default: {
                name: "Weaver",
                rarity: "default",
                colors: { primary: "#00FFFF", secondary: "#FFFFFF", accent: "#00BFFF" },
                description: "Graceful Air Dancer",
                owned: true,
                cost: 0
            },
            storm: {
                name: "Storm Herald",
                rarity: "legendary",
                colors: { primary: "#808080", secondary: "#FFFFFF", accent: "#00BFFF" },
                description: "Thunderstorm embodiment",
                owned: false,
                cost: 1820
            },
            goddess: {
                name: "Sky Goddess",
                rarity: "epic",
                colors: { primary: "#FFFFFF", secondary: "#FFD700", accent: "#00FFFF" },
                description: "Heavenly sky deity",
                owned: false,
                cost: 1350
            },
            shaman: {
                name: "Arctic Shaman",
                rarity: "epic",
                colors: { primary: "#FFFFFF", secondary: "#00BFFF", accent: "#C0C0C0" },
                description: "Frozen wind magic specialist",
                owned: false,
                cost: 1350
            },
            tornado: {
                name: "Tornado Dancer",
                rarity: "epic",
                colors: { primary: "#008080", secondary: "#808080", accent: "#FFFFFF" },
                description: "Chaotic wind force",
                owned: false,
                cost: 1350
            }
        },

        // GUARDIANS
        petra: {
            default: {
                name: "Cleric",
                rarity: "default",
                colors: { primary: "#FFFFFF", secondary: "#FFD700", accent: "#90EE90" },
                description: "Sacred Cleric",
                owned: true,
                cost: 0
            },
            nature: {
                name: "Nature's Blessing",
                rarity: "epic",
                colors: { primary: "#228B22", secondary: "#8B4513", accent: "#FFD700" },
                description: "Forest healer",
                owned: false,
                cost: 1350
            },
            divine: {
                name: "Divine Light",
                rarity: "legendary",
                colors: { primary: "#FFFFFF", secondary: "#FFD700", accent: "#00FFFF" },
                description: "Angelic divine appearance",
                owned: false,
                cost: 1820
            },
            lunar: {
                name: "Lunar Priestess",
                rarity: "epic",
                colors: { primary: "#C0C0C0", secondary: "#00BFFF", accent: "#9932CC" },
                description: "Moon-blessed healer",
                owned: false,
                cost: 1350
            },
            ocean: {
                name: "Ocean Priestess",
                rarity: "epic",
                colors: { primary: "#008080", secondary: "#FFFFFF", accent: "#00BFFF" },
                description: "Water-blessed support",
                owned: false,
                cost: 1350
            }
        },
        kora: {
            default: {
                name: "Empowerer",
                rarity: "default",
                colors: { primary: "#FFD700", secondary: "#228B22", accent: "#FFFFFF" },
                description: "Champion of Unity",
                owned: true,
                cost: 0
            },
            chief: {
                name: "War Chief",
                rarity: "epic",
                colors: { primary: "#8B0000", secondary: "#FFD700", accent: "#2A2A2A" },
                description: "Battle commander",
                owned: false,
                cost: 1350
            },
            guardian: {
                name: "Star Guardian",
                rarity: "legendary",
                colors: { primary: "#FFFFFF", secondary: "#FFD700", accent: "#00BFFF" },
                description: "Celestial protector",
                owned: false,
                cost: 1820
            },
            pride: {
                name: "Nature's Pride",
                rarity: "epic",
                colors: { primary: "#228B22", secondary: "#FFD700", accent: "#8B4513" },
                description: "Forest champion",
                owned: false,
                cost: 1350
            },
            ascendant: {
                name: "Void Ascendant",
                rarity: "epic",
                colors: { primary: "#9932CC", secondary: "#FFD700", accent: "#2A2A2A" },
                description: "Void-powered empowerer",
                owned: false,
                cost: 1350
            }
        },
        kyrax: {
            default: {
                name: "Controller",
                rarity: "default",
                colors: { primary: "#008080", secondary: "#808080", accent: "#00BFFF" },
                description: "Binding Enforcer",
                owned: true,
                cost: 0
            },
            warden: {
                name: "Iron Warden",
                rarity: "epic",
                colors: { primary: "#2A2A2A", secondary: "#808080", accent: "#FF0000" },
                description: "Prison keeper",
                owned: false,
                cost: 1350
            },
            keeper: {
                name: "Void Keeper",
                rarity: "legendary",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#008080" },
                description: "Dimensional restraint master",
                owned: false,
                cost: 1820
            },
            frostbinder: {
                name: "Frost Binder",
                rarity: "epic",
                colors: { primary: "#FFFFFF", secondary: "#00BFFF", accent: "#C0C0C0" },
                description: "Ice control magic",
                owned: false,
                cost: 1350
            },
            shadow: {
                name: "Shadow Restraint",
                rarity: "epic",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#808080" },
                description: "Darkness binding control",
                owned: false,
                cost: 1350
            }
        },

        // ROGUES
        raze: {
            default: {
                name: "Executioner",
                rarity: "default",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#FF0000" },
                description: "Lethal Striker",
                owned: true,
                cost: 0
            },
            reaper: {
                name: "Reaper",
                rarity: "legendary",
                colors: { primary: "#2A2A2A", secondary: "#808080", accent: "#00FF00" },
                description: "Grim reaper incarnate",
                owned: false,
                cost: 1820
            },
            crimson: {
                name: "Crimson Killer",
                rarity: "epic",
                colors: { primary: "#FF0000", secondary: "#2A2A2A", accent: "#FFD700" },
                description: "Blood knight warrior",
                owned: false,
                cost: 1350
            },
            phantom: {
                name: "Phantom Blade",
                rarity: "epic",
                colors: { primary: "#2A2A2A", secondary: "#808080", accent: "#9932CC" },
                description: "Shadow assassin",
                owned: false,
                cost: 1350
            },
            void: {
                name: "Void Reaper",
                rarity: "epic",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#00FF00" },
                description: "Cosmic executioner",
                owned: false,
                cost: 1350
            }
        },
        vesper: {
            default: {
                name: "Warlock",
                rarity: "default",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#90EE90" },
                description: "Lifesap Specialist",
                owned: true,
                cost: 0
            },
            vampire: {
                name: "Vampire Lord",
                rarity: "legendary",
                colors: { primary: "#FF0000", secondary: "#2A2A2A", accent: "#FFD700" },
                description: "Classic gothic vampire",
                owned: false,
                cost: 1820
            },
            plague: {
                name: "Plague Doctor",
                rarity: "epic",
                colors: { primary: "#228B22", secondary: "#808080", accent: "#9932CC" },
                description: "Disease magic specialist",
                owned: false,
                cost: 1350
            },
            drinker: {
                name: "Void Drinker",
                rarity: "epic",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#FFFFFF" },
                description: "Cosmic vampire",
                owned: false,
                cost: 1350
            },
            curse: {
                name: "Curse Weaver",
                rarity: "epic",
                colors: { primary: "#2A2A2A", secondary: "#9932CC", accent: "#808080" },
                description: "Curse magic master",
                owned: false,
                cost: 1350
            }
        },
        silk: {
            default: {
                name: "Weaver",
                rarity: "default",
                colors: { primary: "#FFB6C1", secondary: "#C0C0C0", accent: "#9932CC" },
                description: "Silken Strategist",
                owned: true,
                cost: 0
            },
            queen: {
                name: "Spider Queen",
                rarity: "legendary",
                colors: { primary: "#FFD700", secondary: "#FFB6C1", accent: "#2A2A2A" },
                description: "Arachnid royalty",
                owned: false,
                cost: 1820
            },
            merchant: {
                name: "Silk Merchant",
                rarity: "epic",
                colors: { primary: "#9932CC", secondary: "#FFD700", accent: "#C0C0C0" },
                description: "Trade and commerce specialist",
                owned: false,
                cost: 1350
            },
            spinner: {
                name: "Void Spinner",
                rarity: "epic",
                colors: { primary: "#9932CC", secondary: "#2A2A2A", accent: "#228B22" },
                description: "Cosmic web spinner",
                owned: false,
                cost: 1350
            },
            lace: {
                name: "Shadowlace",
                rarity: "epic",
                colors: { primary: "#2A2A2A", secondary: "#808080", accent: "#9932CC" },
                description: "Shadow weaver",
                owned: false,
                cost: 1350
            }
        }
    };

    /**
     * Emotes for all heroes (4 per hero)
     */
    static HERO_EMOTES = {
        grael: {
            honorable: { name: "Honorable Victory", type: "victory", rarity: "common", cost: 0, owned: true },
            dragon: { name: "Dragon Dance", type: "dance", rarity: "rare", cost: 400, owned: false },
            challenge: { name: "Honorable Challenge", type: "taunt", rarity: "rare", cost: 400, owned: false },
            meditation: { name: "Paladin Meditation", type: "idle", rarity: "common", cost: 200, owned: false }
        },
        thaxus: {
            aggressive: { name: "Aggressive Roar", type: "victory", rarity: "common", cost: 0, owned: true },
            power: { name: "Power Dance", type: "dance", rarity: "rare", cost: 400, owned: false },
            taunt: { name: "Berserker Taunt", type: "taunt", rarity: "rare", cost: 400, owned: false },
            beat: { name: "War Beat", type: "idle", rarity: "common", cost: 200, owned: false }
        },
        // ... Additional emotes for remaining heroes follow same pattern
    };

    /**
     * Get all skins for a hero
     */
    static getHeroSkins(heroName) {
        return this.HERO_SKINS[heroName.toLowerCase()] || {};
    }

    /**
     * Get specific skin details
     */
    static getSkinDetails(heroName, skinKey) {
        const skins = this.getHeroSkins(heroName);
        return skins[skinKey] || null;
    }

    /**
     * Get all owned skins for a hero
     */
    static getOwnedSkins(heroName) {
        const skins = this.getHeroSkins(heroName);
        return Object.entries(skins)
            .filter(([_, skin]) => skin.owned)
            .map(([key, skin]) => ({ key, ...skin }));
    }

    /**
     * Get all purchasable skins for a hero
     */
    static getPurchasableSkins(heroName) {
        const skins = this.getHeroSkins(heroName);
        return Object.entries(skins)
            .filter(([_, skin]) => !skin.owned)
            .map(([key, skin]) => ({ key, ...skin }));
    }

    /**
     * Purchase a skin (deduct LP and mark as owned)
     */
    static purchaseSkin(heroName, skinKey, playerLP) {
        const skin = this.getSkinDetails(heroName, skinKey);
        if (!skin || skin.owned) return false;
        if (playerLP < skin.cost) return false;

        // Mark as owned (in real implementation, save to database)
        skin.owned = true;
        return { success: true, lpRemaining: playerLP - skin.cost };
    }

    /**
     * Get rarity color
     */
    static getRarityColor(rarity) {
        const colors = {
            default: "#999999",
            common: "#FFFFFF",
            rare: "#0099FF",
            epic: "#9933FF",
            legendary: "#FFD700",
            ultimate: "#FF00FF"
        };
        return colors[rarity] || "#999999";
    }

    /**
     * Get rarity order
     */
    static getRarityValue(rarity) {
        const values = {
            default: 0,
            common: 1,
            rare: 2,
            epic: 3,
            legendary: 4,
            ultimate: 5
        };
        return values[rarity] || 0;
    }

    /**
     * Sort skins by rarity
     */
    static sortSkinsByRarity(skins) {
        return Object.entries(skins).sort((a, b) => {
            const rarityA = this.getRarityValue(a[1].rarity);
            const rarityB = this.getRarityValue(b[1].rarity);
            return rarityB - rarityA;
        });
    }
}

/**
 * Cosmetics Display Manager
 * UI rendering for cosmetics shop and selection
 */
class CosmeticsDisplay {
    /**
     * Create cosmetics shop screen
     */
    static createShopScreen(heroName) {
        const container = document.createElement("div");
        container.className = "cosmetics-shop";
        container.style.cssText = `
            width: 100%;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
            color: #ffffff;
            padding: 20px;
            font-family: Arial, sans-serif;
        `;

        // Header
        const header = document.createElement("h1");
        header.textContent = `${heroName.toUpperCase()} - COSMETICS SHOP`;
        header.style.cssText = `
            color: #00d4ff;
            margin: 0 0 20px 0;
            font-size: 24px;
            text-align: center;
        `;
        container.appendChild(header);

        // Skins Section
        const skinsSection = document.createElement("div");
        skinsSection.style.cssText = `
            background: rgba(0, 212, 255, 0.08);
            border: 2px solid #00d4ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        `;

        const skinsTitle = document.createElement("h2");
        skinsTitle.textContent = "SKINS";
        skinsTitle.style.cssText = `
            color: #00d4ff;
            margin: 0 0 15px 0;
            font-size: 16px;
        `;
        skinsSection.appendChild(skinsTitle);

        const skinsGrid = document.createElement("div");
        skinsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
        `;

        const skins = CosmeticsManager.getHeroSkins(heroName);
        Object.entries(skins).forEach(([skinKey, skin]) => {
            const skinCard = this._createSkinCard(skin, skinKey, heroName);
            skinsGrid.appendChild(skinCard);
        });

        skinsSection.appendChild(skinsGrid);
        container.appendChild(skinsSection);

        return container;
    }

    /**
     * Create individual skin card
     */
    static _createSkinCard(skin, skinKey, heroName) {
        const card = document.createElement("div");
        const rarityColor = CosmeticsManager.getRarityColor(skin.rarity);

        card.style.cssText = `
            background: rgba(26, 31, 58, 0.7);
            border: 3px solid ${rarityColor};
            border-radius: 6px;
            padding: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        `;

        // Skin preview area
        const preview = document.createElement("div");
        preview.style.cssText = `
            background: linear-gradient(135deg, ${skin.colors.primary}33, ${skin.colors.accent}33);
            border-radius: 4px;
            height: 100px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
        `;
        preview.textContent = "👤"; // Placeholder for hero icon
        card.appendChild(preview);

        // Skin name
        const nameEl = document.createElement("h3");
        nameEl.textContent = skin.name;
        nameEl.style.cssText = `
            margin: 0 0 8px 0;
            color: ${rarityColor};
            font-size: 13px;
            font-weight: bold;
        `;
        card.appendChild(nameEl);

        // Rarity label
        const rarityEl = document.createElement("div");
        rarityEl.textContent = skin.rarity.toUpperCase();
        rarityEl.style.cssText = `
            color: ${rarityColor};
            font-size: 10px;
            margin-bottom: 8px;
            text-transform: uppercase;
        `;
        card.appendChild(rarityEl);

        // Cost or owned
        const costEl = document.createElement("div");
        if (skin.owned) {
            costEl.textContent = "✓ OWNED";
            costEl.style.cssText = `
                color: #4caf50;
                font-weight: bold;
                font-size: 12px;
            `;
        } else {
            costEl.textContent = `${skin.cost} LP`;
            costEl.style.cssText = `
                color: ${rarityColor};
                font-weight: bold;
                font-size: 12px;
            `;
        }
        card.appendChild(costEl);

        // Hover effect
        card.onmouseover = () => {
            card.style.transform = "scale(1.05)";
            card.style.boxShadow = `0 0 20px rgba(${this._hexToRgb(rarityColor).join(",")}, 0.5)`;
        };
        card.onmouseout = () => {
            card.style.transform = "scale(1)";
            card.style.boxShadow = "none";
        };

        return card;
    }

    /**
     * Helper: Hex to RGB
     */
    static _hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }

    /**
     * Create hero preview with equipped cosmetics
     */
    static createHeroPreview(heroName, equippedSkin = "default") {
        const container = document.createElement("div");
        const skin = CosmeticsManager.getSkinDetails(heroName, equippedSkin);

        container.style.cssText = `
            background: linear-gradient(135deg, ${skin.colors.primary}33, ${skin.colors.accent}33);
            border: 2px solid #00d4ff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        `;

        // Large hero portrait placeholder
        const portrait = document.createElement("div");
        portrait.style.cssText = `
            font-size: 120px;
            margin-bottom: 20px;
        `;
        portrait.textContent = "👤";
        container.appendChild(portrait);

        // Hero name and skin
        const titleEl = document.createElement("h2");
        titleEl.textContent = `${heroName.toUpperCase()} - ${skin.name.toUpperCase()}`;
        titleEl.style.cssText = `
            margin: 0 0 10px 0;
            color: #00ff88;
            font-size: 18px;
        `;
        container.appendChild(titleEl);

        // Description
        const descEl = document.createElement("p");
        descEl.textContent = skin.description;
        descEl.style.cssText = `
            margin: 0;
            color: #9d4edd;
            font-size: 12px;
        `;
        container.appendChild(descEl);

        return container;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CosmeticsManager, CosmeticsDisplay };
}
