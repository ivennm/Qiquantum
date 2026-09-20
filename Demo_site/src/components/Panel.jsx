// Panel — bordered region with an optional uppercase title, action slot and
// footer. The building block of every screen.
export default function Panel({ title, actions, foot, flush = false, className = '', children, style }) {
  return (
    <section className={`panel ${className}`} style={style}>
      {title || actions ? (
        <div className="panel-head">
          {title ? <h2 className="panel-title">{title}</h2> : <span />}
          {actions ? <div className="panel-actions">{actions}</div> : null}
        </div>
      ) : null}
      <div className={`panel-body${flush ? ' is-flush' : ''}`}>{children}</div>
      {foot ? <div className="panel-foot">{foot}</div> : null}
    </section>
  );
}
