// AppShell — the persistent frame around every routed screen.
//
// Owns the theme state. The theme is written as `data-theme` on <html> so the
// token overrides in tokens.css apply. The initial value follows the OS
// preference; the user's choice persists in localStorage.
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import StatusStrip from './StatusStrip.jsx';

const THEME_KEY = 'qiq-theme';

function initialTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable — fall through */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function AppShell() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app-shell">
      <div className="app-sidebar">
        <Sidebar />
      </div>
      <div className="app-topbar">
        <TopBar theme={theme} onToggleTheme={toggleTheme} />
      </div>
      <main className="app-main">
        <div className="app-main-inner">
          <Outlet />
        </div>
      </main>
      <div className="app-status">
        <StatusStrip />
      </div>
    </div>
  );
}
