# Qiquantum

QIQuantum Bioenergetics Experiment Data & Quality Platform.

A software layer that turns a bioenergetics exposure experiment into an
inspectable evidence chain — waveform candidate → delivered signal → biological
outcome — covering the registry, ingestion, alignment and validation,
acceptance gates, assay integration, analysis, evidence packaging and security
requirements. The platform does not make clinical or causal claims.

## Repository layout

| Path | Contents |
|---|---|
| [`Demo_site/`](Demo_site/) | **Visual baseline** of the web UI: React 19 + Vite, eleven screens, placeholder data, no behaviour yet. Start here. |
| [`Demo_site/docs/`](Demo_site/docs/) | Project specification ([SPECIFICATION.md](Demo_site/docs/SPECIFICATION.md)), architecture diagrams ([ARCHITECTURE.md](Demo_site/docs/ARCHITECTURE.md)) and user-flow diagrams ([USER_FLOWS.md](Demo_site/docs/USER_FLOWS.md)), Mermaid with notes. |

## Quick start

```bash
cd Demo_site
npm install
npm run dev      # http://localhost:5173
```

Full prerequisites, container instructions, project structure, how to restyle,
how to add a screen and the architecture sketch are in
[`Demo_site/README.md`](Demo_site/README.md).
