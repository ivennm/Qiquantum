// Instruments & Ingestion — requirement 3.
// Per-stream upload zones, ingest queue, emulator control, documented API.
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import KeyValue from '../components/KeyValue.jsx';
import Checksum from '../components/Checksum.jsx';
import DropZone from '../components/DropZone.jsx';
import Icon from '../components/Icon.jsx';
import { Toolbar, ToolbarSpacer, SearchBox } from '../components/Toolbar.jsx';
import { uploadTargets, ingestQueue, emulator, apiEndpoints } from '../data/ingestion.js';

const INGEST_STATE = { bound: 'pass', ambiguous: 'warn', queued: 'neutral', rejected: 'fail' };
const STREAM_STATE = { loaded: 'neutral', streaming: 'pass', stopped: 'neutral' };

export default function Ingestion() {
  return (
    <>
      <PageHeader
        kicker="Requirement 3 · Acquisition"
        title="Instruments & Ingestion"
        description="Accept waveform command files, measured traces, current/voltage traces, temperature and pH logs and assay exports by CSV/JSON upload or through the documented API. The software emulator drives the whole workflow without laboratory hardware."
        actions={<button type="button" className="btn" title="Not wired in the baseline"><Icon name="refresh" /> Refresh queue</button>}
      />

      <div className="stack-lg">
        <div className="grid-main-side">
          <Panel title="Upload by stream">
            <div className="dropzone-grid">
              {uploadTargets.map((t) => (
                <DropZone
                  key={t.id}
                  title={t.title}
                  formats={t.formats}
                  hint={t.hint}
                  state={t.state === 'warn' ? <StatusPill state="warn">1 pending</StatusPill> : null}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Instrument emulator" actions={<StatusPill state={emulator.running ? 'pass' : 'neutral'}>{emulator.running ? 'Running' : 'Stopped'}</StatusPill>}>
            <div className="stack">
              <div className="form-grid">
                <div className="field">
                  <label className="field-label" htmlFor="em-profile">Profile</label>
                  <select id="em-profile" className="select" defaultValue={emulator.profile} title="Not wired in the baseline">
                    <option>{emulator.profile}</option>
                    <option>oscilloscope-only</option>
                    <option>env-sensors-only</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="em-cand">Candidate</label>
                  <select id="em-cand" className="select" defaultValue={emulator.candidate} title="Not wired in the baseline">
                    <option>WFC-7A31</option><option>WFC-7A30</option><option>WFC-SHAM</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="em-run">Run</label>
                  <input id="em-run" className="input is-mono" defaultValue={emulator.run} readOnly />
                </div>
              </div>
              <div className="table-wrap" style={{ border: 'var(--border-width) solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <DataTable
                  columns={[
                    { key: 'label', label: 'Stream' },
                    { key: 'rate', label: 'Rate', kind: 'num' },
                    { key: 'state', label: 'State', render: (r) => <StatusPill state={STREAM_STATE[r.state]}>{r.state}</StatusPill> },
                  ]}
                  rows={emulator.streams}
                />
              </div>
              <div className="row">
                <button type="button" className="btn is-primary is-sm" disabled title="Already running"><Icon name="play" size={12} /> Start</button>
                <button type="button" className="btn is-sm" title="Not wired in the baseline"><Icon name="pause" size={12} /> Pause</button>
                <button type="button" className="btn is-sm" title="Not wired in the baseline"><Icon name="stop" size={12} /> Stop</button>
                <span className="small muted mono" style={{ marginLeft: 'auto' }}>elapsed {emulator.elapsed}</span>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Ingest queue" flush>
          <Toolbar>
            <SearchBox placeholder="Filter by file, run, stream…" />
            <select className="select" style={{ width: 150 }} defaultValue="all" aria-label="State"><option value="all">All states</option><option>Bound</option><option>Ambiguous</option><option>Queued</option><option>Rejected</option></select>
            <ToolbarSpacer />
            <span className="small muted">{ingestQueue.length} records · 1 ambiguous · 1 unbound</span>
          </Toolbar>
          <DataTable
            columns={[
              { key: 'id', label: 'Ingest', kind: 'mono' },
              { key: 'file', label: 'File', kind: 'mono' },
              { key: 'stream', label: 'Stream' },
              { key: 'run', label: 'Bound to', kind: 'mono' },
              { key: 'size', label: 'Size', kind: 'num' },
              { key: 'sha256', label: 'SHA-256', render: (r) => (r.sha256 === '—' ? '—' : <Checksum value={r.sha256} />) },
              { key: 'received', label: 'Received', kind: 'mono' },
              { key: 'state', label: 'State', render: (r) => <StatusPill state={INGEST_STATE[r.state]}>{r.state}</StatusPill> },
              { key: 'actions', label: '', render: (r) => (
                <div className="row-actions">
                  {r.state === 'ambiguous' || r.state === 'queued'
                    ? <button type="button" className="btn is-sm" title="Not wired in the baseline">Resolve</button>
                    : <button type="button" className="btn is-sm is-ghost" title="Not wired in the baseline"><Icon name="eye" size={12} /></button>}
                </div>
              ) },
            ]}
            rows={ingestQueue}
            rowClass={(r) => (r.state === 'rejected' ? 'is-muted' : '')}
          />
        </Panel>

        <div className="grid-2">
          <Panel title="API reference (mock)" foot="Base URL localhost:8000. Authentication: bearer token. Full OpenAPI document will be served at /api/docs.">
            {apiEndpoints.map((e) => (
              <div className="api-row" key={e.method + e.path}>
                <span className="api-method">{e.method}</span>
                <div>
                  <div className="api-path">{e.path}</div>
                  <div className="api-desc">{e.desc}</div>
                </div>
              </div>
            ))}
          </Panel>

          <Panel title="Ingest contract">
            <KeyValue items={[
              ['Accepted formats', 'CSV, JSON, TDMS, HDF5, XLSX (assay only)'],
              ['Checksum', 'SHA-256 computed on receipt, stored with the record'],
              ['Binding', 'Experiment · run · sample · condition — required before gate evaluation'],
              ['Ambiguity', 'Any undeclared unit, rate or target raises an item; file is held, never guessed'],
              ['Size limit', <span className="mono">2 GB per file, chunked at 8 MB</span>],
              ['Retention', 'Raw file retained immutably; derived streams versioned'],
            ]} />
          </Panel>
        </div>
      </div>
    </>
  );
}
