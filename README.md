# OdooPrep — Functional Mastery

A complete, local-first preparation application for **Odoo functional and implementation knowledge**. It is an independent study platform, **not an official Odoo certification exam** and not affiliated with Odoo S.A.

## What is included

- **1,000 original bilingual questions** (English/Arabic), with the requested distribution:
  - Stage 1 — Fundamentals & administration: **100**
  - Stage 2 — Core functional modules: **350**
  - Stage 3 — Advanced functional knowledge: **200**
  - Stage 4 — ERP implementation & business cases: **200**
  - Stage 5 — Cross-module scenarios & version comparisons: **150**
- Eight question formats: single choice, multiple select, true/false, scenario, business case, configuration, troubleshooting, and version comparison.
- Learning mode with optional immediate reveal and free navigation.
- Randomized practice with stage/module/version/difficulty/type filters.
- Configurable timed certification simulation with automatic grading and detailed review.
- Progress, accuracy, completion, weak-topic recommendations, readiness indicator, bookmarks, smart revision, exam history, and charts.
- Version Comparison Lab for Odoo **14–20**, grounded in official documentation and release notes.
- Full English/Arabic UI and question localization, RTL/LTR, light/dark/system themes.
- LocalStorage persistence, JSON export/import, and confirmed reset. No login, backend, or user database.

## GitHub Pages hosting

Configured website address: **https://ahmedsayed06060-lgtm.github.io/odoo_test/**

The static-hosting workflow is `.github/workflows/github-pages.yml`. It validates and builds the app, publishes the production artifact, then runs browser tests against the actual hosted website. The app uses relative asset URLs and hash routes so refreshing a learning or exam page does not produce a GitHub Pages 404.

The repository is public and GitHub Pages is configured to use **GitHub Actions**. Merging into `main` validates, builds, deploys, and tests the public site. See [deployment instructions](docs/DEPLOYMENT.md) for the workflow and setup details.

Progress is stored separately for each website origin. To move from the Arena preview to GitHub Pages, export JSON from the preview’s Settings page and import it on the hosted site.

## Run locally

```bash
npm install
npm run dev
```

The development server binds to `0.0.0.0:5173`.

```bash
npm run build      # TypeScript + production build
npm run preview    # Serve the production build

# Test the production build at its GitHub Pages-style path:
npx vite preview --host 0.0.0.0 --port 4173 --base=/odoo_test/
# In another terminal:
BASE_URL=http://localhost:4173/odoo_test/ npm run test:browser
```

## Quality checks

```bash
npm run bank:compile   # Rebuild questions.json and source audit from the authored DSL
npm run data:validate  # Structural, bilingual, source, version, and answer-arity checks
npm test               # Vitest: scoring, persistence, and bank integrity
npm run test:browser   # Playwright end-to-end flows (Linux sandbox bootstrap included)
npm run check          # Data validation + unit tests + production build
```

Browser tests cover learning, practice, simulation timing/auto-submit, filtering, bookmarks, version lab, export/import/reset, mobile RTL, and all four language/theme combinations. Screenshots are written to `artifacts/` (ignored by Git).

## Content and source policy

- Questions focus exclusively on functional knowledge, business processes, configuration, workflows, and implementation—not custom development.
- Every question includes a detailed explanation, practical example, and official Odoo reference.
- Source paths are resolved against pinned commits of the official `odoo/documentation` repository for versions 14.0–20.0; see `docs/source-audit.json`.
- Odoo 20 was released in September 2026. Odoo 14–16 are included as historical study versions, not as recommendations for new deployments.
- Feature availability can depend on edition, hosting, localization, and backports. The app surfaces this caveat rather than presenting version/edition availability as universal.
- Simulations use configurable study settings and original questions. They do not claim to reproduce confidential or official exam content.

## Repository map

- `src/data/bank/*.txt` — authored bilingual concept/question DSL.
- `scripts/compile-bank.ts` — deterministic compiler, option shuffling, source resolution.
- `src/data/bank/questions.json` — generated runtime bank.
- `src/lib/` — types, catalog, scoring, storage, global state.
- `src/pages/` — dashboard, learning, bank, exams, runner, results, progress, revision, version lab, settings.
- `docs/source-audit.json` — per-question official source references and pinned documentation commits.
- `docs/validation-report.json` — latest structural validation summary.
