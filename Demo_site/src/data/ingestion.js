// ingestion.js — PLACEHOLDER fixtures for the instrument & ingestion layer.
// Replaced by: GET /api/ingest/queue, GET /api/emulator/status, POST /api/ingest/*

export const emulator = {
  running: true,
  profile: 'oscilloscope+env-v1',
  candidate: 'WFC-7A31',
  run: 'RUN-0142-014',
  sampleRateHz: 250_000,
  elapsed: '00:04:12',
  lastIngest: '2026-09-17 13:52:08',
  streams: [
    { id: 'cmd',  label: 'Command file',      rate: '—',      state: 'loaded' },
    { id: 'meas', label: 'Measured trace',    rate: '250 kHz', state: 'streaming' },
    { id: 'iv',   label: 'Current / voltage', rate: '10 kHz',  state: 'streaming' },
    { id: 'temp', label: 'Temperature',       rate: '1 Hz',    state: 'streaming' },
    { id: 'ph',   label: 'pH',                rate: '1/30 s',  state: 'streaming' },
  ],
};

/** Upload targets, one per stream type the platform accepts. */
export const uploadTargets = [
  { id: 'cmd',   title: 'Waveform command file', formats: '.json .csv', hint: 'Generator command as issued', state: 'ok' },
  { id: 'meas',  title: 'Measured waveform / field trace', formats: '.csv .tdms .h5', hint: 'Oscilloscope or field sensor', state: 'ok' },
  { id: 'iv',    title: 'Current / voltage trace', formats: '.csv .json', hint: 'Drive electronics telemetry', state: 'ok' },
  { id: 'temp',  title: 'Temperature log', formats: '.csv', hint: 'Sample-well or bath probe', state: 'ok' },
  { id: 'ph',    title: 'pH log', formats: '.csv', hint: 'Medium pH at interval', state: 'warn' },
  { id: 'assay', title: 'Assay export', formats: '.csv .xlsx', hint: 'Plate reader / Seahorse', state: 'ok' },
];

/** Ingest queue. Includes one file blocked on a unit ambiguity. */
export const ingestQueue = [
  { id: 'ING-8821', file: 'run014_scope_ch1.csv',      stream: 'Measured trace',    run: 'RUN-0142-014', size: '38.2 MB', received: '13:52:08', state: 'bound',     sha256: 'a91f3e7c2d5b8a4f6e0c1b9d3a7f5e2c8b4d6a0f1e3c5b7d9a2f4e6c8b0d1a3f' },
  { id: 'ING-8820', file: 'run014_cmd.json',           stream: 'Command file',      run: 'RUN-0142-014', size: '12 KB',   received: '13:51:55', state: 'bound',     sha256: 'e2c8b4d6a0f1e3c5b7d9a2f4e6c8b0d1a3f5a91f3e7c2d5b8a4f6e0c1b9d3a7f' },
  { id: 'ING-8819', file: 'run014_iv.csv',             stream: 'Current / voltage', run: 'RUN-0142-014', size: '4.1 MB',  received: '13:51:52', state: 'bound',     sha256: '7d9a2f4e6c8b0d1a3f5a91f3e7c2d5b8a4f6e0c1b9d3a7fe2c8b4d6a0f1e3c5b' },
  { id: 'ING-8818', file: 'bath_temp_2026-09-17.csv',  stream: 'Temperature',       run: 'RUN-0142-014', size: '86 KB',   received: '13:51:40', state: 'bound',     sha256: '1b9d3a7fe2c8b4d6a0f1e3c5b7d9a2f4e6c8b0d1a3f5a91f3e7c2d5b8a4f6e0c' },
  { id: 'ING-8817', file: 'ph_probe_export.csv',       stream: 'pH',                run: 'RUN-0142-014', size: '22 KB',   received: '13:51:38', state: 'ambiguous', sha256: '3c5b7d9a2f4e6c8b0d1a3f5a91f3e7c2d5b8a4f6e0c1b9d3a7fe2c8b4d6a0f1e' },
  { id: 'ING-8816', file: 'P04_luciferase_raw.xlsx',   stream: 'Assay export',      run: '— (unbound)',  size: '210 KB',  received: '11:20:03', state: 'queued',    sha256: '4f6e0c1b9d3a7fe2c8b4d6a0f1e3c5b7d9a2f4e6c8b0d1a3f5a91f3e7c2d5b8a' },
  { id: 'ING-8815', file: 'run013_scope_ch1.csv',      stream: 'Measured trace',    run: 'RUN-0142-013', size: '38.1 MB', received: '10:04:11', state: 'bound',     sha256: 'd5b8a4f6e0c1b9d3a7fe2c8b4d6a0f1e3c5b7d9a2f4e6c8b0d1a3f5a91f3e7c2' },
  { id: 'ING-8814', file: 'run013_cmd.json',           stream: 'Command file',      run: 'RUN-0142-013', size: '12 KB',   received: '10:03:58', state: 'bound',     sha256: 'f3e7c2d5b8a4f6e0c1b9d3a7fe2c8b4d6a0f1e3c5b7d9a2f4e6c8b0d1a3f5a91' },
  { id: 'ING-8809', file: 'run012_scope_ch1.csv',      stream: 'Measured trace',    run: 'RUN-0142-012', size: '0 B',     received: '2026-09-16', state: 'rejected', sha256: '—' },
];

/** Documented API surface (mock). Rendered as reference on the ingestion page. */
export const apiEndpoints = [
  { method: 'POST', path: '/api/ingest/command',   desc: 'Waveform-generator command file (JSON/CSV). Returns ingest id and checksum.' },
  { method: 'POST', path: '/api/ingest/trace',     desc: 'Measured waveform or field trace. Multipart; large files chunked.' },
  { method: 'POST', path: '/api/ingest/telemetry', desc: 'Current/voltage, temperature, pH or other agreed telemetry log.' },
  { method: 'POST', path: '/api/ingest/assay',     desc: 'Assay export mapped through a registered import template.' },
  { method: 'GET',  path: '/api/ingest/{id}',      desc: 'Ingest record: state, checksum, binding, validation findings.' },
  { method: 'POST', path: '/api/ingest/{id}/bind', desc: 'Bind an ingest to experiment / run / sample / condition. Rejects ambiguous input.' },
  { method: 'GET',  path: '/api/emulator/status',  desc: 'Emulator state, active profile, stream rates.' },
  { method: 'POST', path: '/api/emulator/start',   desc: 'Start emulated acquisition for a candidate and run.' },
  { method: 'POST', path: '/api/emulator/stop',    desc: 'Stop emulated acquisition; flush pending streams.' },
];
