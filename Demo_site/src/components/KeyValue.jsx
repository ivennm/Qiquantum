// KeyValue — two-column metadata block.
//   items: [[label, value], ...]   (value may be any React node)
export default function KeyValue({ items, compact = false }) {
  return (
    <dl className={`kv${compact ? ' is-compact' : ''}`}>
      {items.map(([label, value]) => (
        // Fragment keyed by label so dt/dd stay paired in the grid.
        <FragmentPair key={label} label={label} value={value} />
      ))}
    </dl>
  );
}

function FragmentPair({ label, value }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
