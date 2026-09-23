// Biological Assays — requirement 6.
// Endpoint catalogue, import templates, mapping preview, canonical schema
// and an "add endpoint" affordance to show the schema extends.
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import Icon from '../components/Icon.jsx';
import { endpoints, templates, mappingPreview, canonicalSchema } from '../data/assays.js';

export default function Assays() {
  return (
    <>
      <PageHeader
        kicker="Requirement 6 · Quality"
        title="Biological Assays"
        description="Import templates and data mappings for ATP/luciferase, oxygen consumption (Seahorse), mitochondrial membrane potential, ROS and viability. Every endpoint maps into one canonical schema so new endpoints are added as configuration."
        actions={
          <>
            <button type="button" className="btn" title="Not wired in the baseline"><Icon name="upload" /> Import export file</button>
            <button type="button" className="btn is-primary" title="Not wired in the baseline"><Icon name="plus" /> Add endpoint</button>
          </>
        }
      />

      <div className="stack-lg">
        <Panel title="Endpoint catalogue" flush>
          <DataTable
            columns={[
              { key: 'id', label: 'Endpoint', kind: 'mono' },
              { key: 'name', label: 'Name' },
              { key: 'instrument', label: 'Instrument' },
              { key: 'unit', label: 'Unit', kind: 'mono' },
              { key: 'template', label: 'Template', kind: 'mono' },
              { key: 'records', label: 'Records', kind: 'num', render: (r) => r.records.toLocaleString() },
              { key: 'lastImport', label: 'Last import', kind: 'mono' },
              { key: 'state', label: 'QC', render: (r) => <StatusPill state={r.state} /> },
            ]}
            rows={endpoints}
          />
        </Panel>

        <div className="grid-2">
          <Panel title="Import templates" flush foot="A template is a versioned column mapping for one vendor export format. Changing a template does not alter records imported under the previous version.">
            <DataTable
              columns={[
                { key: 'id', label: 'Template', kind: 'mono' },
                { key: 'endpoint', label: 'Endpoint', kind: 'mono' },
                { key: 'vendor', label: 'Vendor format' },
                { key: 'format', label: 'File', kind: 'mono' },
                { key: 'columns', label: 'Cols', kind: 'num' },
                { key: 'updated', label: 'Updated', kind: 'mono' },
                { key: 'a', label: '', render: () => <div className="row-actions"><button type="button" className="btn is-sm is-ghost" title="Not wired in the baseline"><Icon name="edit" size={12} /></button></div> },
              ]}
              rows={templates}
            />
          </Panel>

          <Panel
            title={`Mapping preview · ${mappingPreview.template}`}
            actions={<span className="small muted mono">{mappingPreview.sourceFile}</span>}
            foot="Unmapped required fields block the import. Extra source columns are ignored and recorded in the audit log."
          >
            <div className="mapping-row label"><span>Source column</span><span /><span>Canonical field</span></div>
            {mappingPreview.rows.map((m) => (
              <div className="mapping-row" key={m.src}>
                <span className="mapping-src">{m.src}</span>
                <span className="mapping-arrow"><Icon name="arrow" size={12} /></span>
                <span className={`mapping-dst${m.state === 'neutral' ? ' muted' : ''}`}>{m.dst}</span>
              </div>
            ))}
            <div className="row" style={{ marginTop: 'var(--space-3)' }}>
              <StatusPill state="pass">6 of 6 required mapped</StatusPill>
              <button type="button" className="btn is-sm" style={{ marginLeft: 'auto' }} title="Not wired in the baseline">Run import</button>
            </div>
          </Panel>
        </div>

        <Panel title="Canonical endpoint schema" flush foot="Adding an endpoint registers a new endpoint_id and unit plus a template; the schema itself does not change.">
          <DataTable
            rowKey="field"
            columns={[
              { key: 'field', label: 'Field', kind: 'mono' },
              { key: 'type', label: 'Type', kind: 'mono' },
              { key: 'required', label: 'Required', render: (r) => (r.required ? <StatusPill state="info" outline>required</StatusPill> : <span className="muted small">optional</span>) },
              { key: 'note', label: 'Note', kind: 'wrap' },
            ]}
            rows={canonicalSchema}
          />
        </Panel>
      </div>
    </>
  );
}
