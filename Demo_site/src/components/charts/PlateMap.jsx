// PlateMap — 96-well plate (8 rows × 12 columns).
//
// Props:
//   wells: [{ id, row, col, value: 0–5, sham?: bool, excluded?: bool }]
//   selected: optional well id to outline
//   mode: 'signal' (fill by value) | 'arm' (fill by sham/exposed)
import Legend from '../Legend.jsx';

const CELL = 22;
const GAP = 3;
const PAD_L = 22;
const PAD_T = 16;
const ROWS = 'ABCDEFGH'.split('');

export default function PlateMap({ wells, selected, mode = 'signal', title, caption }) {
  const W = PAD_L + 12 * (CELL + GAP) + 4;
  const H = PAD_T + 8 * (CELL + GAP) + 4;
  const excluded = wells.filter((w) => w.excluded).length;

  return (
    <div className="chart-frame">
      {title ? <div className="label">{title}</div> : null}
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W * 1.6 }} role="img" aria-label={`96-well plate map, ${excluded} wells excluded`}>
        {Array.from({ length: 12 }, (_, c) => (
          <text key={`c${c}`} className="plate-label" x={PAD_L + c * (CELL + GAP) + CELL / 2} y={PAD_T - 5} textAnchor="middle">
            {c + 1}
          </text>
        ))}
        {ROWS.map((r, i) => (
          <text key={r} className="plate-label" x={PAD_L - 8} y={PAD_T + i * (CELL + GAP) + CELL / 2 + 3} textAnchor="middle">
            {r}
          </text>
        ))}
        {wells.map((w) => {
          const cx = PAD_L + w.col * (CELL + GAP);
          const cy = PAD_T + w.row * (CELL + GAP);
          let cls = 'plate-well';
          if (w.excluded) cls += ' is-excluded';
          else if (mode === 'arm') cls += w.sham ? ' is-sham' : ' is-4';
          else cls += ` is-${w.value}`;
          if (w.id === selected) cls += ' is-selected';
          return (
            <g key={w.id}>
              <rect className={cls} x={cx} y={cy} width={CELL} height={CELL} rx={2}>
                <title>{`${w.id} · ${w.arm}${w.excluded ? ' · EXCLUDED' : ''}`}</title>
              </rect>
              {w.excluded ? (
                <>
                  <line className="plate-excluded-mark" x1={cx + 5} y1={cy + 5} x2={cx + CELL - 5} y2={cy + CELL - 5} />
                  <line className="plate-excluded-mark" x1={cx + CELL - 5} y1={cy + 5} x2={cx + 5} y2={cy + CELL - 5} />
                </>
              ) : null}
            </g>
          );
        })}
      </svg>
      {mode === 'signal' ? (
        <Legend items={[
          { label: 'low', color: '--color-plate-1', box: true },
          { label: 'mid', color: '--color-plate-3', box: true },
          { label: 'high', color: '--color-plate-5', box: true },
          { label: 'excluded', color: '--color-plate-excluded', box: true },
        ]} />
      ) : (
        <Legend items={[
          { label: 'exposed', color: '--color-plate-4', box: true },
          { label: 'sham', color: '--color-plate-sham', box: true },
          { label: 'excluded', color: '--color-plate-excluded', box: true },
        ]} />
      )}
      {caption ? <div className="chart-caption">{caption}</div> : null}
    </div>
  );
}
