// validation.js — PLACEHOLDER fixtures for time alignment & data validation.
// Replaced by: GET /api/runs/{id}/alignment, GET /api/validation/ambiguities

/** Stream lanes for the alignment timeline. Times in seconds from run start. */
export const alignmentLanes = [
  { id: 'cmd',  label: 'Command',          kind: 'commanded', segments: [[0.0, 1.2]], offsetMs: 0,    rate: '250 kHz', source: 'run014_cmd.json' },
  { id: 'meas', label: 'Measured trace',   kind: 'primary',   segments: [[0.012, 1.214]], offsetMs: 12, rate: '250 kHz', source: 'run014_scope_ch1.csv' },
  { id: 'iv',   label: 'Current/voltage',  kind: 'secondary', segments: [[0.008, 1.208]], offsetMs: 8,  rate: '10 kHz',  source: 'run014_iv.csv' },
  { id: 'temp', label: 'Temperature',      kind: 'secondary', segments: [[-30, 210]], offsetMs: 0,  rate: '1 Hz',    source: 'bath_temp_2026-09-17.csv' },
  { id: 'ph',   label: 'pH',               kind: 'secondary', segments: [[-30, 90], [120, 210]], gaps: [[90, 120]], offsetMs: 0, rate: '1/30 s', source: 'ph_probe_export.csv' },
];

/** Detected units and sampling rates, with confidence and any conflict. */
export const detectedUnits = [
  { stream: 'Command',         column: 'amplitude', unit: 'V',   rate: '250 000 Hz', confidence: 'declared', state: 'pass' },
  { stream: 'Measured trace',  column: 'ch1',       unit: 'V',   rate: '250 000 Hz', confidence: 'header',   state: 'pass' },
  { stream: 'Current/voltage', column: 'i_drive',   unit: 'mA',  rate: '10 000 Hz',  confidence: 'header',   state: 'pass' },
  { stream: 'Temperature',     column: 'temp',      unit: '°C',  rate: '1 Hz',       confidence: 'inferred', state: 'pass' },
  { stream: 'pH',              column: 'value',     unit: '?',   rate: '0.033 Hz',   confidence: 'unknown',  state: 'fail' },
  { stream: 'pH',              column: 'ts',        unit: 'epoch s / ms ?', rate: '—', confidence: 'ambiguous', state: 'warn' },
];

/** Unresolved ambiguities. Any open item blocks binding for that run. */
export const ambiguities = [
  {
    id: 'AMB-0417', ingest: 'ING-8817', file: 'ph_probe_export.csv', run: 'RUN-0142-014',
    kind: 'Unit not declared',
    detail: 'Column "value" has no unit header. Range 7.21–7.38 is consistent with pH but also with a normalised voltage.',
    options: ['pH (dimensionless)', 'Volts (probe raw)'],
    state: 'open', raised: '2026-09-17 13:51:40',
  },
  {
    id: 'AMB-0416', ingest: 'ING-8817', file: 'ph_probe_export.csv', run: 'RUN-0142-014',
    kind: 'Timestamp resolution',
    detail: 'Column "ts" values are 13 digits — could be epoch milliseconds or a vendor counter. Alignment cannot proceed.',
    options: ['Epoch ms (UTC)', 'Vendor tick counter'],
    state: 'open', raised: '2026-09-17 13:51:40',
  },
  {
    id: 'AMB-0409', ingest: 'ING-8816', file: 'P04_luciferase_raw.xlsx', run: '—',
    kind: 'Binding target missing',
    detail: 'No plate barcode found in the export. Sheet name "Plate 4" matches P04 but was not confirmed.',
    options: ['Bind to P04', 'Reject'],
    state: 'open', raised: '2026-09-17 11:20:03',
  },
  {
    id: 'AMB-0402', ingest: 'ING-8809', file: 'run012_scope_ch1.csv', run: 'RUN-0142-012',
    kind: 'Empty file',
    detail: 'Zero bytes received. Rejected; a re-upload was requested.',
    options: [],
    state: 'resolved', raised: '2026-09-16 15:02:19', resolution: 'Rejected · R. Lindqvist',
  },
];

/** Per-file validation findings for the currently selected run. */
export const validationFindings = [
  { file: 'run014_scope_ch1.csv',     check: 'Row count vs header',  result: '300 000 / 300 000', state: 'pass' },
  { file: 'run014_scope_ch1.csv',     check: 'Monotonic timestamps', result: 'ok',                state: 'pass' },
  { file: 'run014_scope_ch1.csv',     check: 'NaN / blank cells',    result: '0',                 state: 'pass' },
  { file: 'run014_iv.csv',            check: 'Monotonic timestamps', result: 'ok',                state: 'pass' },
  { file: 'bath_temp_2026-09-17.csv', check: 'Sampling regularity',  result: '1.000 s ± 0.002',   state: 'pass' },
  { file: 'ph_probe_export.csv',      check: 'Sampling regularity',  result: 'gap 90–120 s',      state: 'warn' },
  { file: 'ph_probe_export.csv',      check: 'Unit declaration',     result: 'missing',           state: 'fail' },
];
