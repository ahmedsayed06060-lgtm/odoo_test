# GitHub Pages deployment

## Website

Repository: `ahmedsayed06060-lgtm/odoo_test`
Configured public Pages address: `https://ahmedsayed06060-lgtm.github.io/odoo_test/`

GitHub Pages is enabled at this address. A successful GitHub deployment and live-site verification are required before the website is available to visitors.

## Repository configuration

The owner has made the repository public and selected **Settings → Pages → Build and deployment → Source → GitHub Actions**. GitHub reports the Pages source as `workflow` and the site as public. HTTPS is enforced.

Publication happens from `main`, which is the branch allowed by the `github-pages` environment. Merge reviewed changes into `main` to publish automatically. An owner can also open **Actions → Publish OdooPrep to GitHub Pages**, choose `main`, and select **Run workflow**. Work on feature/session branches does not overwrite the public production site.

For a different repository or account, repeat the visibility and Pages setup and update the workflow’s live-test URL and Vite preview subpath to match that repository. No personal access token is requested or stored by this project; the workflow uses GitHub’s short-lived, permission-scoped token.

## Automated publication

The workflow:

- installs from the lockfile with Node.js 22;
- validates all 1,000 questions and runs the unit/integrity tests;
- builds the static Vite application;
- uploads only `dist/`, not source, local browser data, or reference caches;
- deploys that artifact to the `github-pages` environment;
- runs the full Playwright suite against the live Pages URL, including Arabic RTL with the Cairo font, English Inter typography, themes, exam reloads, timer expiry, and JSON backup/restore;
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
