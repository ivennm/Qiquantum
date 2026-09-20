// Sidebar — left navigation rail. Rendered from nav.js; contains no
// hard-coded routes.
import { NavLink } from 'react-router-dom';
import { NAV_GROUPS } from '../nav.js';
import Icon from '../components/Icon.jsx';

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-brand">
        <div className="sidebar-wordmark">
          QI<span>Quantum</span>
        </div>
        <div className="sidebar-sub">Experiment Data &amp; Quality</div>
      </div>

      <nav className="sidebar-nav">
        {NAV_GROUPS.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="label nav-group-label">{group.label}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {item.req ? (
                  <span className="nav-link-req" title={`Requirement ${item.req}`}>
                    R{item.req}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        v0.1.0-baseline · build 2026.09.17
      </div>
    </aside>
  );
}
