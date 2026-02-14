/**
 * NEXUS Pre-Match Narrative System - Phase 4
 * Cinematic pre-game experiences with team analysis and matchup displays
 *
 * Features:
 * - Full-screen cinematic team introductions
 * - Advanced match prediction with detailed scoring
 * - Team strategy analysis and role distribution
 * - Enemy composition warnings and weaknesses
 * - Hero matchup analysis (strong/weak positions)
 * - Dynamic difficulty assessment
 */

class PreMatchNarrative {
    constructor(blueTeam, redTeam) {
        this.blueTeam = blueTeam || [];
        this.redTeam = redTeam || [];
        this.matchPrediction = null;
        this.teamStrategies = {};
        this.matchupAnalysis = {};
        this.battlegroundStory = '';
    }

    /**
     * Generate complete pre-match narrative experience
     */
    generateNarrative() {
        this.analyzeTeamCompositions();
        this.calculateMatchPrediction();
        this.analyzeHeroMatchups();
        this.generateBattlegroundStory();

        return {
            prediction: this.matchPrediction,
            strategies: this.teamStrategies,
            matchups: this.matchupAnalysis,
            story: this.battlegroundStory
        };
    }

    /**
     * Analyze team compositions and strategies
     */
    analyzeTeamCompositions() {
        this.teamStrategies = {
            blue: this._analyzeTeam(this.blueTeam, 'blue'),
            red: this._analyzeTeam(this.redTeam, 'red')
        };
    }

    /**
     * Analyze individual team
     */
    _analyzeTeam(team, teamColor) {
        if (!team || team.length === 0) return null;

        const roleDistribution = this._getRoleDistribution(team);
        const strengthAreas = this._identifyStrengths(team, roleDistribution);
        const weaknessAreas = this._identifyWeaknesses(team, roleDistribution);
        const strategyType = this._determineStrategy(team, roleDistribution);

        return {
            color: teamColor,
            heroes: team,
            roles: roleDistribution,
            strengths: strengthAreas,
            weaknesses: weaknessAreas,
            strategy: strategyType,
            composition: this._getCompositionName(roleDistribution)
        };
    }

    /**
     * Get role distribution for team
     */
    _getRoleDistribution(team) {
        const distribution = {
            warrior: 0,
            ranger: 0,
            mage: 0,
            guardian: 0,
            rogue: 0
        };

        team.forEach(hero => {
            if (typeof HEROES !== 'undefined' && HEROES[hero]) {
                const role = HEROES[hero].role.toLowerCase();
                if (distribution.hasOwnProperty(role)) {
                    distribution[role]++;
                }
            }
        });

        return distribution;
    }

    /**
     * Identify team strengths
     */
    _identifyStrengths(team, roles) {
        const strengths = [];

        if (roles.warrior >= 1) strengths.push('Front-line presence');
        if (roles.guardian >= 2) strengths.push('Sustain & Protection');
        if (roles.ranger >= 2) strengths.push('Ranged dominance');
        if (roles.rogue >= 2) strengths.push('Burst & Mobility');
        if (roles.mage >= 2) strengths.push('Area Control');

        // Check for synergies
        if (typeof MatchupSystem !== 'undefined') {
            let synergyCount = 0;
            for (let i = 0; i < team.length; i++) {
                for (let j = i + 1; j < team.length; j++) {
                    const syn = MatchupSystem.getSynergy(team[i], team[j]);
                    if (syn && syn.strength > 70) {
                        synergyCount++;
                    }
                }
            }
            if (synergyCount >= 3) {
                strengths.push('Strong team synergy');
            }
        }

        return strengths;
    }

    /**
     * Identify team weaknesses
     */
    _identifyWeaknesses(team, roles) {
        const weaknesses = [];

        if (roles.warrior === 0) weaknesses.push('No tank/front-line');
        if (roles.guardian === 0) weaknesses.push('Limited support');
        if (roles.ranger === 0 && roles.rogue === 0) weaknesses.push('Low mobility');
        if (roles.mage === 0) weaknesses.push('Limited area control');

        return weaknesses;
    }

    /**
     * Determine primary strategy type
     */
    _determineStrategy(team, roles) {
        if (roles.warrior >= 2) return 'Tanky Front-line';
        if (roles.rogue >= 2) return 'Burst Assassins';
        if (roles.mage >= 2) return 'Area Control';
        if (roles.guardian >= 2) return 'Support Stack';
        if (roles.ranger >= 2) return 'Ranged Pressure';

        // Mixed composition
        if (roles.warrior >= 1 && roles.guardian >= 1) return 'Defensive Wall';
        if (roles.rogue >= 1 && roles.mage >= 1) return 'Control Burst';
        return 'Balanced Composition';
    }

    /**
     * Get composition name (e.g., "1-1-2-1")
     */
    _getCompositionName(roles) {
        return `${roles.warrior}-${roles.ranger}-${roles.mage}-${roles.guardian}-${roles.rogue}`;
    }

    /**
     * Calculate match prediction with detailed scoring
     */
    calculateMatchPrediction() {
        let blueScore = 0;
        let redScore = 0;

        // Synergy scoring
        const blueSynergy = this._calculateTeamSynergy(this.blueTeam);
        const redSynergy = this._calculateTeamSynergy(this.redTeam);
        blueScore += blueSynergy;
        redScore += redSynergy;

        // Composition strength
        const blueCompositionScore = this._scoreComposition(this.blueTeam);
        const redCompositionScore = this._scoreComposition(this.redTeam);
        blueScore += blueCompositionScore;
        redScore += redCompositionScore;

        // Matchup analysis
        const matchupDiff = this._calculateMatchupAdvantage(this.blueTeam, this.redTeam);
        blueScore += matchupDiff;
        redScore -= matchupDiff;

        // Experience/meta knowledge
        const blueMetaScore = this._calculateMetaAlignment(this.blueTeam);
        const redMetaScore = this._calculateMetaAlignment(this.redTeam);
        blueScore += blueMetaScore;
        redScore += redMetaScore;

        // Determine prediction
        const totalDiff = blueScore - redScore;
        const blueWinChance = this._calculateWinChance(totalDiff);

        this.matchPrediction = {
            blueScore: Math.round(blueScore * 10) / 10,
            redScore: Math.round(redScore * 10) / 10,
            difference: Math.round(totalDiff * 10) / 10,
            blueWinChance: Math.round(blueWinChance),
            redWinChance: 100 - Math.round(blueWinChance),
            prediction: this._getPredictionText(blueWinChance),
            confidence: this._getConfidenceLevel(Math.abs(totalDiff)),
            components: {
                synergy: { blue: Math.round(blueSynergy * 10) / 10, red: Math.round(redSynergy * 10) / 10 },
                composition: { blue: Math.round(blueCompositionScore * 10) / 10, red: Math.round(redCompositionScore * 10) / 10 },
                matchups: { blue: Math.round(matchupDiff * 10) / 10, red: Math.round(-matchupDiff * 10) / 10 },
                meta: { blue: Math.round(blueMetaScore * 10) / 10, red: Math.round(redMetaScore * 10) / 10 }
            }
        };
    }

    /**
     * Calculate team synergy score
     */
    _calculateTeamSynergy(team) {
        if (typeof MatchupSystem === 'undefined') return 0;

        let synergies = 0;
        for (let i = 0; i < team.length; i++) {
            for (let j = i + 1; j < team.length; j++) {
                const syn = MatchupSystem.getSynergy(team[i], team[j]);
                if (syn) {
                    synergies += syn.strength / 100 * 2;
                }
            }
        }
        return synergies;
    }

    /**
     * Score composition quality
     */
    _scoreComposition(team) {
        const roles = this._getRoleDistribution(team);
        let score = 0;

        // Balanced composition is ideal
        const roleArray = Object.values(roles);
        const avgRole = roleArray.reduce((a, b) => a + b, 0) / roleArray.length;
        const variance = roleArray.reduce((sum, r) => sum + Math.pow(r - avgRole, 2), 0) / roleArray.length;

        // Lower variance = more balanced = better score
        score = 10 - (variance * 2);

        // Bonus for covering all roles
        const uniqueRoles = Object.values(roles).filter(r => r > 0).length;
        score += (uniqueRoles / 5) * 5;

        return Math.max(0, score);
    }

    /**
     * Calculate matchup advantage
     */
    _calculateMatchupAdvantage(blueTeam, redTeam) {
        if (typeof MatchupSystem === 'undefined') return 0;

        let advantage = 0;

        blueTeam.forEach(blueHero => {
            redTeam.forEach(redHero => {
                const blueSynergies = MatchupSystem.getRecommendedTeammates(blueHero);
                const redCounters = MatchupSystem.getCounterHeroes(redHero);

                // Blue hero synergizes with red hero? Bad for red
                if (blueSynergies.includes(redHero.toLowerCase())) {
                    advantage += 1;
                }

                // Blue hero counters red hero? Good for blue
                if (redCounters.includes(blueHero.toLowerCase())) {
                    advantage += 1.5;
                }
            });
        });

        return advantage;
    }

    /**
     * Calculate meta alignment score
     */
    _calculateMetaAlignment(team) {
        // Meta favors certain compositions
        const roles = this._getRoleDistribution(team);
        let score = 0;

        // Current meta favors balanced comps with support
        if (roles.guardian >= 1) score += 2;
        if (roles.warrior >= 1) score += 1.5;
        if (roles.rogue >= 1) score += 1;

        return score;
    }

    /**
     * Calculate win chance from score difference
     */
    _calculateWinChance(difference) {
        // Sigmoid function to convert score difference to win probability
        // -10 to 10 range maps to roughly 5% to 95% chance
        return (100 / (1 + Math.exp(-difference / 3))) || 50;
    }

    /**
     * Get prediction text
     */
    _getPredictionText(blueWinChance) {
        if (Math.abs(blueWinChance - 50) < 5) {
            return '⚖️ EVENLY MATCHED';
        } else if (blueWinChance > 50) {
            const advantage = Math.round(blueWinChance - 50);
            return `🔵 BLUE FAVORED (+${advantage}%)`;
        } else {
            const advantage = Math.round(50 - blueWinChance);
            return `🔴 RED FAVORED (+${advantage}%)`;
        }
    }

    /**
     * Get confidence level in prediction
     */
    _getConfidenceLevel(difference) {
        if (difference < 2) return 'Low';
        if (difference < 5) return 'Medium';
        return 'High';
    }

    /**
     * Analyze hero matchups in detail
     */
    analyzeHeroMatchups() {
        if (typeof MatchupSystem === 'undefined') {
            this.matchupAnalysis = {};
            return;
        }

        this.matchupAnalysis = {
            critical: [],
            favorable: [],
            even: [],
            warnings: []
        };

        // Analyze blue team perspective
        this.blueTeam.forEach(blueHero => {
            this.redTeam.forEach(redHero => {
                const matchupQuality = this._analyzeMatchup(blueHero, redHero);
                if (matchupQuality.score > 2) {
                    this.matchupAnalysis.favorable.push(matchupQuality);
                } else if (matchupQuality.score < -2) {
                    this.matchupAnalysis.critical.push(matchupQuality);
                } else {
                    this.matchupAnalysis.even.push(matchupQuality);
                }
            });
        });

        // Generate warnings
        this.matchupAnalysis.warnings = this._generateMatchupWarnings();
    }

    /**
     * Analyze single matchup
     */
    _analyzeMatchup(heroA, heroB) {
        let score = 0;
        let verdict = 'Even';

        const aCounters = MatchupSystem.getCounterHeroes(heroA);
        const bCounters = MatchupSystem.getCounterHeroes(heroB);

        if (aCounters.includes(heroB.toLowerCase())) {
            score -= 3;
            verdict = heroB + ' counters ' + heroA;
        }
        if (bCounters.includes(heroA.toLowerCase())) {
            score += 3;
            verdict = heroA + ' counters ' + heroB;
        }

        const aSynergies = MatchupSystem.getRecommendedTeammates(heroA);
        if (aSynergies.includes(heroB.toLowerCase())) {
            score += 2;
        }

        return {
            heroA,
            heroB,
            score,
            verdict
        };
    }

    /**
     * Generate matchup warnings
     */
    _generateMatchupWarnings() {
        const warnings = [];

        // Check for critical unmatched heroes
        this.redTeam.forEach(redHero => {
            let bestMatchup = -Infinity;
            let countered = true;

            this.blueTeam.forEach(blueHero => {
                const bCounters = MatchupSystem.getCounterHeroes(blueHero);
                if (!bCounters.includes(redHero.toLowerCase())) {
                    countered = false;
                }
            });

            if (countered) {
                warnings.push({
                    type: 'danger',
                    text: `⚠️ ${redHero} is heavily countered by your composition`,
                    severity: 'high'
                });
            }
        });

        return warnings;
    }

    /**
     * Generate battleground story narrative
     */
    generateBattlegroundStory() {
        const strategies = this.teamStrategies;

        const blueStrategy = strategies.blue?.strategy || 'Unknown strategy';
        const redStrategy = strategies.red?.strategy || 'Unknown strategy';

        const stories = [
            `The arena erupts as ${blueStrategy} clash with ${redStrategy}. Will experience triumph, or will innovation prevail?`,
            `Two contrasting approaches enter the battlefield: ${blueStrategy} vs ${redStrategy}. Only one will emerge victorious.`,
            `${blueStrategy} faces off against ${redStrategy}. The spectators hold their breath as these titans prepare to collide.`,
            `In a clash of strategies, ${blueStrategy} squares off with ${redStrategy}. The outcome hangs in the balance.`,
            `The crowd roars as ${blueStrategy} and ${redStrategy} take their positions. Destiny awaits on the battlefield.`
        ];

        this.battlegroundStory = stories[Math.floor(Math.random() * stories.length)];
    }

    /**
     * Create full pre-match screen element
     */
    createScreen() {
        const container = document.createElement('div');
        container.id = 'pre-match-screen-phase4';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a0a2e 100%);
            color: #ffffff;
            overflow: auto;
            z-index: 2000;
            animation: fadeIn 0.5s ease-out;
        `;

        // Header
        const header = this._createHeader();
        container.appendChild(header);

        // Main content
        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        `;

        // Battleground story
        const storySection = this._createStorySection();
        content.appendChild(storySection);

        // Team analysis grid
        const analysisGrid = this._createTeamAnalysisGrid();
        content.appendChild(analysisGrid);

        // Match prediction
        const prediction = this._createMatchPredictionSection();
        content.appendChild(prediction);

        // Matchup analysis
        const matchups = this._createMatchupAnalysisSection();
        content.appendChild(matchups);

        // Footer with actions
        const footer = this._createFooter();
        content.appendChild(footer);

        container.appendChild(content);
        return container;
    }

    /**
     * Create header section
     */
    _createHeader() {
        const header = document.createElement('div');
        header.style.cssText = `
            text-align: center;
            padding: 30px 20px;
            border-bottom: 2px solid #00d4ff;
            margin-bottom: 30px;
            animation: slideDown 0.6s ease-out;
        `;

        const title = document.createElement('h1');
        title.textContent = '⚔️ MATCH AWAITS ⚔️';
        title.style.cssText = `
            margin: 0 0 10px 0;
            color: #00d4ff;
            font-size: 40px;
            text-shadow: 0 0 20px #00d4ff;
            letter-spacing: 2px;
        `;
        header.appendChild(title);

        const subtitle = document.createElement('p');
        subtitle.textContent = this.matchPrediction?.prediction || 'Analyzing teams...';
        subtitle.style.cssText = `
            margin: 0;
            color: #ff9800;
            font-size: 18px;
        `;
        header.appendChild(subtitle);

        return header;
    }

    /**
     * Create story section
     */
    _createStorySection() {
        const section = document.createElement('div');
        section.style.cssText = `
            background: rgba(0, 212, 255, 0.05);
            border: 2px solid #00d4ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
            animation: slideUp 0.5s ease-out;
        `;

        const storyText = document.createElement('p');
        storyText.textContent = this.battlegroundStory;
        storyText.style.cssText = `
            margin: 0;
            color: #b0b0b0;
            font-size: 16px;
            font-style: italic;
            line-height: 1.6;
        `;
        section.appendChild(storyText);

        return section;
    }

    /**
     * Create team analysis grid
     */
    _createTeamAnalysisGrid() {
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        `;

        // Blue team analysis
        const blueCard = this._createTeamCard(this.teamStrategies.blue, 'blue');
        grid.appendChild(blueCard);

        // Red team analysis
        const redCard = this._createTeamCard(this.teamStrategies.red, 'red');
        grid.appendChild(redCard);

        return grid;
    }

    /**
     * Create individual team analysis card
     */
    _createTeamCard(strategy, color) {
        const card = document.createElement('div');
        const bgColor = color === 'blue' ? '#1a3a5a' : '#5a1a3a';
        const borderColor = color === 'blue' ? '#00d4ff' : '#ff6b6b';
        const textColor = color === 'blue' ? '#00d4ff' : '#ff6b6b';

        card.style.cssText = `
            background: rgba(${color === 'blue' ? '0, 212, 255' : '255, 107, 107'}, 0.1);
            border: 2px solid ${borderColor};
            border-radius: 8px;
            padding: 20px;
            animation: slideUp 0.6s ease-out;
        `;

        // Team header
        const header = document.createElement('div');
        header.style.cssText = `
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid ${borderColor};
        `;

        const teamTitle = document.createElement('h2');
        teamTitle.textContent = (color === 'blue' ? '🔵' : '🔴') + ' ' + (color.toUpperCase()) + ' TEAM';
        teamTitle.style.cssText = `
            margin: 0 0 10px 0;
            color: ${textColor};
            font-size: 18px;
        `;
        header.appendChild(teamTitle);

        const composition = document.createElement('p');
        composition.textContent = `Composition: ${strategy.composition}`;
        composition.style.cssText = `
            margin: 0;
            color: #999;
            font-size: 12px;
        `;
        header.appendChild(composition);

        card.appendChild(header);

        // Heroes list
        const heroesList = document.createElement('div');
        heroesList.style.cssText = `
            margin-bottom: 15px;
        `;

        const heroesTitle = document.createElement('p');
        heroesTitle.textContent = 'Heroes:';
        heroesTitle.style.cssText = `
            margin: 0 0 8px 0;
            color: ${textColor};
            font-size: 12px;
            font-weight: bold;
        `;
        heroesList.appendChild(heroesTitle);

        strategy.heroes.forEach(hero => {
            const heroItem = document.createElement('div');
            heroItem.textContent = `• ${hero}`;
            heroItem.style.cssText = `
                color: #b0b0b0;
                font-size: 11px;
                margin: 4px 0 4px 12px;
            `;
            heroesList.appendChild(heroItem);
        });

        card.appendChild(heroesList);

        // Strategy
        const strategyDiv = document.createElement('div');
        strategyDiv.style.cssText = `
            background: rgba(${color === 'blue' ? '0, 212, 255' : '255, 107, 107'}, 0.1);
            border-left: 3px solid ${borderColor};
            padding: 10px 12px;
            margin-bottom: 15px;
            border-radius: 4px;
        `;

        const strategyLabel = document.createElement('p');
        strategyLabel.textContent = 'Strategy:';
        strategyLabel.style.cssText = `
            margin: 0 0 4px 0;
            color: ${textColor};
            font-size: 11px;
            font-weight: bold;
        `;
        strategyDiv.appendChild(strategyLabel);

        const strategyText = document.createElement('p');
        strategyText.textContent = strategy.strategy;
        strategyText.style.cssText = `
            margin: 0;
            color: #b0b0b0;
            font-size: 12px;
        `;
        strategyDiv.appendChild(strategyText);

        card.appendChild(strategyDiv);

        // Strengths
        if (strategy.strengths.length > 0) {
            const strengthsDiv = document.createElement('div');
            strengthsDiv.style.cssText = `
                margin-bottom: 15px;
            `;

            const strengthsTitle = document.createElement('p');
            strengthsTitle.textContent = 'Strengths:';
            strengthsTitle.style.cssText = `
                margin: 0 0 6px 0;
                color: #00ff88;
                font-size: 11px;
                font-weight: bold;
            `;
            strengthsDiv.appendChild(strengthsTitle);

            strategy.strengths.forEach(strength => {
                const item = document.createElement('div');
                item.textContent = `✓ ${strength}`;
                item.style.cssText = `
                    color: #00ff88;
                    font-size: 11px;
                    margin: 3px 0 3px 12px;
                `;
                strengthsDiv.appendChild(item);
            });

            card.appendChild(strengthsDiv);
        }

        // Weaknesses
        if (strategy.weaknesses.length > 0) {
            const weaknessesDiv = document.createElement('div');

            const weaknessesTitle = document.createElement('p');
            weaknessesTitle.textContent = 'Weaknesses:';
            weaknessesTitle.style.cssText = `
                margin: 0 0 6px 0;
                color: #ff6b6b;
                font-size: 11px;
                font-weight: bold;
            `;
            weaknessesDiv.appendChild(weaknessesTitle);

            strategy.weaknesses.forEach(weakness => {
                const item = document.createElement('div');
                item.textContent = `⚠ ${weakness}`;
                item.style.cssText = `
                    color: #ff6b6b;
                    font-size: 11px;
                    margin: 3px 0 3px 12px;
                `;
                weaknessesDiv.appendChild(item);
            });

            card.appendChild(weaknessesDiv);
        }

        return card;
    }

    /**
     * Create match prediction section
     */
    _createMatchPredictionSection() {
        const section = document.createElement('div');
        section.style.cssText = `
            background: rgba(255, 215, 0, 0.05);
            border: 2px solid #ffd700;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            animation: slideUp 0.7s ease-out;
        `;

        const title = document.createElement('h3');
        title.textContent = '🎯 Match Prediction';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #ffd700;
            font-size: 16px;
        `;
        section.appendChild(title);

        // Prediction display
        const predictionDiv = document.createElement('div');
        predictionDiv.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
        `;

        const predictionText = document.createElement('p');
        predictionText.textContent = this.matchPrediction.prediction;
        predictionText.style.cssText = `
            margin: 0 0 10px 0;
            color: #ffd700;
            font-size: 20px;
            font-weight: bold;
        `;
        predictionDiv.appendChild(predictionText);

        const winChances = document.createElement('p');
        winChances.textContent = `🔵 ${this.matchPrediction.blueWinChance}% vs 🔴 ${this.matchPrediction.redWinChance}%`;
        winChances.style.cssText = `
            margin: 0 0 10px 0;
            color: #b0b0b0;
            font-size: 14px;
        `;
        predictionDiv.appendChild(winChances);

        const confidence = document.createElement('p');
        confidence.textContent = `Confidence: ${this.matchPrediction.confidence}`;
        confidence.style.cssText = `
            margin: 0;
            color: #999;
            font-size: 12px;
        `;
        predictionDiv.appendChild(confidence);

        section.appendChild(predictionDiv);

        // Score breakdown
        const breakdown = document.createElement('div');
        breakdown.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        `;

        const components = this.matchPrediction.components;
        const categories = [
            { label: 'Synergy', key: 'synergy' },
            { label: 'Composition', key: 'composition' },
            { label: 'Matchups', key: 'matchups' },
            { label: 'Meta Alignment', key: 'meta' }
        ];

        categories.forEach(cat => {
            const box = document.createElement('div');
            box.style.cssText = `
                background: rgba(157, 78, 221, 0.1);
                border-left: 3px solid #9d4edd;
                padding: 10px;
                border-radius: 4px;
            `;

            const label = document.createElement('p');
            label.textContent = cat.label;
            label.style.cssText = `
                margin: 0 0 4px 0;
                color: #9d4edd;
                font-size: 10px;
                font-weight: bold;
            `;
            box.appendChild(label);

            const scores = document.createElement('p');
            const comp = components[cat.key];
            const diff = comp.blue - comp.red;
            const sign = diff > 0 ? '+' : '';
            scores.textContent = `🔵 ${comp.blue.toFixed(1)} vs 🔴 ${comp.red.toFixed(1)}`;
            scores.style.cssText = `
                margin: 0;
                color: #b0b0b0;
                font-size: 11px;
            `;
            box.appendChild(scores);

            breakdown.appendChild(box);
        });

        section.appendChild(breakdown);

        return section;
    }

    /**
     * Create matchup analysis section
     */
    _createMatchupAnalysisSection() {
        const section = document.createElement('div');
        section.style.cssText = `
            background: rgba(157, 78, 221, 0.05);
            border: 2px solid #9d4edd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            animation: slideUp 0.8s ease-out;
        `;

        const title = document.createElement('h3');
        title.textContent = '⚡ Hero Matchups';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #9d4edd;
            font-size: 16px;
        `;
        section.appendChild(title);

        // Critical matchups
        if (this.matchupAnalysis.critical.length > 0) {
            const criticalDiv = document.createElement('div');
            criticalDiv.style.cssText = `
                margin-bottom: 15px;
            `;

            const criticalTitle = document.createElement('p');
            criticalTitle.textContent = 'Critical Matchups (Blue Disadvantage):';
            criticalTitle.style.cssText = `
                margin: 0 0 8px 0;
                color: #ff6b6b;
                font-size: 12px;
                font-weight: bold;
            `;
            criticalDiv.appendChild(criticalTitle);

            this.matchupAnalysis.critical.slice(0, 3).forEach(mu => {
                const item = document.createElement('div');
                item.textContent = `⚠️ ${mu.heroA} vs ${mu.heroB}: ${mu.verdict}`;
                item.style.cssText = `
                    color: #ff6b6b;
                    font-size: 11px;
                    margin: 4px 0;
                    padding-left: 12px;
                `;
                criticalDiv.appendChild(item);
            });

            section.appendChild(criticalDiv);
        }

        // Favorable matchups
        if (this.matchupAnalysis.favorable.length > 0) {
            const favorableDiv = document.createElement('div');
            favorableDiv.style.cssText = `
                margin-bottom: 15px;
            `;

            const favorableTitle = document.createElement('p');
            favorableTitle.textContent = 'Favorable Matchups (Blue Advantage):';
            favorableTitle.style.cssText = `
                margin: 0 0 8px 0;
                color: #00ff88;
                font-size: 12px;
                font-weight: bold;
            `;
            favorableDiv.appendChild(favorableTitle);

            this.matchupAnalysis.favorable.slice(0, 3).forEach(mu => {
                const item = document.createElement('div');
                item.textContent = `✓ ${mu.heroA} vs ${mu.heroB}: ${mu.verdict}`;
                item.style.cssText = `
                    color: #00ff88;
                    font-size: 11px;
                    margin: 4px 0;
                    padding-left: 12px;
                `;
                favorableDiv.appendChild(item);
            });

            section.appendChild(favorableDiv);
        }

        // Warnings
        if (this.matchupAnalysis.warnings.length > 0) {
            const warningsDiv = document.createElement('div');
            warningsDiv.style.cssText = `
                background: rgba(255, 152, 0, 0.1);
                border-left: 3px solid #ff9800;
                padding: 10px;
                border-radius: 4px;
            `;

            const warningsTitle = document.createElement('p');
            warningsTitle.textContent = 'Warnings:';
            warningsTitle.style.cssText = `
                margin: 0 0 8px 0;
                color: #ff9800;
                font-size: 12px;
                font-weight: bold;
            `;
            warningsDiv.appendChild(warningsTitle);

            this.matchupAnalysis.warnings.forEach(warning => {
                const item = document.createElement('div');
                item.textContent = warning.text;
                item.style.cssText = `
                    color: #ffb74d;
                    font-size: 11px;
                    margin: 4px 0;
                    padding-left: 12px;
                `;
                warningsDiv.appendChild(item);
            });

            section.appendChild(warningsDiv);
        }

        return section;
    }

    /**
     * Create footer with actions
     */
    _createFooter() {
        const footer = document.createElement('div');
        footer.style.cssText = `
            text-align: center;
            padding: 30px 20px;
            border-top: 2px solid #00d4ff;
            display: flex;
            justify-content: center;
            gap: 20px;
        `;

        const startBtn = document.createElement('button');
        startBtn.textContent = 'START MATCH';
        startBtn.style.cssText = `
            padding: 15px 40px;
            font-size: 16px;
            background: #00d4ff;
            color: #000000;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        `;
        startBtn.onmouseover = () => { startBtn.style.boxShadow = '0 0 20px #00d4ff'; };
        startBtn.onmouseout = () => { startBtn.style.boxShadow = 'none'; };
        startBtn.onclick = () => {
            const screen = document.getElementById('pre-match-screen-phase4');
            if (screen) screen.remove();
            if (typeof startMatch === 'function') {
                startMatch();
            }
        };
        footer.appendChild(startBtn);

        const skipBtn = document.createElement('button');
        skipBtn.textContent = 'SKIP';
        skipBtn.style.cssText = `
            padding: 15px 40px;
            font-size: 16px;
            background: transparent;
            color: #9d4edd;
            border: 2px solid #9d4edd;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
        `;
        skipBtn.onmouseover = () => { skipBtn.style.background = 'rgba(157, 78, 221, 0.1)'; };
        skipBtn.onmouseout = () => { skipBtn.style.background = 'transparent'; };
        skipBtn.onclick = () => {
            const screen = document.getElementById('pre-match-screen-phase4');
            if (screen) screen.remove();
            if (typeof startMatch === 'function') {
                startMatch();
            }
        };
        footer.appendChild(skipBtn);

        return footer;
    }
}

/**
 * Global pre-match narrative instance
 */
let preMatchNarrative = null;

/**
 * Initialize Phase 4 pre-match narrative
 */
function initializePreMatchNarrative(blueTeam, redTeam) {
    preMatchNarrative = new PreMatchNarrative(blueTeam, redTeam);
    preMatchNarrative.generateNarrative();
    return preMatchNarrative;
}

/**
 * Display Phase 4 pre-match screen
 */
function displayPreMatchNarrativeScreen(blueTeam, redTeam) {
    const narrative = initializePreMatchNarrative(blueTeam, redTeam);
    const screen = narrative.createScreen();
    document.body.appendChild(screen);
    return screen;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PreMatchNarrative,
        initializePreMatchNarrative,
        displayPreMatchNarrativeScreen
    };
}
