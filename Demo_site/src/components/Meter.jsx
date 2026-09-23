// Meter — thin progress bar. `value`/`max` are numbers; `state` tints it.
export default function Meter({ value, max, state, label }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="meter"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      title={`${value} of ${max}`}
    >
      <div className={`meter-fill${state ? ` is-${state}` : ''}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
