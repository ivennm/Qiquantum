// Checksum — renders a hash truncated to its first and last characters with
// the full value in the tooltip and a copy affordance (not wired).
import Icon from './Icon.jsx';

export default function Checksum({ value, algo = 'sha256', head = 8, tail = 6, full = false }) {
  const short = full || value.length <= head + tail + 1
    ? value
    : `${value.slice(0, head)}…${value.slice(-tail)}`;
  return (
    <span className="checksum" title={`${algo}:${value}`}>
      <span className="checksum-algo">{algo}:</span>
      <span className="checksum-value">{short}</span>
      <button
        type="button"
        className="btn is-ghost is-icon"
        aria-label="Copy checksum"
        title="Copy — not wired in the baseline"
      >
        <Icon name="copy" size={12} />
      </button>
    </span>
  );
}
