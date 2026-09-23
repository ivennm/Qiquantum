// WaveformOverlay — commanded vs measured trace with a residual strip below.
//
// Props:
//   commanded, measured: [{ t, v }]   (same length, same t)
//   height: total pixel height (default 260)
//
// Everything is drawn in a fixed viewBox and scaled by CSS width. Colours
// come from charts.css classes.
import { linear, extent, ticks, pathFrom } from './scale.js';
import { residual } from '../../data/series.js';

const W = 800;
const PAD = { top: 12, right: 16, bottom: 24, left: 44 };

export default function WaveformOverlay({ commanded, measured, height = 260, caption }) {
  const mainH = Math.round(height * 0.68);
  const resH = height - mainH - 28;
  const res = residual(commanded, measured);

  const x = linear([commanded[0].t, commanded[commanded.length - 1].t], [PAD.left, W - PAD.right]);
  const yDom = extent([...commanded.map((p) => p.v), ...measured.map((p) => p.v)], 0.08);
  const y = linear(yDom, [mainH - PAD.bottom, PAD.top]);

  const rDom = extent(res.map((p) => p.v), 0.2);
  const rMax = Math.max(Math.abs(rDom[0]), Math.abs(rDom[1]));
  const ry = linear([-rMax, rMax], [mainH + resH - 4, mainH + 8]);

  const toPx = (series, sy) => series.map((p) => ({ x: x(p.t), y: sy(p.v) }));

  return (
    <div className="chart-frame">
      <svg className="chart" viewBox={`0 0 ${W} ${height}`} role="img" aria-label="Commanded versus measured waveform overlay with residual">
        {/* grid + y ticks */}
        {ticks(yDom, 4).map((tv) => (
          <g key={`y${tv}`}>
            <line className="chart-grid" x1={PAD.left} x2={W - PAD.right} y1={y(tv)} y2={y(tv)} />
            <text className="chart-tick" x={PAD.left - 6} y={y(tv) + 3} textAnchor="end">{tv.toFixed(2)}</text>
          </g>
        ))}
        {/* x ticks */}
        {ticks([commanded[0].t, commanded[commanded.length - 1].t], 6).map((tv) => (
          <g key={`x${tv}`}>
            <line className="chart-grid" y1={PAD.top} y2={mainH - PAD.bottom} x1={x(tv)} x2={x(tv)} />
            <text className="chart-tick" x={x(tv)} y={mainH - PAD.bottom + 12} textAnchor="middle">{tv.toFixed(0)} ms</text>
          </g>
        ))}
        <line className="chart-axis" x1={PAD.left} x2={W - PAD.right} y1={mainH - PAD.bottom} y2={mainH - PAD.bottom} />
        <line className="chart-axis" x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={mainH - PAD.bottom} />
        <text className="chart-label" x={PAD.left} y={PAD.top - 2}>V</text>

        <path className="trace is-commanded" d={pathFrom(toPx(commanded, y))} />
        <path className="trace is-measured" d={pathFrom(toPx(measured, y))} />

        {/* residual strip */}
        <line className="chart-grid" x1={PAD.left} x2={W - PAD.right} y1={mainH + 2} y2={mainH + 2} />
        <line className="chart-zero" x1={PAD.left} x2={W - PAD.right} y1={ry(0)} y2={ry(0)} />
        <text className="chart-label" x={PAD.left - 6} y={ry(0) + 3} textAnchor="end">Δ</text>
        <text className="chart-tick" x={PAD.left - 6} y={ry(rMax) + 8} textAnchor="end">+{rMax.toFixed(2)}</text>
        <text className="chart-tick" x={PAD.left - 6} y={ry(-rMax) - 1} textAnchor="end">−{rMax.toFixed(2)}</text>
        <path className="trace is-residual" d={pathFrom(toPx(res, ry))} />
      </svg>
      {caption ? <div className="chart-caption">{caption}</div> : null}
    </div>
  );
}
