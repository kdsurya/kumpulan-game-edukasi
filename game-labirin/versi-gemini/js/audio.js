/**
 * Web Audio API Engine
 * Menyediakan:
 * 1. Musik latar instrumen (BGM) synthwave/cyber chiptune murni berbasis Web Audio API
 * 2. Efek Suara (SFX): Berhasil (Success chime), Bom/Ledakan (Explosion), Kembang Api (Fireworks),
 *    Pintu Barikade Laser (Door lockdown), Luka/Damage, dan Fanfare
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.masterGain = null;

    this.isBgmPlaying = false;
    this.bgmMuted = false;
    this.sfxMuted = false;

    this.bgmTimer = null;
    this.bgmStep = 0;
    this.tempo = 120; // BPM
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // BGM Gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  ensureContext() {
    if (!this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- CONTROLS ---
  toggleBGM() {
    this.ensureContext();
    this.bgmMuted = !this.bgmMuted;
    if (this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(this.bgmMuted ? 0 : 0.28, this.ctx.currentTime);
    }
    return !this.bgmMuted;
  }

  toggleSFX() {
    this.ensureContext();
    this.sfxMuted = !this.sfxMuted;
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(this.sfxMuted ? 0 : 0.55, this.ctx.currentTime);
    }
    return !this.sfxMuted;
  }

  // --- BACKGROUND MUSIC (INSTRUMENTAL SYNTHWAVE / CHIPTUNE) ---
  startBGM() {
    this.ensureContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;
    this.scheduleBGMNextNote();
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  scheduleBGMNextNote() {
    if (!this.isBgmPlaying || !this.ctx) return;

    const secondsPerBeat = 60.0 / this.tempo;
    const stepDuration = secondsPerBeat / 4; // 16th notes
    const time = this.ctx.currentTime + 0.05;

    // Chord progression: Am (A-C-E) -> F (F-A-C) -> C (C-E-G) -> G (G-B-D)
    // 64 steps total loop (4 bars of 16 steps)
    const bar = Math.floor(this.bgmStep / 16) % 4;
    const stepInBar = this.bgmStep % 16;

    // Bass notes for Am, F, C, G
    const bassFrequencies = [110.0, 87.31, 130.81, 98.0]; // A2, F2, C3, G2
    // Lead Arpeggio scale frequencies
    const arpNotes = [
      [440.0, 523.25, 659.25, 880.0],  // Am
      [349.23, 440.0, 523.25, 698.46], // F
      [523.25, 659.25, 783.99, 1046.5],// C
      [392.0, 493.88, 587.33, 783.99]  // G
    ];

    if (!this.bgmMuted) {
      // 1. Synth Bass on 8th notes (steps 0, 2, 4, 6, 8, 10, 12, 14)
      if (stepInBar % 2 === 0) {
        this.playSynthBass(bassFrequencies[bar], time, stepDuration * 1.8);
      }

      // 2. Cyber Lead Arp on 16th notes
      const notes = arpNotes[bar];
      const noteIdx = (stepInBar * 2) % notes.length;
      if (stepInBar % 2 === 0 || stepInBar % 3 === 0) {
        this.playLeadNote(notes[noteIdx], time, stepDuration * 0.9);
      }

      // 3. Synth Drums: Kick on beats 0, 4, 8, 12. Snare on 4, 12. Hihat on odd steps.
      if (stepInBar === 0 || stepInBar === 8) {
        this.playKick(time);
      }
      if (stepInBar === 4 || stepInBar === 12) {
        this.playSnare(time);
      }
      if (stepInBar % 2 === 1) {
        this.playHiHat(time);
      }
    }

    this.bgmStep = (this.bgmStep + 1) % 64;
    const intervalMs = stepDuration * 1000;
    this.bgmTimer = setTimeout(() => this.scheduleBGMNextNote(), intervalMs);
  }

  playSynthBass(freq, time, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, time);
    filter.frequency.exponentialRampToValueAtTime(140, time + duration);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  playLeadNote(freq, time, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.09, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  playKick(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + 0.12);
  }

  playSnare(time) {
    if (!this.ctx) return;
    // White noise burst
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    noise.start(time);
  }

  playHiHat(time) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.03;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    noise.start(time);
  }

  // --- SOUND EFFECTS (SFX) ---

  /**
   * Efek Suara: Jawaban Benar (Triumphant Success Fanfare Chime)
   */
  playSuccess() {
    this.ensureContext();
    if (this.sfxMuted || !this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.08);

      gain.gain.setValueAtTime(0, startTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.3, startTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime + idx * 0.08);
      osc.stop(startTime + idx * 0.08 + 0.45);
    });
  }

  /**
   * Efek Suara: Gerbang Area Aman Menutup (Laser Barricade Lock)
   */
  playDoorLock() {
    this.ensureContext();
    if (this.sfxMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Efek Suara: Bom Meledak Saat Jawaban Salah
   */
  playExplosion() {
    this.ensureContext();
    if (this.sfxMuted || !this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Low frequency thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.5);

    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.5);

    // 2. Filtered noise blast
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.6);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(now);
  }

  /**
   * Efek Suara: Kembang Api Meletup (Fireworks Pop & Whistle)
   */
  playFirework() {
    this.ensureContext();
    if (this.sfxMuted || !this.ctx) return;

    const now = this.ctx.currentTime;

    // Mini pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 400 + Math.random() * 400;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Efek Suara: Monster Menabrak / Damage
   */
  playHit() {
    this.ensureContext();
    if (this.sfxMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Efek Suara: Langkah Pemain (Halus)
   */
  playStep() {
    this.ensureContext();
    if (this.sfxMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280 + Math.random() * 60, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

// Global Sound Instance
const soundSystem = new SoundSystem();
window.soundSystem = soundSystem;
