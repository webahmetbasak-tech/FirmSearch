import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const data = JSON.parse(await readFile(resolve(root, 'src/app/data/marketplace.data.json'), 'utf8'));
const contacts = JSON.parse(await readFile(resolve(root, 'src/server/private/contact.data.json'), 'utf8'));
const contactSlugs = new Set(Object.values(contacts).flatMap((group) => Object.keys(group)));
const errors = [];
const entityGroups = ['cleaningCompanies', 'cleaningStaff', 'rentalCompanies', 'rentalVehicles'];
const allEntities = entityGroups.flatMap((group) => data[group].map((item) => ({ ...item, group })));

function unique(values, label) {
  const seen = new Set();
  for (const value of values) { if (seen.has(value)) errors.push(`Duplicate ${label}: ${value}`); seen.add(value); }
}
function assert(condition, message) { if (!condition) errors.push(message); }

unique(allEntities.map((item) => item.id), 'entity id');
for (const group of entityGroups) unique(data[group].map((item) => item.slug), `${group} slug`);
unique(data.areas.map((item) => item.id), 'area id');
unique(data.cleaningServices.map((item) => item.id), 'cleaning service id');
unique(data.reviews.map((item) => item.id), 'review id');

const areaIds = new Set(data.areas.map((item) => item.id));
const serviceIds = new Set(data.cleaningServices.map((item) => item.id));
const cleaningCompanyIds = new Set(data.cleaningCompanies.map((item) => item.id));
const staffIds = new Set(data.cleaningStaff.map((item) => item.id));
const rentalCompanyIds = new Set(data.rentalCompanies.map((item) => item.id));
const vehicleIds = new Set(data.rentalVehicles.map((item) => item.id));
const entityIds = new Set(allEntities.map((item) => item.id));

for (const item of allEntities) {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug), `Invalid slug: ${item.slug}`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(item.updatedAt), `Invalid updatedAt: ${item.id}`);
  if (item.isDemo) assert(!item.indexable, `Demo entity cannot be indexable: ${item.id}`);
  if (item.indexable) { assert(item.published, `Indexable entity must be published: ${item.id}`); assert(!item.isDemo, `Indexable entity cannot be demo: ${item.id}`); }
  for (const areaId of item.serviceAreaIds ?? []) assert(areaIds.has(areaId), `Unknown area ${areaId} on ${item.id}`);
  if (item.whatsappEnabled) assert(contactSlugs.has(item.slug), `Missing private contact mapping: ${item.slug}`);
}
for (const company of data.cleaningCompanies) { for (const id of company.serviceIds) assert(serviceIds.has(id), `Unknown service ${id} on ${company.id}`); for (const id of company.staffIds) assert(staffIds.has(id), `Orphan staff reference ${id}`); }
for (const person of data.cleaningStaff) { assert(cleaningCompanyIds.has(person.companyId), `Missing cleaning company for ${person.id}`); for (const id of person.serviceIds) assert(serviceIds.has(id), `Unknown service ${id} on ${person.id}`); }
for (const company of data.rentalCompanies) for (const id of company.vehicleIds) assert(vehicleIds.has(id), `Orphan vehicle reference ${id}`);
for (const vehicle of data.rentalVehicles) { assert(rentalCompanyIds.has(vehicle.companyId), `Missing rental company for ${vehicle.id}`); if (vehicle.pricing) for (const key of ['daily','weekly','monthly']) if (vehicle.pricing[key] !== undefined) assert(Number.isFinite(vehicle.pricing[key]) && vehicle.pricing[key] > 0, `Invalid ${key} price on ${vehicle.id}`); }
for (const review of data.reviews) { assert(entityIds.has(review.entityId), `Review ${review.id} has unknown entity`); assert(Number.isFinite(review.rating) && review.rating >= 1 && review.rating <= 5, `Invalid rating on ${review.id}`); assert(!Number.isNaN(Date.parse(review.createdAt)), `Invalid review date on ${review.id}`); }

if (errors.length) { console.error(`Data validation failed (${errors.length}):\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log(`Data validation passed: ${allEntities.length} entities, ${data.reviews.length} reviews, ${allEntities.filter((item) => item.indexable).length} indexable.`);
