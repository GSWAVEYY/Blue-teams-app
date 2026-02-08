/**
 * Core Ability System
 * Manages ability execution, cooldowns, and effects with proper state management
 */

// Ability execution states
const ABILITY_STATE = {
    READY: "ready",
    COOLDOWN: "cooldown",
    EXECUTING: "executing",
    EXHAUSTED: "exhausted"
};

// Ability targeting modes
const ABILITY_TARGET = {
    SELF: "self",
    AREA: "area",
    SINGLE_TARGET: "singleTarget",
    ALLY: "ally",
    ENEMY: "enemy"
};

class Ability {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;
        this.icon = config.icon || "✦";
        this.cooldown = config.cooldown || 0;
        this.maxCharges = config.maxCharges || 0;
        this.castTime = config.castTime || 0;
        this.range = config.range || 0;
        this.targetMode = config.targetMode || ABILITY_TARGET.SELF;
        this.cost = config.cost || 0; // Resource cost (ammo, energy, etc.)
        this.costType = config.costType || "ammo"; // ammo, health, energy
        this.effect = config.effect || (() => {}); // Function to execute
        this.onCooldown = config.onCooldown || (() => {}); // Executed when ability goes on cooldown
        this.onExecute = config.onExecute || (() => {}); // Executed when ability is cast
        this.onReady = config.onReady || (() => {}); // Executed when ability comes off cooldown
        this.hotkey = config.hotkey || null;

        // State tracking
        this.state = ABILITY_STATE.READY;
        this.currentCooldown = 0;
        this.charges = this.maxCharges;
        this.castTimeRemaining = 0;
        this.lastExecutedAt = 0;
    }

    /**
     * Check if ability can be executed
     */
    canExecute(executor) {
        if (this.state === ABILITY_STATE.EXHAUSTED) return false;
        if (this.state === ABILITY_STATE.COOLDOWN) return false;
        if (this.state === ABILITY_STATE.EXECUTING) return false;

        // Check charges
        if (this.maxCharges > 0 && this.charges <= 0) return false;

        // Check cost
        if (this.cost > 0) {
            const hasResource = this.checkResourceAvailable(executor);
            if (!hasResource) return false;
        }

        return true;
    }

    /**
     * Check if executor has required resource
     */
    checkResourceAvailable(executor) {
        switch (this.costType) {
            case "ammo":
                return executor.ammo >= this.cost;
            case "health":
                return executor.health >= this.cost;
            case "medkit":
                return executor.medkits >= this.cost;
            default:
                return true;
        }
    }

    /**
     * Deduct cost from executor
     */
    deductCost(executor) {
        switch (this.costType) {
            case "ammo":
                executor.ammo = Math.max(0, executor.ammo - this.cost);
                break;
            case "health":
                executor.health = Math.max(0, executor.health - this.cost);
                break;
            case "medkit":
                executor.medkits = Math.max(0, executor.medkits - this.cost);
                break;
        }
    }

    /**
     * Execute the ability
     */
    execute(executor, target = null) {
        if (!this.canExecute(executor)) {
            return false;
        }

        // Start casting
        if (this.castTime > 0) {
            this.state = ABILITY_STATE.EXECUTING;
            this.castTimeRemaining = this.castTime;
            return true;
        }

        return this.finishExecution(executor, target);
    }

    /**
     * Finish executing the ability (after cast time)
     */
    finishExecution(executor, target) {
        try {
            // Deduct cost
            this.deductCost(executor);

            // Execute effect
            this.effect(executor, target);

            // Handle charges
            if (this.maxCharges > 0) {
                this.charges--;
                if (this.charges <= 0) {
                    this.state = ABILITY_STATE.EXHAUSTED;
                }
            } else {
                // Start cooldown
                this.currentCooldown = this.cooldown;
                this.state = ABILITY_STATE.COOLDOWN;
            }

            this.lastExecutedAt = performance.now();
            this.onExecute(executor, target);
            this.onCooldown(executor, target);

            return true;
        } catch (error) {
            console.error(`Error executing ability ${this.id}:`, error);
            return false;
        }
    }

    /**
     * Update ability state (for cooldowns and casting)
     */
    update() {
        // Handle casting
        if (this.state === ABILITY_STATE.EXECUTING && this.castTimeRemaining > 0) {
            this.castTimeRemaining--;
            if (this.castTimeRemaining <= 0) {
                // Cast time finished, ability already executed
            }
        }

        // Handle cooldown
        if (this.state === ABILITY_STATE.COOLDOWN && this.currentCooldown > 0) {
            this.currentCooldown--;
            if (this.currentCooldown <= 0) {
                this.state = ABILITY_STATE.READY;
                this.onReady();
            }
        }

        // Handle exhaustion (charges depleted)
        if (this.state === ABILITY_STATE.EXHAUSTED) {
            // Exhausted abilities stay exhausted until recharged externally
        }
    }

    /**
     * Reset ability to ready state
     */
    reset() {
        this.state = ABILITY_STATE.READY;
        this.currentCooldown = 0;
        this.charges = this.maxCharges;
        this.castTimeRemaining = 0;
    }

    /**
     * Recharge charges
     */
    recharge() {
        this.charges = this.maxCharges;
        if (this.state === ABILITY_STATE.EXHAUSTED) {
            this.state = ABILITY_STATE.READY;
        }
    }

    /**
     * Get ability state for UI display
     */
    getState() {
        return {
            id: this.id,
            name: this.name,
            state: this.state,
            cooldownRemaining: this.currentCooldown,
            charges: this.charges,
            maxCharges: this.maxCharges,
            castTimeRemaining: this.castTimeRemaining,
            canExecute: this.state === ABILITY_STATE.READY
        };
    }
}

/**
 * Role-specific ability implementations
 */

// INFILTRATOR ABILITIES
class Lockpick extends Ability {
    constructor() {
        super({
            id: "lockpick",
            name: "Lockpick",
            description: "Pick a locked door or object",
            icon: "🔓",
            cooldown: 0,
            maxCharges: 5,
            castTime: 60, // 1 second at 60fps
            range: 40,
            targetMode: ABILITY_TARGET.AREA,
            cost: 0,
            effect: (executor, target) => {
                // Find nearby locked objects
                const level = executor.level;
                const nearbyObjects = level.objectives.filter(obj => {
                    const dist = Math.hypot(obj.x - executor.x, obj.y - executor.y);
                    return dist < 50 && obj.locked;
                });

                nearbyObjects.forEach(obj => {
                    obj.locked = false;
                    executor.lastAbilityUsed = "lockpick";
                });
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Lockpick used", "#00ff00");
            }
        });
    }
}

class SilentTakedown extends Ability {
    constructor() {
        super({
            id: "silentTakedown",
            name: "Silent Takedown",
            description: "Non-lethal takedown from behind",
            icon: "⚡",
            cooldown: 120, // 2 seconds
            castTime: 0,
            range: 30,
            targetMode: ABILITY_TARGET.ENEMY,
            cost: 0,
            effect: (executor, target) => {
                if (!target || target.isDown) return;

                const dist = Math.hypot(target.x - executor.x, target.y - executor.y);
                if (dist > 30) return;

                // Check if behind target (simplified)
                target.goDown();
                executor.squad.sharedResources.heatLevel = Math.max(0, executor.squad.sharedResources.heatLevel - 20);
                executor.lastAbilityUsed = "silentTakedown";
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Guard down!", "#00ff00");
            }
        });
    }
}

class ShadowStep extends Ability {
    constructor() {
        super({
            id: "shadowStep",
            name: "Shadow Step",
            description: "Become harder to detect briefly",
            icon: "👁",
            cooldown: 90,
            castTime: 0,
            range: 0,
            targetMode: ABILITY_TARGET.SELF,
            cost: 0,
            effect: (executor) => {
                executor.visibility = Math.max(10, executor.visibility * 0.3);
                executor.shadowStepActive = 30; // 0.5 seconds
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Shadow Step active", "#64a8ff");
            }
        });
    }
}

// OPERATOR ABILITIES
class FocusedAction extends Ability {
    constructor() {
        super({
            id: "focusedAction",
            name: "Focused Action",
            description: "Complete objectives 80% faster",
            icon: "⚙",
            cooldown: 120,
            castTime: 0,
            range: 0,
            targetMode: ABILITY_TARGET.SELF,
            cost: 0,
            effect: (executor) => {
                executor.interactionSpeedBonus = 1.8;
                executor.focusedActionTimer = 120; // 2 seconds
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Focused!", "#ffaa44");
            }
        });
    }
}

class DeviceControl extends Ability {
    constructor() {
        super({
            id: "deviceControl",
            name: "Device Control",
            description: "Disable or control electronic devices",
            icon: "📡",
            cooldown: 60,
            castTime: 30,
            range: 60,
            targetMode: ABILITY_TARGET.AREA,
            cost: 10,
            costType: "ammo",
            effect: (executor) => {
                const level = executor.level;
                // Disable nearby cameras/alarms
                if (level.hazards) {
                    level.hazards.forEach(hazard => {
                        const dist = Math.hypot(hazard.x - executor.x, hazard.y - executor.y);
                        if (dist < 80 && (hazard.type === "camera" || hazard.type === "alarm")) {
                            hazard.disabled = true;
                            hazard.disabledTimer = 180; // 3 seconds
                        }
                    });
                }
                executor.lastAbilityUsed = "deviceControl";
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Devices hacked", "#ffa502");
            }
        });
    }
}

class TargetMarking extends Ability {
    constructor() {
        super({
            id: "targetMarking",
            name: "Mark Target",
            description: "Mark enemies for the squad to see",
            icon: "🎯",
            cooldown: 0,
            maxCharges: Infinity,
            range: 200,
            targetMode: ABILITY_TARGET.ENEMY,
            cost: 0,
            effect: (executor, target) => {
                if (target) {
                    target.isMarked = true;
                    target.markedTimer = 300; // 5 seconds
                    executor.markedTargets = executor.markedTargets || [];
                    executor.markedTargets.push(target);
                }
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Target marked", "#ff6b6b");
            }
        });
    }
}

// SUPPORT ABILITIES
class Revive extends Ability {
    constructor() {
        super({
            id: "revive",
            name: "Revive",
            description: "Bring downed teammate back to action",
            icon: "♕",
            cooldown: 120,
            castTime: 90,
            range: 80,
            targetMode: ABILITY_TARGET.ALLY,
            cost: 0,
            effect: (executor, target) => {
                if (target && target.isDown) {
                    target.revive();
                    executor.squad.morale = Math.min(100, executor.squad.morale + 20);
                }
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Teammate revived!", "#00ff00");
            }
        });
    }
}

class ResourceShare extends Ability {
    constructor() {
        super({
            id: "resourceShare",
            name: "Share Ammo",
            description: "Give ammo or health to teammate",
            icon: "★",
            cooldown: 30,
            castTime: 0,
            range: 100,
            targetMode: ABILITY_TARGET.ALLY,
            cost: 0,
            effect: (executor, target) => {
                if (target && executor.ammo > 30) {
                    const transfer = Math.min(30, executor.ammo - 20);
                    executor.ammo -= transfer;
                    target.ammo += transfer;
                }
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Resources shared", "#4ecdc4");
            }
        });
    }
}

class SmokeGrenade extends Ability {
    constructor() {
        super({
            id: "smokeGrenade",
            name: "Smoke Grenade",
            description: "Deploy smoke for cover",
            icon: "💨",
            cooldown: 60,
            castTime: 0,
            range: 100,
            targetMode: ABILITY_TARGET.AREA,
            maxCharges: 3,
            cost: 0,
            effect: (executor, target) => {
                // Create smoke effect
                executor.lastSmoke = {
                    x: executor.x + (target ? target.x - executor.x : 0),
                    y: executor.y + (target ? target.y - executor.y : 0),
                    radius: 60,
                    timeRemaining: 180
                };
                executor.squad.sharedResources.heatLevel = Math.max(0, executor.squad.sharedResources.heatLevel - 10);
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Smoke deployed", "#888888");
            }
        });
    }
}

// SPECIALIST ABILITIES
class HackSystem extends Ability {
    constructor() {
        super({
            id: "hacking",
            name: "Hack System",
            description: "Disable alarms and cameras remotely",
            icon: "🖥",
            cooldown: 90,
            castTime: 60,
            range: 150,
            targetMode: ABILITY_TARGET.AREA,
            cost: 20,
            costType: "ammo",
            effect: (executor) => {
                const level = executor.level;
                if (level.hazards) {
                    level.hazards.forEach(hazard => {
                        const dist = Math.hypot(hazard.x - executor.x, hazard.y - executor.y);
                        if (dist < 150) {
                            hazard.disabled = true;
                            hazard.disabledTimer = 300; // 5 seconds
                        }
                    });
                }
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Systems hacked", "#c14eca");
            }
        });
    }
}

class DroneRecon extends Ability {
    constructor() {
        super({
            id: "droneRecon",
            name: "Drone Recon",
            description: "Scout area with mini-drone",
            icon: "🛸",
            cooldown: 120,
            castTime: 0,
            range: 0,
            targetMode: ABILITY_TARGET.SELF,
            maxCharges: 2,
            cost: 0,
            effect: (executor) => {
                executor.droneActive = true;
                executor.droneX = executor.x;
                executor.droneY = executor.y;
                executor.droneTimer = 180; // 3 seconds

                // Reveal all visible enemies
                if (executor.level.game) {
                    executor.level.game.guards.forEach(guard => {
                        guard.isRevealed = true;
                        guard.revealTimer = 180;
                    });
                }
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Drone deployed", "#00ffff");
            }
        });
    }
}

class AdaptiveGear extends Ability {
    constructor() {
        super({
            id: "adaptiveGear",
            name: "Adapt Gear",
            description: "Switch specialist role temporarily",
            icon: "🔄",
            cooldown: 180,
            castTime: 0,
            range: 0,
            targetMode: ABILITY_TARGET.SELF,
            cost: 0,
            effect: (executor) => {
                // Toggle between infiltrator and operator stats
                executor.adaptedRole = executor.adaptedRole === "infiltrator" ? "operator" : "infiltrator";
                if (executor.adaptedRole === "infiltrator") {
                    executor.visibility = executor.visibility * 0.8;
                } else {
                    executor.interactionSpeedBonus = 1.5;
                }
            },
            onExecute: (executor) => {
                executor.displayAbilityFeedback("Gear adapted", "#c14eca");
            }
        });
    }
}

// Ability manager for a character
class AbilityManager {
    constructor(abilities = []) {
        this.abilities = abilities;
        this.selectedAbility = null;
        this.abilityQueue = [];
    }

    getAbility(id) {
        return this.abilities.find(a => a.id === id);
    }

    executeAbility(id, executor, target = null) {
        const ability = this.getAbility(id);
        if (!ability) return false;
        return ability.execute(executor, target);
    }

    update() {
        this.abilities.forEach(ability => ability.update());
    }

    getAbilitiesForUI() {
        return this.abilities.map(a => a.getState());
    }

    reset() {
        this.abilities.forEach(a => a.reset());
    }
}
