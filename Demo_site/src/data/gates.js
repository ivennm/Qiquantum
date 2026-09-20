// gates.js — PLACEHOLDER fixtures for the configurable acceptance-gate engine.
// Replaced by: GET /api/gates/rules, GET /api/runs/{id}/gates
//
// Thresholds here are DATA, not code: the rule table on the Gates screen is
// rendered from this array, and the future engine will read the same shape
// from the database. Changing a threshold must never require a code change.

export const gateRules = [
  { id: 'G-FID',  name: 'Waveform fidelity',        metric: 'fidelity',            operator: '>=', threshold: 0.99,  unit: '',    method: 'normalised cross-correlation, commanded vs measured', reasonCode: 'FIDELITY_LOW',     severity: 'fail', enabled: true },
  { id: 'G-PH',   name: 'pH drift',                 metric: 'ph_drift',            operator: '<=', threshold: 0.05,  unit: 'pH',  method: 'max |pH(t) − pH(t₀)| over exposure window',           reasonCode: 'PH_DRIFT',         severity: 'fail', enabled: true },
  { id: 'G-TEMP', name: 'Sample temperature drift', metric: 'temp_drift',          operator: '<=', threshold: 0.1,   unit: '°C',  method: 'max |T(t) − T(t₀)| over exposure window',             reasonCode: 'TEMP_DRIFT',       severity: 'fail', enabled: true },
  { id: 'G-VIAB', name: 'Baseline viability',       metric: 'viability_baseline',  operator: '>=', threshold: 90,    unit: '%',   method: 'trypan-blue exclusion, pre-exposure',                 reasonCode: 'VIABILITY_LOW',    severity: 'fail', enabled: true },
  { id: 'G-REP',  name: 'Independent replicates',   metric: 'replicates',          operator: '>=', threshold: 5,     unit: 'n',   method: 'count of distinct biological replicate IDs with complete data', reasonCode: 'REPLICATES_SHORT', severity: 'warn', enabled: true },
  { id: 'G-ALGN', name: 'Stream alignment',         metric: 'max_offset',          operator: '<=', threshold: 20,    unit: 'ms',  method: 'max cross-stream offset after alignment',              reasonCode: 'ALIGN_OFFSET',     severity: 'warn', enabled: true },
  { id: 'G-AMB',  name: 'No open ambiguities',      metric: 'open_ambiguities',    operator: '==', threshold: 0,     unit: 'n',   method: 'count of unresolved validation ambiguities on bound files', reasonCode: 'AMBIGUITY_OPEN', severity: 'fail', enabled: true },
];

/** Gate evaluation for recent runs of the active experiment. */
export const gateResults = [
  { run: 'RUN-0142-014', candidate: 'WFC-7A31', arm: 'TX-K4', evaluated: '2026-09-17 13:52', fidelity: 0.994, phDrift: 0.031, tempDrift: 0.06, viability: 93.1, replicates: 4, offset: 12, ambiguities: 2, overall: 'fail',
    reasons: ['AMBIGUITY_OPEN', 'REPLICATES_SHORT'] },
  { run: 'RUN-0142-013', candidate: 'WFC-7A31', arm: 'TX-Q9', evaluated: '2026-09-17 10:05', fidelity: 0.992, phDrift: 0.028, tempDrift: 0.05, viability: 92.4, replicates: 4, offset: 9,  ambiguities: 0, overall: 'warn',
    reasons: ['REPLICATES_SHORT'] },
  { run: 'RUN-0142-012', candidate: 'WFC-7A31', arm: 'TX-M2', evaluated: '2026-09-16 15:10', fidelity: null,  phDrift: 0.022, tempDrift: 0.04, viability: 94.0, replicates: 4, offset: null, ambiguities: 0, overall: 'fail',
    reasons: ['FIDELITY_LOW', 'ALIGN_OFFSET'] },
  { run: 'RUN-0142-011', candidate: 'WFC-7A31', arm: 'TX-W7', evaluated: '2026-09-16 11:42', fidelity: 0.996, phDrift: 0.019, tempDrift: 0.03, viability: 95.2, replicates: 4, offset: 7,  ambiguities: 0, overall: 'warn',
    reasons: ['REPLICATES_SHORT'] },
  { run: 'RUN-0142-010', candidate: 'WFC-7A31', arm: 'TX-K4', evaluated: '2026-09-15 16:31', fidelity: 0.991, phDrift: 0.047, tempDrift: 0.08, viability: 91.0, replicates: 4, offset: 14, ambiguities: 0, overall: 'warn',
    reasons: ['REPLICATES_SHORT'] },
  { run: 'RUN-0142-009', candidate: 'WFC-7A31', arm: 'TX-Q9', evaluated: '2026-09-15 14:02', fidelity: 0.987, phDrift: 0.033, tempDrift: 0.05, viability: 92.8, replicates: 4, offset: 11, ambiguities: 0, overall: 'fail',
    reasons: ['FIDELITY_LOW', 'REPLICATES_SHORT'] },
];

/** Per-rule breakdown for the selected run (RUN-0142-014). */
export const selectedRunGateDetail = [
  { rule: 'G-FID',  value: '0.994', threshold: '≥ 0.99',  state: 'pass', reason: '—' },
  { rule: 'G-PH',   value: '0.031', threshold: '≤ 0.05',  state: 'pass', reason: '—' },
  { rule: 'G-TEMP', value: '0.06',  threshold: '≤ 0.1',   state: 'pass', reason: '—' },
  { rule: 'G-VIAB', value: '93.1',  threshold: '≥ 90',    state: 'pass', reason: '—' },
  { rule: 'G-REP',  value: '4',     threshold: '≥ 5',     state: 'warn', reason: 'REPLICATES_SHORT' },
  { rule: 'G-ALGN', value: '12',    threshold: '≤ 20',    state: 'pass', reason: '—' },
  { rule: 'G-AMB',  value: '2',     threshold: '= 0',     state: 'fail', reason: 'AMBIGUITY_OPEN' },
];

/** Reason code dictionary. */
export const reasonCodes = [
  { code: 'FIDELITY_LOW',     text: 'Measured signal does not reproduce the commanded waveform to the configured fidelity.' },
  { code: 'PH_DRIFT',         text: 'Medium pH moved beyond the allowed drift during exposure.' },
  { code: 'TEMP_DRIFT',       text: 'Sample temperature moved beyond the allowed drift during exposure.' },
  { code: 'VIABILITY_LOW',    text: 'Pre-exposure viability below threshold; sample not eligible.' },
  { code: 'REPLICATES_SHORT', text: 'Fewer independent biological replicates than required for the experiment.' },
  { code: 'ALIGN_OFFSET',     text: 'Streams could not be aligned within the configured offset.' },
  { code: 'AMBIGUITY_OPEN',   text: 'One or more bound files have unresolved validation ambiguities.' },
];
