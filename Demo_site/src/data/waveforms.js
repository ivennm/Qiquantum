// waveforms.js — PLACEHOLDER fixtures for the waveform-candidate registry.
// Replaced by: GET /api/waveform-candidates
//
// NOTE ON CUSTODY: the platform stores only opaque identifiers, non-sensitive
// metadata and a checksum. The proprietary waveform definition file never
// enters this database; the checksum lets a delivered signal be traced back
// to the exact definition held by the sponsor.

export const waveformCandidates = [
  {
    id: 'WFC-7A31', version: 'v2', family: 'OQE-7A', created: '2026-08-19T10:14:52-04:00', createdBy: 'sponsor-vault',
    sourceFile: 'wfc_7a31_v2.oqe', sizeBytes: 148_204,
    sha256: '8f3c1a9e2b7d4f60c5a1e8b92d3f7a4c6e1b0d9f8a7c6e5d4b3a2f1e0d9c8b7a',
    sampleRateHz: 250_000, durationMs: 1200, meta: { carrier: 'proprietary', envelope: 'proprietary', channels: 1 },
    runs: 14, status: 'active',
  },
  {
    id: 'WFC-7A30', version: 'v3', family: 'OQE-7A', created: '2026-08-05T09:02:10-04:00', createdBy: 'sponsor-vault',
    sourceFile: 'wfc_7a30_v3.oqe', sizeBytes: 147_990,
    sha256: '2d9b7e4f1a6c3e8b5d0f9a2c7e4b1d6f3a8c5e2b9d7f4a1c6e3b0d8f5a2c9e7b',
    sampleRateHz: 250_000, durationMs: 1200, meta: { carrier: 'proprietary', envelope: 'proprietary', channels: 1 },
    runs: 31, status: 'active',
  },
  {
    id: 'WFC-7A29', version: 'v1', family: 'OQE-7A', created: '2026-07-22T15:40:03-04:00', createdBy: 'sponsor-vault',
    sourceFile: 'wfc_7a29_v1.oqe', sizeBytes: 146_112,
    sha256: 'c4e7a1d3f9b2e6c8a5d0f3b7e1c9a4d6f2b8e5c1a7d3f0b6e9c2a8d5f1b4e7c3',
    sampleRateHz: 250_000, durationMs: 1200, meta: { carrier: 'proprietary', envelope: 'proprietary', channels: 1 },
    runs: 6, status: 'retired',
  },
  {
    id: 'WFC-SHAM', version: 'v1', family: 'control', created: '2026-07-22T15:41:30-04:00', createdBy: 'M. Okafor',
    sourceFile: 'sham_zero_v1.csv', sizeBytes: 9_812,
    sha256: '0000f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e',
    sampleRateHz: 250_000, durationMs: 1200, meta: { carrier: 'none', envelope: 'zero', channels: 1 },
    runs: 40, status: 'active',
  },
];

export const candidateVersionHistory = [
  { id: 'WFC-7A31', version: 'v2', date: '2026-08-19', note: 'Envelope re-timed by sponsor; checksum updated.', sha256: '8f3c1a9e…c8b7a' },
  { id: 'WFC-7A31', version: 'v1', date: '2026-08-11', note: 'Initial registration.', sha256: '5b2e9d1c…7f3a1' },
];
