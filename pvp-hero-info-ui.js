/**
 * NEXUS Hero Info UI
 * Displays hero difficulty, learning tips, synergies, and matchup narratives
 */

class HeroInfoUI {
    /**
     * Create hero profile card element
     */
    static createHeroCard(heroName, width = 400, height = 600) {
        const profile = HeroDifficultySystem.getHeroProfile(heroName);
        if (!profile) return null;

        const container = document.createElement("div");
        container.className = "hero-card";
        container.style.width = width + "px";
        container.style.height = height + "px";
        container.style.backgroundColor = "#1a1f3a";
        container.style.border = "2px solid #00d4ff";
        container.style.borderRadius = "8px";
        container.style.padding = "20px";
        container.style.color = "#ffffff";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.overflow = "auto";
        container.style.boxShadow = "0 0 20px rgba(0, 212, 255, 0.3)";

        // Header with name and difficulty
        const header = document.createElement("div");
        header.style.borderBottom = "2px solid #00d4ff";
        header.style.paddingBottom = "15px";
        header.style.marginBottom = "15px";

        const titleDiv = document.createElement("div");
        titleDiv.style.display = "flex";
        titleDiv.style.justifyContent = "space-between";
        titleDiv.style.alignItems = "center";
        titleDiv.style.marginBottom = "10px";

        const nameEl = document.createElement("h2");
        nameEl.textContent = heroName;
        nameEl.style.margin = "0";
        nameEl.style.color = "#00ff88";
        nameEl.style.fontSize = "24px";

        const difficultyBadge = document.createElement("span");
        difficultyBadge.textContent = profile.difficulty;
        difficultyBadge.style.backgroundColor = HeroDifficultySystem.getDifficultyColor(profile.difficulty);
        difficultyBadge.style.color = "#ffffff";
        difficultyBadge.style.padding = "5px 12px";
        difficultyBadge.style.borderRadius = "20px";
        difficultyBadge.style.fontSize = "12px";
        difficultyBadge.style.fontWeight = "bold";

        titleDiv.appendChild(nameEl);
        titleDiv.appendChild(difficultyBadge);

        const archetypeEl = document.createElement("p");
        archetypeEl.textContent = `${profile.archetype} • ${profile.playstyle}`;
        archetypeEl.style.margin = "0";
        archetypeEl.style.color = "#9d4edd";
        archetypeEl.style.fontSize = "14px";

        header.appendChild(titleDiv);
        header.appendChild(archetypeEl);

        // Strengths
        const strengthsDiv = document.createElement("div");
        strengthsDiv.style.marginBottom = "15px";
        const strengthsTitle = document.createElement("h3");
        strengthsTitle.textContent = "💪 Strengths";
        strengthsTitle.style.color = "#00ff88";
        strengthsTitle.style.fontSize = "14px";
        strengthsTitle.style.margin = "0 0 8px 0";
        strengthsDiv.appendChild(strengthsTitle);

        const strengthsList = document.createElement("ul");
        strengthsList.style.margin = "0";
        strengthsList.style.paddingLeft = "20px";
        strengthsList.style.color = "#cccccc";
        strengthsList.style.fontSize = "12px";
        profile.strengths.forEach(strength => {
            const li = document.createElement("li");
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
        strengthsDiv.appendChild(strengthsList);

        // Weaknesses
        const weaknessesDiv = document.createElement("div");
        weaknessesDiv.style.marginBottom = "15px";
        const weaknessesTitle = document.createElement("h3");
        weaknessesTitle.textContent = "⚠️ Weaknesses";
        weaknessesTitle.style.color = "#ff6b6b";
        weaknessesTitle.style.fontSize = "14px";
        weaknessesTitle.style.margin = "0 0 8px 0";
        weaknessesDiv.appendChild(weaknessesTitle);

        const weaknessesList = document.createElement("ul");
        weaknessesList.style.margin = "0";
        weaknessesList.style.paddingLeft = "20px";
        weaknessesList.style.color = "#cccccc";
        weaknessesList.style.fontSize = "12px";
        profile.weaknesses.forEach(weakness => {
            const li = document.createElement("li");
            li.textContent = weakness;
            weaknessesList.appendChild(li);
        });
        weaknessesDiv.appendChild(weaknessesList);

        // Tips
        const tipsDiv = document.createElement("div");
        const tipsTitle = document.createElement("h3");
        tipsTitle.textContent = "💡 Learning Tips";
        tipsTitle.style.color = "#ffd700";
        tipsTitle.style.fontSize = "14px";
        tipsTitle.style.margin = "0 0 8px 0";
        tipsDiv.appendChild(tipsTitle);

        const tipsList = document.createElement("ul");
        tipsList.style.margin = "0";
        tipsList.style.paddingLeft = "20px";
        tipsList.style.color = "#cccccc";
        tipsList.style.fontSize = "12px";
        profile.tips.forEach(tip => {
            const li = document.createElement("li");
            li.textContent = tip;
            li.style.marginBottom = "8px";
            tipsList.appendChild(li);
        });
        tipsDiv.appendChild(tipsList);

        container.appendChild(header);
        container.appendChild(strengthsDiv);
        container.appendChild(weaknessesDiv);
        container.appendChild(tipsDiv);

        return container;
    }

    /**
     * Create synergy display
     */
    static createSynergyCard(heroName, width = 350, height = 400) {
        const container = document.createElement("div");
        container.className = "synergy-card";
        container.style.width = width + "px";
        container.style.height = height + "px";
        container.style.backgroundColor = "#1a1f3a";
        container.style.border = "2px solid #9d4edd";
        container.style.borderRadius = "8px";
        container.style.padding = "15px";
        container.style.color = "#ffffff";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.overflow = "auto";
        container.style.boxShadow = "0 0 15px rgba(157, 78, 221, 0.3)";

        // Title
        const title = document.createElement("h2");
        title.textContent = `${heroName} Synergies`;
        title.style.margin = "0 0 15px 0";
        title.style.color = "#9d4edd";
        title.style.fontSize = "18px";
        title.style.borderBottom = "2px solid #9d4edd";
        title.style.paddingBottom = "10px";
        container.appendChild(title);

        // Faction
        const faction = MatchupSystem.getFaction(heroName);
        const factionDiv = document.createElement("div");
        factionDiv.style.marginBottom = "15px";
        factionDiv.style.padding = "10px";
        factionDiv.style.backgroundColor = "rgba(157, 78, 221, 0.1)";
        factionDiv.style.borderLeft = "3px solid #9d4edd";
        factionDiv.innerHTML = `<strong>Faction:</strong> ${faction}`;
        container.appendChild(factionDiv);

        // Allies
        const alliesDiv = document.createElement("div");
        alliesDiv.style.marginBottom = "15px";
        const alliesTitle = document.createElement("h3");
        alliesTitle.textContent = "🤝 Recommended Allies";
        alliesTitle.style.color = "#00ff88";
        alliesTitle.style.fontSize = "14px";
        alliesTitle.style.margin = "0 0 8px 0";
        alliesDiv.appendChild(alliesTitle);

        const allies = MatchupSystem.getRecommendedTeammates(heroName);
        if (allies.length > 0) {
            const alliesList = document.createElement("div");
            alliesList.style.display = "flex";
            alliesList.style.flexWrap = "wrap";
            alliesList.style.gap = "8px";
            allies.forEach(ally => {
                const tag = document.createElement("span");
                tag.textContent = ally.toUpperCase();
                tag.style.backgroundColor = "#00ff88";
                tag.style.color = "#1a1f3a";
                tag.style.padding = "5px 10px";
                tag.style.borderRadius = "4px";
                tag.style.fontSize = "12px";
                tag.style.fontWeight = "bold";
                alliesList.appendChild(tag);
            });
            alliesDiv.appendChild(alliesList);
        } else {
            alliesDiv.innerHTML += "<p style='color:#999;font-size:12px;margin:0;'>No specific synergies</p>";
        }
        container.appendChild(alliesDiv);

        // Counters
        const countersDiv = document.createElement("div");
        const countersTitle = document.createElement("h3");
        countersTitle.textContent = "⚔️ Countered By";
        countersTitle.style.color = "#ff6b6b";
        countersTitle.style.fontSize = "14px";
        countersTitle.style.margin = "0 0 8px 0";
        countersDiv.appendChild(countersTitle);

        const counters = MatchupSystem.getCounterHeroes(heroName);
        if (counters.length > 0) {
            const countersList = document.createElement("div");
            countersList.style.display = "flex";
            countersList.style.flexWrap = "wrap";
            countersList.style.gap = "8px";
            counters.forEach(counter => {
                const tag = document.createElement("span");
                tag.textContent = counter.toUpperCase();
                tag.style.backgroundColor = "#ff6b6b";
                tag.style.color = "#ffffff";
                tag.style.padding = "5px 10px";
                tag.style.borderRadius = "4px";
                tag.style.fontSize = "12px";
                tag.style.fontWeight = "bold";
                countersList.appendChild(tag);
            });
            countersDiv.appendChild(countersList);
        } else {
            countersDiv.innerHTML += "<p style='color:#999;font-size:12px;margin:0;'>Well balanced</p>";
        }
        container.appendChild(countersDiv);

        return container;
    }

    /**
     * Create learning path guide
     */
    static createLearningPathUI(width = 500, height = 600) {
        const container = document.createElement("div");
        container.className = "learning-path";
        container.style.width = width + "px";
        container.style.height = height + "px";
        container.style.backgroundColor = "#1a1f3a";
        container.style.border = "2px solid #ffd700";
        container.style.borderRadius = "8px";
        container.style.padding = "20px";
        container.style.color = "#ffffff";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.overflow = "auto";
        container.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.3)";

        // Title
        const title = document.createElement("h2");
        title.textContent = "📚 Hero Learning Path";
        title.style.margin = "0 0 20px 0";
        title.style.color = "#ffd700";
        title.style.fontSize = "20px";
        title.style.textAlign = "center";
        container.appendChild(title);

        const path = HeroDifficultySystem.getLearningPath();

        // Description
        const desc = document.createElement("p");
        desc.style.color = "#cccccc";
        desc.style.fontSize = "12px";
        desc.style.marginBottom = "20px";
        desc.textContent = "Master NEXUS by progressing through difficulty stages:";
        container.appendChild(desc);

        // Stage 1: Easy
        const stage1 = document.createElement("div");
        stage1.style.marginBottom = "20px";
        const s1Title = document.createElement("h3");
        s1Title.textContent = "🟢 Stage 1: Beginner (Easy)";
        s1Title.style.color = "#4caf50";
        s1Title.style.fontSize = "14px";
        s1Title.style.margin = "0 0 10px 0";
        stage1.appendChild(s1Title);

        const s1List = document.createElement("div");
        s1List.style.display = "flex";
        s1List.style.flexWrap = "wrap";
        s1List.style.gap = "8px";
        path.stage1.forEach(hero => {
            const tag = document.createElement("span");
            tag.textContent = hero.toUpperCase();
            tag.style.backgroundColor = "#4caf50";
            tag.style.color = "#ffffff";
            tag.style.padding = "6px 12px";
            tag.style.borderRadius = "4px";
            tag.style.fontSize = "12px";
            tag.style.fontWeight = "bold";
            s1List.appendChild(tag);
        });
        stage1.appendChild(s1List);
        container.appendChild(stage1);

        // Stage 2: Medium
        const stage2 = document.createElement("div");
        stage2.style.marginBottom = "20px";
        const s2Title = document.createElement("h3");
        s2Title.textContent = "🟠 Stage 2: Intermediate (Medium)";
        s2Title.style.color = "#ff9800";
        s2Title.style.fontSize = "14px";
        s2Title.style.margin = "0 0 10px 0";
        stage2.appendChild(s2Title);

        const s2List = document.createElement("div");
        s2List.style.display = "flex";
        s2List.style.flexWrap = "wrap";
        s2List.style.gap = "8px";
        path.stage2.forEach(hero => {
            const tag = document.createElement("span");
            tag.textContent = hero.toUpperCase();
            tag.style.backgroundColor = "#ff9800";
            tag.style.color = "#ffffff";
            tag.style.padding = "6px 12px";
            tag.style.borderRadius = "4px";
            tag.style.fontSize = "12px";
            tag.style.fontWeight = "bold";
            s2List.appendChild(tag);
        });
        stage2.appendChild(s2List);
        container.appendChild(stage2);

        // Stage 3: Hard
        const stage3 = document.createElement("div");
        const s3Title = document.createElement("h3");
        s3Title.textContent = "🔴 Stage 3: Advanced (Hard)";
        s3Title.style.color = "#f44336";
        s3Title.style.fontSize = "14px";
        s3Title.style.margin = "0 0 10px 0";
        stage3.appendChild(s3Title);

        const s3List = document.createElement("div");
        s3List.style.display = "flex";
        s3List.style.flexWrap = "wrap";
        s3List.style.gap = "8px";
        path.stage3.forEach(hero => {
            const tag = document.createElement("span");
            tag.textContent = hero.toUpperCase();
            tag.style.backgroundColor = "#f44336";
            tag.style.color = "#ffffff";
            tag.style.padding = "6px 12px";
            tag.style.borderRadius = "4px";
            tag.style.fontSize = "12px";
            tag.style.fontWeight = "bold";
            s3List.appendChild(tag);
        });
        stage3.appendChild(s3List);
        container.appendChild(stage3);

        return container;
    }

    /**
     * Create difficulty comparison matrix
     */
    static createDifficultyMatrix(width = 600, height = 400) {
        const container = document.createElement("div");
        container.className = "difficulty-matrix";
        container.style.width = width + "px";
        container.style.height = "auto";
        container.style.backgroundColor = "#1a1f3a";
        container.style.border = "2px solid #00d4ff";
        container.style.borderRadius = "8px";
        container.style.padding = "20px";
        container.style.color = "#ffffff";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.boxShadow = "0 0 15px rgba(0, 212, 255, 0.2)";

        const title = document.createElement("h2");
        title.textContent = "⚙️ All Heroes - Difficulty & Playstyle";
        title.style.margin = "0 0 20px 0";
        title.style.color = "#00d4ff";
        title.style.fontSize = "18px";
        title.style.textAlign = "center";
        container.appendChild(title);

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "12px";

        // Header
        const header = table.createTHead();
        const headerRow = header.insertRow();
        const headers = ["Hero", "Role", "Difficulty", "Archetype"];
        headers.forEach(h => {
            const th = document.createElement("th");
            th.textContent = h;
            th.style.color = "#00ff88";
            th.style.padding = "10px";
            th.style.textAlign = "left";
            th.style.borderBottom = "2px solid #00d4ff";
            headerRow.appendChild(th);
        });

        // Body
        const body = table.createTBody();
        const allHeroes = Object.keys(HeroDifficultySystem.HERO_PROFILES);
        allHeroes.sort().forEach(hero => {
            const profile = HeroDifficultySystem.getHeroProfile(hero);
            const row = body.insertRow();
            row.style.borderBottom = "1px solid rgba(0, 212, 255, 0.2)";

            // Name
            const nameCell = row.insertCell();
            nameCell.textContent = hero.charAt(0).toUpperCase() + hero.slice(1);
            nameCell.style.padding = "8px";

            // Role (from faction)
            const roleCell = row.insertCell();
            const faction = MatchupSystem.getFaction(hero);
            roleCell.textContent = faction.split(" ")[0]; // Get first word
            roleCell.style.padding = "8px";

            // Difficulty with color
            const diffCell = row.insertCell();
            diffCell.textContent = profile.difficulty;
            diffCell.style.padding = "8px";
            diffCell.style.color = HeroDifficultySystem.getDifficultyColor(profile.difficulty);
            diffCell.style.fontWeight = "bold";

            // Archetype
            const archCell = row.insertCell();
            archCell.textContent = profile.archetype;
            archCell.style.padding = "8px";
            archCell.style.color = "#9d4edd";
        });

        container.appendChild(table);
        return container;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HeroInfoUI };
}
