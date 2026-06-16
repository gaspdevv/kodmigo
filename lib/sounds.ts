/** İleride kullanıcı ayarı ile kapatılabilir */
const SOUNDS_ENABLED = true;

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!SOUNDS_ENABLED) return null;
  if (typeof window === "undefined") return null;

  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startOffset: number,
  duration: number,
  volume = 0.12,
  type: OscillatorType = "sine",
): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startOffset);

  gain.gain.setValueAtTime(volume, ctx.currentTime + startOffset);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + startOffset + duration,
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(ctx.currentTime + startOffset);
  oscillator.stop(ctx.currentTime + startOffset + duration);
}

export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    playTone(ctx, 523.25, 0, 0.1, 0.1);
    playTone(ctx, 659.25, 0.08, 0.12, 0.1);
    playTone(ctx, 783.99, 0.16, 0.14, 0.08);
  } catch {
    // Ses desteklenmiyorsa sessizce geç
  }
}

function playGentleTone(
  ctx: AudioContext,
  frequency: number,
  startOffset: number,
  duration: number,
  volume = 0.03,
): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startOffset);

  gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
  gain.gain.linearRampToValueAtTime(
    volume,
    ctx.currentTime + startOffset + 0.012,
  );
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + startOffset + duration,
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(ctx.currentTime + startOffset);
  oscillator.stop(ctx.currentTime + startOffset + duration);
}

export function playWrongSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    playGentleTone(ctx, 392, 0, 0.07, 0.052);
    playGentleTone(ctx, 330, 0.09, 0.08, 0.042);
  } catch {
    // Ses desteklenmiyorsa sessizce geç
  }
}

export function playClickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.038, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.045);
  } catch {
    // Ses desteklenmiyorsa sessizce geç
  }
}
