/* ===== Sonic Breakout — Main Menu Script ===== */
(function () {
    'use strict';

    // ---- Level Data ----
    const LEVELS = [
        { id: 0, zone: 'GREEN HILL ZONE', name: 'Act 1 — Rolling Start', bg: 'res/textures/backgrounds/green-hill-zone.png', unlocked: true },
        { id: 1, zone: 'MARBLE ZONE',     name: 'Act 2 — Ancient Ruins', bg: 'res/textures/backgrounds/marble-zone.png',      unlocked: true },
        { id: 2, zone: 'STARLIGHT ZONE',  name: 'Act 3 — Neon Nights',   bg: 'res/textures/backgrounds/starlight-zone.png',   unlocked: false },
        { id: 3, zone: 'FINAL ZONE',      name: 'Act 4 — Eggman\'s Lair', bg: 'res/textures/backgrounds/final-zone.png',      unlocked: false }
    ];

    // ---- DOM Refs ----
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const html          = document.documentElement;
    const navBtns       = $$('.nav-btn');
    const sections      = $$('.section');
    const themeBtns     = $$('.theme-btn');
    const audioToggle   = $('#audio-toggle');
    const audioIcon     = $('#audio-icon');
    const audioLabel    = $('#audio-label');
    const volumeSlider  = $('#volume-slider');
    const volumeValue   = $('#volume-value');
    const bgMusic       = $('#bg-music');
    const launchBtn     = $('#btn-launch-game');
    const levelsGrid    = $('#levels-grid');
    const particlesC    = $('#particles-container');

    // ---- State ----
    let audioMuted = false;
    let currentSection = 'play';

    // ---- Init ----
    function init() {
        loadTheme();
        loadAudioPrefs();
        renderLevels();
        spawnParticles();
        bindNav();
        bindThemeSwitcher();
        bindAudio();
        bindLaunch();
    }

    // ---- Navigation ----
    function bindNav() {
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.section;
                switchSection(target);
            });
        });
    }

    function switchSection(name) {
        currentSection = name;
        navBtns.forEach(b => b.classList.toggle('active', b.dataset.section === name));
        sections.forEach(s => {
            const isTarget = s.id === `section-${name}`;
            s.classList.toggle('active', isTarget);
        });
    }

    // ---- Theme Switcher ----
    function loadTheme() {
        const saved = localStorage.getItem('sonic-breakout-theme') || 'classic';
        applyTheme(saved);
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        themeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
        localStorage.setItem('sonic-breakout-theme', theme);
    }

    function bindThemeSwitcher() {
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
        });
    }

    // ---- Audio ----
    function loadAudioPrefs() {
        const muted = localStorage.getItem('sonic-breakout-muted') === 'true';
        const vol = parseInt(localStorage.getItem('sonic-breakout-volume') || '50', 10);
        audioMuted = muted;
        bgMusic.volume = vol / 100;
        bgMusic.muted = muted;
        volumeSlider.value = vol;
        updateAudioUI();
    }

    function updateAudioUI() {
        audioIcon.textContent = audioMuted ? '🔇' : '🔊';
        audioLabel.textContent = audioMuted ? 'Sound OFF' : 'Sound ON';
        volumeValue.textContent = volumeSlider.value + '%';
    }

    function bindAudio() {
        audioToggle.addEventListener('click', () => {
            audioMuted = !audioMuted;
            bgMusic.muted = audioMuted;
            localStorage.setItem('sonic-breakout-muted', audioMuted);
            updateAudioUI();
            if (!audioMuted) tryPlayMusic();
        });

        volumeSlider.addEventListener('input', () => {
            const v = parseInt(volumeSlider.value, 10);
            bgMusic.volume = v / 100;
            localStorage.setItem('sonic-breakout-volume', v);
            updateAudioUI();
        });

        // Auto-play music on first user interaction
        document.addEventListener('click', tryPlayMusic, { once: false });
        document.addEventListener('keydown', tryPlayMusic, { once: false });
    }

    let musicStarted = false;
    function tryPlayMusic() {
        if (musicStarted || audioMuted) return;
        bgMusic.play().then(() => { musicStarted = true; }).catch(() => {});
    }

    // ---- Level Cards ----
    function renderLevels() {
        levelsGrid.innerHTML = '';
        LEVELS.forEach(level => {
            const card = document.createElement('div');
            card.className = 'level-card' + (level.unlocked ? '' : ' level-card--locked');
            card.innerHTML = `
                <img class="level-card__preview" src="${level.bg}" alt="${level.zone}" />
                <div class="level-card__info">
                    <div class="level-card__zone">${level.zone}</div>
                    <div class="level-card__name">${level.name}</div>
                </div>
                ${level.unlocked
                    ? '<span class="level-card__status level-card__status--unlocked">OPEN</span>'
                    : '<span class="level-card__lock">🔒</span><span class="level-card__status level-card__status--locked">LOCKED</span>'}
            `;
            if (level.unlocked) {
                card.addEventListener('click', () => launchLevel(level.id));
            }
            levelsGrid.appendChild(card);
        });
    }

    function launchLevel(id) {
        // Call the local launcher server
        fetch(`/launch?level=${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Launch failed');
                showLaunchOverlay(id);
            })
            .catch(err => {
                console.error(err);
                alert('Launcher not running! Please run "python launcher.py" first.');
            });
    }

    function showLaunchOverlay(id) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:black;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;animation:fadeSlideIn 0.3s ease';
        overlay.innerHTML = `
            <img src="res/textures/sprites/sonic.png" alt="Loading" style="width:64px;image-rendering:pixelated;animation:sonic-bounce 0.6s ease-in-out infinite">
            <p style="font-family:inherit;font-size:12px;color:#ffd700;letter-spacing:3px">LAUNCHING ZONE ${id + 1}...</p>
            <p style="font-family:inherit;font-size:8px;color:#aaa;margin-top:8px">Game is starting! Enjoy!</p>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 4000);
    }

    // ---- Launch Game ----
    function bindLaunch() {
        launchBtn.addEventListener('click', () => launchLevel(0));
    }

    // ---- Floating Particles ----
    function spawnParticles() {
        const count = 20;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const dur = Math.random() * 12 + 8;
            const delay = Math.random() * 10;
            p.style.cssText = `width:${size}px;height:${size}px;left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s;`;
            particlesC.appendChild(p);
        }
    }

    // ---- Start ----
    document.addEventListener('DOMContentLoaded', init);
})();
