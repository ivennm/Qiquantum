# QIQuantum Platform — Demo_site

Visual baseline for the **QIQuantum Bioenergetics Experiment Data & Quality Platform**.

This is a **non-functional UI shell**. Every screen renders from committed
placeholder fixtures. There is no backend, no authentication, no file parsing,
no gate evaluation and no state that survives a refresh. Buttons, uploads,
filters and the rule editor are visual affordances only, each carrying a
`title` tooltip that says so. The purpose is to give the team and the sponsor a
settled design language and a complete, navigable picture of every screen
before any behaviour is written.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | **22.12 or newer** (22.x LTS recommended) | `.nvmrc` pins `22`; run `nvm use` if you use nvm |
| npm | 9 or newer | ships with Node |
| Docker + Compose | optional | only for the container path below; **not verified** by the authors (see below) |

No other tooling is required. No global installs.

## Install and run

```bash
cd Demo_site
npm install
npm run dev
```

Open <http://localhost:5173>. The dev server hot-reloads on save.

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build to `dist/`. Exits non-zero on any unresolved import, so it doubles as the smoke test. |
| `npm run preview` | Serves the built `dist/` on <http://localhost:4173> so you can check the production bundle. |

## Run in a container (unverified)

> Docker was not installed on the machine this baseline was built on, so the
> `Dockerfile`, `docker-compose.yml` and `nginx.conf` have **not been executed**.
> They follow the standard Vite pattern and are expected to work; treat the
> first run as the test and fix anything that surfaces.

Development server with hot reload:

```bash
docker compose up
# → http://localhost:5173
```

Production image (static build behind nginx with SPA history fallback):

```bash
docker build --target prod -t qiquantum-demo .
docker run --rm -p 8080:80 qiquantum-demo
# → http://localhost:8080
```

---

## Project structure

```
Demo_site/
├── package.json          dependencies, engines, scripts   ★ requirements file
├── vite.config.js        dev server binds 0.0.0.0:5173 so containers can map the port
├── index.html            single HTML entry
├── Dockerfile · docker-compose.yml · nginx.conf · .dockerignore
├── docs/
│   ├── SPECIFICATION.md  project specification: scope, requirements, design, development and implementation approach
│   ├── ARCHITECTURE.md   system context, module graph, styling, data flow, build paths (Mermaid)
│   └── USER_FLOWS.md     navigation map, evidence-chain journey, file/gate/package lifecycles
└── src/
    ├── main.jsx          React root; imports the five stylesheets in cascade order
    ├── App.jsx           route table (reads nav.js)
    ├── nav.js            ★ the single navigation registry — add a screen here
    ├── styles/
    │   ├── tokens.css    ★ the whole design system: every colour, size, space, radius
    │   ├── base.css      reset, typography, focus rings
    │   ├── components.css shared primitives (.panel .data-table .status-pill .btn …)
    │   ├── charts.css    SVG chart styling
    │   └── pages.css     shell layout + the handful of screen-specific grids
    ├── layout/           AppShell · Sidebar · TopBar · StatusStrip
    ├── components/       Panel · PageHeader · DataTable · StatusPill · KeyValue · Checksum
    │   │                 Toolbar · Tabs · EmptyState · Notice · Stat · DropZone · Meter
    │   │                 CodeBlock · Legend · Icon
    │   └── charts/       WaveformOverlay · DriftChart · RunTimeline · PlateMap · Sparkline · scale.js
    ├── data/             ★ placeholder fixtures, one file per domain (swap for API calls)
    └── pages/            one file per screen (11)
```

Files marked ★ are the extension points described below.

## Screens

| Route | Screen | Requirement |
|---|---|---|
| `/` | Overview — active experiment, gate roll-up, replicate counter, recent ingests, emulator | — |
| `/experiments` | Experiments & Protocols — registry, arms, sham, conditions, wells, replicates, versions | 1 |
| `/waveforms` | Waveform Candidates — opaque IDs, versions, checksums, custody boundary | 2 |
| `/ingestion` | Instruments & Ingestion — upload zones, ingest queue, emulator control, API reference | 3 |
| `/validation` | Time Alignment & Validation — stream timeline, units/rates, ambiguity queue | 4 |
| `/gates` | Acceptance Gates — rule table, per-run results, per-rule breakdown, reason codes | 5 |
| `/assays` | Biological Assays — endpoint catalogue, templates, mapping preview, canonical schema | 6 |
| `/analysis` | Analysis & Visualization — overlay + residual, drift, plate map, exposed-vs-sham, exclusions | 7 |
| `/evidence` | Evidence Packages — versioned packages, manifest, checklist, audit log, exports | 8 |
| `/admin` | Security & System — users, permission matrix, error log, backups, test status | 9 |
| `/login` | Sign in — rendered outside the shell; visual only | 9 |

The seeded data deliberately shows a system that is **not** in a perfect state:
one run at FAIL, two open ambiguities blocking binding, replicates at 4 of 5.
A baseline where everything is green would not show what the failure states
look like.

## Documentation

| Document | Contents |
|---|---|
| [docs/SPECIFICATION.md](docs/SPECIFICATION.md) | Project specification: purpose and scope, users and roles, the nine requirement areas with acceptance criteria, design principles, system design (architecture, data model, API surface), development process and phases, testing strategy, implementation approach per area, deployment, risks and open decisions. |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Ten diagrams with notes: system context, runtime composition, module dependencies, styling and theming, data flow today vs. later, screen × primitive matrix, chart pipeline, build and deployment, requirement traceability, implementation status. |
| [docs/USER_FLOWS.md](docs/USER_FLOWS.md) | Ten diagrams with notes from the user's side: navigation map, the evidence-chain journey, an investigator's day, ingested-file lifecycle, ambiguity resolution, gate derivation, package lifecycle, roles across screens, wired shell interactions, screen-by-screen table. |

Diagrams are Mermaid and render inline on GitHub and in VS Code's Markdown preview. All 17 blocks were checked with the Mermaid parser.

---

## How to restyle

Everything visual resolves to a custom property in `src/styles/tokens.css`.
No other file contains a raw colour or a magic pixel value (`grep -rn "#[0-9a-f]" src --include=*.css --include=*.jsx | grep -v tokens.css` returns nothing).

- **Change the palette:** edit the colour block in `tokens.css`. Light and dark
  themes are separate blocks; the dark block overrides colours only.
- **Change density:** `--row-height`, `--control-height`, the `--text-*` scale.
- **Change the typeface:** replace `--font-sans` / `--font-mono`. To use a web
  font, add a `<link>` in `index.html` first.
- **Change a component's look:** find its block in `components.css`. Class
  names are flat and descriptive (`.panel`, `.data-table`, `.status-pill.is-fail`).

Design constraints the baseline follows and that new work should keep:
hairline borders instead of shadows; 2–3 px radii; gate state is never colour
alone (every pill has a text label); chart traces are amber vs teal, not red vs
green; identifiers, checksums, timestamps and numbers are monospace.

## How to add a screen

1. Create `src/pages/MyScreen.jsx`. Compose it from the primitives in
   `src/components/` — start by copying the closest existing page.
2. Add its fixtures to `src/data/myscreen.js`.
3. Import it in `src/nav.js` and add one object to the right group:
   ```js
   { path: '/my-screen', label: 'My Screen', icon: 'grid', page: MyScreen, req: 4 }
   ```
   The sidebar link, the route and the breadcrumb all follow from that entry.
4. If it needs a glyph that does not exist, add a path to `GLYPHS` in `src/components/Icon.jsx`.

## How to make it real

Each file in `src/data/` opens with a comment naming the API call that will
replace it. The intended path is:

1. Keep the components. They take plain arrays and objects.
2. Replace each fixture import in a page with a fetch (or a data-loading hook)
   returning the same shape.
3. Wire the affordances marked "not wired in the baseline" as the behaviour
   behind them lands.
4. Add the test suites the Admin screen's "Automated tests" panel is waiting for.

## Architecture sketch

```
┌────────────────────────────────────────────────────────────────┐
│  Browser  (this repo: React 19 + react-router 7, built by Vite) │
│                                                                 │
│   nav.js ─► App.jsx ─► AppShell ─► pages/* ─► components/*      │
│                                          └──► data/*  (fixtures │
│                                                today; API later)│
└──────────────────────────────┬─────────────────────────────────┘
                               │  /api/…   (documented on /ingestion)
┌──────────────────────────────▼─────────────────────────────────┐
│  Platform API (future)                                          │
│   registry · ingest · validation/alignment · gate engine        │
│   assay mapping · analysis · evidence packaging · auth/RBAC     │
│   + software instrument emulator                                │
└──────────────────────────────┬─────────────────────────────────┘
                               │
┌──────────────────────────────▼─────────────────────────────────┐
│  Storage: relational DB (metadata, checksums, audit log)        │
│           object store (raw files, packages)                    │
│  Proprietary waveform definitions stay OUTSIDE; only the        │
│  SHA-256 is held here.                                          │
└────────────────────────────────────────────────────────────────┘
```

## Verification performed

- `npm install` — clean, no peer-dependency warnings (Node 22.22.1, npm 9.2.0).
- `npm run build` — exits 0.
- Dev server: all 11 routes return 200; unknown routes redirect to `/`.
- Server-side render of every route — no runtime errors.
- Source greps: no gradients, blur, large shadows, large radii, emoji, or hex
  colours outside `tokens.css`.
- **Not verified:** Docker path (no Docker on the authoring machine); pixel
  rendering in a browser (no browser on the authoring machine) — please walk
  the screens and check the ~1100 px breakpoint and dark mode.
