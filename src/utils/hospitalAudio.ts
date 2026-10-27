/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Synthesize pleasant two-tone hospital OPD chime using Web Audio API
export function playHospitalChime(): void {
  try {
    const AudioContextClass =
      window.AudioContext ||
      // @ts-expect-error webkit prefix fallback
      window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First note (High tone ~ 659 Hz E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Second note (Lower chime ~ 523 Hz C5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, now + 0.35);
    gain2.gain.setValueAtTime(0.18, now + 0.35);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.35);
    osc2.stop(now + 1.1);
  } catch (err) {
    console.debug('Web Audio chime unavailable or blocked by autoplay policy:', err);
  }
}
