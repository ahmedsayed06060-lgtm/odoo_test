import { describe, it, expect } from 'vitest';
import advanced from '../src/data/playbooks/advanced.json';
import industry from '../src/data/playbooks/industry.json';
import { moduleMap } from '../src/lib/catalog';
import { playbookCategories, playbookSearchText } from '../src/lib/playbooks';
import { freshState, validateImport } from '../src/lib/storage';
import { bank } from '../src/data/questions';
import type { Playbook } from '../src/lib/types';
const ids = new Set(bank.map(q => q.id));
const all = [...advanced, ...industry] as Playbook[];
describe('playbook library integrity', () => {
  it('contains exactly 100 advanced playbooks and 100 industry scenarios with stable IDs', () => {
    expect(advanced).toHaveLength(100); expect(industry).toHaveLength(100);
    advanced.forEach((p, i) => expect(p.id).toBe(`ADV-${String(i + 1).padStart(3, '0')}`));
    industry.forEach((p, i) => expect(p.id).toBe(`IND-${String(i + 1).padStart(3, '0')}`));
    expect(new Set(all.map(p => p.id)).size).toBe(200);
  });
  it('keeps every playbook bilingual, categorized, module-mapped, and source-referenced', () => {
    for (const p of all) {
      expect(playbookCategories[p.category]).toBeTruthy();
      expect(p.modules.length).toBeGreaterThan(0);
      for (const m of p.modules) expect(moduleMap[m]).toBeTruthy();
      for (const field of [p.title, p.path, p.example.setup, p.example.input, p.example.expected, p.editionNote, p.versionNote]) {
        expect(field.en.trim()).toBeTruthy(); expect(field.ar.trim()).toBeTruthy(); expect(/[\u0600-\u06ff]/.test(field.ar)).toBe(true);
      }
      expect(p.sources.length).toBeGreaterThan(0);
      for (const s of p.sources) expect(s.url).toMatch(/^https:\/\/(www\.)?odoo\.com\//);
      expect(p.sources.some(s => s.url.includes('/page/editions'))).toBe(true);
    }
  });
  it('gives advanced items worked examples and industry items explicit specialized-system boundaries', () => {
    for (const p of advanced as Playbook[]) { if (p.kind !== 'advanced') throw new Error('kind'); expect(p.steps.length).toBeGreaterThanOrEqual(4); expect(p.checks.length).toBeGreaterThanOrEqual(2); expect(p.risks.length).toBeGreaterThanOrEqual(2); expect(p.example.expected.en.trim()).toBeTruthy(); }
    for (const p of industry as Playbook[]) { if (p.kind !== 'industry') throw new Error('kind'); expect(p.steps.length).toBeGreaterThanOrEqual(5); expect(p.controls.length).toBeGreaterThanOrEqual(2); expect(p.kpis.length).toBeGreaterThanOrEqual(2); expect(p.boundary.en.length).toBeGreaterThan(40); expect(p.boundary.ar.length).toBeGreaterThan(40); }
  });
  it('includes the requested contracting, real-estate development, and hospital scenarios', () => {
    const text = industry.map(p => `${p.title.en} ${p.title.ar}`).join(' ').toLowerCase();
    expect(text).toContain('general contracting'); expect(text).toContain('real-estate development'); expect(text).toContain('hospital');
    expect(text).toContain('المقاولات العامة'); expect(text).toContain('التطوير العقاري'); expect(text).toContain('المستشفى');
  });
  it('searches across both languages and keeps progress separate from question bookmarks', () => {
    const hospital = industry.find(p => p.id === 'IND-011') as Playbook;
    expect(playbookSearchText(hospital, 'en')).toContain('hospital');
    expect(playbookSearchText(hospital, 'ar')).toContain('المستشفى');
    const s = freshState(); s.playbookBookmarks = ['ADV-001', 'IND-011']; s.playbookCompleted = ['ADV-001']; s.playbookNotes = { 'IND-011': 'Test note' };
    const restored = validateImport(JSON.parse(JSON.stringify(s)), ids);
    expect(restored.playbookBookmarks).toEqual(['ADV-001', 'IND-011']); expect(restored.playbookCompleted).toEqual(['ADV-001']); expect(restored.playbookNotes['IND-011']).toBe('Test note'); expect(restored.bookmarks).toEqual([]);
  });
  it('migrates older exports without playbook fields and rejects invalid playbook progress', () => {
    const older = freshState() as any; delete older.playbookBookmarks; delete older.playbookCompleted; delete older.playbookNotes;
    const migrated = validateImport(older, ids); expect(migrated.playbookBookmarks).toEqual([]); expect(migrated.playbookCompleted).toEqual([]); expect(migrated.playbookNotes).toEqual({});
    expect(() => validateImport({ ...freshState(), playbookBookmarks: ['ADV-000'] }, ids)).toThrow();
    expect(() => validateImport({ ...freshState(), playbookCompleted: ['IND-101'] }, ids)).toThrow();
    expect(() => validateImport({ ...freshState(), playbookNotes: { 'ADV-001': 'x'.repeat(2001) } }, ids)).toThrow();
  });
});
