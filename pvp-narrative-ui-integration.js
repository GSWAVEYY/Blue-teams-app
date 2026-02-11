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

    /**
     * PHASE 3: Integrate narrative into hero selection screen
     * Hooks hero card click events to display personality info
     */
    static setupHeroSelectionNarrative() {
        const heroGrid = document.getElementById('hero-grid');
        if (!heroGrid) return;

        // Add voice line display container
        const voiceContainer = document.createElement('div');
        voiceContainer.id = 'hero-voice-display';
        voiceContainer.style.position = 'fixed';
        voiceContainer.style.bottom = '100px';
        voiceContainer.style.left = '50%';
        voiceContainer.style.transform = 'translateX(-50%)';
        voiceContainer.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
        voiceContainer.style.border = '2px solid #00d4ff';
        voiceContainer.style.borderRadius = '8px';
        voiceContainer.style.padding = '15px 20px';
        voiceContainer.style.color = '#00d4ff';
        voiceContainer.style.fontSize = '13px';
        voiceContainer.style.maxWidth = '400px';
        voiceContainer.style.zIndex = '1000';
        voiceContainer.style.display = 'none';
        voiceContainer.innerHTML = '<p id="hero-voice-text"></p>';
        document.body.appendChild(voiceContainer);

        // Add personality info to hero details panel
        const detailsPanel = document.getElementById('selected-hero-panel');
        if (detailsPanel) {
            const personalityBox = document.createElement('div');
            personalityBox.id = 'hero-personality-box';
            personalityBox.style.marginTop = '15px';
            personalityBox.style.padding = '10px';
            personalityBox.style.backgroundColor = 'rgba(157, 78, 221, 0.1)';
            personalityBox.style.border = '1px solid #9d4edd';
            personalityBox.style.borderRadius = '6px';
            personalityBox.style.color = '#cccccc';
            personalityBox.style.fontSize = '11px';
            personalityBox.style.display = 'none';
            detailsPanel.appendChild(personalityBox);
        }
    }

    /**
     * Display hero personality when selected in hero selection
     */
    static displayHeroPersonality(heroName) {
        // Get voice line if available
        if (typeof VoiceLineManager !== 'undefined') {
            const voiceLine = VoiceLineManager.getVoiceLine(heroName, 'q');
            const voiceDisplay = document.getElementById('hero-voice-display');
            if (voiceDisplay && voiceLine) {
                document.getElementById('hero-voice-text').textContent = `"${voiceLine}"`;
                voiceDisplay.style.display = 'block';
                setTimeout(() => { voiceDisplay.style.display = 'none'; }, 4000);
            }
        }

        // Get hero personality description
        const personalities = {
            grael: "Honor-bound protector who believes in righteous strength and defending the weak. Excels at front-line combat and inspiring teammates.",
            thaxus: "Berserker warrior who channels pure rage into devastating power. Thrives in extended fights where he can accumulate fury.",
            aldrin: "Bastion defender who prioritizes team protection over personal glory. Creates safe zones where allies can outplay opponents.",
            lyric: "Precision master with unwavering focus and deadly accuracy. Dominates mid-range encounters with calculated strikes.",
            vos: "Tactical predictor who sets traps and controls the battlefield. Punishes aggressive positioning and mistakes.",
            kess: "Phantom assassin who strikes from shadows and vanishes like smoke. Specializes in burst damage and escape sequences.",
            ember: "Inferno caster who consumes enemies in waves of flame. Excels at area control and punishing grouped enemies.",
            talen: "Cascade scholar who builds power through chain reactions. Scales exponentially in extended team fights.",
            zephyr: "Wind weaver who manipulates air currents and destiny itself. Controls enemy movement and dictates engagement pace.",
            petra: "Holy healer whose light mends wounds and shields allies. Enables aggressive play through sustained support.",
            kora: "Empowerer who uplifts allies with inspiring strength. Turns her team into unstoppable forces.",
            kyrax: "Control master who binds and suppresses enemy power. Locks down priority targets and creates safe windows for team.",
            raze: "Executioner dealing lethal precision and marked judgment. Eliminates weak targets and turns fights into 4v5s.",
            vesper: "Drain specialist who feeds on enemy life force. Grows stronger as fights progress, becoming unkillable.",
            silk: "Web weaver who traps enemies in threads of fate. Creates impassable terrain and controls territorial advantage."
        };

        const personalityBox = document.getElementById('hero-personality-box');
        if (personalityBox) {
            const description = personalities[heroName] || "Master of the arena";
            personalityBox.innerHTML = `<strong>${heroName.toUpperCase()}</strong><br/>${description}`;
            personalityBox.style.display = 'block';
        }
    }

    /**
     * PHASE 3: Integrate narrative into team lobby
     * Setup team composition narrative display
     */
    static setupTeamLobbyNarrative() {
        const teamContent = document.getElementById('team-roster');
        if (!teamContent) return;

        // Create team narrative section
        const narrativeSection = document.createElement('div');
        narrativeSection.id = 'team-narrative-section';
        narrativeSection.style.marginTop = '20px';
        narrativeSection.style.padding = '15px';
        narrativeSection.style.backgroundColor = '#1a1f3a';
        narrativeSection.style.border = '2px solid #00d4ff';
        narrativeSection.style.borderRadius = '8px';
        narrativeSection.style.color = '#ffffff';

        narrativeSection.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0 0 10px 0; color: #00d4ff; font-size: 14px;">Team Composition</h3>
                <div id="team-composition-display" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; margin-bottom: 15px;">
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0 0 10px 0; color: #00ff88; font-size: 14px;">Team Synergies</h3>
                <div id="team-synergies-display" style="display: flex; flex-direction: column; gap: 6px;">
                    <p style="color: #999; font-size: 11px; margin: 0;"><em>Analyzing team composition...</em></p>
                </div>
            </div>

            <div>
                <h3 style="margin: 0 0 10px 0; color: #ff9800; font-size: 14px;">Team Strengths</h3>
                <div id="team-strengths-display" style="display: flex; flex-direction: column; gap: 6px;">
                    <p style="color: #999; font-size: 11px; margin: 0;"><em>Team incomplete...</em></p>
                </div>
            </div>

            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 212, 255, 0.3);">
                <h3 style="margin: 0 0 8px 0; color: #9d4edd; font-size: 13px;">🎭 Team Story</h3>
                <p id="team-story-text" style="margin: 0; color: #cccccc; font-size: 11px; font-style: italic;">
                    Your team's legend will be written in this arena...
                </p>
            </div>
        `;

        teamContent.appendChild(narrativeSection);
    }

    /**
     * Update team lobby narrative display with hero choices
     */
    static updateTeamLobbyNarrative(teamHeroes) {
        if (!teamHeroes || teamHeroes.length === 0) return;

        // Update composition display
        const compositionDisplay = document.getElementById('team-composition-display');
        if (compositionDisplay) {
            compositionDisplay.innerHTML = teamHeroes.map(hero => `
                <div style="text-align: center; padding: 8px; background: rgba(0, 212, 255, 0.1); border-radius: 4px; border: 1px solid #00d4ff;">
                    <div style="font-size: 16px; margin-bottom: 4px;">⚔️</div>
                    <p style="margin: 0; font-size: 11px; color: #00d4ff;">${hero}</p>
                </div>
            `).join('');
        }

        // Calculate and display synergies
        const synergiesDisplay = document.getElementById('team-synergies-display');
        if (synergiesDisplay && typeof MatchupSystem !== 'undefined') {
            let synergies = [];

            for (let i = 0; i < teamHeroes.length; i++) {
                for (let j = i + 1; j < teamHeroes.length; j++) {
                    const syn = MatchupSystem.getSynergy(teamHeroes[i], teamHeroes[j]);
                    if (syn) {
                        synergies.push({
                            pair: `${teamHeroes[i]} + ${teamHeroes[j]}`,
                            strength: syn.strength,
                            desc: syn.description
                        });
                    }
                }
            }

            if (synergies.length > 0) {
                synergies.sort((a, b) => b.strength - a.strength);
                synergiesDisplay.innerHTML = synergies.slice(0, 3).map(syn => `
                    <div style="padding: 8px; background: rgba(76, 175, 80, 0.1); border-left: 3px solid #4caf50; font-size: 11px; color: #4caf50;">
                        <strong>${syn.pair}</strong> — ${syn.desc}
                    </div>
                `).join('');
            }
        }

        // Display team strengths
        const strengthsDisplay = document.getElementById('team-strengths-display');
        if (strengthsDisplay) {
            const roles = teamHeroes.map(h => {
                if (typeof HEROES !== 'undefined' && HEROES[h]) {
                    return HEROES[h].role || 'Unknown';
                }
                return 'Unknown';
            });

            const roleCount = {};
            roles.forEach(role => {
                roleCount[role] = (roleCount[role] || 0) + 1;
            });

            const strengths = [];
            if (roleCount['Warrior'] >= 1) strengths.push('Tank/Front-line');
            if (roleCount['Guardian'] >= 1) strengths.push('Support/Utility');
            if (roleCount['Ranger'] >= 1 || roleCount['Rogue'] >= 1) strengths.push('Burst/Damage');
            if (roleCount['Mage'] >= 1) strengths.push('Area Control');

            if (strengths.length > 0) {
                strengthsDisplay.innerHTML = strengths.map(str => `
                    <div style="padding: 6px; background: rgba(255, 152, 0, 0.1); border-left: 3px solid #ff9800; font-size: 11px; color: #ffb74d;">
                        ✓ ${str}
                    </div>
                `).join('');
            }
        }

        // Generate team story
        this._generateTeamStory(teamHeroes);
    }

    /**
     * Generate unique narrative for team composition
     */
    static _generateTeamStory(teamHeroes) {
        const storyText = document.getElementById('team-story-text');
        if (!storyText) return;

        const stories = [
            `${teamHeroes[0]} leads a diverse squad. ${teamHeroes[1]} flanks from the shadows while ${teamHeroes.slice(2).join(' and ')} provide the firepower.`,
            `Five legends converge: ${teamHeroes.join(', ')}. Together, they form an unstoppable force.`,
            `An unlikely alliance forms in the arena. ${teamHeroes[0]}'s determination combines with ${teamHeroes[1]}'s cunning, and the rest follow in triumph.`,
            `The crowd watches in awe as ${teamHeroes[0]} leads from the front, while ${teamHeroes[1]} and the others execute a perfect strategy.`,
            `${teamHeroes[0]} sets the tone. ${teamHeroes[1]} answers the call. And ${teamHeroes.slice(2).join(' and ')} complete the circle. Legends rise today.`
        ];

        const randomStory = stories[Math.floor(Math.random() * stories.length)];
        storyText.textContent = randomStory;
    }

    /**
     * Create pre-match narrative screen (Phase 4 preparation)
     */
    static createPreMatchNarrative(blueTeam, redTeam) {
        const container = document.createElement('div');
        container.id = 'pre-match-narrative';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.zIndex = '2000';
        container.style.color = '#ffffff';
        container.style.padding = '20px';

        // Match title
        const title = document.createElement('h1');
        title.textContent = 'BATTLE AWAITS';
        title.style.marginBottom = '30px';
        title.style.color = '#00d4ff';
        title.style.fontSize = '32px';
        title.style.textShadow = '0 0 20px #00d4ff';
        container.appendChild(title);

        // Teams display
        const teamsContainer = document.createElement('div');
        teamsContainer.style.display = 'grid';
        teamsContainer.style.gridTemplateColumns = '1fr auto 1fr';
        teamsContainer.style.gap = '30px';
        teamsContainer.style.maxWidth = '600px';
        teamsContainer.style.marginBottom = '30px';

        // Blue team
        const blueDiv = document.createElement('div');
        blueDiv.style.textAlign = 'center';
        blueDiv.innerHTML = `
            <h2 style="color: #00d4ff; margin-bottom: 15px;">BLUE TEAM</h2>
            <div style="font-size: 12px; line-height: 1.8;">
                ${blueTeam.map(h => `<div style="color: #00d4ff; margin: 5px 0;">${h}</div>`).join('')}
            </div>
        `;
        teamsContainer.appendChild(blueDiv);

        // VS
        const vsDiv = document.createElement('div');
        vsDiv.style.display = 'flex';
        vsDiv.style.alignItems = 'center';
        vsDiv.innerHTML = '<div style="font-size: 24px; color: #ff9800; font-weight: bold;">VS</div>';
        teamsContainer.appendChild(vsDiv);

        // Red team
        const redDiv = document.createElement('div');
        redDiv.style.textAlign = 'center';
        redDiv.innerHTML = `
            <h2 style="color: #ff6b6b; margin-bottom: 15px;">RED TEAM</h2>
            <div style="font-size: 12px; line-height: 1.8;">
                ${redTeam.map(h => `<div style="color: #ff6b6b; margin: 5px 0;">${h}</div>`).join('')}
            </div>
        `;
        teamsContainer.appendChild(redDiv);

        container.appendChild(teamsContainer);

        // Prediction
        const prediction = this.createVictoryPrediction(blueTeam, redTeam);
        if (prediction) {
            prediction.style.maxWidth = '400px';
            prediction.style.marginBottom = '20px';
            container.appendChild(prediction);
        }

        // Start button
        const startBtn = document.createElement('button');
        startBtn.textContent = 'START MATCH';
        startBtn.style.padding = '15px 40px';
        startBtn.style.fontSize = '16px';
        startBtn.style.backgroundColor = '#00d4ff';
        startBtn.style.color = '#000000';
        startBtn.style.border = 'none';
        startBtn.style.borderRadius = '4px';
        startBtn.style.cursor = 'pointer';
        startBtn.style.marginTop = '20px';
        startBtn.onclick = () => {
            container.remove();
            if (typeof startMatch === 'function') {
                startMatch();
            }
        };
        container.appendChild(startBtn);

        return container;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NarrativeUIIntegration };
}
