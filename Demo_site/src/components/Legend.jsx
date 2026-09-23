// Legend — chart key. Each item: { label, color: '--token-name', box?: bool }
export default function Legend({ items }) {
  return (
    <div className="legend">
      {items.map((it) => (
        <span className="legend-item" key={it.label}>
          <span
            className={`legend-swatch${it.box ? ' is-box' : ''}`}
            style={{ '--swatch': `var(${it.color})`, background: `var(${it.color})` }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}
