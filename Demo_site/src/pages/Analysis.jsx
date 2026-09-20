// Analysis & Visualization — requirement 7.
// Overlay + residual, drift with threshold band, plate map, replicate/batch
// view, exposed-vs-sham summary with effect size + CI, explicit exclusions,
// and a standing non-clinical disclaimer.
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusPill from '../components/StatusPill.jsx';
import KeyValue from '../components/KeyValue.jsx';
import Notice from '../components/Notice.jsx';
import Legend from '../components/Legend.jsx';
import Icon from '../components/Icon.jsx';
import Tabs from '../components/Tabs.jsx';
import WaveformOverlay from '../components/charts/WaveformOverlay.jsx';
import DriftChart from '../components/charts/DriftChart.jsx';
import PlateMap from '../components/charts/PlateMap.jsx';
import { commandedWaveform, measuredWaveform, driftSeries } from '../data/series.js';
import { exposedVsSham, exclusions, plateP01, replicateBatchView, analysisSettings } from '../data/analysis.js';

const cmd = commandedWaveform();
const meas = measuredWaveform(cmd, { seed: 7 });
const temp = driftSeries({ baseline: 37.0, step: 0.006, seed: 11, excursion: 0.05 });
const ph = driftSeries({ baseline: 7.30, step: 0.003, seed: 19, excursion: 0.02, n: 180 });
const wells = plateP01();

const fmt = (v, d = 0) => (v == null ? '—' : typeof v === 'number' ? v.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) : v);

export default function Analysis() {
  return (
    <>
      <PageHeader
        kicker="Requirement 7 · Output"
        title="Analysis & Visualization"
        description="Commanded-versus-measured overlays, run timelines, sensor drift, plate maps, QC status, replicate and batch views, and exposed-versus-sham summaries with descriptive statistics, effect sizes and confidence intervals."
        actions={
          <>
            <button type="button" className="btn" title="Not wired in the baseline"><Icon name="download" /> Export figures</button>
            <button type="button" className="btn" title="Not wired in the baseline"><Icon name="refresh" /> Recompute</button>
          </>
        }
      />

      <div className="stack-lg">
        <Notice kind="warn" title="Descriptive analysis only">
          This platform reports what was measured and how it was processed. It does not make clinical, causal or
          efficacy determinations. Effect sizes and confidence intervals are descriptive summaries of the exposed and
          sham groups under the settings listed below.
        </Notice>

        <Panel title="Commanded vs measured · RUN-0142-014 · WFC-7A31" flush actions={<StatusPill state="pass">fidelity 0.994</StatusPill>}>
          <Tabs active="overlay" items={[
            { id: 'overlay', label: 'Overlay' },
            { id: 'spectrum', label: 'Spectrum' },
            { id: 'iv', label: 'Current / voltage' },
          ]} />
          <div className="panel-body">
            <WaveformOverlay
              commanded={cmd}
              measured={meas}
              caption="Amber: command issued to the generator. Teal: trace captured by the oscilloscope after a 12 ms alignment offset. Lower strip: measured minus commanded. Normalised cross-correlation 0.994 against threshold 0.99."
            />
            <div style={{ marginTop: 'var(--space-2)' }}>
              <Legend items={[
                { label: 'commanded', color: '--color-trace-commanded' },
                { label: 'measured', color: '--color-trace-measured' },
                { label: 'residual', color: '--color-trace-residual' },
              ]} />
            </div>
          </div>
        </Panel>

        <div className="grid-2">
          <Panel title="Sample temperature drift">
            <DriftChart series={temp} baseline={37.0} limit={0.1} unit="°C" label="Temperature" />
          </Panel>
          <Panel title="Medium pH drift">
            <DriftChart series={ph} baseline={7.30} limit={0.05} unit="" label="pH" />
          </Panel>
        </div>

        <div className="grid-main-side">
          <Panel title="Exposed vs sham · descriptive summary" flush foot={`Effect size: ${analysisSettings.effectSize}. CI: ${analysisSettings.ci}.`}>
            <DataTable
              rowKey="k"
              columns={[
                { key: 'endpoint', label: 'Endpoint' },
                { key: 'condition', label: 'Condition' },
                { key: 'n', label: 'n exp / sham', kind: 'num', render: (r) => `${r.nExposed} / ${r.nSham}` },
                { key: 'meanExposed', label: 'Mean exposed', kind: 'num', render: (r) => fmt(r.meanExposed, r.meanExposed < 10 ? 2 : r.meanExposed < 1000 ? 1 : 0) },
                { key: 'meanSham', label: 'Mean sham', kind: 'num', render: (r) => fmt(r.meanSham, r.meanSham < 10 ? 2 : r.meanSham < 1000 ? 1 : 0) },
                { key: 'sd', label: 'SD exp / sham', kind: 'num', render: (r) => `${fmt(r.sdExposed, r.sdExposed < 10 ? 2 : 0)} / ${fmt(r.sdSham, r.sdSham < 10 ? 2 : 0)}` },
                { key: 'effect', label: "Hedges' g", kind: 'num', render: (r) => r.effect.toFixed(2) },
                { key: 'ci', label: '95% CI', kind: 'num', render: (r) => `[${r.ciLow.toFixed(2)}, ${r.ciHigh.toFixed(2)}]` },
              ]}
              rows={exposedVsSham.map((r, i) => ({ ...r, k: i }))}
            />
          </Panel>

          <Panel title="Plate map · P01 · ATP">
            <PlateMap wells={wells} mode="signal" caption="Fill: per-well ATP signal bin after per-plate sham-median normalisation. Crossed wells are excluded (see table below)." />
          </Panel>
        </div>

        <div className="grid-2">
          <Panel title="Replicate × batch" flush foot="Replicate 4 assays pending; replicate 5 not seeded. Gate G-REP remains at WARN.">
            <DataTable
              rowKey="replicate"
              columns={[
                { key: 'replicate', label: 'Replicate', kind: 'mono' },
                { key: 'batch', label: 'Batch', kind: 'mono' },
                { key: 'plate', label: 'Plate', kind: 'mono' },
                { key: 'atp', label: 'ATP RLU', kind: 'num', render: (r) => fmt(r.atp) },
                { key: 'ocr', label: 'OCR', kind: 'num', render: (r) => fmt(r.ocr, 1) },
                { key: 'mmp', label: 'MMP', kind: 'num', render: (r) => fmt(r.mmp, 2) },
                { key: 'viability', label: 'Viab %', kind: 'num', render: (r) => fmt(r.viability, 1) },
                { key: 'state', label: 'QC', render: (r) => <StatusPill state={r.state}>{r.state === 'neutral' ? 'pending' : r.state === 'fail' ? 'missing' : 'pass'}</StatusPill> },
              ]}
              rows={replicateBatchView}
              rowClass={(r) => (r.state === 'fail' ? 'is-muted' : '')}
            />
          </Panel>

          <Panel title="Exclusions" flush foot="Every excluded sample carries a reason and an author. No silent outlier removal is applied.">
            <DataTable
              rowKey="sample"
              columns={[
                { key: 'sample', label: 'Sample', kind: 'mono' },
                { key: 'endpoint', label: 'Endpoint', kind: 'mono' },
                { key: 'reason', label: 'Reason', kind: 'wrap' },
                { key: 'by', label: 'By', kind: 'mono' },
                { key: 'when', label: 'When', kind: 'mono' },
              ]}
              rows={exclusions}
            />
          </Panel>
        </div>

        <Panel title="Analysis settings">
          <KeyValue items={Object.entries(analysisSettings).map(([k, v]) => [
            { effectSize: 'Effect size', ci: 'Confidence interval', outlierRule: 'Outlier rule', normalisation: 'Normalisation', software: 'Software' }[k],
            <span className="mono">{v}</span>,
          ])} />
        </Panel>
      </div>
    </>
  );
}
