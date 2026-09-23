// Overview — landing screen: active experiment summary, gate roll-up,
// replicate counter, recent ingests, emulator state.
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import KeyValue from '../components/KeyValue.jsx';
import Meter from '../components/Meter.jsx';
import Notice from '../components/Notice.jsx';
import Icon from '../components/Icon.jsx';
import { Stat, StatRow } from '../components/Stat.jsx';
import { activeExperiment } from '../data/experiments.js';
import { gateResults } from '../data/gates.js';
import { ingestQueue, emulator } from '../data/ingestion.js';
import { ambiguities } from '../data/validation.js';

const INGEST_STATE = { bound: 'pass', ambiguous: 'warn', queued: 'neutral', rejected: 'fail' };

export default function Overview() {
  const openAmb = ambiguities.filter((a) => a.state === 'open').length;
  const latest = gateResults[0];
  const passCount = gateResults.filter((r) => r.overall === 'pass').length;
  const warnCount = gateResults.filter((r) => r.overall === 'warn').length;
  const failCount = gateResults.filter((r) => r.overall === 'fail').length;

  return (
    <>
      <PageHeader
        kicker="Active experiment"
        title={activeExperiment.id}
        description={activeExperiment.title}
        actions={
          <>
            <Link className="btn" to="/evidence"><Icon name="package" /> Evidence package</Link>
            <Link className="btn is-primary" to="/ingestion"><Icon name="upload" /> Ingest data</Link>
          </>
        }
      />

      {openAmb > 0 ? (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Notice kind="warn" title={`${openAmb} unresolved ambiguities are blocking gate evaluation for ${latest.run}`}>
            The platform never silently accepts ambiguous data. Resolve them under{' '}
            <Link to="/validation">Alignment &amp; Validation</Link> to allow binding and re-evaluation.
          </Notice>
        </div>
      ) : null}

      <div className="stack-lg">
        <Panel flush>
          <StatRow>
            <Stat label="Latest run gate" value={latest.overall.toUpperCase()} state={latest.overall} sub={`${latest.run} · ${latest.reasons.join(', ')}`} />
            <Stat label="Runs pass / warn / fail" value={`${passCount} / ${warnCount} / ${failCount}`} sub={`${gateResults.length} runs evaluated`} />
            <Stat label="Biological replicates" value={`${activeExperiment.replicatesPresent} / ${activeExperiment.replicatesRequired}`} state="warn" sub="below required n — gate G-REP at WARN" />
            <Stat label="Open ambiguities" value={openAmb} state={openAmb ? 'fail' : 'pass'} sub="binding blocked while > 0" />
            <Stat label="Waveform fidelity" value={latest.fidelity.toFixed(3)} state="pass" sub="latest run · threshold ≥ 0.99" />
          </StatRow>
        </Panel>

        <div className="grid-main-side">
          <div className="stack-lg">
            <Panel title="Recent gate evaluations" flush actions={<Link className="btn is-sm" to="/gates">All runs</Link>}>
              <DataTable
                rowKey="run"
                columns={[
                  { key: 'run', label: 'Run', kind: 'mono' },
                  { key: 'arm', label: 'Arm', kind: 'mono' },
                  { key: 'fidelity', label: 'Fidelity', kind: 'num', render: (r) => (r.fidelity == null ? '—' : r.fidelity.toFixed(3)) },
                  { key: 'phDrift', label: 'pH Δ', kind: 'num', render: (r) => r.phDrift.toFixed(3) },
                  { key: 'tempDrift', label: 'T Δ °C', kind: 'num', render: (r) => r.tempDrift.toFixed(2) },
                  { key: 'overall', label: 'Gate', render: (r) => <StatusPill state={r.overall} /> },
                  { key: 'reasons', label: 'Reason codes', kind: 'mono', render: (r) => r.reasons.join(', ') || '—' },
                  { key: 'evaluated', label: 'Evaluated', kind: 'mono' },
                ]}
                rows={gateResults.slice(0, 5)}
              />
            </Panel>

            <Panel title="Recent ingests" flush actions={<Link className="btn is-sm" to="/ingestion">Queue</Link>}>
              <DataTable
                columns={[
                  { key: 'id', label: 'Ingest', kind: 'mono' },
                  { key: 'file', label: 'File', kind: 'mono' },
                  { key: 'stream', label: 'Stream' },
                  { key: 'run', label: 'Bound to', kind: 'mono' },
                  { key: 'size', label: 'Size', kind: 'num' },
                  { key: 'state', label: 'State', render: (r) => <StatusPill state={INGEST_STATE[r.state]}>{r.state}</StatusPill> },
                  { key: 'received', label: 'Received', kind: 'mono' },
                ]}
                rows={ingestQueue.slice(0, 6)}
              />
            </Panel>
          </div>

          <div className="stack-lg">
            <Panel title="Experiment">
              <KeyValue items={[
                ['Protocol', <span className="mono">{activeExperiment.protocol} {activeExperiment.protocolVersion}</span>],
                ['Cell line', `${activeExperiment.cellLine} (${activeExperiment.cellLineSource})`],
                ['Passage', activeExperiment.passage],
                ['Batch', <span className="mono">{activeExperiment.batch}</span>],
                ['Conditions', activeExperiment.conditions.join(' · ')],
                ['Plates', activeExperiment.plates.join(', ')],
                ['Blinding', activeExperiment.blinded ? 'Blinded treatment labels' : 'Open'],
                ['Seed', <span className="mono">{activeExperiment.randomizationSeed}</span>],
                ['Owner', activeExperiment.owner],
              ]} />
            </Panel>

            <Panel title="Replicate structure">
              <div className="stack">
                <div className="row-between small">
                  <span>Independent biological replicates</span>
                  <span className="num">{activeExperiment.replicatesPresent} of {activeExperiment.replicatesRequired}</span>
                </div>
                <Meter value={activeExperiment.replicatesPresent} max={activeExperiment.replicatesRequired} state="warn" label="Replicates" />
                <div className="small muted">BR-05 not yet seeded. Gate G-REP will stay at WARN until five complete replicates exist.</div>
              </div>
            </Panel>

            <Panel title="Instrument emulator" actions={<StatusPill state="pass">Running</StatusPill>}>
              <KeyValue compact items={[
                ['Profile', <span className="mono">{emulator.profile}</span>],
                ['Candidate', <span className="mono">{emulator.candidate}</span>],
                ['Run', <span className="mono">{emulator.run}</span>],
                ['Elapsed', <span className="mono">{emulator.elapsed}</span>],
                ['Sample rate', <span className="mono">{emulator.sampleRateHz.toLocaleString()} Hz</span>],
              ]} />
              <div className="row" style={{ marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn is-sm" title="Not wired in the baseline"><Icon name="pause" size={12} /> Pause</button>
                <button type="button" className="btn is-sm" title="Not wired in the baseline"><Icon name="stop" size={12} /> Stop</button>
                <Link to="/ingestion" className="btn is-sm is-ghost">Configure</Link>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
