class Squad {
    constructor(level, maxMembers = 4) {
        this.level = level;
        this.members = [];
        this.maxMembers = maxMembers;
        this.activeIndex = 0;
        this.formation = "wedge"; // wedge, column, line, spread, holdPosition
        this.sharedResources = {
            ammo: 300,
            medkits: 20,
            heatLevel: 0,
            objectivesCompleted: 0
        };
        this.morale = 100;
        this.commandQueue = [];
    }

    addMember(role, spawnPoint) {
        if (this.members.length >= this.maxMembers) {
            console.warn("Squad is at max capacity");
            return null;
        }

        const member = new SquadMember(
            this.members.length,
            role,
            spawnPoint,
            this.level,
            this
        );

        this.members.push(member);
        return member;
    }

    getActiveMember() {
        return this.members[this.activeIndex] || null;
    }

    switchToMember(index) {
        if (index >= 0 && index < this.members.length) {
            const oldActive = this.getActiveMember();
            if (oldActive) {
                oldActive.isControlled = false;
            }
            this.activeIndex = index;
            const newActive = this.getActiveMember();
            newActive.isControlled = true;
            return newActive;
        }
        return null;
    }

    switchNextMember() {
        const nextIndex = (this.activeIndex + 1) % this.members.length;
        return this.switchToMember(nextIndex);
    }

    switchPreviousMember() {
        const nextIndex = (this.activeIndex - 1 + this.members.length) % this.members.length;
        return this.switchToMember(nextIndex);
    }

    issueCommand(commandType, targetMemberIndex = null) {
        const command = {
            type: commandType,
            targetMember: targetMemberIndex,
            issuedAt: this.level.game?.gameTime || 0
        };
        this.commandQueue.push(command);

        // Execute command
        if (commandType === "regroup") {
            this.regroupSquad();
        } else if (commandType === "holdPosition") {
            this.setHoldPosition();
        } else if (commandType === "formation") {
            this.changeFormation(targetMemberIndex);
        } else if (commandType === "revive") {
            this.reviveTeammate(targetMemberIndex);
        }
    }

    regroupSquad() {
        const active = this.getActiveMember();
        if (!active) return;

        for (let member of this.members) {
            if (member !== active && !member.isDown) {
                member.moveToTarget(active.x, active.y);
                member.currentCommand = "regroup";
                member.commandTimer = 0;
            }
        }
    }

    setHoldPosition() {
        for (let member of this.members) {
            if (!member.isDown) {
                member.holdX = member.x;
                member.holdY = member.y;
                member.currentCommand = "holdPosition";
                member.velocityX = 0;
                member.velocityY = 0;
            }
        }
    }

    changeFormation(newFormation) {
        this.formation = newFormation || this.formation;
        const active = this.getActiveMember();
        if (!active) return;

        const positions = this.calculateFormationPositions(active.x, active.y);
        let memberIndex = 0;

        for (let member of this.members) {
            if (member !== active && memberIndex < positions.length) {
                member.moveToTarget(positions[memberIndex].x, positions[memberIndex].y);
                memberIndex++;
            }
        }
    }

    calculateFormationPositions(baseX, baseY) {
        const spacing = 60;
        const positions = [];

        switch (this.formation) {
            case "wedge":
                // Triangle formation
                positions.push({ x: baseX - spacing, y: baseY - spacing });
                positions.push({ x: baseX + spacing, y: baseY - spacing });
                positions.push({ x: baseX, y: baseY - spacing * 2 });
                break;

            case "column":
                // Line behind leader
                for (let i = 1; i <= 3; i++) {
                    positions.push({ x: baseX, y: baseY + spacing * i });
                }
                break;

            case "line":
                // Side by side
                positions.push({ x: baseX - spacing * 1.5, y: baseY });
                positions.push({ x: baseX - spacing * 0.75, y: baseY });
                positions.push({ x: baseX + spacing * 0.75, y: baseY });
                break;

            case "spread":
                // Spread out, covering area
                positions.push({ x: baseX - spacing * 2, y: baseY - spacing });
                positions.push({ x: baseX + spacing * 2, y: baseY - spacing });
                positions.push({ x: baseX, y: baseY + spacing * 1.5 });
                break;

            case "holdPosition":
                // Stay in place (no movement)
                break;
        }

        return positions;
    }

    reviveTeammate(targetIndex) {
        if (targetIndex >= 0 && targetIndex < this.members.length) {
            const target = this.members[targetIndex];
            const active = this.getActiveMember();

            if (target.isDown && active && !active.isDown) {
                const dist = Math.hypot(target.x - active.x, target.y - active.y);
                if (dist < 80) {
                    target.revive();
                    this.morale = Math.min(100, this.morale + 10);
                }
            }
        }
    }

    update() {
        // Update all members
        for (let member of this.members) {
            member.update();
        }

        // Calculate team heat level (max heat of all members)
        let maxHeat = 0;
        for (let member of this.members) {
            maxHeat = Math.max(maxHeat, member.heatLevel);
        }
        this.sharedResources.heatLevel = maxHeat;

        // Update morale based on team status
        const downCount = this.members.filter(m => m.isDown).length;
        if (downCount > 0) {
            this.morale = Math.max(0, this.morale - 0.5);
        } else {
            this.morale = Math.min(100, this.morale + 0.1);
        }

        // Maintain formation for non-controlled members
        if (this.formation !== "holdPosition") {
            const active = this.getActiveMember();
            if (active) {
                const positions = this.calculateFormationPositions(active.x, active.y);
                let memberIndex = 0;

                for (let member of this.members) {
                    if (member !== active && !member.isDown && member.currentCommand !== "regroup") {
                        if (memberIndex < positions.length) {
                            const target = positions[memberIndex];
                            const dist = Math.hypot(member.x - target.x, member.y - target.y);
                            if (dist > 10) {
                                member.moveToTarget(target.x, target.y);
                            }
                            memberIndex++;
                        }
                    }
                }
            }
        }
    }

    draw(ctx) {
        // Draw all members
        for (let member of this.members) {
            member.draw(ctx);
        }

        // Draw formation lines (optional visual)
        if (this.formation !== "holdPosition") {
            const active = this.getActiveMember();
            if (active) {
                ctx.strokeStyle = "rgba(0, 255, 136, 0.2)";
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);

                for (let member of this.members) {
                    if (member !== active && !member.isDown) {
                        ctx.beginPath();
                        ctx.moveTo(active.x, active.y);
                        ctx.lineTo(member.x, member.y);
                        ctx.stroke();
                    }
                }
                ctx.setLineDash([]);
            }
        }
    }

    getSquadStatus() {
        const active = this.getActiveMember();
        const status = {
            activeMember: active,
            activeIndex: this.activeIndex,
            totalMembers: this.members.length,
            membersDown: this.members.filter(m => m.isDown).length,
            morale: this.morale,
            formation: this.formation,
            sharedResources: { ...this.sharedResources },
            memberStates: this.members.map((m, i) => ({
                index: i,
                name: m.role.name,
                isDown: m.isDown,
                health: m.health,
                heatLevel: m.heatLevel,
                x: m.x,
                y: m.y
            }))
        };
        return status;
    }
}

class SquadMember extends Player {
    constructor(index, role, spawnPoint, level, squad) {
        super(level, spawnPoint);
        this.index = index;
        this.squad = squad;
        this.role = RoleSystem.getRole(role);
        RoleSystem.applyRoleStats(this, this.role);

        // Override player stats with role stats
        this.speed = this.roleStats.speed * 2;
        this.crouchSpeed = this.roleStats.crouchSpeed * 1.5;
        this.maxHealth = this.role.startingHealth;
        this.health = this.maxHealth;

        this.isControlled = (index === 0);
        this.isDown = false;
        this.downTimer = 0;

        this.ammo = this.role.startingAmmo;
        this.medkits = 2;

        this.heatLevel = 0;
        this.detectionTime = 0;

        this.abilities = { ...this.role.abilities };
        this.abilityCooldowns = {};
        for (let ability of this.abilities) {
            this.abilityCooldowns[ability.id] = 0;
        }

        this.currentCommand = null;
        this.commandTimer = 0;
        this.targetX = this.x;
        this.targetY = this.y;
        this.holdX = this.x;
        this.holdY = this.y;
    }

    moveToTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    update() {
        if (this.isDown) {
            this.downTimer++;
            if (this.downTimer > 300) {
                // Can be revived for 5 seconds
            }
            return;
        }

        if (this.isControlled) {
            // Player controlled - use parent update
            super.update();
        } else {
            // AI controlled
            this.updateAI();
        }

        // Update cooldowns
        for (let abilityId in this.abilityCooldowns) {
            if (this.abilityCooldowns[abilityId] > 0) {
                this.abilityCooldowns[abilityId]--;
            }
        }

        // Update heat level
        if (this.detectionTime > 0) {
            this.detectionTime--;
            this.heatLevel = Math.max(0, this.heatLevel - 0.5);
        }
    }

    updateAI() {
        // AI behavior for non-controlled members
        if (this.currentCommand === "regroup") {
            this.moveTowardsTarget();
            if (Math.hypot(this.x - this.targetX, this.y - this.targetY) < 30) {
                this.currentCommand = null;
                this.velocityX = 0;
                this.velocityY = 0;
            }
        } else if (this.currentCommand === "holdPosition") {
            // Maintain position and stance of active player
            const active = this.squad.getActiveMember();
            if (active) {
                this.isCrouching = active.isCrouching;
            }
            this.velocityX = 0;
            this.velocityY = 0;
        } else {
            // Follow formation
            this.moveTowardsTarget();
        }

        // Apply movement with collision
        let newX = this.x + this.velocityX;
        let newY = this.y + this.velocityY;

        if (!this.level.isWall(newX, newY, this.radius)) {
            this.x = newX;
            this.y = newY;
        }

        // Keep within bounds
        this.x = Math.max(this.radius, Math.min(this.level.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.level.height - this.radius, this.y));

        // Update visibility based on stance
        if (this.isCrouching) {
            this.visibility = 30 * this.roleStats.visibility;
        } else if (this.velocityX !== 0 || this.velocityY !== 0) {
            this.visibility = 80 * this.roleStats.visibility;
        } else {
            this.visibility = 40 * this.roleStats.visibility;
        }
    }

    moveTowardsTarget() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 5) {
            const angle = Math.atan2(dy, dx);
            const moveSpeed = this.isCrouching ? this.crouchSpeed : this.speed;
            this.velocityX = Math.cos(angle) * moveSpeed;
            this.velocityY = Math.sin(angle) * moveSpeed;
        } else {
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.goDown();
        }
    }

    goDown() {
        this.isDown = true;
        this.downTimer = 0;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    revive() {
        this.isDown = false;
        this.health = this.maxHealth * 0.5;
        this.downTimer = 0;
    }

    useAbility(abilityId) {
        const ability = this.abilities.find(a => a.id === abilityId);
        if (!ability || this.abilityCooldowns[abilityId] > 0) {
            return false;
        }

        // Execute ability effect
        this.abilityCooldowns[abilityId] = ability.cooldown;
        return true;
    }

    draw(ctx) {
        if (this.isDown) {
            // Draw downed state
            ctx.fillStyle = "#ff6b6b";
            ctx.globalAlpha = 0.6;
            ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
            ctx.globalAlpha = 1;

            ctx.fillStyle = "#ff6b6b";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText("DOWN", this.x, this.y - 35);
        } else {
            super.draw(ctx);
        }

        // Draw squad member indicator
        ctx.fillStyle = this.role.color;
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.role.symbol, this.x, this.y + this.radius + 15);

        // Draw member index
        if (this.isControlled) {
            ctx.strokeStyle = "#ffff00";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw heat indicator
        if (this.heatLevel > 0) {
            ctx.fillStyle = `rgb(${Math.min(255, this.heatLevel * 2.5)}, 0, 0)`;
            ctx.fillRect(this.x - 15, this.y - 25, 30 * (this.heatLevel / 100), 2);
        }
    }
}
