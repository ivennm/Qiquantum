// nav.js — THE single navigation registry.
//
// Both the sidebar (src/layout/Sidebar.jsx) and the route table (src/App.jsx)
// read from this file. To add a screen:
//
//   1. create src/pages/MyScreen.jsx
//   2. import it below and add one entry to the appropriate group
//
// Nothing else needs to change. `req` is the sponsor requirement number the
// screen addresses; it is shown as a small marker in the sidebar so reviewers
// can map screens back to the requirements list.

import Overview    from './pages/Overview.jsx';
import Experiments from './pages/Experiments.jsx';
import Waveforms   from './pages/Waveforms.jsx';
import Ingestion   from './pages/Ingestion.jsx';
import Validation  from './pages/Validation.jsx';
import Gates       from './pages/Gates.jsx';
import Assays      from './pages/Assays.jsx';
import Analysis    from './pages/Analysis.jsx';
import Evidence    from './pages/Evidence.jsx';
import Admin       from './pages/Admin.jsx';

export const NAV_GROUPS = [
  {
    label: 'Registry',
    items: [
      { path: '/',            label: 'Overview',                icon: 'grid',     page: Overview },
      { path: '/experiments', label: 'Experiments & Protocols', icon: 'flask',    page: Experiments, req: 1 },
      { path: '/waveforms',   label: 'Waveform Candidates',     icon: 'wave',     page: Waveforms,   req: 2 },
    ],
  },
  {
    label: 'Acquisition',
    items: [
      { path: '/ingestion',   label: 'Instruments & Ingestion', icon: 'upload',   page: Ingestion,   req: 3 },
      { path: '/validation',  label: 'Alignment & Validation',  icon: 'align',    page: Validation,  req: 4 },
    ],
  },
  {
    label: 'Quality',
    items: [
      { path: '/gates',       label: 'Acceptance Gates',        icon: 'gate',     page: Gates,       req: 5 },
      { path: '/assays',      label: 'Biological Assays',       icon: 'assay',    page: Assays,      req: 6 },
    ],
  },
  {
    label: 'Output',
    items: [
      { path: '/analysis',    label: 'Analysis & Visualization', icon: 'chart',   page: Analysis,    req: 7 },
      { path: '/evidence',    label: 'Evidence Packages',        icon: 'package', page: Evidence,    req: 8 },
    ],
  },
  {
    label: 'System',
    items: [
      { path: '/admin',       label: 'Security & System',       icon: 'shield',   page: Admin,       req: 9 },
    ],
  },
];

/** Flat list of every routed screen, in sidebar order. */
export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

/** Look up the nav entry for a pathname (used by the breadcrumb). */
export function findNavItem(pathname) {
  return NAV_ITEMS.find((item) => item.path === pathname) || null;
}
