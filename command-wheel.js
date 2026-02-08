class CommandWheel {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isActive = false;
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.radius = 120;
        this.commandRadius = 80;

        this.commands = [
            { id: "regroup", label: "REGROUP", icon: "⟲", hotkey: "Q" },
            { id: "holdPosition", label: "HOLD", icon: "■", hotkey: "E" },
            { id: "formation", label: "FORMATION", icon: "△", hotkey: "F", hasSubmenu: true },
            { id: "revive", label: "REVIVE", icon: "♕", hotkey: "R" },
            { id: "shareAmmo", label: "AMMO", icon: "★", hotkey: "T" },
            { id: "toggleStance", label: "STANCE", icon: "●", hotkey: "C" },
            { id: "callout", label: "CALLOUT", icon: "◉", hotkey: "V" },
            { id: "abilities", label: "ABILITIES", icon: "✦", hotkey: "X" }
        ];

        this.formations = [
            { id: "wedge", label: "WEDGE", icon: "►" },
            { id: "column", label: "COLUMN", icon: "↓" },
            { id: "line", label: "LINE", icon: "→" },
            { id: "spread", label: "SPREAD", icon: "✢" },
            { id: "holdPosition", label: "HOLD", icon: "■" }
        ];

        this.selectedIndex = -1;
        this.selectedFormation = -1;
        this.submenuActive = false;

        this.hotkeyBindings = {};
        this.initializeHotkeys();
    }

    initializeHotkeys() {
        document.addEventListener("keydown", (e) => {
            const key = e.key.toUpperCase();

            // Squad cycling hotkeys
            if (key === "TAB") {
                e.preventDefault();
                if (e.shiftKey) {
                    window.gameInstance?.squad?.switchPreviousMember();
                } else {
                    window.gameInstance?.squad?.switchNextMember();
                }
                return;
            }

            // Command hotkeys
            for (let i = 0; i < this.commands.length; i++) {
                if (this.commands[i].hotkey === key) {
                    e.preventDefault();
                    this.executeCommand(this.commands[i].id);
                    return;
                }
            }

            // Formation hotkeys (1-5)
            const formIndex = parseInt(key);
            if (formIndex >= 1 && formIndex <= 5) {
                if (window.gameInstance?.squad) {
                    const formation = this.formations[formIndex - 1];
                    if (formation) {
                        window.gameInstance.squad.issueCommand("formation", formation.id);
                    }
                }
            }
        });
    }

    toggleCommandWheel() {
        this.isActive = !this.isActive;
        this.selectedIndex = -1;
        this.submenuActive = false;
    }

    openCommandWheel() {
        this.isActive = true;
    }

    closeCommandWheel() {
        this.isActive = false;
        this.selectedIndex = -1;
        this.submenuActive = false;
    }

    handleMouseMove(x, y) {
        if (!this.isActive) return;

        const dx = x - this.centerX;
        const dy = y - this.centerY;
        const distance = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        if (distance < this.commandRadius) {
            this.selectedIndex = -1;
            this.submenuActive = false;
        } else if (distance < this.radius) {
            const anglePerCommand = (Math.PI * 2) / this.commands.length;
            let adjustedAngle = angle + anglePerCommand / 2;
            if (adjustedAngle < 0) adjustedAngle += Math.PI * 2;

            this.selectedIndex = Math.floor(adjustedAngle / anglePerCommand) % this.commands.length;

            if (this.commands[this.selectedIndex].hasSubmenu) {
                this.submenuActive = true;
            } else {
                this.submenuActive = false;
            }
        } else {
            this.selectedIndex = -1;
            this.submenuActive = false;
        }
    }

    handleMouseClick(x, y) {
        if (!this.isActive) return;

        const dx = x - this.centerX;
        const dy = y - this.centerY;
        const distance = Math.hypot(dx, dy);

        if (distance >= this.commandRadius && distance < this.radius) {
            if (this.selectedIndex >= 0 && this.selectedIndex < this.commands.length) {
                const command = this.commands[this.selectedIndex];
                if (command.hasSubmenu) {
                    // Handle formation selection
                    const angle = Math.atan2(dy, dx);
                    const anglePerFormation = (Math.PI * 2) / this.formations.length;
                    let adjustedAngle = angle + anglePerFormation / 2;
                    if (adjustedAngle < 0) adjustedAngle += Math.PI * 2;

                    this.selectedFormation = Math.floor(adjustedAngle / anglePerFormation) % this.formations.length;
                    const selectedForm = this.formations[this.selectedFormation];
                    this.executeCommand("formation", selectedForm.id);
                } else {
                    this.executeCommand(command.id);
                }
                this.closeCommandWheel();
            }
        }
    }

    executeCommand(commandId, param = null) {
        const squad = window.gameInstance?.squad;
        if (!squad) return;

        switch (commandId) {
            case "regroup":
                squad.issueCommand("regroup");
                break;
            case "holdPosition":
                squad.issueCommand("holdPosition");
                break;
            case "formation":
                if (param) {
                    squad.formation = param;
                    squad.changeFormation(param);
                }
                break;
            case "revive":
                // Revive nearest downed teammate
                const active = squad.getActiveMember();
                for (let member of squad.members) {
                    if (member.isDown && member !== active) {
                        const dist = Math.hypot(member.x - active.x, member.y - active.y);
                        if (dist < 80) {
                            squad.reviveTeammate(member.index);
                        }
                    }
                }
                break;
            case "shareAmmo":
                this.shareResourceWithNearest("ammo");
                break;
            case "toggleStance":
                const active2 = squad.getActiveMember();
                if (active2) {
                    active2.isCrouching = !active2.isCrouching;
                }
                break;
        }
    }

    shareResourceWithNearest(resourceType) {
        const squad = window.gameInstance?.squad;
        if (!squad) return;

        const active = squad.getActiveMember();
        if (!active) return;

        let nearest = null;
        let nearestDist = Infinity;

        for (let member of squad.members) {
            if (member !== active && !member.isDown) {
                const dist = Math.hypot(member.x - active.x, member.y - active.y);
                if (dist < 100 && dist < nearestDist) {
                    nearest = member;
                    nearestDist = dist;
                }
            }
        }

        if (nearest) {
            if (resourceType === "ammo" && active.ammo > 30) {
                const transfer = Math.min(30, active.ammo - 20);
                active.ammo -= transfer;
                nearest.ammo += transfer;
            }
        }
    }

    draw() {
        if (!this.isActive) return;

        const ctx = this.ctx;

        // Draw background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius + 30, 0, Math.PI * 2);
        ctx.fill();

        // Draw center circle
        ctx.fillStyle = "rgba(0, 255, 136, 0.3)";
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.commandRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw commands
        this.drawCommands();

        // Draw submenu if active
        if (this.submenuActive && this.selectedIndex >= 0) {
            this.drawFormationSubmenu();
        }

        // Draw center icon
        ctx.fillStyle = "#00ff88";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⊕", this.centerX, this.centerY);
    }

    drawCommands() {
        const ctx = this.ctx;
        const anglePerCommand = (Math.PI * 2) / this.commands.length;

        for (let i = 0; i < this.commands.length; i++) {
            const angle = i * anglePerCommand - Math.PI / 2;
            const x = this.centerX + Math.cos(angle) * this.commandRadius;
            const y = this.centerY + Math.sin(angle) * this.commandRadius;

            // Determine if selected
            const isSelected = i === this.selectedIndex;

            // Draw command button
            ctx.fillStyle = isSelected ? "#00ff88" : "rgba(0, 255, 136, 0.3)";
            ctx.beginPath();
            ctx.arc(x, y, 28, 0, Math.PI * 2);
            ctx.fill();

            // Draw command icon
            ctx.fillStyle = isSelected ? "#001100" : "#00ff88";
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.commands[i].icon, x, y);

            // Draw command label
            ctx.fillStyle = "#00ff88";
            ctx.font = "11px Arial";
            ctx.fillText(this.commands[i].label, x, y + 40);

            // Draw hotkey
            ctx.fillStyle = "rgba(0, 255, 136, 0.5)";
            ctx.font = "9px Arial";
            ctx.fillText(this.commands[i].hotkey, x, y + 52);
        }
    }

    drawFormationSubmenu() {
        const ctx = this.ctx;
        const anglePerCommand = (Math.PI * 2) / this.commands.length;
        const commandAngle = this.selectedIndex * anglePerCommand - Math.PI / 2;

        const submenuX = this.centerX + Math.cos(commandAngle) * this.commandRadius;
        const submenuY = this.centerY + Math.sin(commandAngle) * this.commandRadius;

        const anglePerFormation = (Math.PI * 2) / this.formations.length;
        const radius = 60;

        // Draw submenu background
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.beginPath();
        ctx.arc(submenuX, submenuY, radius + 20, 0, Math.PI * 2);
        ctx.fill();

        // Draw formations
        for (let i = 0; i < this.formations.length; i++) {
            const angle = i * anglePerFormation - Math.PI / 2;
            const x = submenuX + Math.cos(angle) * radius;
            const y = submenuY + Math.sin(angle) * radius;

            const isSelected = i === this.selectedFormation;

            ctx.fillStyle = isSelected ? "#64a8ff" : "rgba(100, 168, 255, 0.3)";
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = isSelected ? "#001100" : "#64a8ff";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.formations[i].icon, x, y);

            ctx.fillStyle = "#64a8ff";
            ctx.font = "10px Arial";
            ctx.fillText(this.formations[i].label, x, y + 28);
        }
    }
}
