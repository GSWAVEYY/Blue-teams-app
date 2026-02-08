/**
 * Mission System with Multiple Levels
 * Progressive difficulty with varied layouts and objectives
 */

const DIFFICULTY = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard",
    VERY_HARD: "very_hard",
    INSANE: "insane"
};

const OBJECTIVE_TYPE = {
    RETRIEVE: "retrieve",      // Steal an item
    ELIMINATE: "eliminate",    // Take down target
    HACK: "hack",             // Access system
    SECURE: "secure",         // Secure area
    ESCAPE: "escape"          // Get to extraction
};

/**
 * Mission Definition
 */
class Mission {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;
        this.difficulty = config.difficulty;
        this.objectives = config.objectives || [];
        this.layout = config.layout;
        this.guards = config.guards || [];
        this.rewardXP = config.rewardXP || 100;
        this.rewardReputation = config.rewardReputation || 10;
        this.timeLimit = config.timeLimit || 0; // 0 = no limit
        this.recommendedSquadSize = config.recommendedSquadSize || 4;
        this.hazards = config.hazards || [];
        this.briefing = config.briefing;
        this.completed = false;
        this.bestTime = null;
        this.bestHeat = null;
    }
}

/**
 * Mission Manager
 */
class MissionManager {
    constructor() {
        this.missions = [];
        this.currentMission = null;
        this.completedMissions = [];
        this.initializeMissions();
    }

    initializeMissions() {
        // Mission 1: Training Facility (Easy)
        this.missions.push(new Mission({
            id: "training_facility",
            name: "Training Facility Infiltration",
            description: "Infiltrate a lightly guarded training facility to retrieve test data",
            difficulty: DIFFICULTY.EASY,
            rewardXP: 100,
            rewardReputation: 10,
            recommendedSquadSize: 2,
            briefing: "This is a simple reconnaissance mission. The facility has minimal security. Three lightly armed guards patrol the area. Your objective is to access the server room and retrieve the data before escaping.",
            layout: {
                width: 1200,
                height: 700,
                theme: "training"
            },
            objectives: [
                {
                    x: 600,
                    y: 350,
                    width: 50,
                    height: 50,
                    name: "Server Access",
                    type: OBJECTIVE_TYPE.HACK,
                    completed: false
                }
            ],
            guards: [
                { type: GUARD_TYPE.STANDARD, x: 300, y: 350 },
                { type: GUARD_TYPE.STANDARD, x: 900, y: 200 },
                { type: GUARD_TYPE.STANDARD, x: 600, y: 500 }
            ]
        }));

        // Mission 2: Corporate Office (Medium)
        this.missions.push(new Mission({
            id: "corporate_office",
            name: "Corporate Espionage",
            description: "Break into a corporate office and steal sensitive documents",
            difficulty: DIFFICULTY.MEDIUM,
            rewardXP: 250,
            rewardReputation: 25,
            recommendedSquadSize: 3,
            briefing: "A mid-level security facility with competent guards. You need to retrieve two items: the CEO's encrypted drive and the financial records. Five guards are on duty, with one patrol leader coordinating responses.",
            objectives: [
                {
                    x: 200,
                    y: 300,
                    width: 40,
                    height: 40,
                    name: "CEO's Drive",
                    type: OBJECTIVE_TYPE.RETRIEVE,
                    completed: false
                },
                {
                    x: 1000,
                    y: 400,
                    width: 40,
                    height: 40,
                    name: "Financial Records",
                    type: OBJECTIVE_TYPE.RETRIEVE,
                    completed: false
                }
            ],
            guards: [
                { type: GUARD_TYPE.PATROL_LEADER, x: 600, y: 350 },
                { type: GUARD_TYPE.STANDARD, x: 300, y: 200 },
                { type: GUARD_TYPE.STANDARD, x: 900, y: 250 },
                { type: GUARD_TYPE.AGGRESSIVE, x: 400, y: 500 },
                { type: GUARD_TYPE.STANDARD, x: 800, y: 450 }
            ]
        }));

        // Mission 3: Research Lab (Hard)
        this.missions.push(new Mission({
            id: "research_lab",
            name: "Lab Infiltration",
            description: "Breach a high-security research laboratory",
            difficulty: DIFFICULTY.HARD,
            rewardXP: 500,
            rewardReputation: 50,
            recommendedSquadSize: 4,
            briefing: "A heavily secured research facility with advanced security. Multiple objectives scattered throughout. Seven guards maintain constant surveillance. Be prepared for coordinated responses. There are environmental hazards (security cameras) that can raise alarms.",
            objectives: [
                {
                    x: 300,
                    y: 200,
                    width: 40,
                    height: 40,
                    name: "Research Data",
                    type: OBJECTIVE_TYPE.HACK,
                    completed: false
                },
                {
                    x: 900,
                    y: 300,
                    width: 40,
                    height: 40,
                    name: "Sample Extraction",
                    type: OBJECTIVE_TYPE.RETRIEVE,
                    completed: false
                },
                {
                    x: 600,
                    y: 600,
                    width: 40,
                    height: 40,
                    name: "Lab Access Key",
                    type: OBJECTIVE_TYPE.RETRIEVE,
                    completed: false
                }
            ],
            guards: [
                { type: GUARD_TYPE.PATROL_LEADER, x: 400, y: 300 },
                { type: GUARD_TYPE.AGGRESSIVE, x: 800, y: 400 },
                { type: GUARD_TYPE.AGGRESSIVE, x: 300, y: 600 },
                { type: GUARD_TYPE.STANDARD, x: 900, y: 150 },
                { type: GUARD_TYPE.STANDARD, x: 500, y: 200 },
                { type: GUARD_TYPE.STATIONARY, x: 100, y: 350 },
                { type: GUARD_TYPE.STANDARD, x: 1100, y: 500 }
            ],
            hazards: [
                { type: "camera", x: 200, y: 100, range: 150 },
                { type: "camera", x: 1000, y: 200, range: 150 },
                { type: "camera", x: 600, y: 350, range: 150 }
            ]
        }));

        // Mission 4: Vault Facility (Very Hard)
        this.missions.push(new Mission({
            id: "vault_facility",
            name: "Vault Breach",
            description: "Infiltrate a maximum-security vault facility",
            difficulty: DIFFICULTY.VERY_HARD,
            rewardXP: 1000,
            rewardReputation: 100,
            recommendedSquadSize: 4,
            briefing: "The most secure facility yet. Heavy guard presence with coordinated patrol patterns. Multiple security systems and automated defenses. This mission requires perfect execution. Recommend using all four squad members with careful coordination.",
            objectives: [
                {
                    x: 150,
                    y: 350,
                    width: 40,
                    height: 40,
                    name: "Vault Access",
                    type: OBJECTIVE_TYPE.HACK,
                    completed: false
                },
                {
                    x: 1050,
                    y: 350,
                    width: 40,
                    height: 40,
                    name: "Secure Item",
                    type: OBJECTIVE_TYPE.RETRIEVE,
                    completed: false
                }
            ],
            guards: [
                { type: GUARD_TYPE.PATROL_LEADER, x: 600, y: 200 },
                { type: GUARD_TYPE.PATROL_LEADER, x: 600, y: 500 },
                { type: GUARD_TYPE.AGGRESSIVE, x: 300, y: 350 },
                { type: GUARD_TYPE.AGGRESSIVE, x: 900, y: 350 },
                { type: GUARD_TYPE.STATIONARY, x: 50, y: 350 },
                { type: GUARD_TYPE.STATIONARY, x: 1150, y: 350 },
                { type: GUARD_TYPE.STANDARD, x: 400, y: 100 },
                { type: GUARD_TYPE.STANDARD, x: 800, y: 100 },
                { type: GUARD_TYPE.STANDARD, x: 400, y: 600 },
                { type: GUARD_TYPE.STANDARD, x: 800, y: 600 }
            ],
            hazards: [
                { type: "camera", x: 300, y: 150, range: 180 },
                { type: "camera", x: 900, y: 150, range: 180 },
                { type: "camera", x: 300, y: 550, range: 180 },
                { type: "camera", x: 900, y: 550, range: 180 },
                { type: "alarm", x: 600, y: 350, radius: 200 }
            ]
        }));

        // Mission 5: Executive Penthouse (Insane)
        this.missions.push(new Mission({
            id: "executive_penthouse",
            name: "Penthouse Extraction",
            description: "Extract the executive from a heavily fortified penthouse",
            difficulty: DIFFICULTY.INSANE,
            rewardXP: 2000,
            rewardReputation: 250,
            recommendedSquadSize: 4,
            briefing: "The ultimate challenge. A fortified penthouse with elite security and automated defenses throughout. This is a suicide mission for unprepared teams. Full squad recommended at maximum skill level. Multiple escape routes required.",
            objectives: [
                {
                    x: 1100,
                    y: 100,
                    width: 50,
                    height: 50,
                    name: "Extract Executive",
                    type: OBJECTIVE_TYPE.SECURE,
                    completed: false
                },
                {
                    x: 100,
                    y: 600,
                    width: 50,
                    height: 50,
                    name: "Reach Extraction",
                    type: OBJECTIVE_TYPE.ESCAPE,
                    completed: false
                }
            ],
            guards: [
                { type: GUARD_TYPE.PATROL_LEADER, x: 300, y: 250 },
                { type: GUARD_TYPE.PATROL_LEADER, x: 900, y: 250 },
                { type: GUARD_TYPE.PATROL_LEADER, x: 600, y: 500 },
                { type: GUARD_TYPE.AGGRESSIVE, x: 200, y: 150 },
                { type: GUARD_TYPE.AGGRESSIVE, x: 1000, y: 150 },
                { type: GUARD_TYPE.AGGRESSIVE, x: 200, y: 550 },
                { type: GUARD_TYPE.AGGRESSIVE, x: 1000, y: 550 },
                { type: GUARD_TYPE.STATIONARY, x: 600, y: 50 },
                { type: GUARD_TYPE.STATIONARY, x: 600, y: 650 },
                { type: GUARD_TYPE.STATIONARY, x: 50, y: 350 },
                { type: GUARD_TYPE.STATIONARY, x: 1150, y: 350 },
                { type: GUARD_TYPE.STANDARD, x: 400, y: 350 },
                { type: GUARD_TYPE.STANDARD, x: 800, y: 350 }
            ],
            hazards: [
                { type: "camera", x: 200, y: 100, range: 200 },
                { type: "camera", x: 1000, y: 100, range: 200 },
                { type: "camera", x: 200, y: 600, range: 200 },
                { type: "camera", x: 1000, y: 600, range: 200 },
                { type: "camera", x: 600, y: 350, range: 200 },
                { type: "alarm", x: 400, y: 250, radius: 250 },
                { type: "alarm", x: 800, y: 250, radius: 250 },
                { type: "alarm", x: 600, y: 500, radius: 250 }
            ]
        }));
    }

    /**
     * Get mission by ID
     */
    getMission(missionId) {
        return this.missions.find(m => m.id === missionId);
    }

    /**
     * Get all missions
     */
    getAllMissions() {
        return this.missions;
    }

    /**
     * Get missions by difficulty
     */
    getMissionsByDifficulty(difficulty) {
        return this.missions.filter(m => m.difficulty === difficulty);
    }

    /**
     * Start a mission
     */
    startMission(missionId) {
        const mission = this.getMission(missionId);
        if (!mission) {
            console.error(`Mission ${missionId} not found`);
            return null;
        }
        this.currentMission = mission;
        return mission;
    }

    /**
     * Complete a mission
     */
    completeMission(stats) {
        if (!this.currentMission) return false;

        this.currentMission.completed = true;
        this.currentMission.bestTime = stats.time || 0;
        this.currentMission.bestHeat = stats.finalHeat || 0;
        this.completedMissions.push(this.currentMission);

        return true;
    }

    /**
     * Get next recommended mission
     */
    getNextMission() {
        // Find first incomplete mission
        return this.missions.find(m => !m.completed);
    }

    /**
     * Get difficulty rating (for UI)
     */
    getDifficultyRating(difficulty) {
        const ratings = {
            [DIFFICULTY.EASY]: "★☆☆☆☆",
            [DIFFICULTY.MEDIUM]: "★★☆☆☆",
            [DIFFICULTY.HARD]: "★★★☆☆",
            [DIFFICULTY.VERY_HARD]: "★★★★☆",
            [DIFFICULTY.INSANE]: "★★★★★"
        };
        return ratings[difficulty] || "unknown";
    }
}

/**
 * Create a level from a mission
 */
class MissionLevelBuilder {
    static buildLevelFromMission(mission) {
        const level = new Level();

        // Clear default objectives and spawn points
        level.objectives = [];
        level.spawnPoints.guards = [];

        // Add mission objectives
        mission.objectives.forEach(obj => {
            level.objectives.push({
                x: obj.x,
                y: obj.y,
                width: obj.width,
                height: obj.height,
                name: obj.name,
                type: obj.type,
                completed: false
            });
        });

        // Add guard spawn points based on mission
        mission.guards.forEach(guard => {
            level.spawnPoints.guards.push({
                x: guard.x,
                y: guard.y,
                type: guard.type
            });
        });

        // Store hazards for level
        level.hazards = mission.hazards || [];
        level.missionData = mission;

        return level;
    }
}
