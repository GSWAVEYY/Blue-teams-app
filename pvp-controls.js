/**
 * PVP Mobile Control System
 * Handles joystick, touch input, and ability buttons
 */

class MobileControls {
    constructor(canvas) {
        this.canvas = canvas;

        // Input state
        this.movement = { x: 0, y: 0 };
        this.targetPosition = { x: canvas.width / 2, y: canvas.height / 2 };

        // Joystick
        this.joystick = {
            active: false,
            baseX: 0,
            baseY: 0,
            x: 0,
            y: 0,
            radius: 60,
            outerRadius: 100,
            touchId: null
        };

        // Ability buttons
        this.abilityButtons = {
            q: { x: 0, y: 0, width: 80, height: 80, pressed: false },
            e: { x: 0, y: 0, width: 80, height: 80, pressed: false },
            r: { x: 0, y: 0, width: 80, height: 80, pressed: false }
        };

        // Keyboard fallback
        this.keyState = {};

        this.setupEventListeners();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Touch events
        document.addEventListener("touchstart", (e) => this.handleTouchStart(e), false);
        document.addEventListener("touchmove", (e) => this.handleTouchMove(e), false);
        document.addEventListener("touchend", (e) => this.handleTouchEnd(e), false);

        // Mouse fallback
        document.addEventListener("mousedown", (e) => this.handleMouseDown(e), false);
        document.addEventListener("mousemove", (e) => this.handleMouseMove(e), false);
        document.addEventListener("mouseup", (e) => this.handleMouseUp(e), false);

        // Keyboard fallback
        document.addEventListener("keydown", (e) => this.handleKeyDown(e), false);
        document.addEventListener("keyup", (e) => this.handleKeyUp(e), false);
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        for (let touch of e.touches) {
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            // Check if touch is on left side (movement joystick)
            if (x < rect.width / 2) {
                if (!this.joystick.active) {
                    this.joystick.active = true;
                    this.joystick.touchId = touch.identifier;
                    this.joystick.baseX = x;
                    this.joystick.baseY = y;
                }
            }
            // Check if touch is on ability buttons
            else {
                this.checkAbilityButtonTouch(x, y, true);
            }
        }
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        for (let touch of e.touches) {
            if (touch.identifier === this.joystick.touchId) {
                const rect = this.canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;

                // Calculate joystick position
                const dx = x - this.joystick.baseX;
                const dy = y - this.joystick.baseY;
                const distance = Math.hypot(dx, dy);

                if (distance > 0) {
                    const angle = Math.atan2(dy, dx);
                    const magnitude = Math.min(distance, this.joystick.outerRadius) / this.joystick.outerRadius;

                    this.joystick.x = this.joystick.baseX + Math.cos(angle) * magnitude * this.joystick.radius;
                    this.joystick.y = this.joystick.baseY + Math.sin(angle) * magnitude * this.joystick.radius;

                    // Update movement
                    this.movement.x = Math.cos(angle) * magnitude;
                    this.movement.y = Math.sin(angle) * magnitude;
                } else {
                    this.joystick.x = this.joystick.baseX;
                    this.joystick.y = this.joystick.baseY;
                    this.movement.x = 0;
                    this.movement.y = 0;
                }

                e.preventDefault();
            }
        }
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        for (let touch of e.changedTouches) {
            if (touch.identifier === this.joystick.touchId) {
                this.joystick.active = false;
                this.joystick.touchId = null;
                this.joystick.x = this.joystick.baseX;
                this.joystick.y = this.joystick.baseY;
                this.movement.x = 0;
                this.movement.y = 0;
            }
        }
    }

    /**
     * Check if touch hit ability button
     */
    checkAbilityButtonTouch(x, y, pressed) {
        for (let [ability, btn] of Object.entries(this.abilityButtons)) {
            if (x >= btn.x && x < btn.x + btn.width &&
                y >= btn.y && y < btn.y + btn.height) {
                btn.pressed = pressed;
                return ability;
            }
        }
        return null;
    }

    /**
     * Handle mouse down (fallback)
     */
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (e.button === 0) { // Left click
            if (x < rect.width / 2) {
                this.joystick.active = true;
                this.joystick.baseX = x;
                this.joystick.baseY = y;
            } else {
                this.checkAbilityButtonTouch(x, y, true);
            }
        }
    }

    /**
     * Handle mouse move (fallback)
     */
    handleMouseMove(e) {
        if (this.joystick.active) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const dx = x - this.joystick.baseX;
            const dy = y - this.joystick.baseY;
            const distance = Math.hypot(dx, dy);

            if (distance > 0) {
                const angle = Math.atan2(dy, dx);
                const magnitude = Math.min(distance, this.joystick.outerRadius) / this.joystick.outerRadius;

                this.joystick.x = this.joystick.baseX + Math.cos(angle) * magnitude * this.joystick.radius;
                this.joystick.y = this.joystick.baseY + Math.sin(angle) * magnitude * this.joystick.radius;

                this.movement.x = Math.cos(angle) * magnitude;
                this.movement.y = Math.sin(angle) * magnitude;
            }
        }
    }

    /**
     * Handle mouse up (fallback)
     */
    handleMouseUp(e) {
        if (e.button === 0) {
            this.joystick.active = false;
            this.joystick.x = this.joystick.baseX;
            this.joystick.y = this.joystick.baseY;
            this.movement.x = 0;
            this.movement.y = 0;

            // Reset ability button presses
            Object.values(this.abilityButtons).forEach(btn => btn.pressed = false);
        }
    }

    /**
     * Handle keyboard (fallback for desktop testing)
     */
    handleKeyDown(e) {
        this.keyState[e.key.toLowerCase()] = true;

        // WASD movement
        if (e.key.toLowerCase() === 'w') this.movement.y = -1;
        if (e.key.toLowerCase() === 's') this.movement.y = 1;
        if (e.key.toLowerCase() === 'a') this.movement.x = -1;
        if (e.key.toLowerCase() === 'd') this.movement.x = 1;

        // Ability keys
        if (e.key.toLowerCase() === 'q') this.abilityButtons.q.pressed = true;
        if (e.key.toLowerCase() === 'e') this.abilityButtons.e.pressed = true;
        if (e.key.toLowerCase() === 'r') this.abilityButtons.r.pressed = true;
    }

    /**
     * Handle keyboard up
     */
    handleKeyUp(e) {
        this.keyState[e.key.toLowerCase()] = false;

        // Reset movement
        let x = 0, y = 0;
        if (this.keyState['w']) y -= 1;
        if (this.keyState['s']) y += 1;
        if (this.keyState['a']) x -= 1;
        if (this.keyState['d']) x += 1;

        if (x !== 0 || y !== 0) {
            const magnitude = Math.hypot(x, y);
            this.movement.x = x / magnitude;
            this.movement.y = y / magnitude;
        } else {
            this.movement.x = 0;
            this.movement.y = 0;
        }

        // Ability keys up
        if (e.key.toLowerCase() === 'q') this.abilityButtons.q.pressed = false;
        if (e.key.toLowerCase() === 'e') this.abilityButtons.e.pressed = false;
        if (e.key.toLowerCase() === 'r') this.abilityButtons.r.pressed = false;
    }

    /**
     * Update button positions based on canvas size
     */
    updateButtonPositions(canvasWidth, canvasHeight) {
        const margin = 20;
        const buttonSize = 80;
        const spacing = 10;

        this.abilityButtons.q.x = canvasWidth - (buttonSize + spacing) * 3 - margin;
        this.abilityButtons.q.y = canvasHeight - buttonSize - margin;

        this.abilityButtons.e.x = canvasWidth - (buttonSize + spacing) * 2 - margin;
        this.abilityButtons.e.y = canvasHeight - buttonSize - margin;

        this.abilityButtons.r.x = canvasWidth - buttonSize - margin;
        this.abilityButtons.r.y = canvasHeight - buttonSize - margin;
    }

    /**
     * Get movement input (normalized)
     */
    getMovement() {
        const magnitude = Math.hypot(this.movement.x, this.movement.y);
        if (magnitude === 0) return { x: 0, y: 0 };

        return {
            x: this.movement.x / magnitude,
            y: this.movement.y / magnitude
        };
    }

    /**
     * Check if ability button was pressed
     */
    getAbilityInput(abilityKey) {
        return this.abilityButtons[abilityKey].pressed;
    }

    /**
     * Draw control UI
     */
    draw(ctx) {
        ctx.save();

        // Draw joystick
        if (this.joystick.active || true) { // Always visible
            // Outer circle
            ctx.fillStyle = "rgba(0, 212, 255, 0.1)";
            ctx.beginPath();
            ctx.arc(this.joystick.baseX, this.joystick.baseY, this.joystick.outerRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "rgba(0, 212, 255, 0.3)";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Inner stick
            ctx.fillStyle = this.joystick.active ?
                "rgba(0, 212, 255, 0.6)" :
                "rgba(0, 212, 255, 0.3)";
            ctx.beginPath();
            ctx.arc(this.joystick.x, this.joystick.y, this.joystick.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "rgba(0, 212, 255, 0.8)";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw ability buttons
        for (let [ability, btn] of Object.entries(this.abilityButtons)) {
            ctx.fillStyle = btn.pressed ?
                "rgba(0, 212, 255, 0.4)" :
                "rgba(0, 212, 255, 0.2)";

            ctx.beginPath();
            ctx.roundRect(btn.x, btn.y, btn.width, btn.height, 8);
            ctx.fill();

            ctx.strokeStyle = btn.pressed ?
                "rgba(0, 212, 255, 0.8)" :
                "rgba(0, 212, 255, 0.5)";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = "#00d4ff";
            ctx.font = "bold 20px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(ability.toUpperCase(), btn.x + btn.width / 2, btn.y + btn.height / 2);
        }

        ctx.restore();
    }
}

// Polyfill for roundRect
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (typeof r === 'undefined') r = 5;
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}
