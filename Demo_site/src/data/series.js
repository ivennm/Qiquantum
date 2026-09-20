// series.js — deterministic signal generator for chart placeholders.
//
// PLACEHOLDER. These helpers produce believable-looking waveform and drift
// traces without committing thousands of data points. They will be replaced
// by real sample arrays returned from:
//   GET /api/runs/{runId}/streams/{streamId}/samples
//
// All generators are seeded so every render (and every developer's machine)
// draws the same picture.

/** Mulberry32 — tiny seeded PRNG. Returns a function producing [0, 1). */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Commanded waveform: a clean composite of two sinusoids.
 * Returns [{ t, v }] with t in milliseconds.
 */
export function commandedWaveform({ n = 240, periodMs = 40, amplitude = 1.0 } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * periodMs * 3;
    const v =
      amplitude * Math.sin((2 * Math.PI * t) / periodMs) +
      0.25 * amplitude * Math.sin((2 * Math.PI * t * 3) / periodMs);
    out.push({ t, v });
  }
  return out;
}

/**
 * Measured waveform: the commanded signal with a small phase lag, gain
 * error, and seeded noise. `fidelity` is only descriptive; it is not
 * computed from the trace here.
 */
export function measuredWaveform(commanded, { seed = 7, noise = 0.05, lag = 0.6, gain = 0.97 } = {}) {
  const rnd = seededRandom(seed);
  const n = commanded.length;
  return commanded.map((p, i) => {
    const src = commanded[Math.max(0, i - Math.round(lag))] ?? p;
    return { t: p.t, v: src.v * gain + (rnd() - 0.5) * 2 * noise };
  });
}

/** Residual between two aligned series. */
export function residual(a, b) {
  return a.map((p, i) => ({ t: p.t, v: (b[i]?.v ?? 0) - p.v }));
}

/**
 * Slow drift trace (temperature, pH). Random walk around a baseline with an
 * optional late excursion so the chart shows a threshold being approached.
 */
export function driftSeries({
  n = 180,
  baseline = 37.0,
  step = 0.004,
  seed = 11,
  excursion = 0,
  excursionStart = 0.7,
} = {}) {
  const rnd = seededRandom(seed);
  const out = [];
  let v = baseline;
  for (let i = 0; i < n; i++) {
    v += (rnd() - 0.5) * 2 * step;
    // mean-revert gently
    v += (baseline - v) * 0.02;
    const frac = i / n;
    const bump = frac > excursionStart ? excursion * ((frac - excursionStart) / (1 - excursionStart)) : 0;
    out.push({ t: i, v: v + bump });
  }
  return out;
}

/** Short series for inline sparklines in tables. */
export function sparkSeries(seed, n = 24) {
  const rnd = seededRandom(seed);
  const out = [];
  let v = 0.5;
  for (let i = 0; i < n; i++) {
    v += (rnd() - 0.5) * 0.2;
    v = Math.max(0.05, Math.min(0.95, v));
    out.push({ t: i, v });
  }
  return out;
}
