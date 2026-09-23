// Time Alignment & Validation — requirement 4.
// Alignment timeline, detected units/rates, and the unresolved-ambiguity
// queue that blocks binding. The screen makes "never silently accept
// ambiguous data" visible.
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import Notice from '../components/Notice.jsx';
import Icon from '../components/Icon.jsx';
import RunTimeline from '../components/charts/RunTimeline.jsx';
import Legend from '../components/Legend.jsx';
import { alignmentLanes, detectedUnits, ambiguities, validationFindings } from '../data/validation.js';

const CONF_STATE = { declared: 'pass', header: 'pass', inferred: 'warn', ambiguous: 'warn', unknown: 'fail' };

export default function Validation() {
  const open = ambiguities.filter((a) => a.state === 'open');
  // Exposure lanes are ~1.2 s; environment lanes span minutes. Show the
  // exposure window in detail and the environment window separately.
  const exposureLanes = alignmentLanes.filter((l) => ['cmd', 'meas', 'iv'].includes(l.id));
  const envLanes = alignmentLanes.filter((l) => ['temp', 'ph'].includes(l.id));

  return (
    <>
      <PageHeader
        kicker="Requirement 4 · Acquisition"
        title="Time Alignment & Validation"
        description="Align streams from different sources, detect missing or malformed records, identify units and sampling rates, and bind every file to the correct experiment, sample, condition and run. Anything ambiguous is held for a human decision."
        actions={<button type="button" className="btn" title="Not wired in the baseline"><Icon name="refresh" /> Re-run validation</button>}
      />

      <div className="stack-lg">
        {open.length ? (
          <Notice kind="fail" title={`Binding blocked for RUN-0142-014 — ${open.length} ambiguities require a decision`}>
            The validator does not guess. Each item below lists the interpretations it considered; choosing one records
            who decided, when, and why in the audit log.
          </Notice>
        ) : null}

        <Panel title="Unresolved ambiguities" flush actions={<StatusPill state="fail">{open.length} open</StatusPill>}>
          <DataTable
            columns={[
              { key: 'id', label: 'Item', kind: 'mono' },
              { key: 'file', label: 'File', kind: 'mono' },
              { key: 'run', label: 'Run', kind: 'mono' },
              { key: 'kind', label: 'Kind' },
              { key: 'detail', label: 'Detail', kind: 'wrap' },
              { key: 'options', label: 'Interpretations', render: (r) => (
                r.options.length
                  ? <div className="row">{r.options.map((o) => <button key={o} type="button" className="btn is-sm" title="Not wired in the baseline">{o}</button>)}</div>
                  : <span className="muted small">{r.resolution}</span>
              ) },
              { key: 'state', label: 'State', render: (r) => <StatusPill state={r.state === 'open' ? 'fail' : 'pass'}>{r.state}</StatusPill> },
              { key: 'raised', label: 'Raised', kind: 'mono' },
            ]}
            rows={ambiguities}
            rowClass={(r) => (r.state === 'resolved' ? 'is-muted' : '')}
          />
        </Panel>

        <div className="grid-2">
          <Panel title="Exposure window · RUN-0142-014" foot="Offsets are measured relative to the command stream by cross-correlation of the leading edge. Gate G-ALGN allows ≤ 20 ms.">
            <RunTimeline lanes={exposureLanes} domain={[0, 1.25]} cursor={0.012} />
            <Legend items={[
              { label: 'command', color: '--color-trace-commanded' },
              { label: 'measured', color: '--color-accent' },
              { label: 'telemetry', color: '--color-trace-secondary' },
            ]} />
          </Panel>
          <Panel title="Environment window · −30 s to +210 s" foot="pH probe has a 30 s gap at 90–120 s. Flagged as WARN; the gate treats a gap inside the exposure window as FAIL.">
            <RunTimeline lanes={envLanes} domain={[-30, 210]} cursor={0} />
            <Legend items={[
              { label: 'telemetry', color: '--color-trace-secondary' },
              { label: 'gap', color: '--color-fail-bg', box: true },
            ]} />
          </Panel>
        </div>

        <div className="grid-2">
          <Panel title="Detected units & sampling rates" flush>
            <DataTable
              rowKey="k"
              columns={[
                { key: 'stream', label: 'Stream' },
                { key: 'column', label: 'Column', kind: 'mono' },
                { key: 'unit', label: 'Unit', kind: 'mono' },
                { key: 'rate', label: 'Rate', kind: 'num' },
                { key: 'confidence', label: 'Source', render: (r) => <StatusPill state={CONF_STATE[r.confidence]} outline>{r.confidence}</StatusPill> },
              ]}
              rows={detectedUnits.map((u, i) => ({ ...u, k: i }))}
            />
          </Panel>

          <Panel title="File validation findings" flush>
            <DataTable
              rowKey="k"
              columns={[
                { key: 'file', label: 'File', kind: 'mono' },
                { key: 'check', label: 'Check' },
                { key: 'result', label: 'Result', kind: 'mono' },
                { key: 'state', label: '', render: (r) => <StatusPill state={r.state} /> },
              ]}
              rows={validationFindings.map((f, i) => ({ ...f, k: i }))}
            />
          </Panel>
        </div>
      </div>
    </>
  );
}
