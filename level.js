class Level {
    constructor() {
        this.width = 1200;
        this.height = 700;
        this.tileSize = 40;
        this.walls = [];
        this.objectives = [];
        this.hidingSpots = [];
        this.spawnPoints = {};

        this.generateLevel();
    }

    generateLevel() {
        // Create facility layout
        // Walls: perimeter and internal walls

        // Outer walls
        this.walls.push({ x: 0, y: 0, width: this.width, height: 20 }); // top
        this.walls.push({ x: 0, y: this.height - 20, width: this.width, height: 20 }); // bottom
        this.walls.push({ x: 0, y: 0, width: 20, height: this.height }); // left
        this.walls.push({ x: this.width - 20, y: 0, width: 20, height: this.height }); // right

        // Internal walls - create rooms
        // Main corridor
        this.walls.push({ x: 300, y: 150, width: 20, height: 400 }); // left wing wall
        this.walls.push({ x: 900, y: 150, width: 20, height: 400 }); // right wing wall

        // Guard rooms
        this.walls.push({ x: 100, y: 200, width: 150, height: 20 }); // top wall of guard room
        this.walls.push({ x: 100, y: 350, width: 150, height: 20 }); // bottom wall of guard room

        // Server room (vault)
        this.walls.push({ x: 950, y: 300, width: 200, height: 20 }); // top
        this.walls.push({ x: 950, y: 450, width: 200, height: 20 }); // bottom
        this.walls.push({ x: 950, y: 300, width: 20, height: 150 }); // left
        this.walls.push({ x: 1130, y: 300, width: 20, height: 150 }); // right

        // Hiding spots
        this.hidingSpots.push({ x: 200, y: 250, width: 60, height: 60, name: "Cabinet" });
        this.hidingSpots.push({ x: 500, y: 300, width: 80, height: 80, name: "Desk Cluster" });
        this.hidingSpots.push({ x: 700, y: 400, width: 70, height: 70, name: "Plant Cover" });
        this.hidingSpots.push({ x: 1000, y: 500, width: 100, height: 60, name: "Shadows" });

        // Objectives
        this.objectives.push({
            x: 1050,
            y: 375,
            width: 50,
            height: 50,
            name: "Server Access",
            completed: false
        });

        // Spawn points
        this.spawnPoints.player = { x: 100, y: 100 };
        this.spawnPoints.guards = [
            { x: 600, y: 200 },
            { x: 400, y: 500 },
            { x: 750, y: 350 }
        ];
    }

    isWall(x, y, radius = 15) {
        for (let wall of this.walls) {
            if (this.rectCircleCollide(wall, x, y, radius)) {
                return true;
            }
        }
        return false;
    }

    rectCircleCollide(rect, cx, cy, radius) {
        const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

        const distX = cx - closestX;
        const distY = cy - closestY;

        return (distX * distX + distY * distY) < (radius * radius);
    }

    getHidingSpotAt(x, y, radius = 30) {
        for (let spot of this.hidingSpots) {
            const dist = Math.hypot(x - (spot.x + spot.width / 2), y - (spot.y + spot.height / 2));
            if (dist < radius) {
                return spot;
            }
        }
        return null;
    }

    getObjectiveAt(x, y, radius = 30) {
        for (let obj of this.objectives) {
            const dist = Math.hypot(x - (obj.x + obj.width / 2), y - (obj.y + obj.height / 2));
            if (dist < radius) {
                return obj;
            }
        }
        return null;
    }

    draw(ctx) {
        // Draw walls
        ctx.fillStyle = "#444444";
        for (let wall of this.walls) {
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        }

        // Draw objectives
        ctx.fillStyle = "#ff6b6b";
        ctx.strokeStyle = "#ff6b6b";
        ctx.lineWidth = 2;
        for (let obj of this.objectives) {
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.strokeRect(obj.x - 5, obj.y - 5, obj.width + 10, obj.height + 10);

            // Draw objective indicator
            if (!obj.completed) {
                ctx.font = "12px Arial";
                ctx.fillStyle = "#ff6b6b";
                ctx.textAlign = "center";
                ctx.fillText("●", obj.x + obj.width / 2, obj.y + obj.height / 2 + 4);
            }
        }

        // Draw hiding spots (subtle)
        ctx.fillStyle = "rgba(100, 150, 100, 0.2)";
        ctx.strokeStyle = "#4ecdc4";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        for (let spot of this.hidingSpots) {
            ctx.fillRect(spot.x, spot.y, spot.width, spot.height);
            ctx.strokeRect(spot.x, spot.y, spot.width, spot.height);
        }
        ctx.setLineDash([]);

        // Draw grid for reference
        ctx.strokeStyle = "rgba(100, 100, 100, 0.1)";
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= this.width; x += this.tileSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        for (let y = 0; y <= this.height; y += this.tileSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
    }
}
