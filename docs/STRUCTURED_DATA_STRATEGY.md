# Structured data strategy

## Shared

- Home: `WebSite`. Do not identify the platform itself as any listed provider.
- Landing: `CollectionPage` + `ItemList`, containing only real public entities.
- All hierarchy pages: visible breadcrumbs plus `BreadcrumbList` with absolute URLs.

## Cleaning

- Company: `LocalBusiness` only for a real, non-demo company. Include `PostalAddress` only when public and verified.
- Staff: `Person`; link `worksFor` to the company `@id` when both are real.
- Future service pages may use `Service` and `areaServed` only from provider-authorized data.

## Rental

- Company: `AutoRental` for a real rental business.
- Vehicle: `Car` (or `Vehicle` where more accurate), with visible make/model/spec fields.
- `Offer` appears only when a visible real price exists. `priceCurrency=TRY`, update date in visible content, and GoodRelations `LeaseOut` distinguish rental from sale.
- Google Vehicle Listing markup is not used: Google's feature targets for-sale dealership inventory, not rental fleets.

## Reviews

Only `PUBLISHED` first-party marketplace reviews can contribute to UI averages. No review schema is emitted in the seed build. Before enabling it, verify provenance, moderation, supported Google type, self-serving review restrictions and visible parity. A `Person` rating is not emitted merely to obtain stars.

## Invariants

- stable absolute `@id` and URL;
- no undefined fields;
- no hidden price, address, verification or rating;
- no demo schema beyond page/breadcrumb context;
- serialized through `textContent` after `<` escaping;
- validation in automated SSR checks plus Schema.org/Rich Results tools after deployment.
