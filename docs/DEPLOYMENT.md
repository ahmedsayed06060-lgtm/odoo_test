# GitHub Pages deployment

## Website

Repository: `ahmedsayed06060-lgtm/odoo_test`
Configured public Pages address: `https://ahmedsayed06060-lgtm.github.io/odoo_test/`

This is the configured address, not a claim that GitHub has already enabled the site. The GitHub deployment and live-site verification must both succeed before publication is complete.

## One-time setup

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. If the repository remains private, confirm that the account supports Pages for private repositories. Otherwise, the owner can explicitly choose to make the repository public. Making it public exposes its source and authored content, but never visitors’ browser-local progress.
5. Open **Actions → Publish OdooPrep to GitHub Pages**, choose the session branch `arena/ef231288-odoo-test`, and run the workflow. Subsequent pushes to that branch publish automatically.

The current GitHub connection can push the workflow but cannot enable the repository’s Pages setting through the administration API. No personal access token is requested or stored by this project.

## Automated publication

The workflow:

- installs from the lockfile with Node.js 22;
- validates all 1,000 questions and runs the unit/integrity tests;
- builds the static Vite application;
- uploads only `dist/`, not source, local browser data, or reference caches;
- deploys that artifact to the `github-pages` environment;
- runs the full Playwright suite against the live Pages URL, including Arabic RTL, themes, exam reloads, timer expiry, and JSON backup/restore;
- keeps verification screenshots as a short-lived Actions artifact.

Official GitHub actions are pinned to reviewed commit SHAs. The workflow grants only contents-read, pages-write, and OIDC identity-write permissions. Checkout does not persist credentials.

## Static-hosting compatibility

- Vite uses relative asset URLs, so the same build works locally and under `/odoo_test/`.
- Hash routes such as `#/questions` and `#/exam` are handled entirely by the application. GitHub Pages serves the same entry page on reload; no server rewrite or misleading 404 fallback is needed.
- `public/.nojekyll` preserves the static artifact without Jekyll processing.
- Fonts, questions, explanations, and application code are served as static assets. There is no backend, authentication, or remote progress database.

## Moving browser progress

LocalStorage belongs to a website origin. The Arena preview and GitHub Pages therefore have separate progress stores. Use **Settings & data → Export JSON** on the old site, then **Import JSON** on the new site. Do not clear the old browser data until the imported attempt counts and preferences have been checked.

## Local rehearsal

```bash
npm run check
npx vite preview --host 0.0.0.0 --port 4173 --base=/odoo_test/
```

In a second terminal:

```bash
BASE_URL=http://localhost:4173/odoo_test/ npm run test:browser
```

This exercises the actual production build at the same repository subpath used by GitHub Pages.
