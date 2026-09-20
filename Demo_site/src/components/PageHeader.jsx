// PageHeader — title row at the top of each screen. `kicker` is the small
// uppercase line above the title (usually the requirement reference).
export default function PageHeader({ kicker, title, description, actions }) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        {kicker ? <div className="label page-kicker">{kicker}</div> : null}
        <h1 className="page-title">{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </div>
  );
}
