// experiments.js — PLACEHOLDER fixtures for the experiment & protocol registry.
// Replaced by: GET /api/experiments, GET /api/experiments/{id}

export const activeExperiment = {
  id: 'EXP-2026-0142',
  title: 'OQE candidate WFC-7A31 — hypoxic stress panel, SH-SY5Y',
  status: 'active',
  protocol: 'PRT-0031',
  protocolVersion: 'v3.2',
  owner: 'M. Okafor',
  created: '2026-08-21T14:02:11-04:00',
  updated: '2026-09-16T09:41:07-04:00',
  cellLine: 'SH-SY5Y',
  cellLineSource: 'ATCC CRL-2266',
  passage: 'P14–P16',
  batch: 'BATCH-2026-09-A',
  randomizationSeed: '0x5A3F19C2',
  blinded: true,
  replicatesRequired: 5,
  replicatesPresent: 4,
  conditions: ['Normoxia 21% O₂', 'Hypoxia 1% O₂'],
  plates: ['P01', 'P02', 'P03', 'P04'],
};

export const experiments = [
  { id: 'EXP-2026-0142', title: 'OQE candidate WFC-7A31 — hypoxic stress panel', protocol: 'PRT-0031 v3.2', cellLine: 'SH-SY5Y', arms: 4, replicates: '4 / 5', status: 'active',    updated: '2026-09-16 09:41' },
  { id: 'EXP-2026-0141', title: 'Sham-only environment stability check',        protocol: 'PRT-0030 v1.0', cellLine: 'HEK293',  arms: 1, replicates: '5 / 5', status: 'complete',  updated: '2026-09-11 17:20' },
  { id: 'EXP-2026-0139', title: 'WFC-7A30 dose-response, normoxic',              protocol: 'PRT-0031 v3.1', cellLine: 'SH-SY5Y', arms: 5, replicates: '5 / 5', status: 'complete',  updated: '2026-09-04 12:05' },
  { id: 'EXP-2026-0137', title: 'Seahorse OCR baseline, both lines',             protocol: 'PRT-0029 v2.0', cellLine: 'HEK293 / SH-SY5Y', arms: 2, replicates: '6 / 5', status: 'complete', updated: '2026-08-28 15:33' },
  { id: 'EXP-2026-0135', title: 'WFC-7A29 pilot (withdrawn — fidelity fail)',    protocol: 'PRT-0031 v3.0', cellLine: 'SH-SY5Y', arms: 3, replicates: '2 / 5', status: 'withdrawn', updated: '2026-08-19 10:12' },
  { id: 'EXP-2026-0133', title: 'Plate-reader luciferase calibration',           protocol: 'PRT-0028 v1.2', cellLine: 'HEK293',  arms: 1, replicates: '3 / 3', status: 'complete',  updated: '2026-08-14 16:48' },
];

/** Treatment arms for the active experiment. Blind labels are what the bench sees. */
export const treatmentArms = [
  { id: 'ARM-A', blind: 'TX-K4', label: 'Exposed · Normoxia', candidate: 'WFC-7A31', condition: 'Normoxia 21% O₂', wells: 24, type: 'exposed' },
  { id: 'ARM-B', blind: 'TX-Q9', label: 'Exposed · Hypoxia',  candidate: 'WFC-7A31', condition: 'Hypoxia 1% O₂',   wells: 24, type: 'exposed' },
  { id: 'ARM-C', blind: 'TX-M2', label: 'Sham · Normoxia',    candidate: '— (sham)', condition: 'Normoxia 21% O₂', wells: 24, type: 'sham' },
  { id: 'ARM-D', blind: 'TX-W7', label: 'Sham · Hypoxia',     candidate: '— (sham)', condition: 'Hypoxia 1% O₂',   wells: 24, type: 'sham' },
];

/** Biological replicate register. Replicate 5 is missing — this drives the gate WARN. */
export const replicates = [
  { id: 'BR-01', plate: 'P01', batch: 'BATCH-2026-09-A', passage: 'P14', seeded: '2026-09-08', wells: 24, status: 'complete' },
  { id: 'BR-02', plate: 'P02', batch: 'BATCH-2026-09-A', passage: 'P14', seeded: '2026-09-08', wells: 24, status: 'complete' },
  { id: 'BR-03', plate: 'P03', batch: 'BATCH-2026-09-A', passage: 'P15', seeded: '2026-09-10', wells: 24, status: 'complete' },
  { id: 'BR-04', plate: 'P04', batch: 'BATCH-2026-09-A', passage: 'P15', seeded: '2026-09-10', wells: 24, status: 'assay pending' },
  { id: 'BR-05', plate: '—',   batch: '—',               passage: '—',   seeded: '—',          wells: 0,  status: 'not seeded' },
];

/** Well assignment sample — first rows of the plate map for P01. */
export const wellAssignments = [
  { well: 'A01', plate: 'P01', arm: 'TX-K4', replicate: 'BR-01', sample: 'S-0142-P01-A01', condition: 'Normoxia' },
  { well: 'A02', plate: 'P01', arm: 'TX-M2', replicate: 'BR-01', sample: 'S-0142-P01-A02', condition: 'Normoxia' },
  { well: 'A03', plate: 'P01', arm: 'TX-Q9', replicate: 'BR-01', sample: 'S-0142-P01-A03', condition: 'Hypoxia' },
  { well: 'A04', plate: 'P01', arm: 'TX-W7', replicate: 'BR-01', sample: 'S-0142-P01-A04', condition: 'Hypoxia' },
  { well: 'A05', plate: 'P01', arm: 'TX-K4', replicate: 'BR-01', sample: 'S-0142-P01-A05', condition: 'Normoxia' },
  { well: 'A06', plate: 'P01', arm: 'TX-Q9', replicate: 'BR-01', sample: 'S-0142-P01-A06', condition: 'Hypoxia' },
  { well: 'A07', plate: 'P01', arm: 'TX-M2', replicate: 'BR-01', sample: 'S-0142-P01-A07', condition: 'Normoxia' },
  { well: 'A08', plate: 'P01', arm: 'TX-W7', replicate: 'BR-01', sample: 'S-0142-P01-A08', condition: 'Hypoxia' },
];

/** Protocol version history. */
export const protocolVersions = [
  { version: 'v3.2', date: '2026-09-02', author: 'M. Okafor', change: 'Raised baseline viability threshold to 90%; added pH logging interval 30 s.', state: 'current' },
  { version: 'v3.1', date: '2026-08-25', author: 'M. Okafor', change: 'Added hypoxic arm; randomization seed recorded in registry.', state: 'superseded' },
  { version: 'v3.0', date: '2026-08-12', author: 'R. Lindqvist', change: 'Initial exposure protocol for WFC-7A3x family.', state: 'superseded' },
];
