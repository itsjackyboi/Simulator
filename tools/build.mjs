// Validates tools/seed.mjs, writes world-seed.json, and inlines the seed into index.html
// between the SEED markers. index.html stays fully self-contained; this is only needed
// when editing the canonical seed by hand.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as seed from './seed.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const STATS = ['political', 'economic', 'cultural', 'religious', 'racial'];
const errors = [];

const groups = Object.fromEntries(seed.groups.map(g => [g.id, g]));
const hasRef = ref => {
  const [id, stat] = ref.split('.');
  return groups[id] && typeof groups[id].stats[stat] === 'number';
};

for (const g of seed.groups) {
  for (const s of Object.keys(g.stats)) if (!STATS.includes(s)) errors.push(`${g.id}: unknown stat ${s}`);
  for (const d of g.domains) if (typeof g.stats[d] !== 'number') errors.push(`${g.id}: shown on ${d} tab but has no ${d} stat`);
}
for (const r of seed.relationships) {
  if (!hasRef(`${r.fromId}.${r.fromStat}`)) errors.push(`${r.id}: bad from ${r.fromId}.${r.fromStat}`);
  if (!hasRef(`${r.toId}.${r.toStat}`)) errors.push(`${r.id}: bad to ${r.toId}.${r.toStat}`);
}
const logit = p => Math.log(p / (1 - p));
for (const h of seed.hazards) {
  let contrib = 0;
  for (const i of h.inputs) {
    if (!hasRef(i.ref)) errors.push(`${h.id}: bad input ${i.ref}`);
    else { const [id, s] = i.ref.split('.'); contrib += i.w * (groups[id].stats[s] - 50) / 10; }
  }
  for (const e of h.event.effects) if (!hasRef(e.ref)) errors.push(`${h.id}: bad effect ${e.ref}`);
  h.base = +(logit(h.initial / 100) - contrib).toFixed(3);
}
for (const inj of seed.injectables) for (const e of inj.effects) if (!hasRef(e.ref)) errors.push(`${inj.id}: bad effect ${e.ref}`);
for (const ev of seed.events) for (const id of ev.affectedGroupIds) if (!groups[id]) errors.push(`${ev.id}: bad group ${id}`);

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

const world = {
  meta: seed.meta, groups: seed.groups, relationships: seed.relationships,
  events: seed.events, hazards: seed.hazards, injectables: seed.injectables, narration: seed.narration,
};
const json = JSON.stringify(world, null, 2);
writeFileSync(join(root, 'world-seed.json'), json + '\n');

const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const re = /(<script type="application\/json" id="world-seed">)[\s\S]*?(<\/script>)/;
if (!re.test(html)) { console.error('SEED script tag not found in index.html'); process.exit(1); }
writeFileSync(htmlPath, html.replace(re, (_, a, b) => `${a}\n${json.replace(/<\//g, '<\\/')}\n${b}`));
console.log(`OK: ${seed.groups.length} groups, ${seed.relationships.length} relationships, ${seed.hazards.length} hazards, ${seed.events.length} events, ${seed.injectables.length} injectables`);
