/**
 * NEXUS Narrative UI Integration
 * Synergy indicators, matchup warnings, and team composition feedback
 */

class NarrativeUIIntegration {
    /**
     * Create hero selection card with difficulty and synergy info
     */
    static createEnhancedHeroCard(heroName, teamComposition = []) {
        const profile = HeroDifficultySystem.getHeroProfile(heroName);
        if (!profile) return null;

        const container = document.createElement("div");
        container.className = "hero-select-card";
        container.style.position = "relative";
        container.style.backgroundColor = "#1a1f3a";
        container.style.border = "2px solid #00d4ff";
        container.style.borderRadius = "8px";
        container.style.padding = "12px";
        container.style.color = "#ffffff";
        container.style.cursor = "pointer";
        container.style.transition = "all 0.3s";
        container.style.minWidth = "140px";

        // Difficulty badge
        const diffBadge = document.createElement("div");
        diffBadge.className = "difficulty-badge";
        diffBadge.style.position = "absolute";
        diffBadge.style.top = "8px";
        diffBadge.style.right = "8px";
        diffBadge.style.backgroundColor = HeroDifficultySystem.getDifficultyColor(profile.difficulty);
        diffBadge.style.color = "#ffffff";
        diffBadge.style.padding = "4px 8px";
        diffBadge.style.borderRadius = "4px";
        diffBadge.style.fontSize = "10px";
        diffBadge.style.fontWeight = "bold";
        diffBadge.textContent = profile.difficulty;
        container.appendChild(diffBadge);

        // Hero name
        const nameEl = document.createElement("h3");
        nameEl.textContent = heroName.charAt(0).toUpperCase() + heroName.slice(1);
        nameEl.style.margin = "0 0 8px 0";
        nameEl.style.color = "#00ff88";
        nameEl.style.fontSize = "14px";
        container.appendChild(nameEl);

        // Archetype
        const archEl = document.createElement("p");
        archEl.textContent = profile.archetype;
        archEl.style.margin = "0 0 10px 0";
        archEl.style.color = "#9d4edd";
        archEl.style.fontSize = "11px";
        container.appendChild(archEl);

        // Synergy info if team composition provided
        if (teamComposition.length > 0) {
            const synergyDiv = document.createElement("div");
            synergyDiv.style.marginTop = "10px";
            synergyDiv.style.paddingTop = "10px";
            synergyDiv.style.borderTop = "1px solid rgba(0, 212, 255, 0.3)";

            // Check synergies with current team
            const allies = MatchupSystem.getRecommendedTeammates(heroName);
            const synergyCounts = {
                great: 0,
                good: 0,
                weak: 0
            };

            teamComposition.forEach(teammate => {
                if (allies.includes(teammate.toLowerCase())) {
                    synergyCounts.great++;
                }
            });

            // Show synergy indicator
            if (synergyCounts.great > 0) {
                const synergyTag = document.createElement("div");
                synergyTag.style.backgroundColor = "rgba(76, 175, 80, 0.2)";
                synergyTag.style.border = "1px solid #4caf50";
                synergyTag.style.color = "#4caf50";
                synergyTag.style.padding = "4px 8px";
                synergyTag.style.borderRadius = "3px";
                synergyTag.style.fontSize = "10px";
                synergyTag.style.marginBottom = "4px";
                synergyTag.textContent = `✓ Synergy with ${synergyCounts.great} teammate(s)`;
                synergyDiv.appendChild(synergyTag);
            }

            // Check counters
            const counters = MatchupSystem.getCounterHeroes(heroName);
            const counterCount = teamComposition.filter(t =>
                counters.includes(t.toLowerCase())
            ).length;

            if (counterCount > 0) {
                const counterTag = document.createElement("div");
                counterTag.style.backgroundColor = "rgba(244, 67, 54, 0.2)";
                counterTag.style.border = "1px solid #f44336";
                counterTag.style.color = "#ff6b6b";
                counterTag.style.padding = "4px 8px";
                counterTag.style.borderRadius = "3px";
                counterTag.style.fontSize = "10px";
                counterTag.textContent = `⚠ Countered by enemy ${counterCount} hero(es)`;
                synergyDiv.appendChild(counterTag);
            }

            if (synergyCounts.great > 0 || counterCount > 0) {
                container.appendChild(synergyDiv);
            }
        }

        return container;
    }

    /**
     * Create team composition analysis card
     */
    static createTeamCompositionAnalysis(blueTeam, redTeam) {
        const container = document.createElement("div");
        container.className = "team-analysis";
        container.style.backgroundColor = "#1a1f3a";
        container.style.border = "2px solid #00d4ff";
        container.style.borderRadius = "8px";
        container.style.padding = "15px";
        container.style.color = "#ffffff";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.marginBottom = "20px";

        // Title
        const title = document.createElement("h2");
        title.textContent = "⚔️ Team Composition Analysis";
        title.style.margin = "0 0 15px 0";
        title.style.color = "#00d4ff";
        title.style.fontSize = "16px";
        title.style.borderBottom = "2px solid #00d4ff";
        title.style.paddingBottom = "10px";
        container.appendChild(title);

        // Blue team analysis
        const blueDiv = document.createElement("div");
        blueDiv.style.marginBottom = "15px";
        const blueTitle = document.createElement("h3");
        blueTitle.textContent = "🔵 Blue Team";
        blueTitle.style.color = "#00d4ff";
        blueTitle.style.fontSize = "13px";
        blueTitle.style.margin = "0 0 8px 0";
        blueDiv.appendChild(blueTitle);

        const blueAnalysis = this._analyzeComposition(blueTeam);
        const blueText = document.createElement("p");
        blueText.style.margin = "0";
        blueText.style.fontSize = "12px";
        blueText.style.color = "#cccccc";
        blueText.innerHTML = blueAnalysis;
        blueDiv.appendChild(blueText);
        container.appendChild(blueDiv);

        // Red team analysis
        if (redTeam.length > 0) {
            const redDiv = document.createElement("div");
            const redTitle = document.createElement("h3");
            redTitle.textContent = "🔴 Red Team";
            redTitle.style.color = "#ff6b6b";
            redTitle.style.fontSize = "13px";
            redTitle.style.margin = "0 0 8px 0";
            redDiv.appendChild(redTitle);

            const redAnalysis = this._analyzeComposition(redTeam);
            const redText = document.createElement("p");
            redText.style.margin = "0";
            redText.style.fontSize = "12px";
            redText.style.color = "#cccccc";
            redText.innerHTML = redAnalysis;
            redDiv.appendChild(redText);
            container.appendChild(redDiv);
        }

        return container;
    }

    /**
     * Analyze composition and return text description
     */
    static _analyzeComposition(team) {
        if (team.length === 0) {
            return "<span style='color:#999;'>Team incomplete</span>";
        }

        // Count roles
        const roles = {};
        team.forEach(hero => {
            const faction = MatchupSystem.getFaction(hero);
            const role = faction.split(" ")[0];
            roles[role] = (roles[role] || 0) + 1;
        });

        const roleStr = Object.entries(roles)
            .map(([role, count]) => `${count}× ${role}`)
            .join(", ");

        // Check for synergies
        let synergyCount = 0;
        for (let i = 0; i < team.length; i++) {
            const allies = MatchupSystem.getRecommendedTeammates(team[i]);
            for (let j = i + 1; j < team.length; j++) {
                if (allies.includes(team[j].toLowerCase())) {
                    synergyCount++;
                }
            }
        }

        let analysis = `<strong>${roleStr}</strong><br/>`;
        if (synergyCount > 0) {
            analysis += `<span style='color:#4caf50;'>✓ ${synergyCount} synergies</span>`;
        } else {
            analysis += `<span style='color:#ff9800;'>~ Neutral composition</span>`;
        }

        return analysis;
    }

    /**
     * Create hero matchup warning
     */
    static createMatchupWarning(selectedHero, teamComposition) {
        if (!selectedHero || teamComposition.length === 0) return null;

        const counters = MatchupSystem.getCounterHeroes(selectedHero);
        const allies = MatchupSystem.getRecommendedTeammates(selectedHero);

        let warningContent = "";
        let warningColor = "";
        let warningIcon = "";

        // Check for positive synergies
        const friendlyAllies = teamComposition.filter(h =>
            allies.includes(h.toLowerCase())
        );

        if (friendlyAllies.length >= 2) {
            warningContent = `Excellent synergy with ${friendlyAllies.join(", ")}! This composition will be very strong.`;
            warningColor = "#4caf50";
            warningIcon = "✓";
        } else if (friendlyAllies.length === 1) {
            warningContent = `Good synergy with ${friendlyAllies[0]}. Consider the matchup against enemy team.`;
            warningColor = "#ff9800";
            warningIcon = "~";
        } else {
            warningContent = "No direct synergies with current team. Fill gaps with complementary heroes.";
            warningColor = "#9d4edd";
            warningIcon = "○";
        }

        const warning = document.createElement("div");
        warning.style.backgroundColor = `rgba(${this._hexToRgb(warningColor).join(",")}, 0.1)`;
        warning.style.border = `2px solid ${warningColor}`;
        warning.style.borderRadius = "6px";
        warning.style.padding = "12px";
        warning.style.color = warningColor;
        warning.style.fontSize = "12px";
        warning.style.marginBottom = "10px";
        warning.innerHTML = `<strong>${warningIcon} Synergy Analysis:</strong> ${warningContent}`;

        return warning;
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

    /**
     * Create victory prediction card
     */
    static createVictoryPrediction(blueTeam, redTeam) {
        if (blueTeam.length === 0 || redTeam.length === 0) return null;

        const container = document.createElement("div");
        container.style.backgroundColor = "#1a1f3a";
        container.style.border = "2px solid #ffd700";
        container.style.borderRadius = "8px";
        container.style.padding = "15px";
        container.style.color = "#ffffff";
        container.style.fontFamily = "Arial, sans-serif";

        // Title
        const title = document.createElement("h3");
        title.textContent = "🎯 Match Prediction";
        title.style.color = "#ffd700";
        title.style.fontSize = "14px";
        title.style.margin = "0 0 12px 0";
        container.appendChild(title);

        // Calculate advantage
        let blueAdvantage = 0;
        let redAdvantage = 0;

        // Synergy score
        let blueSynergy = 0;
        let redSynergy = 0;

        for (let i = 0; i < blueTeam.length; i++) {
            const allies = MatchupSystem.getRecommendedTeammates(blueTeam[i]);
            for (let j = i + 1; j < blueTeam.length; j++) {
                if (allies.includes(blueTeam[j].toLowerCase())) {
                    blueSynergy += 0.5;
                }
            }
        }

        for (let i = 0; i < redTeam.length; i++) {
            const allies = MatchupSystem.getRecommendedTeammates(redTeam[i]);
            for (let j = i + 1; j < redTeam.length; j++) {
                if (allies.includes(redTeam[j].toLowerCase())) {
                    redSynergy += 0.5;
                }
            }
        }

        blueAdvantage += blueSynergy;
        redAdvantage += redSynergy;

        // Matchup analysis
        let blueMatchupScore = 0;
        let redMatchupScore = 0;

        blueTeam.forEach(blueHero => {
            redTeam.forEach(redHero => {
                const blueCounters = MatchupSystem.getCounterHeroes(blueHero);
                const redCounters = MatchupSystem.getCounterHeroes(redHero);

                if (blueCounters.includes(redHero.toLowerCase())) {
                    redMatchupScore += 0.3;
                }
                if (redCounters.includes(blueHero.toLowerCase())) {
                    blueMatchupScore += 0.3;
                }
            });
        });

        blueAdvantage += blueMatchupScore;
        redAdvantage += redMatchupScore;

        // Determine prediction
        const diff = blueAdvantage - redAdvantage;
        let prediction = "";
        let predictionColor = "";

        if (Math.abs(diff) < 0.5) {
            prediction = "⚖️ EVENLY MATCHED - Close game expected";
            predictionColor = "#ffd700";
        } else if (diff > 0.5) {
            const advantage = Math.round(Math.abs(diff) * 10);
            prediction = `🔵 BLUE FAVORED (+${advantage}% advantage)`;
            predictionColor = "#00d4ff";
        } else {
            const advantage = Math.round(Math.abs(diff) * 10);
            prediction = `🔴 RED FAVORED (+${advantage}% advantage)`;
            predictionColor = "#ff6b6b";
        }

        const predictionEl = document.createElement("div");
        predictionEl.style.backgroundColor = `rgba(${this._hexToRgb(predictionColor).join(",")}, 0.1)`;
        predictionEl.style.border = `1px solid ${predictionColor}`;
        predictionEl.style.borderRadius = "4px";
        predictionEl.style.padding = "10px";
        predictionEl.style.color = predictionColor;
        predictionEl.style.fontSize = "12px";
        predictionEl.style.fontWeight = "bold";
        predictionEl.textContent = prediction;
        container.appendChild(predictionEl);

        // Detailed breakdown
        const breakdown = document.createElement("div");
        breakdown.style.marginTop = "12px";
        breakdown.style.fontSize = "11px";
        breakdown.style.color = "#999999";
        breakdown.innerHTML = `
            <div style="margin-bottom: 6px;">Synergy: 🔵 ${blueSynergy.toFixed(1)} vs 🔴 ${redSynergy.toFixed(1)}</div>
            <div>Matchups: 🔵 ${blueMatchupScore.toFixed(1)} vs 🔴 ${redMatchupScore.toFixed(1)}</div>
        `;
        container.appendChild(breakdown);

        return container;
    }

    /**
     * Create faction comparison
     */
    static createFactionComparison(team) {
        const container = document.createElement("div");
        container.style.backgroundColor = "#1a1f3a";
        container.style.border = "1px solid #9d4edd";
        container.style.borderRadius = "6px";
        container.style.padding = "10px";
        container.style.color = "#ffffff";
        container.style.fontSize = "11px";

        const factions = {};
        team.forEach(hero => {
            const faction = MatchupSystem.getFaction(hero);
            factions[faction] = (factions[faction] || 0) + 1;
        });

        const factionList = Object.entries(factions)
            .map(([faction, count]) => `${faction}: ${count}`)
            .join(" • ");

        container.innerHTML = `<strong>Factions:</strong> ${factionList || "Mixed"}`;
        return container;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NarrativeUIIntegration };
}
