// App — the route table.
//
// Every screen inside the application shell is registered in nav.js; this
// file only maps that list onto <Route> elements. The login screen is the
// one route rendered outside the shell.
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layout/AppShell.jsx';
import Login from './pages/Login.jsx';
import { NAV_ITEMS } from './nav.js';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppShell />}>
        {NAV_ITEMS.map(({ path, page: Page }) => (
          <Route key={path} path={path} element={<Page />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
