# Data and contact operations

## Add a cleaning company

Add a unique record to `cleaningCompanies` in `src/app/data/marketplace.data.json`. Use a lowercase ASCII slug, existing service/area IDs, authorized public address only, accurate verification state/date, `published=true`, and set `indexable=true` only after editorial approval. Set `isDemo=false`.

## Add a staff member

Add the staff record, reference an existing cleaning `companyId`, then add its ID to that company's `staffIds`. Do not publish a photo without permission. Do not infer experience, verification or service areas.

## Add a rental company and vehicle

Create the rental company first. Add each vehicle with its company ID, then add the vehicle ID to `vehicleIds`. Use `ON_REQUEST` when static data cannot prove current availability. Optional `pricing.daily/weekly/monthly` must be positive TRY values and should include `updatedAt`.

## Reviews and ratings

Add only genuine reviews with moderation status. Only `PUBLISHED` reviews are returned by the repository. UI/schema rating support should not be enabled until review provenance and Google eligibility are reviewed.

## WhatsApp

Public JSON contains only `whatsappEnabled`. Put the authorized E.164 digits and display name in the matching server-only map at `src/server/private/contact.config.ts`, keyed by the exact entity slug; then set `whatsappEnabled=true`. The build validator fails if the public flag has no private mapping.

## Required checks

```bash
npm run validate:data
npm test
npm run build
npm run seo:check
```

When the verified production origin is known, replace `SITE_CONFIG.origin`, update the robots sitemap URL, then run:

```bash
SITE_ORIGIN=https://example.com npm run generate:sitemap
```

On PowerShell use `$env:SITE_ORIGIN='https://example.com'` before the command.
