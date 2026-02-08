/**
 * Advanced Guard AI System
 * Enhanced detection, communication, memory, and tactical behavior
 */

const GUARD_TYPE = {
    STANDARD: "standard",        // Regular patrol guard
    AGGRESSIVE: "aggressive",    // Actively hunts threats
    STATIONARY: "stationary",    // Doesn't patrol
    PATROL_LEADER: "patrolLeader" // Communicates with others
};

const GUARD_STATE = {
    PATROL: "patrol",
    SUSPICIOUS: "suspicious",
    ALERT: "alert",
    HUNTING: "hunting",
    COORDINATING: "coordinating",
    DEAD: "dead"
};

/**
 * Line-of-sight detection with wall obstruction
 */
class LineOfSight {
    static canSee(fromX, fromY, toX, toY, level, maxDistance = 300) {
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.hypot(dx, dy);

        // Check distance
        if (distance > maxDistance) return false;

        // Ray cast from source to target
        const steps = Math.ceil(distance / 5);
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const checkX = fromX + dx * t;
            const checkY = fromY + dy * t;

            // Check for wall obstruction
            if (level.isWall(checkX, checkY, 3)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get all visible positions from a point
     */
    static getVisibleArea(fromX, fromY, level, range = 300) {
        const visible = [];
        const rays = 16;

        for (let i = 0; i < rays; i++) {
            const angle = (i / rays) * Math.PI * 2;
            const endX = fromX + Math.cos(angle) * range;
            const endY = fromY + Math.sin(angle) * range;

            if (this.canSee(fromX, fromY, endX, endY, level, range)) {
                visible.push({ x: endX, y: endY, angle });
            }
        }

        return visible;
    }
}

/**
 * Guard communication and coordination system
 */
class GuardCommunication {
    constructor() {
        this.threats = [];      // Known threats
        this.lastSeenPositions = [];  // Remembered enemy positions
        this.coordinatedWithGuards = [];
    }

    /**
     * Report a threat to other guards (within communication range)
     */
    reportThreat(threat, fromGuard, guards, range = 250) {
        const nearbyGuards = guards.filter(g => {
            const dist = Math.hypot(g.x - fromGuard.x, g.y - fromGuard.y);
            return dist < range && g !== fromGuard && g.state !== GUARD_STATE.DEAD;
        });

        nearbyGuards.forEach(guard => {
            if (!guard.threatMemory.find(t => t.id === threat.id)) {
                guard.threatMemory.push({
                    id: threat.id,
                    lastSeenX: threat.x,
                    lastSeenY: threat.y,
                    reportedBy: fromGuard,
                    timeReported: performance.now(),
                    confidence: 0.8
                });
            }
        });

        return nearbyGuards.length;
    }

    /**
     * Share last seen position information
     */
    shareLastSeenPosition(x, y, fromGuard, guards, range = 250) {
        const nearbyGuards = guards.filter(g => {
            const dist = Math.hypot(g.x - fromGuard.x, g.y - fromGuard.y);
            return dist < range && g !== fromGuard;
        });

        nearbyGuards.forEach(guard => {
            guard.knownThreatPositions.push({
                x, y,
                reportedBy: fromGuard,
                time: performance.now()
            });
        });
    }
}

/**
 * Guard memory system
 */
class GuardMemory {
    constructor() {
        this.threatMemory = [];       // Known threats
        this.seenPositions = [];      // Where threats were seen
        this.heartsPositions = [];    // Where sounds came from
        this.knownThreatPositions = [];
        this.suspiciousAreas = [];    // Areas to investigate
        this.lastInvestigatedArea = null;
        this.memoryDecayRate = 0.995; // Memories fade over time
    }

    /**
     * Remember seeing a threat
     */
    rememberThreat(threatId, x, y, confidence = 1.0) {
        const existing = this.threatMemory.find(t => t.id === threatId);
        if (existing) {
            existing.lastSeenX = x;
            existing.lastSeenY = y;
            existing.confidence = Math.min(1.0, existing.confidence + 0.1);
            existing.lastSeen = performance.now();
        } else {
            this.threatMemory.push({
                id: threatId,
                lastSeenX: x,
                lastSeenY: y,
                firstSeen: performance.now(),
                lastSeen: performance.now(),
                confidence: confidence
            });
        }
    }

    /**
     * Get strongest remembered threat
     */
    getStrongestMemory() {
        if (this.threatMemory.length === 0) return null;

        // Sort by confidence and recency
        return this.threatMemory.reduce((strongest, current) => {
            const currentScore = current.confidence * (1 - (performance.now() - current.lastSeen) / 30000);
            const strongestScore = strongest.confidence * (1 - (performance.now() - strongest.lastSeen) / 30000);
            return currentScore > strongestScore ? current : strongest;
        });
    }

    /**
     * Decay memory confidence over time
     */
    updateMemory() {
        this.threatMemory = this.threatMemory.filter(t => {
            t.confidence *= this.memoryDecayRate;
            return t.confidence > 0.1;
        });
    }

    /**
     * Add suspicious area to investigate
     */
    markSuspiciousArea(x, y) {
        this.suspiciousAreas.push({
            x, y,
            discovered: performance.now(),
            investigated: false
        });
    }

    /**
     * Mark area as investigated
     */
    markAreaInvestigated(x, y, radius = 100) {
        this.suspiciousAreas = this.suspiciousAreas.map(area => {
            const dist = Math.hypot(area.x - x, area.y - y);
            if (dist < radius) {
                area.investigated = true;
                this.lastInvestigatedArea = area;
            }
            return area;
        });
    }
}

/**
 * Enhanced Guard class with advanced AI
 */
class AdvancedGuard extends Guard {
    constructor(level, spawnPoint, type = GUARD_TYPE.STANDARD) {
        super(level, spawnPoint);
        this.type = type;
        this.state = GUARD_STATE.PATROL;

        // Advanced systems
        this.communication = new GuardCommunication();
        this.memory = new GuardMemory();
        this.threatMemory = [];
        this.knownThreatPositions = [];

        // Behavior modifiers based on type
        this.applyTypeBehavior();

        // Tactical state
        this.targetThreat = null;
        this.searchPattern = "spiral";
        this.lastSearchX = null;
        this.lastSearchY = null;
        this.collaboratingGuards = [];
    }

    /**
     * Apply behavior modifiers based on guard type
     */
    applyTypeBehavior() {
        switch (this.type) {
            case GUARD_TYPE.AGGRESSIVE:
                this.speed = 2.5;
                this.sightRange = 400;
                this.alertThreshold = 30;
                break;

            case GUARD_TYPE.STATIONARY:
                this.speed = 0;
                this.sightRange = 250;
                this.patrolPoints = [{ x: this.x, y: this.y }];
                break;

            case GUARD_TYPE.PATROL_LEADER:
                this.speed = 1.8;
                this.sightRange = 320;
                this.communicationRange = 400;
                break;

            case GUARD_TYPE.STANDARD:
            default:
                this.speed = 1.5;
                this.sightRange = 300;
                break;
        }
    }

    /**
     * Enhanced detection with line-of-sight
     */
    canDetectTarget(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.hypot(dx, dy);

        // Check range
        if (distance > this.sightRange) return false;

        // Check line of sight
        if (!LineOfSight.canSee(this.x, this.y, target.x, target.y, this.level, this.sightRange)) {
            return false;
        }

        // Check vision cone
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        const guardAngle = 0;
        const angleDiff = Math.abs(targetAngle - guardAngle);
        if (angleDiff > (this.sightAngle / 2) && angleDiff < (360 - this.sightAngle / 2)) {
            return false;
        }

        // Visibility and noise checks
        const detectionChance = target.getVisibility();
        if (Math.random() * 100 > detectionChance) {
            return false;
        }

        return true;
    }

    /**
     * Enhanced update with memory and communication
     */
    update(players, otherGuards = []) {
        if (this.state === GUARD_STATE.DEAD) return;

        this.memory.updateMemory();

        // Check for threats
        let detectedThreats = [];
        if (Array.isArray(players)) {
            detectedThreats = players.filter(p => this.canDetectTarget(p));
        } else {
            // Single player
            if (this.canDetectTarget(players)) {
                detectedThreats = [players];
            }
        }

        // Process detections
        if (detectedThreats.length > 0) {
            detectedThreats.forEach(threat => {
                this.memory.rememberThreat(threat.id || 0, threat.x, threat.y);
                this.alertLevel = Math.min(100, this.alertLevel + 20);
                this.state = GUARD_STATE.HUNTING;
                this.targetThreat = threat;

                // Communicate with nearby guards
                if (this.type === GUARD_TYPE.PATROL_LEADER && otherGuards.length > 0) {
                    this.communication.reportThreat(threat, this, otherGuards, this.sightRange * 1.5);
                }
            });
        } else {
            // Check memory for known threats
            const remembered = this.memory.getStrongestMemory();
            if (remembered && remembered.confidence > 0.3) {
                this.lastSeenX = remembered.lastSeenX;
                this.lastSeenY = remembered.lastSeenY;
                this.alertLevel = Math.max(0, this.alertLevel - 1);
                this.state = GUARD_STATE.ALERT;
            } else {
                if (this.alertLevel <= 20) {
                    this.state = GUARD_STATE.PATROL;
                } else {
                    this.state = GUARD_STATE.SUSPICIOUS;
                }
            }
        }

        // Update behavior based on state
        this.updateBehaviorByState();

        // Decay alert
        this.alertLevel = Math.max(0, this.alertLevel - 0.3);
    }

    /**
     * Update behavior based on current state
     */
    updateBehaviorByState() {
        switch (this.state) {
            case GUARD_STATE.PATROL:
                this.patrol();
                break;

            case GUARD_STATE.SUSPICIOUS:
                this.investigateSuspicion();
                break;

            case GUARD_STATE.ALERT:
                this.searchArea();
                break;

            case GUARD_STATE.HUNTING:
                if (this.targetThreat) {
                    this.huntThreat(this.targetThreat);
                }
                break;

            case GUARD_STATE.COORDINATING:
                this.coordinateWithNearbyGuards();
                break;
        }
    }

    /**
     * Investigate suspicious sounds/areas
     */
    investigateSuspicion() {
        // Move toward suspicious area
        const unInvestigated = this.memory.suspiciousAreas.find(a => !a.investigated);
        if (unInvestigated) {
            const dx = unInvestigated.x - this.x;
            const dy = unInvestigated.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 30) {
                // Arrived at suspicious area
                this.memory.markAreaInvestigated(unInvestigated.x, unInvestigated.y);
            } else {
                const angle = Math.atan2(dy, dx);
                this.velocityX = Math.cos(angle) * this.speed * 0.7;
                this.velocityY = Math.sin(angle) * this.speed * 0.7;
            }
        }
    }

    /**
     * Hunt specific threat with tactical movement
     */
    huntThreat(threat) {
        if (!threat) return;

        const dx = threat.x - this.x;
        const dy = threat.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 5) {
            // Threat caught - alert all guards
            this.alertLevel = 100;
        } else {
            const angle = Math.atan2(dy, dx);
            const huntSpeed = this.type === GUARD_TYPE.AGGRESSIVE ? this.speed : this.speed * 0.8;
            this.velocityX = Math.cos(angle) * huntSpeed;
            this.velocityY = Math.sin(angle) * huntSpeed;
        }
    }

    /**
     * Coordinate movement with nearby guards
     */
    coordinateWithNearbyGuards() {
        // Guards can move to surround threats
        if (this.targetThreat) {
            // Simple flanking behavior
            const threatAngle = Math.atan2(this.targetThreat.y - this.y, this.targetThreat.x - this.x);
            const flankeAngle = threatAngle + (Math.random() - 0.5) * Math.PI;

            const dx = Math.cos(flankeAngle) * 150;
            const dy = Math.sin(flankeAngle) * 150;
            const targetX = this.targetThreat.x + dx;
            const targetY = this.targetThreat.y + dy;

            const moveDX = targetX - this.x;
            const moveDY = targetY - this.y;
            const moveDistance = Math.hypot(moveDX, moveDY);

            if (moveDistance > 10) {
                const angle = Math.atan2(moveDY, moveDX);
                this.velocityX = Math.cos(angle) * this.speed * 0.6;
                this.velocityY = Math.sin(angle) * this.speed * 0.6;
            }
        }
    }

    /**
     * Get guard state for debugging
     */
    getState() {
        return {
            type: this.type,
            state: this.state,
            alertLevel: this.alertLevel,
            threatMemory: this.memory.threatMemory.length,
            suspiciousAreas: this.memory.suspiciousAreas.length
        };
    }

    /**
     * Mark guard as dead
     */
    kill() {
        this.state = GUARD_STATE.DEAD;
        this.velocityX = 0;
        this.velocityY = 0;
    }
}
