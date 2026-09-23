// Tabs — horizontal tab strip. `active` is the id of the highlighted tab.
// Tabs do not switch content in the baseline; each page shows the content of
// its active tab.
export default function Tabs({ items, active }) {
  return (
    <div className="tabs" role="tablist">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === active}
          className={`tab${t.id === active ? ' is-active' : ''}`}
          title={t.id === active ? undefined : 'Tab switching is not wired in the baseline'}
        >
          {t.label}
          {t.count !== undefined ? <span className="tab-count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
