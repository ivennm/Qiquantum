// Evidence Packages — requirement 8.
// Versioned package list, manifest preview, artifact checklist, audit log
// and export affordances (JSON/CSV machine-readable, PDF human-readable).
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import Checksum from '../components/Checksum.jsx';
import CodeBlock from '../components/CodeBlock.jsx';
import Notice from '../components/Notice.jsx';
import Icon from '../components/Icon.jsx';
import { packages, artifactChecklist, manifestPreview, auditLog } from '../data/evidence.js';

export default function Evidence() {
  const selected = packages[0];
  return (
    <>
      <PageHeader
        kicker="Requirement 8 · Output"
        title="Evidence Packages"
        description="A versioned package per experiment: protocol and candidate identifiers, source-file checksums, timestamps, sample lineage, gate results, analysis settings, figures and an audit log. Machine-readable JSON/CSV plus a concise human-readable report."
        actions={<button type="button" className="btn is-primary" title="Not wired in the baseline"><Icon name="package" /> Generate package</button>}
      />

      <div className="stack-lg">
        <Panel title="Packages" flush>
          <DataTable
            selectedKey={selected.id}
            columns={[
              { key: 'id', label: 'Package', kind: 'mono' },
              { key: 'experiment', label: 'Experiment', kind: 'mono' },
              { key: 'created', label: 'Created', kind: 'mono' },
              { key: 'by', label: 'By' },
              { key: 'gates', label: 'Gate roll-up', render: (r) => <StatusPill state={r.gates} /> },
              { key: 'files', label: 'Files', kind: 'num' },
              { key: 'size', label: 'Size', kind: 'num' },
              { key: 'sha256', label: 'Package SHA-256', render: (r) => <Checksum value={r.sha256} /> },
              { key: 'state', label: 'State', render: (r) => <StatusPill state={r.state === 'sealed' ? 'info' : 'neutral'} outline>{r.state}</StatusPill> },
              { key: 'a', label: '', render: (r) => (
                <div className="row-actions">
                  <button type="button" className="btn is-sm is-ghost" title="Download JSON — not wired">JSON</button>
                  <button type="button" className="btn is-sm is-ghost" title="Download CSV bundle — not wired">CSV</button>
                  <button type="button" className="btn is-sm is-ghost" disabled={r.state === 'draft'} title={r.state === 'draft' ? 'Report withheld until gates resolve' : 'Download PDF — not wired'}>PDF</button>
                </div>
              ) },
            ]}
            rows={packages}
          />
        </Panel>

        <div className="grid-main-side">
          <div className="stack-lg">
            <Panel title={`${selected.id} — manifest preview`} flush actions={<button type="button" className="btn is-sm" title="Not wired in the baseline"><Icon name="download" size={12} /> manifest.json</button>}>
              <CodeBlock title="manifest.json" meta="qiq-evidence/1.0 · 4.1 KB" maxHeight={420}>{manifestPreview}</CodeBlock>
            </Panel>
          </div>

          <div className="stack-lg">
            <Notice kind="warn" title="Draft — human-readable report withheld">
              The report is generated only once every run in the package has a gate result and no open ambiguities.
              Machine-readable outputs are available for drafts so reviewers can inspect the state.
            </Notice>
            <Panel title="Artifact checklist" flush>
              <div className="panel-body">
                <ul className="checklist">
                  {artifactChecklist.map((a) => (
                    <li key={a.item} className={a.done ? '' : 'is-pending'}>
                      <Icon name={a.done ? 'check' : 'clock'} />
                      <span>{a.item}</span>
                      <span className="checklist-meta">{a.meta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
          </div>
        </div>

        <Panel title="Audit log · EXP-2026-0142" flush foot="Append-only. Every state change, decision and export is recorded with actor and timestamp; the log ships inside the package.">
          <DataTable
            rowKey="k"
            columns={[
              { key: 'at', label: 'Time', kind: 'mono' },
              { key: 'who', label: 'Actor', kind: 'mono' },
              { key: 'action', label: 'Action', kind: 'mono' },
              { key: 'target', label: 'Target', kind: 'mono' },
              { key: 'detail', label: 'Detail', kind: 'wrap' },
            ]}
            rows={auditLog.map((e, i) => ({ ...e, k: i }))}
          />
        </Panel>
      </div>
    </>
  );
}
