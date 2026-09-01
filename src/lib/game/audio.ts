type Tone = {
  freq: number;
  dur: number;
  type: OscillatorType;
  gain: number;
  delay?: number;
  slide?: number;
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let unlocked = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function unlockAudio(): void {
  const audio = getCtx();
  if (!audio || !master) return;
  if (audio.state === "suspended") {
    void audio.resume();
  }
  unlocked = true;
}

export function resumeAudio(): void {
  if (!unlocked) return;
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

function beep(tones: Tone[], muted: boolean): void {
  if (muted || !unlocked) return;
  const audio = getCtx();
  if (!audio || !master) return;
  if (audio.state === "suspended") void audio.resume();

  const now = audio.currentTime;
  for (const tone of tones) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = tone.type;
    osc.frequency.setValueAtTime(tone.freq, now + (tone.delay ?? 0));
    if (tone.slide) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(40, tone.slide),
        now + (tone.delay ?? 0) + tone.dur,
      );
    }
    const start = now + (tone.delay ?? 0);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(tone.gain, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + tone.dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }
}

export function sfxTap(muted: boolean): void {
  beep([{ freq: 420, dur: 0.04, type: "square", gain: 0.08 }], muted);
}

export function sfxCorrect(muted: boolean, combo: number): void {
  const bump = Math.min(6, Math.floor(combo / 3)) * 40;
  beep(
    [
      { freq: 523 + bump, dur: 0.07, type: "sine", gain: 0.18 },
      { freq: 659 + bump, dur: 0.1, type: "sine", gain: 0.16, delay: 0.06 },
    ],
    muted,
  );
}

export function sfxWrong(muted: boolean): void {
  beep(
    [{ freq: 220, dur: 0.18, type: "triangle", gain: 0.16, slide: 90 }],
    muted,
  );
}

export function sfxTick(muted: boolean): void {
  beep([{ freq: 880, dur: 0.05, type: "square", gain: 0.07 }], muted);
}

export function sfxStart(muted: boolean): void {
  beep(
    [
      { freq: 392, dur: 0.08, type: "sine", gain: 0.14 },
      { freq: 523, dur: 0.12, type: "sine", gain: 0.14, delay: 0.08 },
    ],
    muted,
  );
}
