// StatusPill — gate / ingest / run state. The text label is always shown so
// state is never conveyed by colour alone.
//
//   state: 'pass' | 'warn' | 'fail' | 'info' | 'neutral'
//
// Callers may pass the state name as the label (default) or override it.
const DEFAULT_LABEL = {
  pass: 'Pass',
  warn: 'Warn',
  fail: 'Fail',
  info: 'Info',
  neutral: 'Pending',
};

export default function StatusPill({ state = 'neutral', outline = false, children, title }) {
  return (
    <span
      className={`status-pill is-${state}${outline ? ' is-outline' : ''}`}
      title={title}
    >
      {children ?? DEFAULT_LABEL[state]}
    </span>
  );
}
