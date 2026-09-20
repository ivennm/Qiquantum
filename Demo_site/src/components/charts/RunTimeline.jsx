// RunTimeline — horizontal lanes, one per data stream, showing coverage
// segments, gaps and the measured offset relative to the command stream.
//
// Props:
//   lanes: [{ id, label, kind, segments: [[start, end]], gaps?: [[s, e]], offsetMs }]
//   domain: [start, end] in seconds
//   cursor: optional t in seconds to draw a dashed cursor
import { linear } from './scale.js';

const W = 800;
const LANE_H = 26;
const LABEL_W = 132;
const PAD_R = 16;

export default function RunTimeline({ lanes, domain, cursor, caption }) {
  const x = linear(domain, [LABEL_W, W - PAD_R]);
  const height = lanes.length * LANE_H + 24;

  return (
    <div className="chart-frame">
      <svg className="chart" viewBox={`0 0 ${W} ${height}`} role="img" aria-label="Run timeline showing stream coverage and offsets">
        {/* axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const t = domain[0] + (domain[1] - domain[0]) * f;
          return (
            <g key={f}>
              <line className="chart-grid" x1={x(t)} x2={x(t)} y1={0} y2={lanes.length * LANE_H} />
              <text className="chart-tick" x={x(t)} y={lanes.length * LANE_H + 14} textAnchor="middle">{t.toFixed(0)} s</text>
            </g>
          );
        })}
        {lanes.map((lane, i) => {
          const y0 = i * LANE_H;
          const segClass = lane.kind === 'commanded' ? 'is-commanded' : lane.kind === 'secondary' ? 'is-secondary' : '';
          return (
            <g key={lane.id}>
              <line className="timeline-lane-rule" x1={0} x2={W} y1={y0 + LANE_H} y2={y0 + LANE_H} />
              <text className="timeline-lane-label" x={8} y={y0 + LANE_H / 2 + 4}>{lane.label}</text>
              {lane.segments.map(([s, e], k) => (
                <rect
                  key={k}
                  className={`timeline-seg ${segClass}`}
                  x={x(Math.max(s, domain[0]))}
                  width={Math.max(2, x(Math.min(e, domain[1])) - x(Math.max(s, domain[0])))}
                  y={y0 + 7}
                  height={LANE_H - 14}
                />
              ))}
              {(lane.gaps || []).map(([s, e], k) => (
                <rect
                  key={`g${k}`}
                  className="timeline-seg is-gap"
                  x={x(s)}
                  width={Math.max(2, x(e) - x(s))}
                  y={y0 + 7}
                  height={LANE_H - 14}
                />
              ))}
              {lane.offsetMs ? (
                <text className="timeline-offset-label" x={W - PAD_R} y={y0 + LANE_H / 2 + 3} textAnchor="end">
                  +{lane.offsetMs} ms
                </text>
              ) : null}
            </g>
          );
        })}
        {cursor !== undefined ? (
          <line className="timeline-cursor" x1={x(cursor)} x2={x(cursor)} y1={0} y2={lanes.length * LANE_H} />
        ) : null}
      </svg>
      {caption ? <div className="chart-caption">{caption}</div> : null}
    </div>
  );
}
