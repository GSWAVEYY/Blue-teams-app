/**
 * Enhanced Hero Selection Screen
 * Displays synergies, difficulty, matchups, and team composition analysis
 */

class EnhancedHeroSelection {
    constructor(gameState, uiManager) {
        this.gameState = gameState;
        this.uiManager = uiManager;
        this.currentTeam = [];
        this.selectedHero = null;
        this.blueTeam = [];
        this.redTeam = [];
    }

    /**
     * Populate hero grid with enhanced cards
     */
    populateHeroGrid(gridElement, currentTeam = [], selectedHero = null) {
        gridElement.innerHTML = "";
        this.currentTeam = currentTeam;
        this.selectedHero = selectedHero;

        const heroes = Object.keys(HeroDifficultySystem.HERO_PROFILES);

        heroes.forEach(heroName => {
            const card = NarrativeUIIntegration.createEnhancedHeroCard(heroName, currentTeam);
            if (!card) return;

            // Add click handler
            card.onclick = () => this.selectHero(heroName);

            // Highlight if selected
            if (selectedHero === heroName) {
                card.style.borderColor = "#00ff88";
                card.style.boxShadow = "0 0 20px rgba(0, 255, 136, 0.5)";
            }

            // Disable if already in team
            if (currentTeam.map(h => h.toLowerCase()).includes(heroName.toLowerCase())) {
                card.style.opacity = "0.5";
                card.style.cursor = "not-allowed";
            }

            gridElement.appendChild(card);
        });
    }

    /**
     * Select a hero and show details
     */
    selectHero(heroName) {
        if (this.currentTeam.map(h => h.toLowerCase()).includes(heroName.toLowerCase())) {
            return; // Already in team
        }

        this.selectedHero = heroName;
        const detailsElement = document.getElementById("hero-details");

        if (detailsElement) {
            detailsElement.innerHTML = "";

            // Basic hero info
            const profile = HeroDifficultySystem.getHeroProfile(heroName);
            const infoDiv = document.createElement("div");
            infoDiv.style.marginBottom = "15px";

            const titleDiv = document.createElement("div");
            titleDiv.style.display = "flex";
            titleDiv.style.justifyContent = "space-between";
            titleDiv.style.alignItems = "center";
            titleDiv.style.marginBottom = "10px";

            const titleEl = document.createElement("h2");
            titleEl.textContent = heroName.charAt(0).toUpperCase() + heroName.slice(1);
            titleEl.style.margin = "0";
            titleEl.style.color = "#00ff88";

            const diffBadge = document.createElement("span");
            diffBadge.textContent = profile.difficulty;
            diffBadge.style.backgroundColor = HeroDifficultySystem.getDifficultyColor(profile.difficulty);
            diffBadge.style.color = "#ffffff";
            diffBadge.style.padding = "6px 12px";
            diffBadge.style.borderRadius = "4px";
            diffBadge.style.fontSize = "12px";
            diffBadge.style.fontWeight = "bold";

            titleDiv.appendChild(titleEl);
            titleDiv.appendChild(diffBadge);
            infoDiv.appendChild(titleDiv);

            // Archetype and playstyle
            const archEl = document.createElement("p");
            archEl.textContent = `${profile.archetype} • ${profile.playstyle}`;
            archEl.style.color = "#9d4edd";
            archEl.style.margin = "0 0 10px 0";
            archEl.style.fontSize = "12px";
            infoDiv.appendChild(archEl);

            // Faction
            const faction = MatchupSystem.getFaction(heroName);
            const factionEl = document.createElement("p");
            factionEl.textContent = `Faction: ${faction}`;
            factionEl.style.color = "#cccccc";
            factionEl.style.margin = "0 0 15px 0";
            factionEl.style.fontSize = "11px";
            infoDiv.appendChild(factionEl);

            detailsElement.appendChild(infoDiv);

            // Add synergy warning if team exists
            if (this.currentTeam.length > 0) {
                const warning = NarrativeUIIntegration.createMatchupWarning(heroName, this.currentTeam);
                if (warning) {
                    detailsElement.appendChild(warning);
                }
            }

            // Strengths and weaknesses
            const statsDiv = document.createElement("div");
            statsDiv.style.display = "grid";
            statsDiv.style.gridTemplateColumns = "1fr 1fr";
            statsDiv.style.gap = "10px";
            statsDiv.style.marginBottom = "15px";

            // Strengths
            const strengthsDiv = document.createElement("div");
            strengthsDiv.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
            strengthsDiv.style.border = "1px solid #4caf50";
            strengthsDiv.style.borderRadius = "4px";
            strengthsDiv.style.padding = "8px";

            const strengthsTitle = document.createElement("h4");
            strengthsTitle.textContent = "💪 Strengths";
            strengthsTitle.style.color = "#4caf50";
            strengthsTitle.style.fontSize = "11px";
            strengthsTitle.style.margin = "0 0 6px 0";
            strengthsDiv.appendChild(strengthsTitle);

            const strengthsList = document.createElement("ul");
            strengthsList.style.margin = "0";
            strengthsList.style.paddingLeft = "18px";
            strengthsList.style.fontSize = "10px";
            strengthsList.style.color = "#cccccc";

            profile.strengths.forEach(strength => {
                const li = document.createElement("li");
                li.textContent = strength;
                li.style.marginBottom = "3px";
                strengthsList.appendChild(li);
            });
            strengthsDiv.appendChild(strengthsList);
            statsDiv.appendChild(strengthsDiv);

            // Weaknesses
            const weaknessesDiv = document.createElement("div");
            weaknessesDiv.style.backgroundColor = "rgba(244, 67, 54, 0.1)";
            weaknessesDiv.style.border = "1px solid #f44336";
            weaknessesDiv.style.borderRadius = "4px";
            weaknessesDiv.style.padding = "8px";

            const weaknessesTitle = document.createElement("h4");
            weaknessesTitle.textContent = "⚠️ Weaknesses";
            weaknessesTitle.style.color = "#ff6b6b";
            weaknessesTitle.style.fontSize = "11px";
            weaknessesTitle.style.margin = "0 0 6px 0";
            weaknessesDiv.appendChild(weaknessesTitle);

            const weaknessesList = document.createElement("ul");
            weaknessesList.style.margin = "0";
            weaknessesList.style.paddingLeft = "18px";
            weaknessesList.style.fontSize = "10px";
            weaknessesList.style.color = "#cccccc";

            profile.weaknesses.forEach(weakness => {
                const li = document.createElement("li");
                li.textContent = weakness;
                li.style.marginBottom = "3px";
                weaknessesList.appendChild(li);
            });
            weaknessesDiv.appendChild(weaknessesList);
            statsDiv.appendChild(weaknessesDiv);

            detailsElement.appendChild(statsDiv);

            // Learning tips
            const tipsDiv = document.createElement("div");
            tipsDiv.style.backgroundColor = "rgba(255, 215, 0, 0.1)";
            tipsDiv.style.border = "1px solid #ffd700";
            tipsDiv.style.borderRadius = "4px";
            tipsDiv.style.padding = "8px";
            tipsDiv.style.marginBottom = "15px";

            const tipsTitle = document.createElement("h4");
            tipsTitle.textContent = "💡 Key Tips";
            tipsTitle.style.color = "#ffd700";
            tipsTitle.style.fontSize = "11px";
            tipsTitle.style.margin = "0 0 6px 0";
            tipsDiv.appendChild(tipsTitle);

            const tipsList = document.createElement("ul");
            tipsList.style.margin = "0";
            tipsList.style.paddingLeft = "18px";
            tipsList.style.fontSize = "10px";
            tipsList.style.color = "#cccccc";

            // Show first 2 tips
            profile.tips.slice(0, 2).forEach(tip => {
                const li = document.createElement("li");
                li.textContent = tip;
                li.style.marginBottom = "4px";
                tipsList.appendChild(li);
            });
            tipsDiv.appendChild(tipsList);
            detailsElement.appendChild(tipsDiv);

            // Recommended allies
            const alliesDiv = document.createElement("div");
            const allies = MatchupSystem.getRecommendedTeammates(heroName);
            if (allies.length > 0) {
                alliesDiv.style.marginBottom = "15px";
                const alliesTitle = document.createElement("h4");
                alliesTitle.textContent = "🤝 Synergizes With";
                alliesTitle.style.color = "#00ff88";
                alliesTitle.style.fontSize = "11px";
                alliesTitle.style.margin = "0 0 6px 0";
                alliesDiv.appendChild(alliesTitle);

                const alliesTags = document.createElement("div");
                alliesTags.style.display = "flex";
                alliesTags.style.flexWrap = "wrap";
                alliesTags.style.gap = "6px";

                allies.forEach(ally => {
                    const tag = document.createElement("span");
                    tag.textContent = ally.toUpperCase();
                    tag.style.backgroundColor = "#00ff88";
                    tag.style.color = "#1a1f3a";
                    tag.style.padding = "4px 8px";
                    tag.style.borderRadius = "3px";
                    tag.style.fontSize = "10px";
                    tag.style.fontWeight = "bold";
                    alliesTags.appendChild(tag);
                });
                alliesDiv.appendChild(alliesTags);
                detailsElement.appendChild(alliesDiv);
            }

            // Countered by
            const countersDiv = document.createElement("div");
            const counters = MatchupSystem.getCounterHeroes(heroName);
            if (counters.length > 0) {
                countersDiv.style.marginBottom = "15px";
                const countersTitle = document.createElement("h4");
                countersTitle.textContent = "⚔️ Countered By";
                countersTitle.style.color = "#ff6b6b";
                countersTitle.style.fontSize = "11px";
                countersTitle.style.margin = "0 0 6px 0";
                countersDiv.appendChild(countersTitle);

                const countersTags = document.createElement("div");
                countersTags.style.display = "flex";
                countersTags.style.flexWrap = "wrap";
                countersTags.style.gap = "6px";

                counters.forEach(counter => {
                    const tag = document.createElement("span");
                    tag.textContent = counter.toUpperCase();
                    tag.style.backgroundColor = "#ff6b6b";
                    tag.style.color = "#ffffff";
                    tag.style.padding = "4px 8px";
                    tag.style.borderRadius = "3px";
                    tag.style.fontSize = "10px";
                    tag.style.fontWeight = "bold";
                    countersTags.appendChild(tag);
                });
                countersDiv.appendChild(countersTags);
                detailsElement.appendChild(countersDiv);
            }
        }

        // Refresh grid highlighting
        document.querySelectorAll(".hero-select-card").forEach(card => {
            if (card.dataset.hero === heroName) {
                card.style.borderColor = "#00ff88";
                card.style.boxShadow = "0 0 20px rgba(0, 255, 136, 0.5)";
            } else {
                card.style.borderColor = "#00d4ff";
                card.style.boxShadow = "none";
            }
        });
    }

    /**
     * Confirm hero selection
     */
    confirmSelection(heroName) {
        if (this.currentTeam.length < 5) {
            this.currentTeam.push(heroName);
            return true;
        }
        return false;
    }

    /**
     * Get team analysis display
     */
    getTeamAnalysisDisplay(blueTeam = [], redTeam = []) {
        const container = document.createElement("div");

        // Add team composition analysis
        const analysis = NarrativeUIIntegration.createTeamCompositionAnalysis(blueTeam, redTeam);
        if (analysis) container.appendChild(analysis);

        // Add victory prediction
        const prediction = NarrativeUIIntegration.createVictoryPrediction(blueTeam, redTeam);
        if (prediction) container.appendChild(prediction);

        return container;
    }

    /**
     * Get team roster display with synergies
     */
    getTeamRosterDisplay(team, teamColor = "blue") {
        const container = document.createElement("div");
        container.style.marginBottom = "15px";

        team.forEach((hero, index) => {
            const heroDiv = document.createElement("div");
            heroDiv.style.backgroundColor = teamColor === "blue" ? "rgba(0, 212, 255, 0.1)" : "rgba(255, 107, 107, 0.1)";
            heroDiv.style.border = `1px solid ${teamColor === "blue" ? "#00d4ff" : "#ff6b6b"}`;
            heroDiv.style.borderRadius = "4px";
            heroDiv.style.padding = "8px";
            heroDiv.style.marginBottom = "8px";
            heroDiv.style.color = "#ffffff";
            heroDiv.style.fontSize = "12px";

            const nameEl = document.createElement("strong");
            nameEl.textContent = hero.charAt(0).toUpperCase() + hero.slice(1);
            nameEl.style.color = teamColor === "blue" ? "#00d4ff" : "#ff6b6b";
            heroDiv.appendChild(nameEl);

            // Show synergies with other team members
            const allies = MatchupSystem.getRecommendedTeammates(hero);
            const synergies = team.filter((h, i) => i !== index && allies.includes(h.toLowerCase()));

            if (synergies.length > 0) {
                const synergyEl = document.createElement("div");
                synergyEl.style.marginTop = "4px";
                synergyEl.style.fontSize = "10px";
                synergyEl.style.color = "#4caf50";
                synergyEl.textContent = `✓ Synergy: ${synergies.join(", ")}`;
                heroDiv.appendChild(synergyEl);
            }

            container.appendChild(heroDiv);
        });

        return container;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnhancedHeroSelection };
}
