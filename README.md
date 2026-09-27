# Kütahya Yerel Marketplace

Angular 22.2 SSR marketplace for two distinct Kütahya verticals: cleaning providers/staff and car-rental companies/vehicles.

## Commands

```bash
npm install
npm run dev
npm run validate:data
npm test
npm run build
npm start
npm run seo:check
```

`npm start` serves the completed production build on `PORT` (default 4000). `npm run seo:check` starts an isolated built server and verifies response HTML, metadata, canonicals, JSON-LD, redirects, 404s, robots and sitemap.

## Architecture

- `src/app/core`: configuration, typed domain models, repositories, SEO/structured data and analytics abstraction.
- `src/app/features`: home, cleaning, rental, entity details, static pages and 404 handling.
- `src/app/data/marketplace.data.json`: config-driven MVP inventory.
- `src/server/private/contact.config.ts`: server-only WhatsApp destinations.
- `scripts`: data validation, sitemap generation, IndexNow submission and production SEO checks.
- `docs`: source-backed research, keyword/SERP analysis, architecture, data operations and post-launch SEO operations.

Current inventory contains two cleaning profiles and one car-rental provider profile. Published records are indexable, present in the sitemap and connected to server-side WhatsApp destinations. Maintain records through [DATA_OPERATIONS.md](docs/DATA_OPERATIONS.md).

## Production setup

Before deployment:

1. Replace `https://kutahya-yerel.example` in `src/app/core/config/site.config.ts` and `public/robots.txt`.
2. Add the final hostname to `security.allowedHosts` in `angular.json`.
3. Add real entities and private contacts; run every validation command.
4. Generate the sitemap with the verified origin.
5. Deploy `dist/firm-search` to a Node 20+ runtime and run `node server/server.mjs` behind HTTPS/reverse proxy.

Example Docker/VM process command:

```bash
PORT=4000 node dist/firm-search/server/server.mjs
```

See [SEO_OPS.md](docs/SEO_OPS.md) for Search Console, Bing/IndexNow, crawler and AI-visibility monitoring steps.
