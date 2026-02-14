/**
 * NEXUS Scrim UI System
 * Mobile-optimized scrim request and management interface
 *
 * Mobile scrim features:
 * - Scrim request interface
 * - Quick opponent suggestions
 * - Scrim history view
 * - Coach analytics display
 */

class ScrimUI {
    static createScrimRequestPanel() {
        const panel = document.createElement('div');
        panel.className = 'scrim-request-panel';
        panel.innerHTML = `
            <div class="scrim-header">
                <h2>⚔️ Request Practice Scrim</h2>
                <p>Challenge another team to a practice match</p>
            </div>

            <div class="scrim-form">
                <div class="form-group">
                    <label>Opponent Team:</label>
                    <input type="text" id="opponent-search" placeholder="Search team name..." class="input-field">
                    <div id="opponent-suggestions" class="suggestions-list"></div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Game Mode:</label>
                        <select id="scrim-mode" class="input-field">
                            <option value="tdm">Team Deathmatch</option>
                            <option value="koth">King of the Hill</option>
                            <option value="search">Search & Destroy</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Team Size:</label>
                        <select id="scrim-size" class="input-field">
                            <option value="3">3v3</option>
                            <option value="5">5v5</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Best of:</label>
                        <select id="scrim-bestof" class="input-field">
                            <option value="1">Bo1</option>
                            <option value="3">Bo3</option>
                            <option value="5">Bo5</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>When:</label>
                        <input type="datetime-local" id="scrim-time" class="input-field">
                    </div>
                </div>

                <div class="form-group">
                    <label>Custom Rules (Optional):</label>
                    <div class="custom-rules-toggle">
                        <input type="checkbox" id="enable-rules">
                        <span>Enable Custom Rules</span>
                    </div>
                    <div id="custom-rules-section" class="hidden">
                        <textarea id="banned-heroes" placeholder="Banned heroes (comma separated)" class="input-field"></textarea>
                        <textarea id="special-conditions" placeholder="Special conditions..." class="input-field"></textarea>
                    </div>
                </div>

                <button class="btn-primary btn-send-request" onclick="sendScrimRequest()">Send Request</button>
            </div>
        `;

        return panel;
    }

    static createPendingRequestsPanel(scrimManager, teamId) {
        const panel = document.createElement('div');
        panel.className = 'pending-requests-panel';

        const pending = scrimManager.getPendingRequests(teamId);

        let html = `
            <div class="panel-header">
                <h3>📬 Pending Requests (${pending.length})</h3>
            </div>
        `;

        if (pending.length === 0) {
            html += '<p class="empty-state">No pending scrim requests</p>';
        } else {
            html += '<div class="request-list">';
            pending.forEach(scrim => {
                const scheduledTime = new Date(scrim.proposedTime);
                html += `
                    <div class="request-card">
                        <div class="request-info">
                            <div class="teams">
                                <span class="team-name">${scrim.challenger.teamId}</span>
                                <span class="vs">vs</span>
                            </div>
                            <div class="details">
                                <span>${scrim.gameMode.toUpperCase()} ${scrim.teamSize}v${scrim.teamSize}</span>
                                <span class="time">📅 ${scheduledTime.toLocaleDateString()} ${scheduledTime.toLocaleTimeString()}</span>
                            </div>
                        </div>
                        <div class="request-actions">
                            <button class="btn-small btn-accept" onclick="acceptScrim('${scrim.id}')">Accept</button>
                            <button class="btn-small btn-decline" onclick="declineScrim('${scrim.id}')">Decline</button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        panel.innerHTML = html;
        return panel;
    }

    static createScrimHistoryPanel(scrimManager, teamId) {
        const panel = document.createElement('div');
        panel.className = 'scrim-history-panel';

        const history = scrimManager.getScrimHistory(teamId, 10);
        const stats = scrimManager.getScrimStats(teamId);

        let html = `
            <div class="panel-header">
                <h3>📊 Scrim History</h3>
                ${stats ? `
                    <div class="stats-summary">
                        <div class="stat">
                            <span class="label">Scrims:</span>
                            <span class="value">${stats.scrims}</span>
                        </div>
                        <div class="stat">
                            <span class="label">W/L:</span>
                            <span class="value">${stats.wins}/${stats.losses}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Win Rate:</span>
                            <span class="value">${stats.winRate}%</span>
                        </div>
                        <div class="stat">
                            <span class="label">Avg Score:</span>
                            <span class="value">${stats.avgScore}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        if (history.length === 0) {
            html += '<p class="empty-state">No scrim history yet</p>';
        } else {
            html += '<div class="history-list">';
            history.forEach(scrim => {
                const isWin = scrim.winner === teamId;
                const opponent = scrim.challenger.teamId === teamId ? scrim.opponent.teamId : scrim.challenger.teamId;
                html += `
                    <div class="history-item ${isWin ? 'win' : 'loss'}">
                        <div class="result-indicator">${isWin ? '✓' : '✗'}</div>
                        <div class="scrim-details">
                            <div class="opponent">vs ${opponent}</div>
                            <div class="mode">${scrim.gameMode} ${scrim.teamSize}v${scrim.teamSize}</div>
                            <div class="matches">Matches: ${scrim.matches.length}</div>
                            <div class="date">${new Date(scrim.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div class="result-badge">
                            ${isWin ? 'Won' : 'Lost'}
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        panel.innerHTML = html;
        return panel;
    }

    static createRecommendedOpponentsPanel(scrimManager, teamId) {
        const panel = document.createElement('div');
        panel.className = 'recommended-opponents-panel';

        const recommendations = scrimManager.getRecommendedOpponents(teamId);

        let html = `
            <div class="panel-header">
                <h3>🎯 Recommended Opponents</h3>
                <p>Teams with similar skill levels</p>
            </div>
        `;

        if (recommendations.length === 0) {
            html += '<p class="empty-state">No recommendations available yet</p>';
        } else {
            html += '<div class="opponent-grid">';
            recommendations.forEach(rec => {
                const compatibilityPercent = rec.compatibility.toFixed(0);
                const compatibilityColor = compatibilityPercent > 80 ? '#4caf50' : compatibilityPercent > 60 ? '#ff9800' : '#f44336';
                
                html += `
                    <div class="opponent-card">
                        <div class="opponent-name">${rec.teamId}</div>
                        <div class="compatibility-bar">
                            <div class="fill" style="width: ${compatibilityPercent}%; background: ${compatibilityColor}"></div>
                        </div>
                        <div class="compatibility-text">${compatibilityPercent}% Match</div>
                        <div class="winrate">Win Rate: ${rec.winRate}%</div>
                        <button class="btn-small btn-primary" onclick="quickScrimRequest('${rec.teamId}')">
                            Challenge
                        </button>
                    </div>
                `;
            });
            html += '</div>';
        }

        panel.innerHTML = html;
        return panel;
    }

    static createCoachAnalyticsPanel(scrimManager, teamId) {
        const panel = document.createElement('div');
        panel.className = 'coach-analytics-panel';

        const analytics = scrimManager.getCoachAnalytics(teamId);

        if (!analytics) {
            panel.innerHTML = '<p class="empty-state">No analytics available yet</p>';
            return panel;
        }

        let html = `
            <div class="panel-header">
                <h3>📈 Coach Analytics</h3>
            </div>

            <div class="analytics-content">
                <div class="analytics-section">
                    <h4>Overall Performance</h4>
                    <div class="metric">
                        <span class="label">Total Scrims:</span>
                        <span class="value">${analytics.totalScrims}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Win Rate:</span>
                        <span class="value" style="color: ${parseFloat(analytics.winRate) > 50 ? '#4caf50' : '#f44336'}">${analytics.winRate}%</span>
                    </div>
                    <div class="metric">
                        <span class="label">Avg Score:</span>
                        <span class="value">${analytics.avgScore}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Recent Form:</span>
                        <span class="value" style="color: ${analytics.recentForm === 'Winning' ? '#4caf50' : '#f44336'}">${analytics.recentForm}</span>
                    </div>
                </div>

                <div class="analytics-section">
                    <h4>Strengths</h4>
                    <ul class="strength-list">
                        ${analytics.strengthAreas.map(a => `<li>✓ ${a}</li>`).join('')}
                    </ul>
                </div>

                <div class="analytics-section">
                    <h4>Areas for Improvement</h4>
                    <ul class="weakness-list">
                        ${analytics.weaknessAreas.map(a => `<li>⚠ ${a}</li>`).join('')}
                    </ul>
                </div>

                <div class="analytics-section">
                    <h4>Coach Recommendations</h4>
                    <ul class="recommendations-list">
                        ${analytics.recommendations.map(r => `<li>→ ${r}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        panel.innerHTML = html;
        return panel;
    }

    static createMobileScrimDashboard(scrimManager, teamManager, teamId) {
        const dashboard = document.createElement('div');
        dashboard.className = 'mobile-scrim-dashboard';

        dashboard.innerHTML = `
            <div class="scrim-tabs">
                <button class="tab-btn active" onclick="switchScrimTab('requests')">Requests</button>
                <button class="tab-btn" onclick="switchScrimTab('history')">History</button>
                <button class="tab-btn" onclick="switchScrimTab('opponents')">Opponents</button>
                <button class="tab-btn" onclick="switchScrimTab('analytics')">Analytics</button>
            </div>

            <div id="scrim-requests" class="tab-content active">
                ${ScrimUI.createScrimRequestPanel().outerHTML}
                ${ScrimUI.createPendingRequestsPanel(scrimManager, teamId).outerHTML}
            </div>

            <div id="scrim-history" class="tab-content">
                ${ScrimUI.createScrimHistoryPanel(scrimManager, teamId).outerHTML}
            </div>

            <div id="scrim-opponents" class="tab-content">
                ${ScrimUI.createRecommendedOpponentsPanel(scrimManager, teamId).outerHTML}
            </div>

            <div id="scrim-analytics" class="tab-content">
                ${ScrimUI.createCoachAnalyticsPanel(scrimManager, teamId).outerHTML}
            </div>
        `;

        return dashboard;
    }
}

/**
 * Tab switching function
 */
function switchScrimTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.scrim-ui .tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.scrim-ui .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const tab = document.getElementById(`scrim-${tabName}`);
    if (tab) {
        tab.classList.add('active');
        event.target.classList.add('active');
    }
}

/**
 * Send scrim request
 */
function sendScrimRequest() {
    const opponentId = document.getElementById('opponent-search').value;
    const gameMode = document.getElementById('scrim-mode').value;
    const teamSize = parseInt(document.getElementById('scrim-size').value);
    const bestOf = parseInt(document.getElementById('scrim-bestof').value);
    const scheduledTime = document.getElementById('scrim-time').value;

    if (!opponentId) {
        alert('Please select an opponent team');
        return;
    }

    const scrimManager = getScrimManager();
    const currentTeam = getCurrentTeamId(); // Would get from game state

    const scrim = scrimManager.sendScrimRequest(currentTeam, opponentId, getCurrentPlayerId(), gameMode, teamSize);

    if (scrim) {
        alert(`Scrim request sent to ${opponentId}!`);
        document.getElementById('opponent-search').value = '';
    }
}

/**
 * Accept scrim
 */
function acceptScrim(scrimId) {
    const scrimManager = getScrimManager();
    const teamId = getCurrentTeamId();
    const captainId = getCurrentPlayerId();

    if (scrimManager.acceptScrimRequest(scrimId, teamId, captainId)) {
        alert('Scrim request accepted!');
        location.reload(); // Refresh UI
    }
}

/**
 * Decline scrim
 */
function declineScrim(scrimId) {
    const scrimManager = getScrimManager();
    const teamId = getCurrentTeamId();

    if (scrimManager.declineScrimRequest(scrimId, teamId)) {
        alert('Scrim request declined');
        location.reload();
    }
}

/**
 * Quick scrim request to recommended opponent
 */
function quickScrimRequest(opponentTeamId) {
    const scrimManager = getScrimManager();
    const currentTeam = getCurrentTeamId();
    const captainId = getCurrentPlayerId();

    const scrim = scrimManager.sendScrimRequest(currentTeam, opponentTeamId, captainId, 'tdm', 5);

    if (scrim) {
        alert(`Scrim request sent to ${opponentTeamId}!`);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrimUI };
}
