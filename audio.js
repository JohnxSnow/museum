/**
 * ====================================================
 * Virtual Art Gallery - Web Audio & Audio Guide Engine
 * Classical museum soundscape, harp chimes & voice guide
 * ====================================================
 */

class GalleryAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;

    // Harmonic chords for regal, peaceful palace atmosphere
    this.scales = [
      [146.83, 220.00, 261.63, 329.63, 440.00, 523.25], // D minor 9th (Regal, deep)
      [174.61, 220.00, 261.63, 349.23, 440.00, 523.25], // F major 7th (Serene, open)
      [196.00, 246.94, 293.66, 392.00, 493.88, 587.33], // G major 9th (Warm, uplifting)
      [130.81, 196.00, 246.94, 329.63, 392.00, 493.88], // C major 7th (Classical, pure)
      [164.81, 220.00, 261.63, 329.63, 415.30, 493.88]  // A minor 9th (Contemplative)
    ];
    this.currentChordIndex = 0;

    // Speech synthesis state
    this.speechSynthesis = window.speechSynthesis || null;
    this.isSpeaking = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
  }

  toggleMusic() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.startAmbientMusic();
      this.playChime(523.25, 0.25);
    } else {
      this.stopAmbientMusic();
    }
    return !this.isMuted;
  }

  startAmbientMusic() {
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.playNextChord();
  }

  stopAmbientMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 1.5);
    }
  }

  playNextChord() {
    if (!this.isPlayingMusic || !this.ctx) return;

    this.musicGain.gain.setTargetAtTime(0.3, this.ctx.currentTime, 1.2);

    const chord = this.scales[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.scales.length;

    // Rich warm pad drone
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550 + idx * 80, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const attack = 2.5 + idx * 0.4;
      const hold = 5.5;
      const release = 4.0;
      const duration = attack + hold + release;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.05 / (idx + 1), now + attack);
      gain.gain.setValueAtTime(0.05 / (idx + 1), now + attack + hold);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + duration + 0.5);
    });

    // Soft harp arpeggio note
    if (Math.random() > 0.2) {
      setTimeout(() => {
        const harpNotes = [chord[2], chord[3], chord[4], chord[5] || chord[1] * 2];
        harpNotes.forEach((n, i) => {
          setTimeout(() => this.playHarpNote(n, 0.08), i * 160);
        });
      }, 1800 + Math.random() * 1500);
    }

    this.musicTimer = setTimeout(() => {
      this.playNextChord();
    }, 7500);
  }

  playHarpNote(freq, volume = 0.08) {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 2.3);
    } catch (e) {}
  }

  playChime(freq = 659.25, volume = 0.12) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch (e) {}
  }

  playFootstep() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(65 + Math.random() * 20, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.09);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  }

  playInspectOpen() {
    this.playChime(587.33, 0.15);
    setTimeout(() => this.playChime(880.00, 0.12), 140);
  }

  playInspectClose() {
    this.playChime(440.00, 0.1);
  }

  playTeleport() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  // Camera mechanical shutter sound for Photo Mode
  playCameraShutter() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(now);

      // Follow-up mechanical curtain sound
      setTimeout(() => {
        try {
          if (!this.ctx) return;
          const t2 = this.ctx.currentTime;
          const noise2 = this.ctx.createBufferSource();
          noise2.buffer = buffer;
          const filter2 = this.ctx.createBiquadFilter();
          filter2.type = 'highpass';
          filter2.frequency.setValueAtTime(1400, t2);

          const gain2 = this.ctx.createGain();
          gain2.gain.setValueAtTime(0.28, t2);
          gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.08);

          noise2.connect(filter2);
          filter2.connect(gain2);
          gain2.connect(this.sfxGain);
          noise2.start(t2);
        } catch (e) {}
      }, 70);
    } catch (e) {}
  }

  // Voice narration / Audio guide for artworks
  speakText(text, lang = 'ku') {
    if (!this.speechSynthesis) return false;
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    // Detect available voices
    const voices = this.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang)) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (voice) utterance.voice = voice;

    this.isSpeaking = true;
    utterance.onend = () => { this.isSpeaking = false; };
    utterance.onerror = () => { this.isSpeaking = false; };

    this.speechSynthesis.speak(utterance);
    return true;
  }

  stopSpeaking() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}

window.galleryAudio = new GalleryAudio();
