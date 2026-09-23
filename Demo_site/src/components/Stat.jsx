// Stat — a large monospace readout with a label and a sub-line.
//   state: optional 'pass' | 'warn' | 'fail' to tint the value
export function Stat({ label, value, sub, state }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className={`stat-value${state ? ` is-${state}` : ''}`}>{value}</div>
      {sub ? <div className="stat-sub">{sub}</div> : null}
    </div>
  );
}

/** A horizontal strip of Stats separated by hairlines. */
export function StatRow({ children }) {
  return <div className="stat-row">{children}</div>;
}

export default Stat;
