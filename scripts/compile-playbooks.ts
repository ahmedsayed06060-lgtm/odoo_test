import fs from 'node:fs';
import { moduleMap } from '../src/lib/catalog';

const dir = 'src/data/playbooks';
const sources = JSON.parse(fs.readFileSync(`${dir}/sources.json`, 'utf8')) as Record<string, string>;
const commit = 'c4faee6405fc0918330848c2e53be08748e0766d';
const retrieved = '2026-10-30';
const categories = new Set(['accounting','inventory','manufacturing','commercial','services','data','implementation','construction','healthcare','education','hospitality','retail','logistics','industrial','agriculture','professional','public']);
const enterpriseModules = new Set(['accounting','advanced-accounting','valuation','budget','analytic','workflows','quality','maintenance','helpdesk','fieldservice','documents','subscriptions','rental','automation','payroll']);
const bi = (v: unknown, p: string): { en: string; ar: string } => {
  if (!Array.isArray(v) || v.length !== 2 || typeof v[0] !== 'string' || typeof v[1] !== 'string' || !v[0].trim() || !v[1].trim()) throw Error(`Invalid bilingual ${p}`);
  if (!/[\u0600-\u06ff]/.test(v[1])) throw Error(`Arabic script missing ${p}`);
  if (!/[A-Za-z]/.test(v[0])) throw Error(`Latin script missing ${p}`);
  return { en: v[0], ar: v[1] };
};
const list = (v: unknown, p: string, min: number) => {
  if (!Array.isArray(v) || v.length < min) throw Error(`Invalid list ${p}`);
  return v.map((x, i) => bi(x, `${p}[${i}]`));
};
const resolve = (key: string) => {
  const s = sources[key];
  if (!s) throw Error(`Missing source ${key}`);
  if (s.startsWith('https:')) {
    const title = key.startsWith('r') ? `Odoo ${key.slice(1)} — Official release notes` : key === 'implementation' ? 'Odoo — Implementation Methodology' : key === 'editions' ? 'Odoo — Community vs Enterprise' : 'Odoo — Official documentation';
    return { title, url: s, version: key.startsWith('r') ? `${key.slice(1)}.0` : 'All', kind: s.includes('release-notes') ? 'release' : 'documentation', retrieved };
  }
  const url = `https://www.odoo.com/documentation/20.0/${s}.html`;
  return { title: `Odoo 20 — ${s.split('/').pop()!.replaceAll('_', ' ')}`, url, version: '20.0', kind: 'documentation', retrieved, audit: { commit, path: `/content/applications/${s}.rst` } };
};
const versionOverrides: Record<number, [string, string]> = {
  20: ['E-invoicing flows depend on the country localization and authority environment. Egypt ETA support is documented from Odoo 15 onward; verify the current localization package and legal effective date.', 'تعتمد تدفقات الفوترة الإلكترونية على توطين البلد وبيئة الهيئة. دعم مصلحة الضرائب المصرية موثق من Odoo 15 فصاعدًا؛ تحقق من حزمة التوطين الحالية وتاريخ السريان القانوني.'],
  39: ['Inventory valuation closing/backdating behavior changed in Odoo 19. Do not assume the same lock-date and valuation-close workflow exists in Odoo 18.', 'تغير سلوك إقفال تقييم المخزون/التاريخ الرجعي في Odoo 19. لا تفترض وجود نفس تدفق تواريخ الإقفال وإقفال التقييم في Odoo 18.'],
  55: ['Continuous production concepts are specific to Odoo 20 release notes. Odoo 18/19 work-order flows may not support the same partial-output behavior.', 'مفاهيم الإنتاج المستمر خاصة بملاحظات إصدار Odoo 20. قد لا تدعم تدفقات أوامر العمل في Odoo 18/19 نفس سلوك المخرج الجزئي.'],
  74: ['In Odoo 20, Field Service is activated inside Planning. Odoo 18/19 use a separate Field Service app and different menus.', 'في Odoo 20 تُفعّل الخدمة الميدانية داخل التخطيط. يستخدم Odoo 18/19 تطبيق خدمة ميدانية منفصلًا وقوائم مختلفة.'],
  78: ['Odoo 20 removes the old Payroll work-entry and Planning-Payroll integration. Do not assume approved planning shifts automatically create payroll work entries.', 'يزيل Odoo 20 تكامل الرواتب القديم لقيود العمل والتخطيط-الرواتب. لا تفترض أن ورديات التخطيط المعتمدة تنشئ قيود عمل رواتب تلقائيًا.'],
  88: ['Intercompany counterpart automation and clearing-account configuration are version-sensitive. Verify the exact settings in the target Odoo release before enabling automation.', 'أتمتة المستندات البينية المقابلة وإعداد حساب المقاصة حساسة للإصدار. تحقق من الإعدادات الدقيقة في إصدار Odoo المستهدف قبل تفعيل الأتمتة.'],
  90: ['Data inalterability, secure posted entries, and lock-date behavior depend on edition, localization, and release. Verify the legal requirement and Odoo version before relying on hashing.', 'تعتمد عدم قابلية البيانات للتغيير وتأمين القيود المرحلة وتواريخ الإقفال على الطبعة والتوطين والإصدار. تحقق من المتطلب القانوني وإصدار Odoo قبل الاعتماد على التجزئة.'],
  98: ['Country localization and e-invoicing credentials change with legal effective dates. The playbook uses Odoo 20 documentation; verify the localization package for your exact release.', 'يتغير التوطين المحلي وبيانات الفوترة الإلكترونية بتواريخ السريان القانونية. يستخدم الدليل وثائق Odoo 20؛ تحقق من حزمة التوطين لإصدارك الدقيق.'],
};
function compile(kind: 'advanced' | 'industry', prefix: 'ADV' | 'IND') {
  const files = fs.readdirSync(`${dir}/${kind}`).filter(f => f.endsWith('.jsonl')).sort();
  const items: any[] = []; const audit: any[] = []; const seen = new Set<number>(); const titles = new Set<string>();
  for (const f of files) {
    for (const line of fs.readFileSync(`${dir}/${kind}/${f}`, 'utf8').split('\n')) {
      if (!line.trim() || line.startsWith('#')) continue;
      const r = JSON.parse(line);
      if (seen.has(r.n)) throw Error(`Duplicate number ${r.n}`); seen.add(r.n);
      if (!categories.has(r.cat)) throw Error(`Unknown category ${r.cat}`);
      if (!Array.isArray(r.mods) || !r.mods.length || r.mods.some((m: string) => !moduleMap[m])) throw Error(`Unknown module in ${r.n}`);
      const title = bi(r.title, `title ${r.n}`); const tk = title.en.toLowerCase();
      if (titles.has(tk)) throw Error(`Duplicate title ${title.en}`); titles.add(tk);
      const srcKeys = [...new Set([...(r.src as string[]), 'editions'])];
      const src = srcKeys.map(resolve);
      const example = { setup: bi(r.example[0], `example.setup ${r.n}`), input: bi(r.example[1], `example.input ${r.n}`), expected: bi(r.example[2], `example.expected ${r.n}`) };
      const usedEnterprise = r.mods.filter((m: string) => enterpriseModules.has(m)).map((m: string) => moduleMap[m].name.en);
      const editionNote = usedEnterprise.length
        ? { en: `This playbook uses capabilities that may require Enterprise: ${usedEnterprise.join(', ')}. Community/Invoicing may not include the same depth. Verify the official editions comparison and your subscription before design.`, ar: `يستخدم هذا الدليل قدرات قد تتطلب Enterprise: ${usedEnterprise.join(', ')}. قد لا تتضمن Community/الفوترة نفس العمق. تحقق من مقارنة الطبعات الرسمية واشتراكك قبل التصميم.` }
        : { en: 'Core operational apps may be available in Community, but advanced features, integrations, and hosting options can require Enterprise. Verify the official editions comparison for your target release.', ar: 'قد تتوافر التطبيقات التشغيلية الأساسية في Community، لكن الميزات المتقدمة والتكاملات وخيارات الاستضافة قد تتطلب Enterprise. تحقق من مقارنة الطبعات الرسمية لإصدارك المستهدف.' };
      const override = kind === 'advanced' ? versionOverrides[r.n] : undefined;
      const versionNote = override ? { en: override[0], ar: override[1] } : { en: 'Reference workflow is documented against Odoo 20. Menus, feature availability, and edition limits can differ in Odoo 18/19; validate in a test database before production.', ar: 'تدفق العمل المرجعي موثق مقابل Odoo 20. قد تختلف القوائم وتوافر الميزات وحدود الطبعة في Odoo 18/19؛ تحقق في قاعدة اختبار قبل الإنتاج.' };
      const base = { kind, id: `${prefix}-${String(r.n).padStart(3, '0')}`, number: r.n, category: r.cat, modules: r.mods, title, path: bi(r.path, `path ${r.n}`), steps: list(r.steps, `steps ${r.n}`, kind === 'advanced' ? 4 : 5), example, sources: src, versions: [20], editionNote, versionNote, difficulty: r.n % 5 === 0 ? 'expert' : 'advanced', minutes: kind === 'advanced' ? 15 : 25 };
      if (kind === 'advanced') items.push({ ...base, goal: bi(r.goal, 'goal'), case: bi(r.case, 'case'), checks: list(r.checks, 'checks', 2), risks: list(r.risks, 'risks', 2) });
      else items.push({ ...base, profile: bi(r.profile, 'profile'), challenge: bi(r.challenge, 'challenge'), controls: list(r.controls, 'controls', 2), kpis: list(r.kpis, 'kpis', 2), boundary: bi(r.boundary, 'boundary') });
      audit.push({ id: base.id, sources: src });
    }
  }
  items.sort((a, b) => a.number - b.number);
  if (items.length !== 100) throw Error(`${kind} count ${items.length}`);
  for (let i = 1; i <= 100; i++) if (!seen.has(i)) throw Error(`Missing ${kind} ${i}`);
  fs.writeFileSync(`${dir}/${kind}.json`, JSON.stringify(items));
  return audit;
}
const audit = { retrieved, officialDocumentationRepository: 'https://github.com/odoo/documentation', commit, advanced: compile('advanced', 'ADV'), industry: compile('industry', 'IND') };
fs.writeFileSync('docs/playbooks-source-audit.json', JSON.stringify(audit, null, 2));
console.log('Compiled 100 advanced playbooks and 100 industry scenarios.');
