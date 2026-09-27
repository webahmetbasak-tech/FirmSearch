# Information architecture

## Domain separation

Cleaning and rental share the shell, SEO infrastructure, analytics abstraction, verification primitives and review model. They intentionally keep separate company and entity types:

```text
CleaningService → CleaningCompany → CleaningStaff
CarRental intent → RentalCompany → RentalVehicle
```

`MarketplaceRepository` isolates the UI from the JSON seed source. A future API/PostgreSQL implementation can replace it without changing page components.

## Page responsibilities

- Home: choose a vertical, explain trust model and process.
- Cleaning landing: service context, real companies/staff, selection guidance.
- Cleaning company: description, areas, verification, staff and conversion.
- Staff: expertise, company relationship, services/areas and conversion.
- Rental landing: inventory/filter context, companies/vehicles, rental guidance.
- Rental company: areas, verified delivery/corporate capabilities, fleet and conversion.
- Vehicle: specs, only real pricing/conditions, company relationship and conversion.

## Data source

`src/app/data/marketplace.data.json` is the MVP content source. The current published records are production inventory with `isDemo=false`; they are indexable and included in the sitemap. See `DATA_OPERATIONS.md` for the publication workflow.

## Future pages

Home cleaning, office cleaning, daily/monthly/long-term/corporate/airport rental and rental-price pages are not scaffolded as empty SEO pages. Add them only after the quality gate in `SEO_GEO_ARCHITECTURE.md` passes.
