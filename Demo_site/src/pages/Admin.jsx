// Security & System — requirement 9.
// Users × roles, permission grid, error log, backups, automated-test status,
// "no PHI" notice.
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import KeyValue from '../components/KeyValue.jsx';
import Notice from '../components/Notice.jsx';
import Icon from '../components/Icon.jsx';
import { users, roles, permissions, errorLog, backups, testStatus } from '../data/users.js';

const LEVEL_STATE = { ERROR: 'fail', WARN: 'warn', INFO: 'neutral' };

export default function Admin() {
  return (
    <>
      <PageHeader
        kicker="Requirement 9 · System"
        title="Security & System"
        description="Authentication, role-based permissions, input validation, error logging, backup and export, and automated test status. No protected health information or patient data is stored."
        actions={
          <>
            <button type="button" className="btn" title="Not wired in the baseline"><Icon name="db" /> Run backup</button>
            <button type="button" className="btn is-primary" title="Not wired in the baseline"><Icon name="plus" /> Invite user</button>
          </>
        }
      />

      <div className="stack-lg">
        <Notice kind="info" title="Data classification">
          This platform holds instrument telemetry, cell-line assay results and experiment metadata. No PHI or patient
          data is accepted; input validation rejects fields that match identifier patterns.
        </Notice>

        <Panel title="Users" flush>
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email', kind: 'mono' },
              { key: 'role', label: 'Role' },
              { key: 'auth', label: 'Auth', kind: 'mono' },
              { key: 'lastSeen', label: 'Last seen', kind: 'mono' },
              { key: 'state', label: 'State', render: (r) => <StatusPill state={r.state === 'active' ? 'pass' : 'neutral'}>{r.state}</StatusPill> },
              { key: 'a', label: '', render: () => <div className="row-actions"><button type="button" className="btn is-sm is-ghost" title="Not wired in the baseline"><Icon name="edit" size={12} /></button></div> },
            ]}
            rows={users}
          />
        </Panel>

        <Panel title="Permission matrix" flush foot="Roles are additive within a row; a capability is granted if any assigned role grants it.">
          <div className="table-wrap">
            <table className="data-table perm-grid">
              <thead>
                <tr>
                  <th>Capability</th>
                  {roles.map((r) => <th key={r}>{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {permissions.map((p) => (
                  <tr key={p.cap}>
                    <td>{p.cap}</td>
                    {p.grants.map((g, i) => (
                      <td key={i} className={g ? 'perm-yes' : 'perm-no'}>
                        <Icon name={g ? 'check' : 'x'} size={12} title={g ? 'granted' : 'denied'} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="grid-2">
          <Panel title="Error log" flush actions={<button type="button" className="btn is-sm" title="Not wired in the baseline"><Icon name="download" size={12} /> Export</button>}>
            <DataTable
              rowKey="k"
              columns={[
                { key: 'at', label: 'Time', kind: 'mono' },
                { key: 'level', label: 'Level', render: (r) => <StatusPill state={LEVEL_STATE[r.level]} outline>{r.level}</StatusPill> },
                { key: 'source', label: 'Source', kind: 'mono' },
                { key: 'message', label: 'Message', kind: 'wrap' },
              ]}
              rows={errorLog.map((e, i) => ({ ...e, k: i }))}
            />
          </Panel>

          <div className="stack-lg">
            <Panel title="Backups" flush>
              <DataTable
                columns={[
                  { key: 'id', label: 'Snapshot', kind: 'mono' },
                  { key: 'at', label: 'Taken', kind: 'mono' },
                  { key: 'size', label: 'Size', kind: 'num' },
                  { key: 'kind', label: 'Kind' },
                  { key: 'verified', label: '', render: (r) => <StatusPill state={r.verified ? 'pass' : 'warn'}>{r.verified ? 'verified' : 'unverified'}</StatusPill> },
                ]}
                rows={backups}
              />
            </Panel>
            <Panel title="Deployment">
              <KeyValue compact items={[
                ['Mode', 'Local · containers (docker compose)'],
                ['Cloud target', 'Sponsor-approved environment — not configured'],
                ['Auth provider', 'Institutional SSO (SAML) + local accounts for service users'],
                ['TLS', 'Terminated at reverse proxy'],
                ['Session', '8 h idle timeout'],
              ]} />
            </Panel>
          </div>
        </div>

        <Panel
          title="Automated tests"
          flush
          actions={<span className="small muted mono">last run {testStatus.lastRun} · {testStatus.commit}</span>}
          foot="Requirement 9 calls for unit and integration tests. No behaviour exists in the baseline yet, so no suites are defined; this panel is where their status will report."
        >
          <DataTable
            rowKey="name"
            columns={[
              { key: 'name', label: 'Suite', kind: 'mono' },
              { key: 'passed', label: 'Passed', kind: 'num' },
              { key: 'failed', label: 'Failed', kind: 'num' },
              { key: 'skipped', label: 'Skipped', kind: 'num' },
              { key: 'state', label: 'State', render: (r) => <StatusPill state={r.state}>{r.note}</StatusPill> },
            ]}
            rows={testStatus.suites}
          />
        </Panel>
      </div>
    </>
  );
}
