// analysis.js — PLACEHOLDER fixtures for analysis & visualization.
// Replaced by: GET /api/experiments/{id}/summary, GET /api/plates/{id}/map

/** Exposed-vs-sham summary per endpoint. Descriptive only. */
export const exposedVsSham = [
  { endpoint: 'ATP (RLU)',           condition: 'Normoxia', nExposed: 48, nSham: 48, meanExposed: 41_820, meanSham: 39_140, sdExposed: 3_210, sdSham: 2_980, effect: 0.86, ciLow: 0.44, ciHigh: 1.28 },
  { endpoint: 'ATP (RLU)',           condition: 'Hypoxia',  nExposed: 48, nSham: 48, meanExposed: 28_310, meanSham: 27_950, sdExposed: 2_870, sdSham: 3_020, effect: 0.12, ciLow: -0.28, ciHigh: 0.52 },
  { endpoint: 'OCR (pmol/min)',      condition: 'Normoxia', nExposed: 36, nSham: 36, meanExposed: 182.4,  meanSham: 176.9,  sdExposed: 14.1,  sdSham: 13.6,  effect: 0.40, ciLow: -0.07, ciHigh: 0.86 },
  { endpoint: 'OCR (pmol/min)',      condition: 'Hypoxia',  nExposed: 36, nSham: 36, meanExposed: 96.2,   meanSham: 97.8,   sdExposed: 11.0,  sdSham: 10.4,  effect: -0.15, ciLow: -0.61, ciHigh: 0.31 },
  { endpoint: 'MMP (ratio)',         condition: 'Normoxia', nExposed: 36, nSham: 36, meanExposed: 2.41,   meanSham: 2.33,   sdExposed: 0.19,  sdSham: 0.21,  effect: 0.40, ciLow: -0.07, ciHigh: 0.86 },
  { endpoint: 'Viability (%)',       condition: 'Both',     nExposed: 48, nSham: 48, meanExposed: 92.8,   meanSham: 93.1,   sdExposed: 1.6,   sdSham: 1.4,   effect: -0.20, ciLow: -0.60, ciHigh: 0.20 },
];

/** Explicit exclusions with reasons. */
export const exclusions = [
  { sample: 'S-0142-P02-C07', plate: 'P02', well: 'C07', endpoint: 'ATP', reason: 'Edge-well evaporation flagged by plate QC', by: 'rule: EDGE_EVAP', when: '2026-09-16 17:12' },
  { sample: 'S-0142-P02-H12', plate: 'P02', well: 'H12', endpoint: 'ATP', reason: 'Edge-well evaporation flagged by plate QC', by: 'rule: EDGE_EVAP', when: '2026-09-16 17:12' },
  { sample: 'S-0142-P03-E04', plate: 'P03', well: 'E04', endpoint: 'ROS', reason: 'Pipetting error noted in bench log', by: 'M. Okafor', when: '2026-09-12 14:20' },
  { sample: 'RUN-0142-012 (all)', plate: 'P01', well: '—', endpoint: 'all', reason: 'Gate FIDELITY_LOW — measured trace missing', by: 'gate engine', when: '2026-09-16 15:10' },
];

/**
 * 96-well plate map for P01. Value is a 0–5 signal bin; `arm` is the blind
 * label; `excluded` marks wells removed from analysis.
 */
export function plateP01() {
  const rows = 'ABCDEFGH'.split('');
  const armCycle = ['TX-K4', 'TX-M2', 'TX-Q9', 'TX-W7'];
  const wells = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 1; c <= 12; c++) {
      const arm = armCycle[(r + c) % 4];
      const sham = arm === 'TX-M2' || arm === 'TX-W7';
      // A simple deterministic pattern: exposed wells brighter under normoxia.
      const base = sham ? 2 : arm === 'TX-K4' ? 4 : 3;
      const jitter = ((r * 7 + c * 3) % 3) - 1;
      const value = Math.max(0, Math.min(5, base + jitter));
      wells.push({
        id: `${rows[r]}${String(c).padStart(2, '0')}`,
        row: r,
        col: c - 1,
        arm,
        sham,
        value,
        excluded: (r === 2 && c === 7) || (r === 7 && c === 12),
      });
    }
  }
  return wells;
}

/** Replicate × batch table. */
export const replicateBatchView = [
  { replicate: 'BR-01', batch: 'BATCH-2026-09-A', plate: 'P01', atp: 41_100, ocr: 180.2, mmp: 2.39, viability: 93.0, state: 'pass' },
  { replicate: 'BR-02', batch: 'BATCH-2026-09-A', plate: 'P02', atp: 42_480, ocr: 184.9, mmp: 2.44, viability: 92.1, state: 'pass' },
  { replicate: 'BR-03', batch: 'BATCH-2026-09-A', plate: 'P03', atp: 41_930, ocr: 181.6, mmp: 2.40, viability: 93.5, state: 'pass' },
  { replicate: 'BR-04', batch: 'BATCH-2026-09-A', plate: 'P04', atp: null,   ocr: null,  mmp: null, viability: 92.6, state: 'neutral' },
  { replicate: 'BR-05', batch: '—',               plate: '—',   atp: null,   ocr: null,  mmp: null, viability: null, state: 'fail' },
];

export const analysisSettings = {
  effectSize: "Hedges' g (small-sample corrected)",
  ci: '95% (bootstrap, 2 000 resamples, seed 0x5A3F19C2)',
  outlierRule: 'none applied — exclusions are explicit only',
  normalisation: 'per-plate median of sham wells',
  software: 'qiq-analysis 0.1.0 (placeholder)',
};
