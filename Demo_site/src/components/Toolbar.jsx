// Toolbar — row of controls above a table or panel body. Purely layout.
export function Toolbar({ children }) {
  return <div className="toolbar">{children}</div>;
}

export function ToolbarSpacer() {
  return <div className="toolbar-spacer" />;
}

export function ToolbarSep() {
  return <div className="toolbar-sep" />;
}

/** A search box that is visual only in the baseline. */
export function SearchBox({ placeholder = 'Filter…', width = 220 }) {
  return (
    <input
      className="input is-mono"
      style={{ width }}
      placeholder={placeholder}
      readOnly
      title="Filtering is not wired in the baseline"
      aria-label={placeholder}
    />
  );
}

export default Toolbar;
