# Post-deployment SEO operations

## Preflight

1. Replace the `.example` origin in `SITE_CONFIG` and `robots.txt` with the verified HTTPS domain; add that hostname to Angular's `security.allowedHosts` list (never use a wildcard in production).
2. Confirm the published inventory and contact permissions are still current; pass all validation commands.
3. Generate the production sitemap and confirm it contains only canonical, indexable, non-demo URLs.
4. Check production SSR without a browser, security/CDN bot rules, 404s, 301s and canonical host behavior.
5. Run Schema.org Validator and Google Rich Results Test on representative real pages. Rich-result eligibility is not guaranteed.

## Google Search Console

1. Create/verify a Domain property using DNS.
2. Submit `/sitemap.xml`.
3. Use URL Inspection on home, both landings, one company, one staff member and one vehicle.
4. Verify rendered HTML and indexing/canonical selection.
5. Monitor Page indexing, Performance and Core Web Vitals; investigate rather than assuming every excluded URL is an error.
6. Maintain each provider's Business Profile separately; never claim it as the marketplace.

## Bing Webmaster Tools

1. Verify the site (or import the verified Search Console property).
2. Submit the sitemap and inspect representative URLs.
3. Configure an IndexNow key. Call `npm run indexnow:submit` only for real URL additions, changes or deletions; do not batch unchanged URLs repeatedly.
4. Monitor Search Performance, crawl errors and AI Performance citations/grounding queries.

## Monitoring log

For web queries record engine, query, country/device, date, landing URL, impressions/clicks/position. For AI queries record platform, exact query, date, whether cited, cited URL and a saved reference. Do not report a fake “AI rank.”

Critical cleaning queries: `Kütahya temizlikçi`, `Kütahya temizlik`, `Kütahya temizlik firması`, `Kütahya ev temizliği`.

Critical rental queries: `Kütahya araç kiralama`, `Kütahya araba kiralama`, `Kütahya oto kiralama`, `Kütahya günlük araç kiralama`, `Kütahya aylık araç kiralama`, `Kütahya kiralık araba`.
