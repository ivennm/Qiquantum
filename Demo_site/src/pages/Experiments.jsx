// Experiments & Protocols — requirement 1.
// Registry list on the left, detail of the selected experiment on the right.
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import KeyValue from '../components/KeyValue.jsx';
import Tabs from '../components/Tabs.jsx';
import Icon from '../components/Icon.jsx';
import { Toolbar, ToolbarSpacer, SearchBox } from '../components/Toolbar.jsx';
import {
  activeExperiment, experiments, treatmentArms, replicates, wellAssignments, protocolVersions,
} from '../data/experiments.js';

const EXP_STATE = { active: 'info', complete: 'pass', withdrawn: 'fail' };
const REP_STATE = { complete: 'pass', 'assay pending': 'neutral', 'not seeded': 'fail' };

export default function Experiments() {
  return (
    <>
      <PageHeader
        kicker="Requirement 1 · Registry"
        title="Experiments & Protocols"
        description="Create and version experiments, protocols, treatment arms, sham controls, oxygen conditions, plate and well assignments, cell-line metadata, batches and independent biological replicates. Randomised assignment and blinded labels are recorded here."
        actions={
          <>
            <button type="button" className="btn" title="Not wired in the baseline"><Icon name="edit" /> New version</button>
            <button type="button" className="btn is-primary" title="Not wired in the baseline"><Icon name="plus" /> New experiment</button>
          </>
        }
      />

      <div className="stack-lg">
        <Panel title="Experiment registry" flush>
          <Toolbar>
            <SearchBox placeholder="Filter by id, title, cell line…" />
            <select className="select" style={{ width: 140 }} defaultValue="all" aria-label="Status"><option value="all">All statuses</option><option>Active</option><option>Complete</option><option>Withdrawn</option></select>
            <ToolbarSpacer />
            <span className="small muted">{experiments.length} experiments</span>
          </Toolbar>
          <DataTable
            selectedKey={activeExperiment.id}
            columns={[
              { key: 'id', label: 'ID', kind: 'mono', sortable: true },
              { key: 'title', label: 'Title', kind: 'wrap' },
              { key: 'protocol', label: 'Protocol', kind: 'mono' },
              { key: 'cellLine', label: 'Cell line' },
              { key: 'arms', label: 'Arms', kind: 'num' },
              { key: 'replicates', label: 'Replicates', kind: 'num' },
              { key: 'status', label: 'Status', render: (r) => <StatusPill state={EXP_STATE[r.status]}>{r.status}</StatusPill> },
              { key: 'updated', label: 'Updated', kind: 'mono', sortable: true },
            ]}
            rows={experiments}
          />
        </Panel>

        <Panel title={`${activeExperiment.id} — detail`} flush actions={<StatusPill state="info">Active</StatusPill>}>
          <Tabs active="design" items={[
            { id: 'design', label: 'Design' },
            { id: 'wells', label: 'Well assignments', count: 384 },
            { id: 'versions', label: 'Protocol versions', count: protocolVersions.length },
            { id: 'audit', label: 'Audit' },
          ]} />
          <div className="panel-body">
            <div className="grid-side-main">
              <div className="stack-lg">
                <KeyValue items={[
                  ['Title', activeExperiment.title],
                  ['Protocol', <span className="mono">{activeExperiment.protocol} {activeExperiment.protocolVersion}</span>],
                  ['Cell line', `${activeExperiment.cellLine} · ${activeExperiment.cellLineSource}`],
                  ['Passage range', activeExperiment.passage],
                  ['Batch', <span className="mono">{activeExperiment.batch}</span>],
                  ['Randomisation seed', <span className="mono">{activeExperiment.randomizationSeed}</span>],
                  ['Blinding', 'Enabled — bench sees TX-xx labels only'],
                  ['Created', <span className="mono">{activeExperiment.created}</span>],
                  ['Updated', <span className="mono">{activeExperiment.updated}</span>],
                ]} />
              </div>

              <div className="stack-lg">
                <div>
                  <div className="label" style={{ marginBottom: 'var(--space-2)' }}>Treatment arms</div>
                  <div className="arm-list">
                    {treatmentArms.map((arm) => (
                      <div className="arm-card" key={arm.id}>
                        <div className="arm-card-head">
                          <span className="mono">{arm.id}</span>
                          <StatusPill state={arm.type === 'sham' ? 'neutral' : 'info'} outline>{arm.type}</StatusPill>
                        </div>
                        <div>{arm.label}</div>
                        <div className="small muted">{arm.candidate} · {arm.wells} wells</div>
                        <div className="arm-card-blind small">blind: {arm.blind}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="label" style={{ marginBottom: 'var(--space-2)' }}>Biological replicates</div>
                  <div className="table-wrap" style={{ border: 'var(--border-width) solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <DataTable
                      columns={[
                        { key: 'id', label: 'Replicate', kind: 'mono' },
                        { key: 'plate', label: 'Plate', kind: 'mono' },
                        { key: 'batch', label: 'Batch', kind: 'mono' },
                        { key: 'passage', label: 'Passage', kind: 'mono' },
                        { key: 'seeded', label: 'Seeded', kind: 'mono' },
                        { key: 'wells', label: 'Wells', kind: 'num' },
                        { key: 'status', label: 'Status', render: (r) => <StatusPill state={REP_STATE[r.status]}>{r.status}</StatusPill> },
                      ]}
                      rows={replicates}
                      rowClass={(r) => (r.status === 'not seeded' ? 'is-muted' : '')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid-2">
          <Panel title="Well assignments · P01 (first 8)" flush foot="Sample IDs are derived: S-{experiment}-{plate}-{well}. Full plate under the Well assignments tab.">
            <DataTable
              rowKey="well"
              columns={[
                { key: 'well', label: 'Well', kind: 'mono' },
                { key: 'arm', label: 'Blind arm', kind: 'mono' },
                { key: 'replicate', label: 'Replicate', kind: 'mono' },
                { key: 'condition', label: 'Condition' },
                { key: 'sample', label: 'Sample ID', kind: 'mono' },
              ]}
              rows={wellAssignments}
            />
          </Panel>

          <Panel title="Protocol version history" flush>
            <DataTable
              rowKey="version"
              columns={[
                { key: 'version', label: 'Version', kind: 'mono' },
                { key: 'date', label: 'Date', kind: 'mono' },
                { key: 'author', label: 'Author' },
                { key: 'change', label: 'Change', kind: 'wrap' },
                { key: 'state', label: '', render: (r) => <StatusPill state={r.state === 'current' ? 'pass' : 'neutral'} outline>{r.state}</StatusPill> },
              ]}
              rows={protocolVersions}
            />
          </Panel>
        </div>
      </div>
    </>
  );
}
