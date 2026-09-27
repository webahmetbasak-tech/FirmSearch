# Kütahya SERP and competitor research

Research date: **2026-09-27**. Results are a web-search snapshot, not a guaranteed Google rank order. A text research environment cannot reliably reproduce a GPS-localized Google Local Pack; verify Maps/Local Pack manually from Kütahya before launch.

## Queries reviewed

Cleaning: `Kütahya temizlikçi`, `Kütahya temizlik`, `Kütahya temizlik şirketi`, `Kütahya ev temizliği`.

Rental: `Kütahya araç kiralama`, `Kütahya araba kiralama`, `Kütahya oto kiralama`, `Kütahya günlük araç kiralama`, `Kütahya aylık araç kiralama`, `Kütahya araç kiralama fiyatları`, `Kütahya havalimanı araç kiralama`.

## Cleaning observations

- Results mix profile directories (Bakıcı Burada, Temizlikçi Abla), quote/price marketplaces (EviTemiz, Yıkat, TrendHizmet), map/directory pages, and individual provider sites.
- Dominant page types expose a list, price estimate, or direct provider CTA. Data quality varies considerably: some pages make broad “verified” or price claims without enough visible provenance.
- Primary `temizlikçi`, `temizlik`, and `temizlik şirketi` results overlap enough to support one strong marketplace route rather than near-duplicate landings.
- Opportunity: transparent verification state, company→staff relationships, update dates, review provenance, no invented prices, and concise answers about coverage and process.

## Rental observations

- Aggregators dominate: ENUYGUN, Obilet, Yolcu360, Turna, and Miniyol present date/location search, live-looking inventory, transmission/category filters, supplier identity and prices. Local rental sites also appear, but several expose stale or incomplete fleets.
- The core variants `araç/araba/oto kiralama` share commercial inventory intent. A single canonical route is appropriate.
- Daily/monthly/price/airport queries are valuable only when a page can show different inventory, conditions, delivery capability, or current price comparisons. Repeating the main list with a changed heading would be a doorway pattern.
- Zafer Airport is the relevant regional airport signal, but no airport landing should launch until at least one listed provider explicitly confirms delivery/meeting service.

## Local opportunity and constraints

1. The defensible advantage is entity depth and freshness, not longer generic copy.
2. Collect provider-authorized photos, NAP, operating hours, service areas, conditions, fleet, price timestamps, and real reviews.
3. Encourage each real business to maintain its own Google Business Profile; the marketplace must not claim third-party profiles.
4. Seek genuine Kütahya citations/links from chambers, associations, local media and relevant partners. Do not buy or automate local-link schemes.
5. Validate Local Pack competitors, NAP consistency and provider claims manually before production publication.

## Architecture outcome

- Canonicals: `/kutahya/temizlikci` and `/kutahya/arac-kiralama`.
- HTTP 301 aliases: `/kutahya/temizlik`, `/kutahya/temizlik-sirketi`, `/kutahya/araba-kiralama`, `/kutahya/oto-kiralama`.
- Special-intent routes are intentionally absent (real 404) until their inventory gates pass.
- Competitor brand pages are intentionally absent.
