// users.js — PLACEHOLDER fixtures for security & system administration.
// Replaced by: GET /api/users, GET /api/roles, GET /api/system/*

export const currentUser = {
  name: 'Maya Okafor',
  email: 'm.okafor@uconn.edu',
  initials: 'MO',
  role: 'Investigator',
};

export const roles = ['Admin', 'Investigator', 'Analyst', 'Technician', 'Sponsor (read-only)'];

export const users = [
  { id: 'u-01', name: 'Maya Okafor',     email: 'm.okafor@uconn.edu',     role: 'Investigator',       auth: 'SSO', lastSeen: '2026-09-17 13:58', state: 'active' },
  { id: 'u-02', name: 'Rasmus Lindqvist', email: 'r.lindqvist@uconn.edu',  role: 'Admin',              auth: 'SSO', lastSeen: '2026-09-17 09:12', state: 'active' },
  { id: 'u-03', name: 'Priya Natarajan', email: 'p.natarajan@uconn.edu',  role: 'Analyst',            auth: 'SSO', lastSeen: '2026-09-16 19:40', state: 'active' },
  { id: 'u-04', name: 'Tom Achebe',      email: 't.achebe@uconn.edu',     role: 'Technician',         auth: 'SSO', lastSeen: '2026-09-17 11:20', state: 'active' },
  { id: 'u-05', name: 'Sponsor liaison', email: 'liaison@sponsor.example', role: 'Sponsor (read-only)', auth: 'Local', lastSeen: '2026-09-15 08:05', state: 'active' },
  { id: 'u-06', name: 'Emulator service', email: 'svc-emulator@local',    role: 'Technician',         auth: 'API key', lastSeen: '2026-09-17 13:52', state: 'service' },
];

/** Permission grid: rows are capabilities, columns are roles. */
export const permissions = [
  { cap: 'View experiments & results',   grants: [true, true, true, true, true] },
  { cap: 'Create / version experiments', grants: [true, true, false, false, false] },
  { cap: 'Register waveform candidates', grants: [true, false, false, false, false] },
  { cap: 'Upload / ingest files',        grants: [true, true, false, true, false] },
  { cap: 'Resolve ambiguities',          grants: [true, true, false, false, false] },
  { cap: 'Edit gate thresholds',         grants: [true, false, false, false, false] },
  { cap: 'Run analysis',                 grants: [true, true, true, false, false] },
  { cap: 'Seal evidence packages',       grants: [true, true, false, false, false] },
  { cap: 'Export packages',              grants: [true, true, true, false, true] },
  { cap: 'Manage users & roles',         grants: [true, false, false, false, false] },
  { cap: 'Trigger backup / restore',     grants: [true, false, false, false, false] },
];

export const errorLog = [
  { at: '2026-09-17 13:51:40', level: 'WARN',  source: 'validator',  message: 'Unit header missing on ph_probe_export.csv (ING-8817) — ambiguity raised, binding blocked' },
  { at: '2026-09-17 11:20:03', level: 'WARN',  source: 'ingest',     message: 'No plate barcode in P04_luciferase_raw.xlsx — left unbound' },
  { at: '2026-09-16 15:02:19', level: 'ERROR', source: 'ingest',     message: 'run012_scope_ch1.csv: 0 bytes received — rejected' },
  { at: '2026-09-16 15:02:19', level: 'INFO',  source: 'ingest',     message: 'Re-upload requested for RUN-0142-012 measured trace' },
  { at: '2026-09-15 22:00:00', level: 'INFO',  source: 'backup',     message: 'Nightly snapshot complete · 1.9 GB · sha256 verified' },
  { at: '2026-09-14 09:31:12', level: 'ERROR', source: 'api',        message: 'POST /api/ingest/trace 413 — chunk size exceeded (client retried)' },
];

export const backups = [
  { id: 'BK-2026-09-16', at: '2026-09-16 22:00', size: '1.9 GB', kind: 'nightly', verified: true },
  { id: 'BK-2026-09-15', at: '2026-09-15 22:00', size: '1.8 GB', kind: 'nightly', verified: true },
  { id: 'BK-2026-09-14', at: '2026-09-14 22:00', size: '1.8 GB', kind: 'nightly', verified: true },
  { id: 'BK-2026-09-11-manual', at: '2026-09-11 17:35', size: '1.6 GB', kind: 'manual (pre-seal)', verified: true },
];

export const testStatus = {
  lastRun: '2026-09-17 09:05',
  commit: '4faa181',
  suites: [
    { name: 'unit · ingest parsers',    passed: 0, failed: 0, skipped: 0, state: 'neutral', note: 'not yet written' },
    { name: 'unit · gate engine',       passed: 0, failed: 0, skipped: 0, state: 'neutral', note: 'not yet written' },
    { name: 'unit · alignment',         passed: 0, failed: 0, skipped: 0, state: 'neutral', note: 'not yet written' },
    { name: 'integration · API',        passed: 0, failed: 0, skipped: 0, state: 'neutral', note: 'not yet written' },
    { name: 'e2e · emulator round-trip', passed: 0, failed: 0, skipped: 0, state: 'neutral', note: 'not yet written' },
  ],
};
