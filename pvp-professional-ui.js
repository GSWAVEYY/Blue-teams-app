/**
 * NEXUS Professional Landing Page & Lobby UI
 * Based on industry best practices from LoL, Valorant, Overwatch 2, Dota 2, CS2
 */

class ProfessionalLobbyUI {
    /**
     * Create professional main menu/landing page
     */
    static createLandingPage() {
        const container = document.createElement("div");
        container.className = "landing-page";
        container.style.cssText = `
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1429 100%);
            color: #ffffff;
            font-family: 'Arial', sans-serif;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        `;

        // Header section
        const header = document.createElement("div");
        header.style.cssText = `
            background: rgba(0, 212, 255, 0.05);
            border-bottom: 2px solid #00d4ff;
            padding: 20px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 80px;
        `;

        const logo = document.createElement("div");
        logo.style.cssText = `
            font-size: 32px;
            font-weight: bold;
            color: #00ff88;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
            letter-spacing: 2px;
        `;
        logo.textContent = "⚔️ NEXUS";
        header.appendChild(logo);

        const headerRight = document.createElement("div");
        headerRight.style.cssText = `
            display: flex;
            gap: 20px;
            align-items: center;
        `;

        const userInfo = document.createElement("div");
        userInfo.style.cssText = `
            text-align: right;
            font-size: 12px;
            color: #9d4edd;
        `;
        userInfo.innerHTML = `<div>Level 12 • Gold Rank</div><div>34 Wins • 28 Losses</div>`;
        headerRight.appendChild(userInfo);

        const settingsBtn = document.createElement("button");
        settingsBtn.textContent = "⚙️";
        settingsBtn.style.cssText = `
            background: rgba(157, 78, 221, 0.1);
            border: 2px solid #9d4edd;
            color: #9d4edd;
            font-size: 20px;
            width: 44px;
            height: 44px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
        `;
        headerRight.appendChild(settingsBtn);
        header.appendChild(headerRight);

        container.appendChild(header);

        // Main content area
        const mainContent = document.createElement("div");
        mainContent.style.cssText = `
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 24px;
            padding: 24px;
            max-width: 1600px;
            width: 100%;
            margin: 0 auto;
        `;

        // Left sidebar - News & Status
        const leftSidebar = document.createElement("div");
        leftSidebar.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 16px;
        `;

        // Status card
        const statusCard = document.createElement("div");
        statusCard.style.cssText = `
            background: rgba(0, 212, 255, 0.08);
            border: 2px solid #00d4ff;
            border-radius: 8px;
            padding: 16px;
            min-height: 120px;
        `;
        statusCard.innerHTML = `
            <h3 style="margin: 0 0 12px 0; color: #00d4ff; font-size: 14px;">📊 MATCH HISTORY</h3>
            <div style="font-size: 12px; color: #cccccc; line-height: 1.6;">
                <div>🔵 <span style="color: #00ff88;">Win</span> vs Red Team (+24 LP)</div>
                <div style="margin: 8px 0;">Last played: Krael, 12/3/8</div>
                <div style="color: #999; font-size: 11px;">45 min ago • Arena 1</div>
            </div>
        `;
        leftSidebar.appendChild(statusCard);

        // Recent heroes
        const heroesCard = document.createElement("div");
        heroesCard.style.cssText = `
            background: rgba(157, 78, 221, 0.08);
            border: 2px solid #9d4edd;
            border-radius: 8px;
            padding: 16px;
        `;
        heroesCard.innerHTML = `
            <h3 style="margin: 0 0 12px 0; color: #9d4edd; font-size: 14px;">⭐ MAIN HEROES</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <div style="text-align: center; font-size: 10px;">
                    <div style="background: rgba(0, 212, 255, 0.2); aspect-ratio: 1; border-radius: 4px; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid #00d4ff;">🗡️</div>
                    <div style="color: #00d4ff;">KRAEL</div>
                    <div style="color: #999; font-size: 9px;">45% WR</div>
                </div>
                <div style="text-align: center; font-size: 10px;">
                    <div style="background: rgba(76, 175, 80, 0.2); aspect-ratio: 1; border-radius: 4px; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid #4caf50;">🛡️</div>
                    <div style="color: #4caf50;">PETRA</div>
                    <div style="color: #999; font-size: 9px;">52% WR</div>
                </div>
                <div style="text-align: center; font-size: 10px;">
                    <div style="background: rgba(255, 215, 0, 0.2); aspect-ratio: 1; border-radius: 4px; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid #ffd700;">🏹</div>
                    <div style="color: #ffd700;">LYRIC</div>
                    <div style="color: #999; font-size: 9px;">48% WR</div>
                </div>
            </div>
        `;
        leftSidebar.appendChild(heroesCard);

        // News/updates card
        const newsCard = document.createElement("div");
        newsCard.style.cssText = `
            background: rgba(255, 215, 0, 0.08);
            border: 2px solid #ffd700;
            border-radius: 8px;
            padding: 16px;
            flex: 1;
        `;
        newsCard.innerHTML = `
            <h3 style="margin: 0 0 12px 0; color: #ffd700; font-size: 14px;">📰 LATEST NEWS</h3>
            <div style="font-size: 11px; color: #cccccc; line-height: 1.6;">
                <div style="margin-bottom: 10px;">
                    <div style="color: #ffd700; font-weight: bold;">Patch 2.1 Released</div>
                    <div style="color: #999;">Hero balance changes</div>
                </div>
                <div>
                    <div style="color: #ffd700; font-weight: bold;">Season 3 Begins</div>
                    <div style="color: #999;">New cosmetics available</div>
                </div>
            </div>
        `;
        leftSidebar.appendChild(newsCard);

        mainContent.appendChild(leftSidebar);

        // Center - Quick Play & Modes
        const centerSection = document.createElement("div");
        centerSection.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 16px;
        `;

        // Featured section
        const featuredCard = document.createElement("div");
        featuredCard.style.cssText = `
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(157, 78, 221, 0.1));
            border: 2px solid #00d4ff;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            min-height: 140px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        `;
        featuredCard.innerHTML = `
            <h2 style="margin: 0 0 12px 0; color: #00ff88; font-size: 24px;">READY TO PLAY?</h2>
            <p style="margin: 0 0 16px 0; color: #9d4edd; font-size: 12px;">Queue for ranked matches and climb the ladder</p>
            <button style="
                background: linear-gradient(135deg, #00d4ff, #00ff88);
                border: none;
                color: #1a1f3a;
                padding: 12px 32px;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
            " onmouseover="this.style.boxShadow='0 0 20px rgba(0, 255, 136, 0.6)'" onmouseout="this.style.boxShadow='none'">
                PLAY NOW
            </button>
        `;
        centerSection.appendChild(featuredCard);

        // Game modes grid
        const modesGrid = document.createElement("div");
        modesGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        `;

        const modes = [
            { icon: "⚔️", name: "Team Deathmatch", desc: "5v5 • 50 Kills", color: "#00d4ff" },
            { icon: "⚡", name: "Quick Match", desc: "3v3 • 30 Kills", color: "#00ff88" },
            { icon: "💣", name: "Search & Destroy", desc: "5v5 • Objective", color: "#ffd700" }
        ];

        modes.forEach(mode => {
            const modeCard = document.createElement("div");
            modeCard.style.cssText = `
                background: rgba(26, 31, 58, 0.5);
                border: 2px solid ${mode.color};
                border-radius: 6px;
                padding: 16px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
            `;
            modeCard.innerHTML = `
                <div style="font-size: 28px; margin-bottom: 8px;">${mode.icon}</div>
                <div style="color: ${mode.color}; font-weight: bold; font-size: 12px; margin-bottom: 4px;">${mode.name}</div>
                <div style="color: #999; font-size: 11px;">${mode.desc}</div>
            `;
            modeCard.onmouseover = () => {
                modeCard.style.background = `rgba(255, 255, 255, 0.05)`;
                modeCard.style.boxShadow = `0 0 15px rgba(${this._hexToRgb(mode.color).join(",")}, 0.3)`;
            };
            modeCard.onmouseout = () => {
                modeCard.style.background = "rgba(26, 31, 58, 0.5)";
                modeCard.style.boxShadow = "none";
            };
            modesGrid.appendChild(modeCard);
        });

        centerSection.appendChild(modesGrid);

        // Season progress
        const seasonCard = document.createElement("div");
        seasonCard.style.cssText = `
            background: rgba(26, 31, 58, 0.5);
            border: 2px solid #00d4ff;
            border-radius: 8px;
            padding: 16px;
        `;
        seasonCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; color: #00d4ff; font-size: 13px;">📊 SEASON 3 PROGRESS</h3>
                <div style="color: #9d4edd; font-weight: bold; font-size: 12px;">Plat 2 • 67 LP</div>
            </div>
            <div style="height: 8px; background: rgba(0, 212, 255, 0.1); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: 67%; background: linear-gradient(90deg, #00d4ff, #00ff88); border-radius: 4px;"></div>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: #999;">Next rank: Diamond (0/100 LP)</div>
        `;
        centerSection.appendChild(seasonCard);

        mainContent.appendChild(centerSection);

        container.appendChild(mainContent);

        return container;
    }

    /**
     * Create professional team lobby screen
     */
    static createProfessionalLobby(blueTeam = [], redTeam = [], playerTeam = "blue") {
        const container = document.createElement("div");
        container.className = "professional-lobby";
        container.style.cssText = `
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1429 100%);
            color: #ffffff;
            font-family: 'Arial', sans-serif;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // Top bar with match info
        const topBar = document.createElement("div");
        topBar.style.cssText = `
            background: rgba(0, 212, 255, 0.08);
            border-bottom: 2px solid #00d4ff;
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
        `;

        const matchInfo = document.createElement("div");
        matchInfo.style.cssText = `
            font-size: 13px;
            color: #cccccc;
            display: flex;
            gap: 24px;
        `;
        matchInfo.innerHTML = `
            <div><span style="color: #00d4ff;">Mode:</span> Team Deathmatch</div>
            <div><span style="color: #00d4ff;">Map:</span> Arena 1</div>
            <div><span style="color: #ffd700;">⏱️</span> <span id="match-timer">4:32</span></div>
        `;
        topBar.appendChild(matchInfo);

        const readySection = document.createElement("div");
        readySection.style.cssText = `
            display: flex;
            gap: 16px;
            align-items: center;
        `;

        const synergyBadge = document.createElement("div");
        synergyBadge.style.cssText = `
            background: rgba(76, 175, 80, 0.2);
            border: 2px solid #4caf50;
            border-radius: 6px;
            padding: 8px 16px;
            color: #4caf50;
            font-weight: bold;
            font-size: 12px;
        `;
        synergyBadge.innerHTML = `✓ Synergy: 78%`;
        readySection.appendChild(synergyBadge);

        const readyButton = document.createElement("button");
        readyButton.style.cssText = `
            background: linear-gradient(135deg, #00d4ff, #00ff88);
            border: none;
            color: #1a1f3a;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
        `;
        readyButton.textContent = "✓ READY";
        readyButton.onmouseover = () => {
            readyButton.style.boxShadow = "0 0 15px rgba(0, 255, 136, 0.5)";
        };
        readyButton.onmouseout = () => {
            readyButton.style.boxShadow = "none";
        };
        readySection.appendChild(readyButton);

        topBar.appendChild(readySection);
        container.appendChild(topBar);

        // Main lobby area
        const lobbyArea = document.createElement("div");
        lobbyArea.style.cssText = `
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            padding: 24px;
            overflow-y: auto;
        `;

        // Blue team
        const blueSection = this._createTeamSection(blueTeam, "blue", playerTeam === "blue");
        lobbyArea.appendChild(blueSection);

        // Red team
        const redSection = this._createTeamSection(redTeam, "red", playerTeam === "red");
        lobbyArea.appendChild(redSection);

        container.appendChild(lobbyArea);

        // Bottom bar - Communication
        const bottomBar = document.createElement("div");
        bottomBar.style.cssText = `
            background: rgba(157, 78, 221, 0.08);
            border-top: 2px solid #9d4edd;
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
        `;

        const quickMessages = document.createElement("div");
        quickMessages.style.cssText = `
            display: flex;
            gap: 8px;
        `;

        const messages = ["🟢 Ready", "👍 Locked", "🛡️ Tank", "⚔️ Damage", "🤝 Support"];
        messages.forEach(msg => {
            const btn = document.createElement("button");
            btn.textContent = msg;
            btn.style.cssText = `
                background: rgba(157, 78, 221, 0.3);
                border: 1px solid #9d4edd;
                color: #9d4edd;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.3s;
            `;
            btn.onmouseover = () => {
                btn.background = "rgba(157, 78, 221, 0.5)";
            };
            quickMessages.appendChild(btn);
        });
        bottomBar.appendChild(quickMessages);

        const voiceSection = document.createElement("div");
        voiceSection.style.cssText = `
            display: flex;
            gap: 12px;
            align-items: center;
        `;
        voiceSection.innerHTML = `
            <button style="
                background: rgba(76, 175, 80, 0.2);
                border: 1px solid #4caf50;
                color: #4caf50;
                width: 36px;
                height: 36px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            ">🎤</button>
            <div style="color: #999; font-size: 11px;">Voice: ON</div>
        `;
        bottomBar.appendChild(voiceSection);

        container.appendChild(bottomBar);

        return container;
    }

    /**
     * Create team section with hero cards
     */
    static _createTeamSection(team, teamColor, isPlayerTeam) {
        const section = document.createElement("div");
        const bgColor = teamColor === "blue" ? "rgba(0, 212, 255, 0.08)" : "rgba(255, 107, 107, 0.08)";
        const borderColor = teamColor === "blue" ? "#00d4ff" : "#ff6b6b";
        const accentColor = teamColor === "blue" ? "#00d4ff" : "#ff6b6b";

        section.style.cssText = `
            background: ${bgColor};
            border: 2px solid ${borderColor};
            border-radius: 8px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        `;

        // Team header
        const header = document.createElement("div");
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid ${borderColor};
            padding-bottom: 12px;
        `;

        const teamTitle = document.createElement("h2");
        teamTitle.style.cssText = `
            margin: 0;
            color: ${accentColor};
            font-size: 16px;
        `;
        teamTitle.textContent = teamColor === "blue" ? "🔵 BLUE TEAM" : "🔴 RED TEAM";
        header.appendChild(teamTitle);

        const teamStats = document.createElement("div");
        teamStats.style.cssText = `
            display: flex;
            gap: 16px;
            font-size: 11px;
            color: #999;
        `;
        teamStats.innerHTML = `
            <div>Roles: 1W 1R 1M</div>
            <div>Power: ★★★★☆</div>
        `;
        header.appendChild(teamStats);
        section.appendChild(header);

        // Hero cards
        const cardsContainer = document.createElement("div");
        cardsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        team.forEach((hero, index) => {
            const card = this._createHeroCard(hero, index, teamColor, isPlayerTeam);
            cardsContainer.appendChild(card);
        });

        section.appendChild(cardsContainer);

        return section;
    }

    /**
     * Create individual hero card
     */
    static _createHeroCard(heroName, slotIndex, teamColor, isPlayerSlot) {
        const card = document.createElement("div");
        const accentColor = teamColor === "blue" ? "#00d4ff" : "#ff6b6b";
        const roleColor = this._getRoleColor(heroName);

        card.style.cssText = `
            background: rgba(26, 31, 58, 0.6);
            border: 2px solid ${accentColor};
            border-radius: 6px;
            padding: 12px;
            display: grid;
            grid-template-columns: 60px 1fr 60px;
            gap: 12px;
            align-items: center;
        `;

        if (isPlayerSlot) {
            card.style.boxShadow = `0 0 20px rgba(${this._hexToRgb(accentColor).join(",")}, 0.3)`;
        }

        // Hero portrait area
        const portrait = document.createElement("div");
        portrait.style.cssText = `
            aspect-ratio: 1;
            background: linear-gradient(135deg, ${roleColor}44, ${accentColor}33);
            border: 2px solid ${roleColor};
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            position: relative;
        `;
        portrait.textContent = this._getHeroIcon(heroName);

        // Role icon overlay
        const roleIcon = document.createElement("div");
        roleIcon.style.cssText = `
            position: absolute;
            top: -4px;
            left: -4px;
            width: 24px;
            height: 24px;
            background: ${roleColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 2px solid #1a1f3a;
        `;
        roleIcon.textContent = this._getRoleEmoji(heroName);
        portrait.appendChild(roleIcon);

        card.appendChild(portrait);

        // Hero info
        const info = document.createElement("div");
        info.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 4px;
        `;

        const nameEl = document.createElement("div");
        nameEl.style.cssText = `
            font-weight: bold;
            color: ${accentColor};
            font-size: 12px;
        `;
        nameEl.textContent = "Player " + (slotIndex + 1);
        info.appendChild(nameEl);

        const heroEl = document.createElement("div");
        heroEl.style.cssText = `
            color: #ffffff;
            font-weight: bold;
            font-size: 13px;
        `;
        heroEl.textContent = heroName.charAt(0).toUpperCase() + heroName.slice(1);
        info.appendChild(heroEl);

        const roleEl = document.createElement("div");
        roleEl.style.cssText = `
            color: ${roleColor};
            font-size: 11px;
        `;
        roleEl.textContent = this._getHeroRole(heroName);
        info.appendChild(roleEl);

        card.appendChild(info);

        // Status area
        const status = document.createElement("div");
        status.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        `;

        const levelBadge = document.createElement("div");
        levelBadge.style.cssText = `
            background: rgba(157, 78, 221, 0.3);
            border: 1px solid #9d4edd;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #9d4edd;
            font-size: 14px;
        `;
        levelBadge.textContent = "12";
        status.appendChild(levelBadge);

        const readyBadge = document.createElement("div");
        readyBadge.style.cssText = `
            color: #4caf50;
            font-size: 11px;
            font-weight: bold;
        `;
        readyBadge.textContent = "✓ READY";
        status.appendChild(readyBadge);

        card.appendChild(status);

        return card;
    }

    /**
     * Helper: Get hero icon
     */
    static _getHeroIcon(heroName) {
        const icons = {
            grael: "🗡️", thaxus: "⚒️", aldrin: "🛡️",
            lyric: "🏹", vos: "🪤", kess: "👻",
            ember: "🔥", talen: "⚡", zephyr: "💨",
            petra: "✨", kora: "🌟", kyrax: "⛓️",
            raze: "💀", vesper: "🌙", silk: "🕸️"
        };
        return icons[heroName.toLowerCase()] || "⚔️";
    }

    /**
     * Helper: Get role emoji
     */
    static _getRoleEmoji(heroName) {
        const roles = {
            grael: "⚔️", thaxus: "⚔️", aldrin: "⚔️",
            lyric: "🏹", vos: "🏹", kess: "🏹",
            ember: "🔥", talen: "🔥", zephyr: "🔥",
            petra: "🛡️", kora: "🛡️", kyrax: "🛡️",
            raze: "💀", vesper: "💀", silk: "💀"
        };
        return roles[heroName.toLowerCase()] || "⚔️";
    }

    /**
     * Helper: Get hero role text
     */
    static _getHeroRole(heroName) {
        const roles = {
            grael: "WARRIOR", thaxus: "WARRIOR", aldrin: "WARRIOR",
            lyric: "RANGER", vos: "RANGER", kess: "RANGER",
            ember: "MAGE", talen: "MAGE", zephyr: "MAGE",
            petra: "GUARDIAN", kora: "GUARDIAN", kyrax: "GUARDIAN",
            raze: "ROGUE", vesper: "ROGUE", silk: "ROGUE"
        };
        return roles[heroName.toLowerCase()] || "HERO";
    }

    /**
     * Helper: Get role color
     */
    static _getRoleColor(heroName) {
        const colors = {
            grael: "#D4A574", thaxus: "#D4A574", aldrin: "#D4A574",
            lyric: "#C0C0C0", vos: "#C0C0C0", kess: "#C0C0C0",
            ember: "#FF6B6B", talen: "#FF6B6B", zephyr: "#FF6B6B",
            petra: "#00B4A0", kora: "#00B4A0", kyrax: "#00B4A0",
            raze: "#3A0CA3", vesper: "#3A0CA3", silk: "#3A0CA3"
        };
        return colors[heroName.toLowerCase()] || "#9d4edd";
    }

    /**
     * Helper: Convert hex to RGB
     */
    static _hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProfessionalLobbyUI };
}
