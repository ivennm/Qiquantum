// TopBar — breadcrumb, active-experiment context, RUO badge, theme toggle,
// role chip and user initials.
//
// The experiment selector and user menu are visual only in the baseline;
// they will become real controls once there is an API and an auth layer.
import { Link, useLocation } from 'react-router-dom';
import { findNavItem } from '../nav.js';
import Icon from '../components/Icon.jsx';
import { activeExperiment } from '../data/experiments.js';
import { currentUser } from '../data/users.js';

export default function TopBar({ theme, onToggleTheme }) {
  const { pathname } = useLocation();
  const current = findNavItem(pathname);

  return (
    <header className="topbar">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Platform</Link>
        {current && current.path !== '/' ? (
          <>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{current.label}</span>
          </>
        ) : (
          <>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Overview</span>
          </>
        )}
      </nav>

      <button
        type="button"
        className="context-select"
        title="Experiment switcher — not wired in the baseline"
      >
        <span className="label">Experiment</span>
        <span className="num">{activeExperiment.id}</span>
        <Icon name="chevron" size={12} />
      </button>

      <div className="topbar-spacer" />

      <span className="ruo-badge" title="Research Use Only. Not for clinical or diagnostic use.">
        RESEARCH USE ONLY
      </span>

      <button
        type="button"
        className="btn is-ghost is-icon"
        onClick={onToggleTheme}
        title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-label="Toggle colour theme"
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>

      <span className="role-chip">{currentUser.role}</span>
      <span className="avatar" title={`${currentUser.name} (${currentUser.email})`}>
        {currentUser.initials}
      </span>
    </header>
  );
}
