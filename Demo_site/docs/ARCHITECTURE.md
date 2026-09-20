# Demo_site — Architecture

Diagrams and notes describing how the visual baseline in this folder is put
together. Every diagram is derived from the files in `Demo_site/` only; the
"future" elements are drawn dashed and labelled as such.

Diagrams are written in [Mermaid](https://mermaid.js.org). GitHub, GitLab and
VS Code (with the built-in Markdown preview) render them inline. If your
viewer does not, paste a block into <https://mermaid.live>.

Companion document: [USER_FLOWS.md](USER_FLOWS.md) describes the same system
from the user's side.

---

## 1. System context

What the baseline is, and what it is not yet.

```mermaid
flowchart LR
    user(["Researcher / analyst<br/>(browser)"])

    subgraph built["Built in this folder"]
        spa["Demo_site SPA<br/>React 19 · react-router 7 · Vite 7<br/>11 screens, placeholder fixtures"]
    end

    subgraph future["Not built yet — drawn for orientation"]
        api["Platform API<br/>registry · ingest · validation<br/>gates · assays · analysis · packaging · auth"]
        db[("Relational DB<br/>metadata · checksums · audit log")]
        obj[("Object store<br/>raw files · evidence packages")]
        emu["Software instrument emulator"]
    end

    vault[("Sponsor waveform vault<br/>proprietary definitions<br/>OUTSIDE the platform")]

    user -->|"HTTP · localhost:5173"| spa
    spa -.->|"/api/… (documented on the Ingestion screen)"| api
    api -.-> db
    api -.-> obj
    emu -.->|"streams"| api
    vault -.->|"SHA-256 only"| db

    style future stroke-dasharray: 5 5
    style api stroke-dasharray: 5 5
    style db stroke-dasharray: 5 5
    style obj stroke-dasharray: 5 5
    style emu stroke-dasharray: 5 5
```

**Notes**

- The only thing that exists is the SPA. It has no network calls. Every table,
  chart and readout renders from arrays in `src/data/`.
- The API boundary is already *documented* on the Ingestion screen so the team
  agrees on it before it is built.
- The custody rule from requirement 2 is drawn as a hard boundary: the sponsor's
  waveform definition files never enter the platform. Only their checksum does.

---

## 2. Runtime composition

How the React tree is assembled when the page loads.

```mermaid
flowchart TD
    html["index.html<br/>&lt;div id=root&gt;"] --> main["src/main.jsx<br/>createRoot · StrictMode<br/>imports the 5 stylesheets"]
    main --> router["BrowserRouter"]
    router --> app["src/App.jsx<br/>&lt;Routes&gt;"]

    app -->|"/login"| login["pages/Login.jsx<br/>(outside the shell)"]
    app -->|"every path in nav.js"| shell["layout/AppShell.jsx<br/>owns theme state"]
    app -->|"*"| redirect["Navigate to /"]

    shell --> sidebar["layout/Sidebar.jsx"]
    shell --> topbar["layout/TopBar.jsx"]
    shell --> outlet["&lt;Outlet&gt;<br/>the active page"]
    shell --> status["layout/StatusStrip.jsx"]

    outlet --> pages["pages/*.jsx<br/>Overview · Experiments · Waveforms<br/>Ingestion · Validation · Gates<br/>Assays · Analysis · Evidence · Admin"]

    nav["src/nav.js<br/>NAV_GROUPS · NAV_ITEMS · findNavItem()"]
    nav -.->|"read by"| app
    nav -.->|"read by"| sidebar
    nav -.->|"read by (breadcrumb)"| topbar
```

**Notes**

- `nav.js` is the single registry. It imports every page component and
  exports the grouped list. `App.jsx` flattens it into `<Route>` elements;
  `Sidebar` renders it as links; `TopBar` looks up the current path in it for
  the breadcrumb. Adding a screen is one import and one object in `nav.js`.
- `AppShell` is a layout route: it renders once and swaps only the `<Outlet>`
  when the URL changes. Sidebar, top bar and status strip never re-mount.
- Login is deliberately outside the shell so it can use its own split layout.
- The CSS grid that positions the four shell regions is `.app-shell` in
  `styles/pages.css`, driven by `--sidebar-width`, `--topbar-height` and
  `--statusbar-height` from `tokens.css`.

---

## 3. Module dependency graph

Which folders are allowed to import from which. Arrows point from importer
to imported. This is the actual graph as of the baseline, not an aspiration.

```mermaid
flowchart LR
    subgraph entry["Entry"]
        main["main.jsx"]
        App["App.jsx"]
        nav["nav.js"]
    end

    subgraph layout["layout/"]
        AppShell
        Sidebar
        TopBar
        StatusStrip
    end

    subgraph pages["pages/ (11)"]
        P["Overview … Admin, Login"]
    end

    subgraph components["components/"]
        prim["Panel · PageHeader · DataTable<br/>StatusPill · KeyValue · Checksum<br/>Toolbar · Tabs · EmptyState · Notice<br/>Stat · DropZone · Meter · CodeBlock · Legend"]
        Icon
        subgraph charts["components/charts/"]
            ch["WaveformOverlay · DriftChart<br/>RunTimeline · PlateMap · Sparkline"]
            scale["scale.js"]
        end
    end

    subgraph data["data/ (fixtures)"]
        fx["experiments · waveforms · ingestion<br/>validation · gates · assays<br/>analysis · evidence · users"]
        series["series.js<br/>seeded generators"]
    end

    subgraph styles["styles/"]
        css["tokens → base → components → charts → pages"]
    end

    main --> App
    main --> css
    App --> nav
    App --> AppShell
    App --> P
    nav --> P
    AppShell --> Sidebar & TopBar & StatusStrip
    Sidebar --> nav
    Sidebar --> Icon
    TopBar --> nav
    TopBar --> Icon
    TopBar --> fx
    StatusStrip --> fx
    P --> prim
    P --> Icon
    P --> ch
    P --> fx
    P --> series
    prim --> Icon
    ch --> scale
    ch --> series
    ch --> prim
```

**Notes**

- **Rules the graph obeys:** `components/` never imports from `pages/`,
  `layout/` or `data/`. Charts import only `scale.js`, `series.js` and
  `Legend`. Primitives import only `Icon`. This keeps every primitive
  reusable in isolation.
- **The one asymmetry:** `layout/TopBar` and `layout/StatusStrip` read
  fixtures directly (`activeExperiment`, `currentUser`, `emulator`). When the
  API lands these become the first two consumers of a global "session" context.
- `nav.js → pages` and `App.jsx → nav.js` means the route table is generated,
  not hand-maintained.

---

## 4. Styling architecture and theming

Five plain stylesheets, no preprocessor, no CSS modules, no utility classes.

```mermaid
flowchart TB
    subgraph cascade["Import order in main.jsx (cascade order)"]
        direction TB
        t["1 · tokens.css<br/>every colour, size, space, radius, weight, duration<br/>as a CSS custom property — light + dark"]
        b["2 · base.css<br/>reset · element defaults · type scale · focus rings"]
        c["3 · components.css<br/>.panel .data-table .status-pill .btn .field .kv …"]
        ch["4 · charts.css<br/>.trace .chart-grid .plate-well .timeline-seg …"]
        p["5 · pages.css<br/>.app-shell grid · sidebar · topbar · login · a few screen grids"]
        t --> b --> c --> ch --> p
    end

    subgraph theme["Theme selection at runtime"]
        os["OS prefers-color-scheme"] --> init
        ls["localStorage 'qiq-theme'"] --> init["AppShell initialTheme()"]
        init --> state["useState(theme)"]
        toggle["TopBar moon/sun button"] --> state
        state --> attr["document.documentElement<br/>data-theme = light | dark"]
        attr --> tokens["tokens.css picks the<br/>matching colour block"]
        tokens --> all["every component re-colours<br/>with no other code"]
    end
```

**Notes**

- Only `tokens.css` contains hex colours. `grep` for `#[0-9a-f]` across
  `src/` outside that file returns nothing. That is what makes a restyle a
  one-file job.
- The dark block overrides **colour tokens only**. Layout tokens are shared,
  so the two themes cannot drift in geometry.
- Class naming is flat: block (`.status-pill`), modifier (`.is-fail`). No
  BEM double-underscores, no generated names, so a CSS-only contributor can
  find and change anything.
- Design constraints encoded in the tokens: 1px hairlines instead of shadows
  (one shadow token exists, for overlay menus only), radii of 2–3px, 13px
  body, 30px table rows, uppercase 11px micro-labels, monospace for all data
  values, amber-vs-teal chart traces.

---

## 5. Data flow — today and after the API exists

```mermaid
flowchart LR
    subgraph today["Baseline (today)"]
        f1["src/data/*.js<br/>static arrays + seeded generators"] -->|"import"| pg1["page component"]
        pg1 -->|"props (plain arrays/objects)"| pr1["primitives + charts"]
        pr1 --> dom1["DOM / SVG"]
    end

    subgraph later["After the API exists (planned)"]
        api["GET /api/…"] --> hook["data-loading hook<br/>(same shapes as the fixtures)"]
        hook --> pg2["page component<br/>(unchanged JSX)"]
        pg2 --> pr2["primitives + charts<br/>(unchanged)"]
        pr2 --> dom2["DOM / SVG"]
    end
```

**Notes**

- Each fixture file opens with a comment naming the endpoint that replaces
  it, e.g. `experiments.js → GET /api/experiments`.
- Primitives take plain data (`columns`, `rows`, `items`, `series`). None of
  them know where the data came from, so swapping fixtures for fetches does
  not touch `components/`.
- There is no client-side state store. The only state in the app is the theme
  in `AppShell`. That is intentional for a visual baseline; a store is a
  decision for when there is behaviour to hold.

---

## 6. Screen × primitive usage

Which building blocks each screen is made of (from the actual imports).

| Screen | Panel | PageHeader | DataTable | StatusPill | KeyValue | Checksum | Toolbar | Tabs | Notice | Stat | DropZone | Meter | CodeBlock | Legend | Charts |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| Overview | ● | ● | ● | ● | ● | | | | ● | ● | | ● | | | |
| Experiments | ● | ● | ● | ● | ● | | ● | ● | | | | | | | |
| Waveforms | ● | ● | ● | ● | ● | ● | ● | | ● | | | | | | |
| Ingestion | ● | ● | ● | ● | ● | ● | ● | | | | ● | | | | |
| Validation | ● | ● | ● | ● | | | | | ● | | | | | ● | RunTimeline ×2 |
| Gates | ● | ● | ● | ● | | | ● | | ● | | | | | | |
| Assays | ● | ● | ● | ● | | | | | | | | | | | |
| Analysis | ● | ● | ● | ● | ● | | | ● | ● | | | | | ● | WaveformOverlay, DriftChart ×2, PlateMap |
| Evidence | ● | ● | ● | ● | | ● | | | ● | | | | ● | | |
| Admin | ● | ● | ● | ● | ● | | | | ● | | | | | | |
| Login | | | | | | | | | | | | | | | |

`Icon` is used everywhere and omitted from the table. `EmptyState` and
`Sparkline` are provided for the next phase and not yet placed on a screen.

**Notes**

- Every screen after the first was cheaper than the one before it. Ten of
  eleven screens use the same five primitives.
- The Login screen uses only `Icon`; its layout classes live in `pages.css`.

---

## 7. Chart pipeline

The charts are hand-written SVG, not a charting library.

```mermaid
flowchart LR
    gen["data/series.js<br/>commandedWaveform()<br/>measuredWaveform()<br/>driftSeries()<br/>sparkSeries()"] -->|"[{t, v}]"| chart
    fix["data/analysis.js<br/>plateP01()<br/>data/validation.js<br/>alignmentLanes"] -->|"wells / lanes"| chart
    chart["charts/*.jsx"] --> scale["charts/scale.js<br/>linear() · extent() · ticks() · pathFrom()"]
    scale -->|"pixel coords"| svg["&lt;svg viewBox&gt;<br/>&lt;path class='trace is-measured'&gt;"]
    svg --> css["charts.css<br/>class → token colour"]
```

**Notes**

- `series.js` uses a seeded PRNG (mulberry32) so every machine draws the
  identical picture. Nothing is random between renders.
- Charts draw in a fixed `viewBox` and scale by CSS width, so they need no
  resize observer.
- Colour is never set in JSX. A path gets a class (`is-commanded`,
  `is-measured`, `is-residual`) and `charts.css` resolves it to a token, so
  charts follow the theme automatically.
- Each chart has an adjacent text caption stating what the picture shows, so
  the information is not colour-only.

---

## 8. Build and deployment paths

```mermaid
flowchart LR
    src["src/"] --> dev["npm run dev<br/>Vite dev server<br/>localhost:5173 · HMR"]
    src --> build["npm run build"]
    build --> dist["dist/<br/>index.html + hashed assets"]
    dist --> preview["npm run preview<br/>localhost:4173"]

    subgraph docker["Docker (written, NOT verified — no Docker on the authoring machine)"]
        compose["docker compose up<br/>target: dev<br/>bind-mount src, port 5173"]
        prod["docker build --target prod<br/>node:22-alpine builds dist<br/>nginx:1.27-alpine serves it"]
        nginx["nginx.conf<br/>try_files → /index.html<br/>(SPA history fallback)"]
        prod --> nginx
    end

    src -.-> compose
    src -.-> prod
```

**Notes**

- `vite.config.js` sets `host: true` so the dev server listens on `0.0.0.0`.
  That is only there so a container can publish the port; it also makes the
  dev server reachable on the LAN.
- The nginx fallback matters: without it, refreshing `/gates` in the prod
  image would 404 because the file does not exist on disk.
- `engines.node >= 22.12` in `package.json` and `.nvmrc` = `22` pin the
  runtime the baseline was verified on.

---

## 9. Screen ↔ requirement traceability

```mermaid
flowchart LR
    r1["R1 Experiment & protocol registry"] --> s1["/experiments"]
    r2["R2 Waveform-candidate registry"] --> s2["/waveforms"]
    r3["R3 Instrument & ingestion layer"] --> s3["/ingestion"]
    r4["R4 Time alignment & validation"] --> s4["/validation"]
    r5["R5 Acceptance-gate engine"] --> s5["/gates"]
    r6["R6 Biological-assay integration"] --> s6["/assays"]
    r7["R7 Analysis & visualization"] --> s7["/analysis"]
    r8["R8 Evidence-package generation"] --> s8["/evidence"]
    r9["R9 Security, reliability, quality"] --> s9["/admin"]
    r9 --> s10["/login"]
    ov["/ (Overview)"] -.->|"summarises"| s3 & s4 & s5
```

**Notes**

- The sidebar shows the requirement number (`R1`…`R9`) next to each screen
  so a reviewer can map the UI back to the sponsor's list without this document.
- The Overview is not a requirement; it is the landing page that surfaces the
  state of R3–R5 for the active experiment.

---

## 10. What is and is not implemented

| Area | Status in this folder |
|---|---|
| Visual design system (tokens, primitives, charts) | Done, themed light + dark |
| Eleven navigable screens with real URLs | Done |
| Placeholder data showing pass / warn / fail states | Done |
| Responsive down to ~1100px | Designed (grids collapse); not verified in a browser on the authoring machine |
| Any network call, auth, upload, parsing, gate evaluation | Not implemented, by design |
| Sorting, filtering, tab switching, form submission | Visual only; controls carry a tooltip saying so |
| Tests | None; there is no behaviour to test yet. The Admin screen reserves the panel where suite results will appear |
| Docker dev and prod images | Written; not executed |
