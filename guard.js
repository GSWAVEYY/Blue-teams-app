class Guard {
    constructor(level, spawnPoint) {
        this.x = spawnPoint.x;
        this.y = spawnPoint.y;
        this.radius = 12;
        this.speed = 1.5;

        this.velocityX = 0;
        this.velocityY = 0;

        this.level = level;
        this.state = "patrol"; // patrol, alert, hunting
        this.alertLevel = 0; // 0-100
        this.sightRange = 300;
        this.sightAngle = 120; // degrees of vision

        this.patrolPoints = this.generatePatrolPoints();
        this.currentPatrolIndex = 0;
        this.patrolTimer = 0;

        this.detectionTime = 0;
        this.lastSeenX = null;
        this.lastSeenY = null;

        this.visionCone = [];
    }

    generatePatrolPoints() {
        // Generate random patrol points for guards
        const points = [];
        const numPoints = 3;
        for (let i = 0; i < numPoints; i++) {
            let x, y, valid;
            do {
                valid = true;
                x = 200 + Math.random() * 800;
                y = 150 + Math.random() * 500;
                if (this.level.isWall(x, y, 50)) {
                    valid = false;
                }
            } while (!valid);
            points.push({ x, y });
        }
        return points;
    }

    canSeePoint(targetX, targetY, playerVisibility) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.hypot(dx, dy);

        // Check if in range
        if (distance > this.sightRange) {
            return false;
        }

        // Check line of sight (simple version - no obstruction for now)
        // In a full implementation, would check walls

        // Calculate angle
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        const guardAngle = 0; // Simplified - guards look outward

        // Check if in vision cone
        const angleDiff = Math.abs(targetAngle - guardAngle);
        if (angleDiff > this.sightAngle / 2 && angleDiff < 360 - this.sightAngle / 2) {
            return false;
        }

        // Visibility check - harder to see if player is hidden or crouching
        const detectionChance = playerVisibility;
        if (Math.random() * 100 > detectionChance) {
            return false;
        }

        return true;
    }

    update(player) {
        this.updateSightCone();

        // Check if can see player
        const canSeePlayer = this.canSeePoint(player.x, player.y, player.getVisibility());

        if (canSeePlayer) {
            this.lastSeenX = player.x;
            this.lastSeenY = player.y;
            this.detectionTime = 0;
            this.alertLevel = Math.min(100, this.alertLevel + 15);
            this.state = "hunting";
        } else {
            if (this.detectionTime > 0) {
                this.detectionTime--;
                this.alertLevel = Math.max(0, this.alertLevel - 2);
            }
            if (this.alertLevel <= 20) {
                this.state = "patrol";
            } else {
                this.state = "alert";
            }
        }

        // Behavior based on state
        if (this.state === "hunting" && this.lastSeenX !== null) {
            this.huntPlayer();
        } else if (this.state === "alert") {
            this.searchArea();
        } else {
            this.patrol();
        }

        // Movement
        let newX = this.x + this.velocityX;
        let newY = this.y + this.velocityY;

        if (!this.level.isWall(newX, newY, this.radius)) {
            this.x = newX;
            this.y = newY;
        }

        // Keep within bounds
        this.x = Math.max(this.radius, Math.min(this.level.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.level.height - this.radius, this.y));
    }

    patrol() {
        if (this.patrolPoints.length === 0) return;

        const target = this.patrolPoints[this.currentPatrolIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 20) {
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
            this.patrolTimer = 30; // Pause at waypoint
            this.velocityX = 0;
            this.velocityY = 0;
        } else if (this.patrolTimer > 0) {
            this.patrolTimer--;
            this.velocityX = 0;
            this.velocityY = 0;
        } else {
            const angle = Math.atan2(dy, dx);
            this.velocityX = Math.cos(angle) * this.speed * 0.5;
            this.velocityY = Math.sin(angle) * this.speed * 0.5;
        }
    }

    huntPlayer() {
        if (this.lastSeenX === null) return;

        const dx = this.lastSeenX - this.x;
        const dy = this.lastSeenY - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 5) {
            this.lastSeenX = null;
            this.lastSeenY = null;
            this.alertLevel = 80;
            this.detectionTime = 120;
        } else {
            const angle = Math.atan2(dy, dx);
            this.velocityX = Math.cos(angle) * this.speed;
            this.velocityY = Math.sin(angle) * this.speed;
        }
    }

    searchArea() {
        // Move around randomly but somewhat methodically
        if (Math.random() < 0.02) {
            const angle = Math.random() * Math.PI * 2;
            this.velocityX = Math.cos(angle) * this.speed * 0.6;
            this.velocityY = Math.sin(angle) * this.speed * 0.6;
        }
    }

    updateSightCone() {
        // Update vision cone for rendering
        this.visionCone = [];
        const numRays = 30;
        for (let i = 0; i < numRays; i++) {
            const angle = (i / numRays - 0.5) * (this.sightAngle * Math.PI / 180);
            const x = this.x + Math.cos(angle) * this.sightRange;
            const y = this.y + Math.sin(angle) * this.sightRange;
            this.visionCone.push({ x, y, angle });
        }
    }

    draw(ctx) {
        // Draw vision cone (light red)
        ctx.fillStyle = "rgba(255, 100, 100, 0.1)";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let point of this.visionCone) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();

        // Draw guard
        let color;
        if (this.state === "hunting") {
            color = "#ff4444";
        } else if (this.state === "alert") {
            color = "#ffaa44";
        } else {
            color = "#888888";
        }

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw alert indicator
        if (this.state !== "patrol") {
            ctx.fillStyle = "#ffaa44";
            ctx.font = "10px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`!`, this.x, this.y - 25);
        }

        // Draw alert bar
        ctx.fillStyle = "#333333";
        ctx.fillRect(this.x - 15, this.y - 25, 30, 3);
        ctx.fillStyle = "#ff4444";
        ctx.fillRect(this.x - 15, this.y - 25, (30 * this.alertLevel) / 100, 3);
    }

    getAlertLevel() {
        return this.alertLevel;
    }

    setState(newState) {
        this.state = newState;
    }
}
