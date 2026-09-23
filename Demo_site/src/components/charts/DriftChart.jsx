// DriftChart — a slow sensor series (temperature, pH) plotted against a
// threshold band around its baseline value.
//
// Props:
//   series:    [{ t, v }]
//   baseline:  number — the t₀ reference value
//   limit:     number — allowed |drift| from baseline
//   unit:      string for tick labels
//   height:    pixel height (default 160)
import { linear, extent, ticks, pathFrom } from './scale.js';

const W = 800;
const PAD = { top: 12, right: 16, bottom: 22, left: 48 };

export default function DriftChart({ series, baseline, limit, unit = '', height = 160, label, caption }) {
  const x = linear([series[0].t, series[series.length - 1].t], [PAD.left, W - PAD.right]);
  const values = series.map((p) => p.v);
  const dom = extent([...values, baseline - limit * 1.3, baseline + limit * 1.3]);
  const y = linear(dom, [height - PAD.bottom, PAD.top]);
  const px = series.map((p) => ({ x: x(p.t), y: y(p.v) }));

  const maxDrift = Math.max(...values.map((v) => Math.abs(v - baseline)));
  const breach = series.find((p) => Math.abs(p.v - baseline) > limit);

  return (
    <div className="chart-frame">
      <svg className="chart" viewBox={`0 0 ${W} ${height}`} role="img" aria-label={`${label || 'Drift'} against threshold band`}>
        <rect
          className="chart-band"
          x={PAD.left}
          width={W - PAD.left - PAD.right}
          y={y(baseline + limit)}
          height={Math.max(0, y(baseline - limit) - y(baseline + limit))}
        />
        {ticks(dom, 3).map((tv) => (
          <g key={tv}>
            <line className="chart-grid" x1={PAD.left} x2={W - PAD.right} y1={y(tv)} y2={y(tv)} />
            <text className="chart-tick" x={PAD.left - 6} y={y(tv) + 3} textAnchor="end">{tv.toFixed(2)}{unit}</text>
          </g>
        ))}
        <line className="chart-limit" x1={PAD.left} x2={W - PAD.right} y1={y(baseline + limit)} y2={y(baseline + limit)} />
        <line className="chart-limit" x1={PAD.left} x2={W - PAD.right} y1={y(baseline - limit)} y2={y(baseline - limit)} />
        <text className="chart-limit-label" x={W - PAD.right} y={y(baseline + limit) - 3} textAnchor="end">+{limit}{unit} limit</text>
        <line className="chart-zero" x1={PAD.left} x2={W - PAD.right} y1={y(baseline)} y2={y(baseline)} />
        <line className="chart-axis" x1={PAD.left} x2={W - PAD.right} y1={height - PAD.bottom} y2={height - PAD.bottom} />
        <text className="chart-tick" x={PAD.left} y={height - PAD.bottom + 12}>t₀</text>
        <text className="chart-tick" x={W - PAD.right} y={height - PAD.bottom + 12} textAnchor="end">{series.length} s</text>
        <path className="trace is-secondary" d={pathFrom(px)} />
        {breach ? <circle className="chart-marker" cx={x(breach.t)} cy={y(breach.v)} r={3} /> : null}
      </svg>
      <div className="chart-caption">
        {caption || `${label}: max |drift| ${maxDrift.toFixed(3)}${unit} against limit ${limit}${unit}. ${breach ? 'Limit exceeded — marked.' : 'Within limit.'}`}
      </div>
    </div>
  );
}
