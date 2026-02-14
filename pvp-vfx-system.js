/**
 * NEXUS Visual Effects System
 * Particle effects, projectiles, and AoE visualization for abilities
 */

/**
 * Particle Effect
 */
class Particle {
    constructor(x, y, vx, vy, color, size = 5, lifetime = 1) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxSize = size;
        this.lifetime = lifetime;
        this.elapsed = 0;
        this.gravity = 200; // pixels per second^2
    }

    update(deltaTime) {
        this.elapsed += deltaTime;

        // Apply gravity
        this.vy += this.gravity * deltaTime;

        // Update position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Fade out
        const progress = this.elapsed / this.lifetime;
        this.size = this.maxSize * (1 - progress);

        return this.elapsed < this.lifetime;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 1 - (this.elapsed / this.lifetime);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

/**
 * Projectile Effect
 */
class Projectile {
    constructor(x, y, targetX, targetY, color, speed = 500, size = 8) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.speed = speed;
        this.size = size;
        this.elapsed = 0;

        // Calculate direction
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.hypot(dx, dy);
        this.vx = (dx / distance) * speed;
        this.vy = (dy / distance) * speed;
        this.distance = distance;
        this.traveled = 0;
    }

    update(deltaTime) {
        const moveAmount = this.speed * deltaTime;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.traveled += moveAmount;
        this.elapsed += deltaTime;

        return this.traveled < this.distance;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 0.1, this.y - this.vy * 0.1);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    reachedTarget() {
        return this.traveled >= this.distance;
    }
}

/**
 * Area Effect Zone
 */
class EffectZone {
    constructor(x, y, radius, color, duration = 3, damagePerSecond = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.duration = duration;
        this.elapsed = 0;
        this.damagePerSecond = damagePerSecond;
        this.pulsing = true;
    }

    update(deltaTime) {
        this.elapsed += deltaTime;
        return this.elapsed < this.duration;
    }

    draw(ctx) {
        const progress = this.elapsed / this.duration;
        const alpha = Math.max(0, 1 - progress);

        // Pulsing effect
        const pulse = Math.sin(this.elapsed * Math.PI * 2 * 2) * 10;
        const displayRadius = this.radius + pulse;

        // Fill
        ctx.fillStyle = this.color.replace(')', ', ' + (alpha * 0.3) + ')');
        ctx.beginPath();
        ctx.arc(this.x, this.y, displayRadius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = this.color.replace(')', ', ' + alpha + ')');
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    getHeroesInZone(allHeroes) {
        return allHeroes.filter(hero => {
            const distance = Math.hypot(hero.x - this.x, hero.y - this.y);
            return distance < this.radius;
        });
    }
}

/**
 * Damage Number (Floating damage indicator)
 */
class DamageNumber {
    constructor(x, y, damage, color = "#ff6b6b") {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.color = color;
        this.lifetime = 1.5;
        this.elapsed = 0;
        this.vx = (Math.random() - 0.5) * 50; // Random sideways
        this.vy = -100; // Float upward
    }

    update(deltaTime) {
        this.elapsed += deltaTime;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        return this.elapsed < this.lifetime;
    }

    draw(ctx) {
        const progress = this.elapsed / this.lifetime;
        const alpha = 1 - progress;

        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${20 + progress * 5}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(Math.floor(this.damage), this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

/**
 * Visual Effects Manager
 */
class VFXManager {
    constructor() {
        this.particles = [];
        this.projectiles = [];
        this.zones = [];
        this.damageNumbers = [];
    }

    /**
     * Create particle burst effect
     */
    burstEffect(x, y, color, count = 20, spread = 360, lifetime = 1) {
        for (let i = 0; i < count; i++) {
            const angle = (spread / count) * i * (Math.PI / 180);
            const speed = 200 + Math.random() * 100;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            this.particles.push(new Particle(x, y, vx, vy, color, 5, lifetime));
        }
    }

    /**
     * Create projectile
     */
    projectile(fromX, fromY, toX, toY, color, speed = 500) {
        this.projectiles.push(new Projectile(fromX, fromY, toX, toY, color, speed));
    }

    /**
     * Create AoE zone
     */
    zone(x, y, radius, color, duration = 3) {
        this.zones.push(new EffectZone(x, y, radius, color, duration));
    }

    /**
     * Show damage number
     */
    damageNumber(x, y, damage, color = "#ff6b6b") {
        this.damageNumbers.push(new DamageNumber(x, y, damage, color));
    }

    /**
     * Stun effect (stars)
     */
    stunEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i;
            const speed = 150;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            this.particles.push(new Particle(x, y, vx, vy, "#ffff00", 6, 0.8));
        }
    }

    /**
     * Heal effect (green particles)
     */
    healEffect(x, y, amount) {
        this.burstEffect(x, y, "rgba(0, 255, 136, 0.8)", 15, 360, 1.5);
        this.damageNumber(x, y - 20, `+${Math.floor(amount)}`, "#00ff88");
    }

    /**
     * Shield effect (cyan shield)
     */
    shieldEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const vx = Math.cos(angle) * 150;
            const vy = Math.sin(angle) * 150;

            this.particles.push(new Particle(x, y, vx, vy, "rgba(0, 212, 255, 0.8)", 4, 1));
        }
    }

    /**
     * Ability-specific effects
     */
    fireball(fromX, fromY, toX, toY) {
        // Fire projectile
        this.projectile(fromX, fromY, toX, toY, "rgba(255, 100, 0, 0.8)", 600);

        // Impact particles
        this.burstEffect(toX, toY, "rgba(255, 150, 0, 0.8)", 30, 360, 1.2);
    }

    flameLance(fromX, fromY, toX, toY) {
        // Flame projectile
        this.projectile(fromX, fromY, toX, toY, "rgba(255, 80, 0, 0.9)", 700);
    }

    iceProjectile(fromX, fromY, toX, toY) {
        // Ice projectile
        this.projectile(fromX, fromY, toX, toY, "rgba(100, 200, 255, 0.8)", 500);

        // Frost particles
        this.burstEffect(toX, toY, "rgba(150, 220, 255, 0.7)", 20, 360, 1.5);
    }

    lightningStrike(x, y) {
        // Lightning burst
        this.burstEffect(x, y, "rgba(255, 255, 0, 0.9)", 25, 360, 0.5);
        this.damageNumber(x, y, "⚡", "#ffff00");
    }

    slash(fromX, fromY, toX, toY, color = "rgba(255, 100, 100, 0.8)") {
        // Slash line effect
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.hypot(dx, dy);
        const midX = fromX + dx / 2;
        const midY = fromY + dy / 2;

        // Particles along slash
        for (let i = 0; i < 15; i++) {
            const progress = i / 15;
            const x = fromX + dx * progress;
            const y = fromY + dy * progress;
            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * Math.PI / 3;
            const speed = 200 + Math.random() * 100;

            this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 4, 0.8));
        }
    }

    explosion(x, y, radius = 150) {
        // Large explosion
        this.burstEffect(x, y, "rgba(255, 150, 0, 0.8)", 40, 360, 1.5);
        this.burstEffect(x, y, "rgba(255, 200, 0, 0.6)", 30, 360, 1.8);

        // Shockwave zone
        this.zone(x, y, radius, "rgba(255, 100, 0, 0.5)", 0.5);
    }

    /**
     * Update all effects
     */
    update(deltaTime) {
        // Update particles
        this.particles = this.particles.filter(p => p.update(deltaTime));

        // Update projectiles
        this.projectiles = this.projectiles.filter(p => p.update(deltaTime));

        // Update zones
        this.zones = this.zones.filter(z => z.update(deltaTime));

        // Update damage numbers
        this.damageNumbers = this.damageNumbers.filter(d => d.update(deltaTime));
    }

    /**
     * Draw all effects
     */
    draw(ctx) {
        // Draw zones (behind everything)
        for (let zone of this.zones) {
            zone.draw(ctx);
        }

        // Draw particles
        for (let particle of this.particles) {
            particle.draw(ctx);
        }

        // Draw projectiles
        for (let projectile of this.projectiles) {
            projectile.draw(ctx);
        }

        // Draw damage numbers (on top)
        for (let dmg of this.damageNumbers) {
            dmg.draw(ctx);
        }
    }

    clear() {
        this.particles = [];
        this.projectiles = [];
        this.zones = [];
        this.damageNumbers = [];
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VFXManager, Particle, Projectile, EffectZone, DamageNumber };
}
