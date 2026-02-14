/**
 * NEXUS Audio System
 * Music, sound effects, voice acting, and 3D audio management
 */

class AudioManager {
    constructor() {
        this.audioContext = this.initializeAudioContext();
        this.masterVolume = 0.8;
        this.volumes = {
            music: 0.5,
            sfx: 0.8,
            voice: 0.9,
            ambient: 0.4,
            ui: 0.7
        };

        // Audio sources
        this.musicTrack = null;
        this.activeLoops = [];
        this.voiceQueue = [];
        this.currentGameState = "menu";
        this.dynamicMixingEnabled = true;

        // Listener position (for 3D audio)
        this.listenerPos = { x: 0, y: 0 };

        // Track loading status
        this.tracksLoaded = 0;
        this.totalTracks = 0;
    }

    /**
     * Initialize Web Audio API context
     */
    initializeAudioContext() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Resume context on user interaction (required for autoplay)
        document.addEventListener('click', () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        });

        return audioContext;
    }

    /**
     * Music tracks database
     */
    static MUSIC_TRACKS = {
        menu: {
            name: "Nexus Awakens",
            duration: 150,
            loop: true,
            bpm: 120,
            category: "menu"
        },
        heroSelect: {
            name: "Choose Your Champion",
            duration: 105,
            loop: true,
            bpm: 140,
            category: "selection"
        },
        lobby: {
            name: "Before the Storm",
            duration: 120,
            loop: true,
            bpm: 130,
            category: "lobby"
        },
        loading: {
            name: "Battle Commence",
            duration: 80,
            loop: false,
            bpm: 150,
            category: "transition"
        },
        matchTDM: {
            name: "Arena Clash",
            duration: 180,
            loop: true,
            bpm: 160,
            category: "match",
            adaptiveIntensity: true
        },
        matchKoth: {
            name: "Control Point",
            duration: 210,
            loop: true,
            bpm: 135,
            category: "match",
            adaptiveIntensity: true
        },
        matchSD: {
            name: "Bomb Site",
            duration: 165,
            loop: true,
            bpm: 120,
            category: "match",
            adaptiveIntensity: true
        },
        victory: {
            name: "Champions Rise",
            duration: 45,
            loop: false,
            bpm: 140,
            category: "end"
        },
        defeat: {
            name: "Back to the Arena",
            duration: 40,
            loop: false,
            bpm: 110,
            category: "end"
        }
    };

    /**
     * Sound effect database
     */
    static SFX_LIBRARY = {
        // Ability SFX (organized by hero)
        abilities: {
            grael: {
                q: { name: "Shield Wall", duration: 0.8, volume: 0.7 },
                e: { name: "Counterblow", duration: 0.5, volume: 0.8 },
                r: { name: "Dragon Ascension", duration: 1.5, volume: 0.9 }
            },
            thaxus: {
                q: { name: "Whirlwind", duration: 1.2, volume: 0.9 },
                e: { name: "Cleave", duration: 0.7, volume: 0.8 },
                r: { name: "Infernal Rampage", duration: 2.0, volume: 0.95 }
            },
            // ... Continue for all 15 heroes
        },

        // Weapon SFX
        weapons: {
            swordSwing: { name: "Sword Swing", duration: 0.5, volume: 0.7 },
            arrowShoot: { name: "Arrow Shoot", duration: 0.3, volume: 0.6 },
            spellCast: { name: "Spell Cast", duration: 0.6, volume: 0.7 },
            daguerStab: { name: "Dagger Stab", duration: 0.4, volume: 0.7 },
            axeSwing: { name: "Axe Swing", duration: 0.7, volume: 0.8 }
        },

        // Combat feedback
        combat: {
            lightDamage: { name: "Light Hit", duration: 0.2, volume: 0.5 },
            mediumDamage: { name: "Medium Hit", duration: 0.3, volume: 0.7 },
            heavyDamage: { name: "Heavy Hit", duration: 0.4, volume: 0.9 },
            critical: { name: "Critical Hit", duration: 0.5, volume: 0.95 },
            shield: { name: "Shield Hit", duration: 0.3, volume: 0.6 },
            kill: { name: "Kill Sound", duration: 0.8, volume: 0.9 },
            death: { name: "Death Sound", duration: 1.0, volume: 0.85 },
            healthWarning: { name: "Health Critical", duration: 0.4, volume: 0.8 }
        },

        // Movement
        movement: {
            footstep: { name: "Footstep", duration: 0.2, volume: 0.4 },
            dash: { name: "Dash", duration: 0.3, volume: 0.6 },
            jump: { name: "Jump", duration: 0.2, volume: 0.5 },
            land: { name: "Land", duration: 0.2, volume: 0.5 }
        },

        // UI sounds
        ui: {
            buttonClick: { name: "Button Click", duration: 0.1, volume: 0.5 },
            notification: { name: "Notification", duration: 0.3, volume: 0.7 },
            success: { name: "Success", duration: 0.4, volume: 0.7 },
            error: { name: "Error", duration: 0.3, volume: 0.8 }
        }
    };

    /**
     * Voice lines database
     */
    static VOICE_LINES = {
        grael: {
            q: "An unbreakable wall!",
            e: "We shall not yield!",
            r: "BURN, FOOLS!",
            kill: "Honor demands victory!",
            death: "I will return...",
            respawn: "Back to the arena!"
        },
        thaxus: {
            q: "BLOOD AND THUNDER!",
            e: "Everything falls!",
            r: "YOU DARE CHALLENGE ME?!",
            kill: "ANOTHER FALLS!",
            death: "This... isn't... over!",
            respawn: "I RETURN!"
        },
        // ... Continue for all 15 heroes
    };

    /**
     * Play music for game state
     */
    playMusic(gameState, options = {}) {
        const track = AudioManager.MUSIC_TRACKS[gameState];
        if (!track) {
            console.warn(`Unknown music track: ${gameState}`);
            return;
        }

        // Crossfade if already playing
        if (this.musicTrack) {
            this.fadeOutMusic(0.5, () => {
                this.startMusicTrack(track, gameState);
            });
        } else {
            this.startMusicTrack(track, gameState);
        }

        this.currentGameState = gameState;
    }

    /**
     * Start music track with Web Audio
     */
    startMusicTrack(track, state) {
        const ctx = this.audioContext;

        // Create audio element
        const audio = new Audio();
        audio.src = `/assets/music/${state}.mp3`; // Path to music file
        audio.loop = track.loop;
        audio.volume = this.volumes.music * this.masterVolume;

        // Create gain node for volume control
        const gainNode = ctx.createGain();
        gainNode.gain.value = this.volumes.music * this.masterVolume;

        // Connect audio to gain node
        const source = ctx.createMediaElementAudioSource(audio);
        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Play music
        audio.play().catch(err => {
            console.warn("Audio playback failed:", err);
        });

        this.musicTrack = {
            element: audio,
            gainNode: gainNode,
            state: state,
            track: track
        };
    }

    /**
     * Fade out music with callback
     */
    fadeOutMusic(duration = 1.0, callback = null) {
        if (!this.musicTrack) return;

        const startTime = this.audioContext.currentTime;
        const endTime = startTime + duration;
        const startGain = this.musicTrack.gainNode.gain.value;

        const fadeInterval = setInterval(() => {
            const now = this.audioContext.currentTime;
            if (now >= endTime) {
                this.musicTrack.element.pause();
                this.musicTrack.gainNode.gain.value = 0;
                clearInterval(fadeInterval);
                this.musicTrack = null;
                if (callback) callback();
            } else {
                const progress = (now - startTime) / duration;
                this.musicTrack.gainNode.gain.value = startGain * (1 - progress);
            }
        }, 16);
    }

    /**
     * Stop all music
     */
    stopMusic() {
        if (this.musicTrack) {
            this.musicTrack.element.pause();
            this.musicTrack = null;
        }
    }

    /**
     * Play sound effect
     */
    playSFX(category, name, options = {}) {
        const sfx = AudioManager.SFX_LIBRARY[category]?.[name];
        if (!sfx) {
            console.warn(`Unknown SFX: ${category}/${name}`);
            return;
        }

        const ctx = this.audioContext;
        const audio = new Audio();
        audio.src = `/assets/sfx/${category}/${name}.mp3`;

        // Apply volume based on category
        const volume = (this.volumes[category] || 0.7) * this.masterVolume;

        // Apply spatial audio if position provided
        if (options.position) {
            this.applySpatialAudio(audio, options.position);
        }

        audio.volume = volume * (options.volumeMultiplier || 1.0);
        audio.play().catch(err => {
            console.warn("SFX playback failed:", err);
        });

        // Remove audio element after playback
        audio.onended = () => {
            audio.remove();
        };

        return audio;
    }

    /**
     * Apply spatial audio (3D positioning)
     */
    applySpatialAudio(audioElement, sourcePos) {
        // Calculate distance and pan
        const dx = sourcePos.x - this.listenerPos.x;
        const dy = sourcePos.y - this.listenerPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate pan (-1 to 1)
        const pan = Math.max(-1, Math.min(1, dx / 500));

        // Calculate attenuation based on distance
        const maxDistance = 1000;
        const attenuation = Math.max(0.2, 1 - (distance / maxDistance));

        // Create stereo panner node
        const ctx = this.audioContext;
        const source = ctx.createMediaElementAudioSource(audioElement);
        const pannerNode = ctx.createStereoPanner();
        const gainNode = ctx.createGain();

        pannerNode.pan.value = pan;
        gainNode.gain.value = attenuation;

        source.connect(pannerNode);
        pannerNode.connect(gainNode);
        gainNode.connect(ctx.destination);
    }

    /**
     * Play hero ability sound
     */
    playAbilitySound(heroName, abilityKey) {
        const heroName_ = heroName.toLowerCase();
        const abilityData = AudioManager.VOICE_LINES[heroName_]?.[abilityKey];

        if (!abilityData) return;

        // Play SFX
        this.playSFX("abilities", `${heroName_}_${abilityKey}`);

        // Queue voice line
        this.queueVoiceLine(heroName_, abilityKey);
    }

    /**
     * Queue voice line for playback
     */
    queueVoiceLine(heroName, lineType) {
        const voiceLine = AudioManager.VOICE_LINES[heroName.toLowerCase()]?.[lineType];
        if (!voiceLine) return;

        this.voiceQueue.push({
            hero: heroName,
            line: voiceLine,
            type: lineType,
            timestamp: this.audioContext.currentTime
        });

        // Play if queue was empty
        if (this.voiceQueue.length === 1) {
            this.playNextVoiceLine();
        }
    }

    /**
     * Play next voice line in queue
     */
    playNextVoiceLine() {
        if (this.voiceQueue.length === 0) return;

        const nextLine = this.voiceQueue.shift();
        const ctx = this.audioContext;
        const audio = new Audio();

        // Use voice file for hero
        audio.src = `/assets/voices/${nextLine.hero}/${nextLine.type}.mp3`;
        audio.volume = this.volumes.voice * this.masterVolume;

        audio.play().catch(err => {
            console.warn("Voice playback failed:", err);
            this.playNextVoiceLine(); // Try next
        });

        // Queue next voice line after this one finishes
        audio.onended = () => {
            audio.remove();
            if (this.voiceQueue.length > 0) {
                this.playNextVoiceLine();
            }
        };
    }

    /**
     * Play announcer line
     */
    playAnnouncerLine(eventType) {
        const lines = {
            gameStart: "NEXUS ARENA - BEGIN!",
            firstBlood: "FIRST BLOOD!",
            doubleKill: "DOUBLE KILL!",
            tripleKill: "TRIPLE KILL!",
            quadraKill: "QUADRA KILL!",
            teamFight: "TEAM FIGHT INCOMING!",
            victory: "VICTORY!",
            defeat: "DEFEAT!",
            pointCaptured: "POINT CAPTURED!",
            bombPlanted: "BOMB PLANTED!"
        };

        const line = lines[eventType];
        if (!line) return;

        const audio = new Audio();
        audio.src = `/assets/voices/announcer/${eventType}.mp3`;
        audio.volume = this.volumes.voice * this.masterVolume;

        audio.play().catch(err => {
            console.warn("Announcer playback failed:", err);
        });

        audio.onended = () => audio.remove();
    }

    /**
     * Set listener position (for spatial audio)
     */
    setListenerPosition(x, y) {
        this.listenerPos = { x, y };
    }

    /**
     * Set volume for category
     */
    setVolume(category, level) {
        if (this.volumes.hasOwnProperty(category)) {
            this.volumes[category] = Math.max(0, Math.min(1, level));

            // Update music if playing
            if (category === "music" && this.musicTrack) {
                this.musicTrack.gainNode.gain.value = this.volumes.music * this.masterVolume;
            }
        }
    }

    /**
     * Set master volume
     */
    setMasterVolume(level) {
        this.masterVolume = Math.max(0, Math.min(1, level));
    }

    /**
     * Get all current volumes
     */
    getVolumes() {
        return {
            master: this.masterVolume,
            ...this.volumes
        };
    }

    /**
     * Mute/unmute audio
     */
    setMuted(muted) {
        this.audioContext.destination.muted = muted;
    }

    /**
     * Save audio settings to localStorage
     */
    saveSettings() {
        const settings = {
            masterVolume: this.masterVolume,
            volumes: this.volumes,
            dynamicMixing: this.dynamicMixingEnabled
        };
        localStorage.setItem("audioSettings", JSON.stringify(settings));
    }

    /**
     * Load audio settings from localStorage
     */
    loadSettings() {
        const settings = localStorage.getItem("audioSettings");
        if (settings) {
            const parsed = JSON.parse(settings);
            this.masterVolume = parsed.masterVolume || 0.8;
            this.volumes = parsed.volumes || this.volumes;
            this.dynamicMixingEnabled = parsed.dynamicMixing !== false;
        }
    }
}

/**
 * Audio UI Manager
 * Handles audio settings screen
 */
class AudioUIManager {
    /**
     * Create audio settings panel
     */
    static createAudioSettings(audioManager) {
        const container = document.createElement("div");
        container.className = "audio-settings";
        container.style.cssText = `
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
            color: #ffffff;
            padding: 24px;
            border: 2px solid #00d4ff;
            border-radius: 8px;
            max-width: 400px;
            font-family: Arial, sans-serif;
        `;

        // Title
        const title = document.createElement("h2");
        title.textContent = "🎵 AUDIO SETTINGS";
        title.style.cssText = `
            color: #00d4ff;
            margin: 0 0 20px 0;
            font-size: 16px;
        `;
        container.appendChild(title);

        // Master Volume
        const masterSection = this._createVolumeSlider(
            audioManager,
            "master",
            "Master Volume",
            audioManager.masterVolume
        );
        container.appendChild(masterSection);

        // Category volumes
        const categories = ["music", "sfx", "voice", "ambient", "ui"];
        const categoryNames = {
            music: "🎼 Music",
            sfx: "💥 Sound Effects",
            voice: "🎤 Voice Lines",
            ambient: "🌊 Ambient",
            ui: "🖱️ UI Sounds"
        };

        for (const category of categories) {
            const section = this._createVolumeSlider(
                audioManager,
                category,
                categoryNames[category],
                audioManager.volumes[category]
            );
            container.appendChild(section);
        }

        // Advanced options
        const advancedDiv = document.createElement("div");
        advancedDiv.style.cssText = `
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(0, 212, 255, 0.3);
        `;

        // Dynamic mixing checkbox
        const mixingLabel = document.createElement("label");
        mixingLabel.style.cssText = `
            display: flex;
            align-items: center;
            color: #9d4edd;
            font-size: 12px;
            margin-bottom: 10px;
            cursor: pointer;
        `;

        const mixingCheckbox = document.createElement("input");
        mixingCheckbox.type = "checkbox";
        mixingCheckbox.checked = audioManager.dynamicMixingEnabled;
        mixingCheckbox.onchange = () => {
            audioManager.dynamicMixingEnabled = mixingCheckbox.checked;
        };
        mixingCheckbox.style.marginRight = "8px";

        mixingLabel.appendChild(mixingCheckbox);
        mixingLabel.appendChild(document.createTextNode("Dynamic Audio Mixing"));
        advancedDiv.appendChild(mixingLabel);

        // Reset button
        const resetBtn = document.createElement("button");
        resetBtn.textContent = "RESET TO DEFAULTS";
        resetBtn.style.cssText = `
            background: rgba(157, 78, 221, 0.3);
            border: 1px solid #9d4edd;
            color: #9d4edd;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            margin-top: 10px;
            width: 100%;
            transition: all 0.3s;
        `;

        resetBtn.onmouseover = () => {
            resetBtn.style.background = "#9d4edd";
            resetBtn.style.color = "#ffffff";
        };
        resetBtn.onmouseout = () => {
            resetBtn.style.background = "rgba(157, 78, 221, 0.3)";
            resetBtn.style.color = "#9d4edd";
        };

        resetBtn.onclick = () => {
            audioManager.masterVolume = 0.8;
            audioManager.volumes = {
                music: 0.5,
                sfx: 0.8,
                voice: 0.9,
                ambient: 0.4,
                ui: 0.7
            };
            audioManager.saveSettings();
            // Refresh UI
            location.reload();
        };

        advancedDiv.appendChild(resetBtn);
        container.appendChild(advancedDiv);

        return container;
    }

    /**
     * Create volume slider
     */
    static _createVolumeSlider(audioManager, category, label, currentValue) {
        const section = document.createElement("div");
        section.style.cssText = `
            margin-bottom: 16px;
        `;

        const labelEl = document.createElement("label");
        labelEl.textContent = label;
        labelEl.style.cssText = `
            display: block;
            font-size: 12px;
            color: #9d4edd;
            margin-bottom: 8px;
        `;
        section.appendChild(labelEl);

        const sliderContainer = document.createElement("div");
        sliderContainer.style.cssText = `
            display: flex;
            gap: 10px;
            align-items: center;
        `;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.value = Math.round(currentValue * 100);
        slider.style.cssText = `
            flex: 1;
            cursor: pointer;
        `;

        const valueDisplay = document.createElement("span");
        valueDisplay.textContent = `${slider.value}%`;
        valueDisplay.style.cssText = `
            color: #00d4ff;
            font-weight: bold;
            min-width: 40px;
            text-align: right;
            font-size: 11px;
        `;

        slider.oninput = () => {
            const level = slider.value / 100;
            valueDisplay.textContent = `${slider.value}%`;

            if (category === "master") {
                audioManager.setMasterVolume(level);
            } else {
                audioManager.setVolume(category, level);
            }
        };

        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(valueDisplay);
        section.appendChild(sliderContainer);

        return section;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioManager, AudioUIManager };
}
