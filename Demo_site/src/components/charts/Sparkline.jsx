// Sparkline — tiny inline trend for table cells.
import { linear, extent, pathFrom } from './scale.js';

export default function Sparkline({ series, kind = 'is-measured', width = 72, height = 18 }) {
  const x = linear([0, series.length - 1], [1, width - 1]);
  const y = linear(extent(series.map((p) => p.v)), [height - 2, 2]);
  const d = pathFrom(series.map((p, i) => ({ x: x(i), y: y(p.v) })));
  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path className={`trace ${kind}`} d={d} />
    </svg>
  );
}
