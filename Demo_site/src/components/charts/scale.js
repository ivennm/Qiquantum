// scale.js — tiny linear-scale helpers shared by the SVG charts.
// Avoids pulling in d3 for three arithmetic functions.

/** Returns a function mapping [d0, d1] onto [r0, r1]. */
export function linear([d0, d1], [r0, r1]) {
  const span = d1 - d0 || 1;
  return (x) => r0 + ((x - d0) / span) * (r1 - r0);
}

/** Min and max of a numeric array, with optional padding fraction. */
export function extent(values, pad = 0) {
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of values) {
    if (v == null || Number.isNaN(v)) continue;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  if (lo === Infinity) return [0, 1];
  const p = (hi - lo || 1) * pad;
  return [lo - p, hi + p];
}

/** Evenly spaced tick values across a domain. */
export function ticks([lo, hi], n = 5) {
  const out = [];
  for (let i = 0; i <= n; i++) out.push(lo + ((hi - lo) * i) / n);
  return out;
}

/** SVG path "d" for a series of {x, y} already in pixel space. */
export function pathFrom(points) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}
