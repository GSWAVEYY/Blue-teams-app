/**
 * NEXUS Narrative UI Hooks - Phase 3 Integration
 * Patches game flow to integrate narrative UI into hero selection and team lobby
 */

class NarrativeUIHooks {
    constructor() {
        this.setupInitialized = false;
        this.heroSelectionSetup = false;
        this.teamLobbySetup = false;
    }

    /**
     * Initialize all narrative UI hooks
     */
    initialize() {
        console.log('[NarrativeUIHooks] Initializing Phase 3 integration hooks...');

        // Hook into hero grid population
        this.patchHeroGridPopulation();

        // Hook into hero selection
        this.patchHeroSelectionUI();

        // Hook into team lobby display
        this.patchTeamLobbyUI();

        // Hook into confirmation flow
        this.patchConfirmationFlow();

        this.setupInitialized = true;
        console.log('[NarrativeUIHooks] Phase 3 integration complete');
    }

    /**
     * Patch hero grid to add narrative elements
     */
    patchHeroGridPopulation() {
        const originalPopulateHeroGrid = window.UIManager?.prototype?.populateHeroGrid;

        if (originalPopulateHeroGrid) {
            window.UIManager.prototype.populateHeroGrid = function() {
                // Call original
                originalPopulateHeroGrid.call(this);

                // Add narrative UI setup
                setTimeout(() => {
                    NarrativeUIIntegration.setupHeroSelectionNarrative();
                }, 100);
            };
        }
    }

    /**
     * Patch hero selection to display personality
     */
    patchHeroSelectionUI() {
        // Hook into hero grid click events
        setTimeout(() => {
            const heroGrid = document.getElementById('hero-grid');
            if (heroGrid) {
                heroGrid.addEventListener('click', (e) => {
                    const card = e.target.closest('[data-hero]');
                    if (card) {
                        const heroName = card.getAttribute('data-hero');
                        NarrativeUIIntegration.displayHeroPersonality(heroName);
                    }
                });
            }
        }, 500);
    }

    /**
     * Patch team lobby to show narrative section
     */
    patchTeamLobbyUI() {
        const originalShowScreen = window.UIManager?.prototype?.showScreen;

        if (originalShowScreen) {
            window.UIManager.prototype.showScreen = function(screenId) {
                // Call original
                originalShowScreen.call(this, screenId);

                // If showing team lobby, setup narrative
                if (screenId === 'team-lobby-screen') {
                    setTimeout(() => {
                        if (!window.narrativeTeamLobbySetup) {
                            NarrativeUIIntegration.setupTeamLobbyNarrative();
                            window.narrativeTeamLobbySetup = true;
                        }
                        this.updateTeamNarrative();
                    }, 100);
                }
            };
        }
    }

    /**
     * Update team lobby narrative display
     */
    updateTeamNarrative() {
        if (typeof gameState === 'undefined') return;

        const teamHeroes = gameState.teams?.blue || [];
        if (teamHeroes.length > 0) {
            NarrativeUIIntegration.updateTeamLobbyNarrative(teamHeroes);
        }
    }

    /**
     * Patch confirmation flow to show pre-match narrative
     */
    patchConfirmationFlow() {
        const originalToggleReady = window.toggleReady;

        if (originalToggleReady && typeof originalToggleReady === 'function') {
            window.toggleReady = function() {
                // Call original
                originalToggleReady.call(this);

                // Check if match should start
                if (typeof gameState !== 'undefined') {
                    if (gameState.allPlayersReady && gameState.allPlayersReady() && gameState.teams && gameState.teams.red && gameState.teams.red.length > 0) {
                        // Show pre-match narrative before starting game
                        setTimeout(() => {
                            const narrative = NarrativeUIIntegration.createPreMatchNarrative(
                                gameState.teams.blue || [],
                                gameState.teams.red || []
                            );
                            if (narrative) {
                                document.body.appendChild(narrative);
                                // Auto-start after 4 seconds if user doesn't click
                                setTimeout(() => {
                                    const preMatch = document.getElementById('pre-match-narrative');
                                    if (preMatch && preMatch.parentNode) {
                                        preMatch.remove();
                                    }
                                }, 4000);
                            }
                        }, 300);
                    }
                }
            };
        }
    }

    /**
     * Hook hero click events for personality display
     */
    hookHeroCardClicks() {
        document.addEventListener('click', (e) => {
            const heroCard = e.target.closest('.hero-select-card, [data-hero]');
            if (heroCard) {
                const heroName = heroCard.getAttribute('data-hero') ||
                               heroCard.textContent.toLowerCase().trim();
                if (heroName && heroName !== '') {
                    NarrativeUIIntegration.displayHeroPersonality(heroName);
                }
            }
        });
    }

    /**
     * Initialize narrative UI manager if not already done
     */
    ensureNarrativeUIManager() {
        if (typeof NarrativeUIIntegration === 'undefined') {
            console.error('[NarrativeUIHooks] NarrativeUIIntegration not loaded');
            return false;
        }
        return true;
    }
}

/**
 * Global narrative UI hooks instance
 */
let narrativeUIHooks = null;

/**
 * Initialize Phase 3 narrative UI integration
 */
function initializeNarrativeUIPhase3() {
    if (!narrativeUIHooks) {
        narrativeUIHooks = new NarrativeUIHooks();
    }

    if (narrativeUIHooks.ensureNarrativeUIManager()) {
        narrativeUIHooks.initialize();
        return narrativeUIHooks;
    }

    return null;
}

/**
 * Auto-initialize when DOM is ready
 */
function setupNarrativeUIHooksOnReady() {
    // Wait for all systems to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => initializeNarrativeUIPhase3(), 500);
        });
    } else {
        setTimeout(() => initializeNarrativeUIPhase3(), 500);
    }
}

// Start setup
setupNarrativeUIHooksOnReady();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NarrativeUIHooks,
        initializeNarrativeUIPhase3
    };
}
