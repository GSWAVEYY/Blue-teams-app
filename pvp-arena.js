/**
 * PVP Arena System
 * Defines arena maps and environments for different game modes
 */

const ARENA_TYPE = {
    TDM: "tdm",
    SEARCH: "search",
    KOTH: "koth"
};

class Arena {
    constructor(type, name, width, height) {
        this.type = type;
        this.name = name;
        this.width = width;
        this.height = height;
        this.walls = [];
        this.spawnPoints = { blue: [], red: [] };
        this.objectives = [];
        this.hazards = [];
    }

    /**
     * Add a wall to the arena
     */
    addWall(x, y, width, height) {
        this.walls.push({ x, y, width, height });
    }

    /**
     * Add spawn point
     */
    addSpawnPoint(team, x, y) {
        this.spawnPoints[team].push({ x, y });
    }

    /**
     * Add objective (bomb site, control point, etc)
     */
    addObjective(x, y, radius, type) {
        this.objectives.push({ x, y, radius, type, active: true });
    }

    /**
     * Add environmental hazard
     */
    addHazard(x, y, radius, type, damage = 10) {
        this.hazards.push({ x, y, radius, type, damage, active: true });
    }

    /**
     * Check if point is inside wall
     */
    isWall(x, y, radius = 0) {
        for (let wall of this.walls) {
            if (x + radius > wall.x &&
                x - radius < wall.x + wall.width &&
                y + radius > wall.y &&
                y - radius < wall.y + wall.height) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get safe spawn point for team
     */
    getRandomSpawnPoint(team) {
        const spawns = this.spawnPoints[team];
        return spawns[Math.floor(Math.random() * spawns.length)];
    }

    /**
     * Draw arena (walls, objectives, hazards)
     */
    draw(ctx) {
        // Draw walls
        ctx.fillStyle = "#1a1f3a";
        ctx.strokeStyle = "#00d4ff";
        ctx.lineWidth = 2;

        for (let wall of this.walls) {
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
        }

        // Draw objectives
        for (let obj of this.objectives) {
            ctx.fillStyle = obj.type === "bomb" ? "rgba(255, 100, 0, 0.3)" : "rgba(0, 255, 100, 0.3)";
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = obj.type === "bomb" ? "#ff6400" : "#00ff88";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw hazards
        for (let hazard of this.hazards) {
            ctx.fillStyle = "rgba(255, 50, 50, 0.2)";
            ctx.beginPath();
            ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#ff3333";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

/**
 * Arena Manager - Creates and manages arenas
 */
class ArenaManager {
    static createArena(gameMode, mapName = "default") {
        switch (gameMode) {
            case "tdm":
                return this.createTDMArena();
            case "search":
                return this.createSearchAndDestroyArena();
            case "koth":
                return this.createKothArena();
            default:
                return this.createTDMArena();
        }
    }

    /**
     * Create Team Deathmatch arena
     * Simple symmetrical layout with center and side areas
     */
    static createTDMArena() {
        const arena = new Arena(ARENA_TYPE.TDM, "Nexus Arena", 1920, 1080);

        // Blue spawn area (left side)
        arena.addWall(50, 100, 150, 300);
        arena.addWall(50, 500, 150, 300);

        // Red spawn area (right side)
        arena.addWall(1720, 100, 150, 300);
        arena.addWall(1720, 500, 150, 300);

        // Center walls (obstacle layout)
        arena.addWall(850, 300, 220, 100);
        arena.addWall(950, 600, 200, 100);
        arena.addWall(600, 450, 150, 150);
        arena.addWall(1200, 450, 150, 150);

        // Spawn points (Blue team)
        arena.addSpawnPoint("blue", 100, 150);
        arena.addSpawnPoint("blue", 100, 600);
        arena.addSpawnPoint("blue", 250, 350);

        // Spawn points (Red team)
        arena.addSpawnPoint("red", 1820, 150);
        arena.addSpawnPoint("red", 1820, 600);
        arena.addSpawnPoint("red", 1670, 350);

        // Environmental hazards
        arena.addHazard(960, 540, 100, "laser", 15);

        return arena;
    }

    /**
     * Create Search & Destroy arena
     * Asymmetrical with bomb sites
     */
    static createSearchAndDestroyArena() {
        const arena = new Arena(ARENA_TYPE.SEARCH, "Infiltration Site", 1920, 1080);

        // Blue spawn (attackers)
        arena.addWall(50, 250, 200, 400);

        // Red spawn (defenders)
        arena.addWall(1670, 250, 200, 400);

        // Middle structures
        arena.addWall(700, 200, 150, 200);
        arena.addWall(1070, 200, 150, 200);
        arena.addWall(600, 650, 300, 150);
        arena.addWall(1020, 650, 300, 150);

        // Bomb sites A and B
        arena.addObjective(400, 250, 80, "bomb"); // Site A
        arena.addObjective(1520, 750, 80, "bomb"); // Site B

        // Spawn points
        arena.addSpawnPoint("blue", 100, 300);
        arena.addSpawnPoint("blue", 100, 600);

        arena.addSpawnPoint("red", 1820, 300);
        arena.addSpawnPoint("red", 1820, 600);

        return arena;
    }

    /**
     * Create King of the Hill arena
     * Center control point
     */
    static createKothArena() {
        const arena = new Arena(ARENA_TYPE.KOTH, "Central Hub", 1920, 1080);

        // Side walls
        arena.addWall(50, 100, 250, 400);
        arena.addWall(50, 600, 250, 300);
        arena.addWall(1620, 100, 250, 400);
        arena.addWall(1620, 600, 250, 300);

        // Mid structures (leading to control point)
        arena.addWall(600, 150, 150, 200);
        arena.addWall(600, 750, 150, 200);
        arena.addWall(1170, 150, 150, 200);
        arena.addWall(1170, 750, 150, 200);

        // Central control point
        arena.addObjective(960, 540, 120, "control");

        // Spawn points
        arena.addSpawnPoint("blue", 100, 300);
        arena.addSpawnPoint("blue", 100, 700);

        arena.addSpawnPoint("red", 1820, 300);
        arena.addSpawnPoint("red", 1820, 700);

        return arena;
    }
}

/**
 * Minimap renderer for top-right corner
 */
class Minimap {
    constructor(arena, canvasWidth = 200, canvasHeight = 150) {
        this.arena = arena;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.scaleX = canvasWidth / arena.width;
        this.scaleY = canvasHeight / arena.height;
    }

    /**
     * Draw minimap
     */
    draw(ctx, heroes) {
        // Background
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Border
        ctx.strokeStyle = "#00d4ff";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw walls
        ctx.fillStyle = "#1a1f3a";
        for (let wall of this.arena.walls) {
            ctx.fillRect(
                wall.x * this.scaleX,
                wall.y * this.scaleY,
                wall.width * this.scaleX,
                wall.height * this.scaleY
            );
        }

        // Draw objectives
        for (let obj of this.arena.objectives) {
            ctx.fillStyle = obj.type === "bomb" ? "rgba(255, 100, 0, 0.6)" : "rgba(0, 255, 100, 0.6)";
            ctx.beginPath();
            ctx.arc(
                obj.x * this.scaleX,
                obj.y * this.scaleY,
                Math.max(3, obj.radius * this.scaleX),
                0, Math.PI * 2
            );
            ctx.fill();
        }

        // Draw heroes
        for (let hero of heroes) {
            const color = hero.team === "blue" ? "#00d4ff" : "#ff3333";
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(
                hero.x * this.scaleX,
                hero.y * this.scaleY,
                4,
                0, Math.PI * 2
            );
            ctx.fill();
        }
    }
}
