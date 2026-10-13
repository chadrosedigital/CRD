# Chad Rose Digital

Complete source for the four-page Chad Rose Digital website: Home, How it works, Pricing and Contact. Includes the supplied CR Digital logo, black/white/gold design, desktop monitor hero and subtle 3D scroll effects.

## Run locally

No Node packages or installation step are required. From the repository root:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000 in your browser.

## Edit and rebuild

- `src/build.py`: shared page templates and content. Requires Python 3.12 or newer.
- `dist/site.css`: base layout and responsive styles.
- `dist/prestige.css`: black/white/gold branding and monitor styling.
- `dist/site.js`: scroll animation, mobile menu and enquiry interactions.
- `dist/assets/crd-logo.png`: optimized display logo.
- `src/assets/crd-logo-original.png`: original supplied logo.
- `.21st/`: design notes and decisions.
- `SOURCES.md`: design references and provenance.

After changing the templates, regenerate the HTML:

```sh
python3 src/build.py
```

Commit the generated `dist/` files along with the source. The CSS, JavaScript and image assets are maintained directly and retained during HTML generation.

## Put this project on GitHub

1. Extract this ZIP.
2. Create an empty GitHub repository. Choose private if you want the source kept private.
3. Upload the contents of the `chad-rose-digital` folder to the repository root, including dot folders. Alternatively, from the extracted folder:

```sh
git init
git add .
git commit -m "Add Chad Rose Digital website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the URL shown by GitHub.

## Hosting

Publish the `dist/` directory with any static web host. All site navigation and asset links are relative, so the website also works under a repository subpath.

An optional **manual** GitHub Pages workflow is included. To use it, configure Settings → Pages → Source → GitHub Actions, then run **Deploy website to GitHub Pages** from the Actions tab. This serves the checked-in `dist/` output; rebuild and commit HTML first if you change templates. The workflow does not run automatically on push. GitHub Pages is separate from the existing Sites deployment and has its own access settings and plan requirements.

Workflow references: [GitHub's official static Pages workflow](https://github.com/actions/starter-workflows/blob/main/pages/static.yml).

`.openai/hosting.json` retains the original Sites project binding. It is not used by GitHub Pages. GitHub does not inherit that project's owner-private access settings. No access tokens or Git credentials are included in this archive.

## Contact form and external resources

The contact form prepares a `mailto:` enquiry to chadrosedigital@gmail.com. Visitors review and send it through their email app; the site has no backend email service or database. A copy-message fallback is provided.

Fonts load from Google Fonts (DM Sans and DM Serif Display). Scroll effects respect reduced-motion preferences. Branding and source provenance are documented in `SOURCES.md`.

## Export

Exported on 13 October 2026 from the published source commit `3d20828bb2935b0f411b3d17b8de70ca8b16024e`. Repository history and local runtime files are omitted. This archive contains the complete editable website and ready-to-host output.
