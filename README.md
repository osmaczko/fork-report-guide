# Fork report guide

The developer guide to logos-chat's fork report: how it works, how to run it, how to read it, and the
simulations. Built with [Astro Starlight](https://starlight.astro.build); the pages are Markdown in
`src/content/docs/`, and a ```` ```mermaid ```` block is drawn as a diagram.

```sh
npm ci
npm run dev        # http://localhost:4321/
npm run build      # into dist/
```

A push to `main` publishes the site to GitHub Pages through `.github/workflows/deploy.yml`; the repository's
Pages source must be set to GitHub Actions.
