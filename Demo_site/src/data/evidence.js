// evidence.js — PLACEHOLDER fixtures for evidence-package generation.
// Replaced by: GET /api/experiments/{id}/packages, GET /api/packages/{id}/manifest

export const packages = [
  { id: 'PKG-0142-v3', experiment: 'EXP-2026-0142', version: 'v3', created: '2026-09-17 13:58', by: 'M. Okafor', gates: 'fail', files: 27, size: '312 MB', sha256: 'b7e1c9a4d6f2b8e5c1a7d3f0b6e9c2a8d5f1b4e7c3c4e7a1d3f9b2e6c8a5d0f3', state: 'draft' },
  { id: 'PKG-0142-v2', experiment: 'EXP-2026-0142', version: 'v2', created: '2026-09-16 18:04', by: 'M. Okafor', gates: 'warn', files: 24, size: '271 MB', sha256: 'a4d6f2b8e5c1a7d3f0b6e9c2a8d5f1b4e7c3c4e7a1d3f9b2e6c8a5d0f3b7e1c9', state: 'sealed' },
  { id: 'PKG-0142-v1', experiment: 'EXP-2026-0142', version: 'v1', created: '2026-09-11 16:20', by: 'R. Lindqvist', gates: 'warn', files: 18, size: '198 MB', sha256: 'e5c1a7d3f0b6e9c2a8d5f1b4e7c3c4e7a1d3f9b2e6c8a5d0f3b7e1c9a4d6f2b8', state: 'sealed' },
  { id: 'PKG-0141-v1', experiment: 'EXP-2026-0141', version: 'v1', created: '2026-09-11 17:30', by: 'R. Lindqvist', gates: 'pass', files: 12, size: '96 MB',  sha256: 'f0b6e9c2a8d5f1b4e7c3c4e7a1d3f9b2e6c8a5d0f3b7e1c9a4d6f2b8e5c1a7d3', state: 'sealed' },
  { id: 'PKG-0139-v2', experiment: 'EXP-2026-0139', version: 'v2', created: '2026-09-04 12:40', by: 'M. Okafor', gates: 'pass', files: 31, size: '402 MB', sha256: 'c2a8d5f1b4e7c3c4e7a1d3f9b2e6c8a5d0f3b7e1c9a4d6f2b8e5c1a7d3f0b6e9', state: 'sealed' },
];

/** Artifact checklist for the selected (draft) package. */
export const artifactChecklist = [
  { item: 'Protocol identifier + version',        meta: 'PRT-0031 v3.2',        done: true },
  { item: 'Waveform candidate identifiers',        meta: 'WFC-7A31 v2, WFC-SHAM v1', done: true },
  { item: 'Source-file checksums',                 meta: '27 × sha256',          done: true },
  { item: 'Timestamps (ingest, run, assay)',       meta: 'ISO-8601 / offsets',   done: true },
  { item: 'Sample lineage (plate → well → sample → replicate)', meta: '384 rows', done: true },
  { item: 'Acceptance-gate results with reason codes', meta: '6 runs',           done: true },
  { item: 'Analysis settings',                     meta: 'settings.json',        done: true },
  { item: 'Figures (overlay, drift, plate maps)',  meta: '9 × svg/png',          done: true },
  { item: 'Audit log',                             meta: 'audit.jsonl · 142 events', done: true },
  { item: 'Human-readable report',                 meta: 'report.pdf — pending gate resolution', done: false },
];

export const manifestPreview = `{
  "package_id": "PKG-0142-v3",
  "schema": "qiq-evidence/1.0",
  "experiment": {
    "id": "EXP-2026-0142",
    "protocol": { "id": "PRT-0031", "version": "v3.2" }
  },
  "candidates": [
    { "id": "WFC-7A31", "version": "v2",
      "sha256": "8f3c1a9e2b7d4f60c5a1e8b92d3f7a4c…" },
    { "id": "WFC-SHAM", "version": "v1",
      "sha256": "0000f1a2b3c4d5e6f708192a3b4c5d6e…" }
  ],
  "runs": 6,
  "gates": { "overall": "fail",
             "reasons": ["AMBIGUITY_OPEN", "REPLICATES_SHORT"] },
  "files": [
    { "path": "streams/run014_scope_ch1.csv",
      "sha256": "a91f3e7c2d5b8a4f6e0c1b9d3a7f5e2c…",
      "bytes": 40056832 },
    …
  ],
  "analysis": { "settings": "analysis/settings.json",
                "figures": 9 },
  "audit_log": "audit.jsonl",
  "generated_at": "2026-09-17T13:58:42-04:00",
  "generated_by": "m.okafor"
}`;

export const auditLog = [
  { at: '2026-09-17 13:58:42', who: 'm.okafor',   action: 'package.draft',   target: 'PKG-0142-v3', detail: 'Draft generated; report withheld (gate FAIL)' },
  { at: '2026-09-17 13:52:10', who: 'gate-engine', action: 'gate.evaluate',  target: 'RUN-0142-014', detail: 'FAIL · AMBIGUITY_OPEN, REPLICATES_SHORT' },
  { at: '2026-09-17 13:51:40', who: 'validator',   action: 'ambiguity.raise', target: 'ING-8817',   detail: 'AMB-0417, AMB-0416 (unit, timestamp)' },
  { at: '2026-09-17 13:51:38', who: 'emulator',    action: 'ingest.receive', target: 'ING-8817',    detail: 'ph_probe_export.csv · 22 KB' },
  { at: '2026-09-16 18:04:15', who: 'm.okafor',   action: 'package.seal',    target: 'PKG-0142-v2', detail: 'Sealed · sha256 a4d6f2b8…' },
  { at: '2026-09-16 17:12:03', who: 'plate-qc',    action: 'sample.exclude', target: 'S-0142-P02-C07', detail: 'EDGE_EVAP' },
  { at: '2026-09-16 15:10:51', who: 'gate-engine', action: 'gate.evaluate',  target: 'RUN-0142-012', detail: 'FAIL · FIDELITY_LOW, ALIGN_OFFSET' },
  { at: '2026-09-16 15:02:19', who: 'r.lindqvist', action: 'ingest.reject',  target: 'ING-8809',    detail: 'Empty file' },
];
