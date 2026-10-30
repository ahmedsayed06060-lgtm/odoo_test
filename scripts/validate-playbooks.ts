import fs from 'node:fs';
import { moduleMap } from '../src/lib/catalog';
import { playbookCategories } from '../src/lib/playbooks';
import type { Playbook } from '../src/lib/types';
const errors: string[] = [];
const fail = (m: string) => errors.push(m);
const stray = /[^\u0000-\u024f\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\u2000-\u206f\u20a0-\u20cf\ufb50-\ufdff\ufe70-\ufeff]/;
const bi = (v: any, p: string, id: string) => {
  if (!v || typeof v.en !== 'string' || typeof v.ar !== 'string' || !v.en.trim() || !v.ar.trim()) fail(`${id}: incomplete bilingual ${p}`);
  else { if (!/[\u0600-\u06ff]/.test(v.ar)) fail(`${id}: Arabic field lacks Arabic script ${p}`); if (!/[A-Za-z]/.test(v.en)) fail(`${id}: English field lacks Latin script ${p}`); }
};
const walk = (v: any, p: string, id: string) => {
  if (typeof v === 'string') { if (stray.test(v)) fail(`${id}: unexpected script in ${p}: ${v.slice(0, 90)}`); }
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, id));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${p}.${k}`, id));
};
const audit = JSON.parse(fs.readFileSync('docs/playbooks-source-audit.json', 'utf8'));
for (const kind of ['advanced', 'industry'] as const) {
  const items = JSON.parse(fs.readFileSync(`src/data/playbooks/${kind}.json`, 'utf8')) as Playbook[];
  const prefix = kind === 'advanced' ? 'ADV' : 'IND';
  if (items.length !== 100) fail(`${kind}: expected 100 items, got ${items.length}`);
  const ids = new Set<string>(); const titles = new Set<string>();
  items.forEach((p, i) => {
    const expected = `${prefix}-${String(i + 1).padStart(3, '0')}`;
    if (p.id !== expected) fail(`${kind}: expected ${expected}, got ${p.id}`);
    if (ids.has(p.id)) fail(`Duplicate ID ${p.id}`); ids.add(p.id);
    if (p.kind !== kind) fail(`${p.id}: wrong kind`);
    if (p.number !== i + 1) fail(`${p.id}: wrong number`);
    const tk = p.title.en.toLowerCase(); if (titles.has(tk)) fail(`Duplicate title ${p.id}`); titles.add(tk);
    if (!playbookCategories[p.category]) fail(`${p.id}: unknown category`);
    if (!p.modules.length || p.modules.some(m => !moduleMap[m])) fail(`${p.id}: unknown module`);
    for (const field of [p.title, p.path, p.example.setup, p.example.input, p.example.expected, p.editionNote, p.versionNote]) bi(field, 'field', p.id);
    if (p.steps.length < (kind === 'advanced' ? 4 : 5)) fail(`${p.id}: too few steps`);
    p.steps.forEach(s => bi(s, 'step', p.id));
    if (!p.sources.length) fail(`${p.id}: missing sources`);
    for (const s of p.sources) { if (!/^https:\/\/(www\.)?odoo\.com\//.test(s.url)) fail(`${p.id}: non-official source ${s.url}`); if (!s.title?.trim()) fail(`${p.id}: empty source title`); }
    if (!p.sources.some(s => s.url.includes('/page/editions'))) fail(`${p.id}: missing editions source`);
    if (p.kind === 'advanced') { bi(p.goal, 'goal', p.id); bi(p.case, 'case', p.id); if (p.checks.length < 2 || p.risks.length < 2) fail(`${p.id}: missing checks/risks`); p.checks.forEach(x => bi(x, 'check', p.id)); p.risks.forEach(x => bi(x, 'risk', p.id)); }
    else { bi(p.profile, 'profile', p.id); bi(p.challenge, 'challenge', p.id); bi(p.boundary, 'boundary', p.id); if (p.controls.length < 2 || p.kpis.length < 2) fail(`${p.id}: missing controls/kpis`); p.controls.forEach(x => bi(x, 'control', p.id)); p.kpis.forEach(x => bi(x, 'kpi', p.id)); }
    walk(p, 'playbook', p.id);
  });
  const audited = audit[kind] as { id: string }[];
  if (audited.length !== items.length || audited.some((a, i) => a.id !== items[i].id)) fail(`${kind}: source audit mismatch`);
}
const report = { advanced: 100, industry: 100, sourceAudit: 'docs/playbooks-source-audit.json', errors };
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/playbooks-validation-report.json', JSON.stringify(report, null, 2));
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Validated 100 advanced playbooks and 100 industry scenarios; bilingual fields, modules, sources, paths, and boundaries are structurally sound.');
