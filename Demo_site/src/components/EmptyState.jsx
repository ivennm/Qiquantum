// EmptyState — placeholder for a region with no records.
export default function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      {title ? <div className="empty-state-title">{title}</div> : null}
      {children}
    </div>
  );
}
