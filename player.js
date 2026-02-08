class Player {
    constructor(level, spawnPoint) {
        this.x = spawnPoint.x;
        this.y = spawnPoint.y;
        this.radius = 15;
        this.speed = 3;
        this.crouchSpeed = 1.5;
        this.maxSpeed = 3;

        this.velocityX = 0;
        this.velocityY = 0;

        this.isCrouching = false;
        this.isHiding = false;
        this.hidingSpot = null;

        this.keys = {};
        this.level = level;

        this.visibility = 100; // How visible the player is (0-100)
        this.noiseLevel = 0; // How much noise player makes

        this.setupInput();
    }

    setupInput() {
        document.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;

            if (e.key === " ") {
                e.preventDefault();
                this.tryHide();
            }
            if (e.key === "e" || e.key === "E") {
                e.preventDefault();
                this.tryInteract();
            }
        });

        document.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    update() {
        this.isCrouching = this.keys["shift"];

        // Handle hiding
        if (this.isHiding) {
            this.visibility = 0;
            this.noiseLevel = 0;
            return;
        }

        // Movement input
        this.velocityX = 0;
        this.velocityY = 0;

        const currentSpeed = this.isCrouching ? this.crouchSpeed : this.speed;

        if (this.keys["w"] || this.keys["arrowup"]) this.velocityY -= currentSpeed;
        if (this.keys["s"] || this.keys["arrowdown"]) this.velocityY += currentSpeed;
        if (this.keys["a"] || this.keys["arrowleft"]) this.velocityX -= currentSpeed;
        if (this.keys["d"] || this.keys["arrowright"]) this.velocityX += currentSpeed;

        // Calculate movement
        let newX = this.x + this.velocityX;
        let newY = this.y + this.velocityY;

        // Collision detection
        if (!this.level.isWall(newX, newY, this.radius)) {
            this.x = newX;
            this.y = newY;
        }

        // Update visibility based on movement
        if (this.isCrouching) {
            this.visibility = 30;
            this.noiseLevel = 10;
        } else if (this.velocityX !== 0 || this.velocityY !== 0) {
            this.visibility = 80;
            this.noiseLevel = 50;
        } else {
            this.visibility = 40;
            this.noiseLevel = 0;
        }

        // Keep within bounds
        this.x = Math.max(this.radius, Math.min(this.level.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.level.height - this.radius, this.y));
    }

    tryHide() {
        if (this.isHiding) {
            this.isHiding = false;
            this.hidingSpot = null;
            return;
        }

        const spot = this.level.getHidingSpotAt(this.x, this.y);
        if (spot) {
            this.isHiding = true;
            this.hidingSpot = spot;
        }
    }

    tryInteract() {
        const obj = this.level.getObjectiveAt(this.x, this.y);
        if (obj && !obj.completed) {
            obj.completed = true;
            return true;
        }
        return false;
    }

    draw(ctx) {
        // Draw player
        if (this.isHiding) {
            ctx.fillStyle = "rgba(0, 150, 0, 0.5)";
            ctx.strokeStyle = "#00ff00";
        } else if (this.isCrouching) {
            ctx.fillStyle = "rgba(100, 150, 200, 0.7)";
            ctx.strokeStyle = "#64a8ff";
        } else {
            ctx.fillStyle = "#4ecdc4";
            ctx.strokeStyle = "#00ffff";
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw direction indicator
        const dirX = Math.cos(0) * (this.radius + 8);
        const dirY = Math.sin(0) * (this.radius + 8);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + dirX * 1.5, this.y + dirY * 1.5);
        ctx.stroke();

        // Draw hiding indicator
        if (this.isHiding && this.hidingSpot) {
            ctx.fillStyle = "#00ff00";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText("HIDDEN", this.x, this.y - 30);
        }

        // Draw crouching indicator
        if (this.isCrouching) {
            ctx.fillStyle = "#64a8ff";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText("●●●", this.x, this.y - 30);
        }
    }

    getVisibility() {
        return this.visibility;
    }

    getNoiseLevel() {
        return this.noiseLevel;
    }
}
