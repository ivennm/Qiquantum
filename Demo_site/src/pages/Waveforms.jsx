// Waveform Candidates — requirement 2.
// Opaque IDs, versions, non-sensitive metadata, source file, checksum. The
// custody notice makes the "definition stays outside this database" rule
// explicit on the screen.
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import KeyValue from '../components/KeyValue.jsx';
import Checksum from '../components/Checksum.jsx';
import Notice from '../components/Notice.jsx';
import Icon from '../components/Icon.jsx';
import { Toolbar, ToolbarSpacer, SearchBox } from '../components/Toolbar.jsx';
import { waveformCandidates, candidateVersionHistory } from '../data/waveforms.js';

export default function Waveforms() {
  const selected = waveformCandidates[0];
  return (
    <>
      <PageHeader
        kicker="Requirement 2 · Registry"
        title="Waveform Candidates"
        description="Each candidate is stored under an opaque identifier with version, non-sensitive metadata, source-file name, creation date and a cryptographic checksum. The proprietary definition itself never enters this database."
        actions={<button type="button" className="btn is-primary" title="Not wired in the baseline"><Icon name="plus" /> Register candidate</button>}
      />

      <div className="stack-lg">
        <Notice kind="info" title="Custody boundary">
          Waveform definitions are held by the sponsor outside the student-facing database. This registry keeps only the
          identifier, version, metadata approved as non-sensitive, and the SHA-256 of the definition file. A delivered
          signal is traced back to its definition by checksum match, never by storing the definition here.
        </Notice>

        <Panel title="Candidate registry" flush>
          <Toolbar>
            <SearchBox placeholder="Filter by id, family…" />
            <select className="select" style={{ width: 130 }} defaultValue="all" aria-label="Status"><option value="all">All</option><option>Active</option><option>Retired</option></select>
            <ToolbarSpacer />
            <span className="small muted">{waveformCandidates.length} candidates</span>
          </Toolbar>
          <DataTable
            selectedKey={selected.id}
            columns={[
              { key: 'id', label: 'Candidate', kind: 'mono', sortable: true },
              { key: 'version', label: 'Ver', kind: 'mono' },
              { key: 'family', label: 'Family', kind: 'mono' },
              { key: 'sourceFile', label: 'Source file', kind: 'mono' },
              { key: 'sha256', label: 'SHA-256', render: (r) => <Checksum value={r.sha256} /> },
              { key: 'sampleRateHz', label: 'Rate', kind: 'num', render: (r) => `${(r.sampleRateHz / 1000).toFixed(0)} kHz` },
              { key: 'durationMs', label: 'Dur', kind: 'num', render: (r) => `${r.durationMs} ms` },
              { key: 'runs', label: 'Runs', kind: 'num' },
              { key: 'created', label: 'Created', kind: 'mono', sortable: true, render: (r) => r.created.slice(0, 10) },
              { key: 'status', label: 'Status', render: (r) => <StatusPill state={r.status === 'active' ? 'pass' : 'neutral'}>{r.status}</StatusPill> },
            ]}
            rows={waveformCandidates}
          />
        </Panel>

        <div className="grid-main-side">
          <Panel title={`${selected.id} ${selected.version} — record`}>
            <KeyValue items={[
              ['Identifier', <span className="mono">{selected.id}</span>],
              ['Version', <span className="mono">{selected.version}</span>],
              ['Family', <span className="mono">{selected.family}</span>],
              ['Registered by', <span className="mono">{selected.createdBy}</span>],
              ['Created', <span className="mono">{selected.created}</span>],
              ['Source file', <span className="mono">{selected.sourceFile} · {selected.sizeBytes.toLocaleString()} B</span>],
              ['SHA-256', <Checksum value={selected.sha256} full />],
              ['Sample rate', <span className="mono">{selected.sampleRateHz.toLocaleString()} Hz</span>],
              ['Duration', <span className="mono">{selected.durationMs} ms</span>],
              ['Channels', <span className="mono">{selected.meta.channels}</span>],
              ['Carrier', <span className="muted">{selected.meta.carrier} — withheld</span>],
              ['Envelope', <span className="muted">{selected.meta.envelope} — withheld</span>],
              ['Definition file', <span className="muted">not stored · sponsor vault</span>],
            ]} />
          </Panel>

          <div className="stack-lg">
            <Panel title="Version history" flush>
              <DataTable
                rowKey="version"
                columns={[
                  { key: 'version', label: 'Ver', kind: 'mono' },
                  { key: 'date', label: 'Date', kind: 'mono' },
                  { key: 'sha256', label: 'SHA-256', kind: 'mono' },
                  { key: 'note', label: 'Note', kind: 'wrap' },
                ]}
                rows={candidateVersionHistory}
              />
            </Panel>
            <Panel title="Verify a delivered file">
              <div className="stack">
                <div className="field">
                  <label className="field-label" htmlFor="verify-hash">Paste SHA-256 of a definition file</label>
                  <input id="verify-hash" className="input is-mono" placeholder="64 hex characters" readOnly title="Not wired in the baseline" />
                  <span className="field-hint">Matches against registered checksums only; the file itself is not uploaded.</span>
                </div>
                <div>
                  <button type="button" className="btn" title="Not wired in the baseline"><Icon name="check" /> Verify</button>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
