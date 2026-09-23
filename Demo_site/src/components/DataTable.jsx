// DataTable — dense read-only grid.
//
//   columns: [{ key, label, kind?: 'num' | 'mono' | 'wrap', render?: (row) => node, sortable?: bool }]
//   rows:    array of objects
//   rowKey:  property name used as React key (default 'id')
//
// `render` overrides the default cell (row[key]). Sorting and selection are
// visual affordances only in the baseline.
export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  selectedKey,
  rowClass,
  caption,
  emptyText = 'No records.',
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${col.kind === 'num' ? 'is-num' : ''} ${col.sortable ? 'is-sortable' : ''}`}
                style={col.width ? { width: col.width } : undefined}
                title={col.sortable ? 'Sorting is not wired in the baseline' : undefined}
              >
                {col.label}
                {col.sortable ? <span className="sort-hint">↕</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="muted">{emptyText}</td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = row[rowKey];
              const classes = [
                selectedKey !== undefined && key === selectedKey ? 'is-selected' : '',
                rowClass ? rowClass(row) : '',
              ].join(' ').trim();
              return (
                <tr key={key} className={classes || undefined}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={
                        col.kind === 'num' ? 'is-num'
                        : col.kind === 'mono' ? 'is-mono'
                        : col.kind === 'wrap' ? 'is-wrap'
                        : undefined
                      }
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
