// assays.js — PLACEHOLDER fixtures for biological-assay integration.
// Replaced by: GET /api/assays/endpoints, GET /api/assays/templates

export const endpoints = [
  { id: 'EP-ATP',  name: 'ATP (luciferase)',                    instrument: 'Plate reader (luminescence)', unit: 'RLU',        template: 'TPL-ATP-v2',    records: 384, lastImport: '2026-09-16 17:10', state: 'pass' },
  { id: 'EP-OCR',  name: 'Oxygen consumption rate (Seahorse)',  instrument: 'Seahorse XFe96',              unit: 'pmol/min',   template: 'TPL-XFE96-v1',  records: 288, lastImport: '2026-09-15 11:48', state: 'pass' },
  { id: 'EP-MMP',  name: 'Mitochondrial membrane potential',    instrument: 'Plate reader (fluorescence)', unit: 'ratio 590/530', template: 'TPL-JC1-v1', records: 288, lastImport: '2026-09-15 09:30', state: 'pass' },
  { id: 'EP-ROS',  name: 'Reactive oxygen species',             instrument: 'Plate reader (fluorescence)', unit: 'RFU',        template: 'TPL-DCFDA-v1', records: 192, lastImport: '2026-09-12 14:05', state: 'warn' },
  { id: 'EP-VIAB', name: 'Viability',                           instrument: 'Cell counter',                unit: '%',          template: 'TPL-VIAB-v3',   records: 96,  lastImport: '2026-09-16 09:02', state: 'pass' },
];

/** Import templates: how a vendor export maps onto the canonical schema. */
export const templates = [
  { id: 'TPL-ATP-v2',   endpoint: 'EP-ATP',  vendor: 'BioTek Gen5',  format: '.xlsx', columns: 6, version: 'v2', updated: '2026-08-30' },
  { id: 'TPL-XFE96-v1', endpoint: 'EP-OCR',  vendor: 'Agilent Wave', format: '.xlsx', columns: 11, version: 'v1', updated: '2026-08-22' },
  { id: 'TPL-JC1-v1',   endpoint: 'EP-MMP',  vendor: 'BioTek Gen5',  format: '.csv',  columns: 7, version: 'v1', updated: '2026-08-22' },
  { id: 'TPL-DCFDA-v1', endpoint: 'EP-ROS',  vendor: 'BioTek Gen5',  format: '.csv',  columns: 5, version: 'v1', updated: '2026-08-22' },
  { id: 'TPL-VIAB-v3',  endpoint: 'EP-VIAB', vendor: 'Countess 3',   format: '.csv',  columns: 4, version: 'v3', updated: '2026-09-02' },
];

/** Column mapping preview for TPL-ATP-v2. */
export const mappingPreview = {
  template: 'TPL-ATP-v2',
  sourceFile: 'P03_luciferase_raw.xlsx',
  rows: [
    { src: 'Well',            dst: 'well_id',        state: 'pass' },
    { src: 'Plate Barcode',   dst: 'plate_id',       state: 'pass' },
    { src: 'Lum (RLU)',       dst: 'value',          state: 'pass' },
    { src: 'Read Time',       dst: 'measured_at',    state: 'pass' },
    { src: 'Gain',            dst: 'meta.gain',      state: 'pass' },
    { src: 'Integration (s)', dst: 'meta.integration_s', state: 'pass' },
    { src: 'Notes',           dst: '— (ignored)',    state: 'neutral' },
  ],
};

/** Canonical endpoint schema — what any new assay must map into. */
export const canonicalSchema = [
  { field: 'endpoint_id',  type: 'string',   required: true,  note: 'Registered endpoint (EP-…)' },
  { field: 'sample_id',    type: 'string',   required: true,  note: 'Resolved from plate_id + well_id' },
  { field: 'plate_id',     type: 'string',   required: true,  note: 'P01–P04' },
  { field: 'well_id',      type: 'string',   required: true,  note: 'A01–H12' },
  { field: 'value',        type: 'number',   required: true,  note: 'In endpoint unit' },
  { field: 'unit',         type: 'string',   required: true,  note: 'Declared by template' },
  { field: 'measured_at',  type: 'datetime', required: true,  note: 'ISO-8601 with offset' },
  { field: 'meta',         type: 'object',   required: false, note: 'Endpoint-specific extras (gain, integration…)' },
];
