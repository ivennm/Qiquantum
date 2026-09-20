// Acceptance Gates — requirement 5.
// Rule table (thresholds are data in src/data/gates.js), per-run results,
// per-rule breakdown for the selected run, reason-code dictionary.
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import Notice from '../components/Notice.jsx';
import Icon from '../components/Icon.jsx';
import { Toolbar, ToolbarSpacer } from '../components/Toolbar.jsx';
import { gateRules, gateResults, selectedRunGateDetail, reasonCodes } from '../data/gates.js';

function RuleExpr({ rule }) {
  return (
    <span className="rule-expr">
      {rule.metric}
      <span className="rule-op">{rule.operator}</span>
      {rule.threshold}{rule.unit ? ` ${rule.unit}` : ''}
    </span>
  );
}

export default function Gates() {
  const selected = gateResults[0];
  return (
    <>
      <PageHeader
        kicker="Requirement 5 · Quality"
        title="Acceptance Gates"
        description="Sponsor-defined rules return pass, warning or fail with a reason code for every run. Thresholds and calculation methods are configuration, not code."
        actions={
          <>
            <button type="button" className="btn" title="Not wired in the baseline"><Icon name="download" /> Export rule set</button>
            <button type="button" className="btn is-primary" title="Not wired in the baseline"><Icon name="plus" /> Add rule</button>
          </>
        }
      />

      <div className="stack-lg">
        <Panel title="Rule set · v4 (effective 2026-09-02)" flush foot="Editing a threshold creates a new rule-set version; runs record which version evaluated them.">
          <Toolbar>
            <span className="small muted">{gateRules.length} rules · {gateRules.filter((r) => r.enabled).length} enabled</span>
            <ToolbarSpacer />
            <label className="checkbox"><input type="checkbox" defaultChecked readOnly /> Show disabled</label>
          </Toolbar>
          <DataTable
            columns={[
              { key: 'id', label: 'Rule', kind: 'mono' },
              { key: 'name', label: 'Name' },
              { key: 'expr', label: 'Condition', render: (r) => <RuleExpr rule={r} /> },
              { key: 'method', label: 'Calculation method', kind: 'wrap' },
              { key: 'reasonCode', label: 'Reason code', kind: 'mono' },
              { key: 'severity', label: 'On breach', render: (r) => <StatusPill state={r.severity} outline>{r.severity}</StatusPill> },
              { key: 'enabled', label: 'Enabled', render: (r) => <label className="checkbox"><input type="checkbox" checked={r.enabled} readOnly title="Not wired in the baseline" /></label> },
              { key: 'actions', label: '', render: () => <div className="row-actions"><button type="button" className="btn is-sm is-ghost" title="Not wired in the baseline"><Icon name="edit" size={12} /></button></div> },
            ]}
            rows={gateRules}
          />
        </Panel>

        <Panel title="Run evaluations · EXP-2026-0142" flush>
          <DataTable
            rowKey="run"
            selectedKey={selected.run}
            columns={[
              { key: 'run', label: 'Run', kind: 'mono' },
              { key: 'arm', label: 'Arm', kind: 'mono' },
              { key: 'fidelity', label: 'Fidelity', kind: 'num', render: (r) => (r.fidelity == null ? '—' : r.fidelity.toFixed(3)) },
              { key: 'phDrift', label: 'pH Δ', kind: 'num', render: (r) => r.phDrift.toFixed(3) },
              { key: 'tempDrift', label: 'T Δ °C', kind: 'num', render: (r) => r.tempDrift.toFixed(2) },
              { key: 'viability', label: 'Viab %', kind: 'num', render: (r) => r.viability.toFixed(1) },
              { key: 'replicates', label: 'n', kind: 'num' },
              { key: 'offset', label: 'Offset ms', kind: 'num', render: (r) => (r.offset == null ? '—' : r.offset) },
              { key: 'ambiguities', label: 'Amb', kind: 'num' },
              { key: 'overall', label: 'Result', render: (r) => <StatusPill state={r.overall} /> },
              { key: 'reasons', label: 'Reason codes', kind: 'mono', render: (r) => r.reasons.join(', ') || '—' },
              { key: 'evaluated', label: 'Evaluated', kind: 'mono' },
            ]}
            rows={gateResults}
          />
        </Panel>

        <div className="grid-main-side">
          <Panel title={`${selected.run} — per-rule breakdown`} flush actions={<StatusPill state={selected.overall} />}>
            <DataTable
              rowKey="rule"
              columns={[
                { key: 'rule', label: 'Rule', kind: 'mono' },
                { key: 'name', label: 'Name', render: (r) => gateRules.find((g) => g.id === r.rule)?.name },
                { key: 'value', label: 'Observed', kind: 'num' },
                { key: 'threshold', label: 'Threshold', kind: 'num' },
                { key: 'state', label: 'Result', render: (r) => <StatusPill state={r.state} /> },
                { key: 'reason', label: 'Reason', kind: 'mono' },
              ]}
              rows={selectedRunGateDetail}
            />
          </Panel>

          <div className="stack-lg">
            <Notice kind="info" title="How the overall result is derived">
              The overall result is the worst of any enabled rule: any FAIL → FAIL; else any WARN → WARN; else PASS.
              Reason codes list every breached rule, not only the worst.
            </Notice>
            <Panel title="Reason codes" flush>
              <DataTable
                rowKey="code"
                columns={[
                  { key: 'code', label: 'Code', kind: 'mono' },
                  { key: 'text', label: 'Meaning', kind: 'wrap' },
                ]}
                rows={reasonCodes}
              />
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
