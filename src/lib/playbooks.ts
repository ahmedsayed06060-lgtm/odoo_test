import type { Bi, Playbook } from './types';
export const playbookCategories: Record<string, Bi> = {
  accounting: { en: 'Accounting & Finance', ar: 'المحاسبة والمالية' },
  inventory: { en: 'Inventory & Supply Chain', ar: 'المخزون وسلسلة الإمداد' },
  manufacturing: { en: 'Manufacturing & Operations', ar: 'التصنيع والعمليات' },
  commercial: { en: 'Sales, POS & Commerce', ar: 'المبيعات ونقاط البيع والتجارة' },
  services: { en: 'Services & HR', ar: 'الخدمات والموارد البشرية' },
  data: { en: 'Data, Studio & Automation', ar: 'البيانات وStudio والأتمتة' },
  implementation: { en: 'Implementation & Go-Live', ar: 'التنفيذ والإطلاق' },
  construction: { en: 'Construction & Real Estate', ar: 'المقاولات والعقارات' },
  healthcare: { en: 'Healthcare & Life Sciences', ar: 'الرعاية الصحية وعلوم الحياة' },
  education: { en: 'Education & Training', ar: 'التعليم والتدريب' },
  hospitality: { en: 'Hospitality & Events', ar: 'الضيافة والفعاليات' },
  retail: { en: 'Retail & Consumer Goods', ar: 'التجزئة والسلع الاستهلاكية' },
  logistics: { en: 'Logistics & Transport', ar: 'اللوجستيات والنقل' },
  industrial: { en: 'Industrial & Process Manufacturing', ar: 'الصناعة والتصنيع العملياتي' },
  agriculture: { en: 'Agriculture & Food', ar: 'الزراعة والغذاء' },
  professional: { en: 'Professional Services', ar: 'الخدمات المهنية' },
  public: { en: 'Public Sector & Nonprofit', ar: 'القطاع العام وغير الربحي' },
};
export const playbookKinds = {
  advanced: { en: 'Advanced playbooks', ar: 'أدلة عملية متقدمة', singular: { en: 'Advanced playbook', ar: 'دليل عملي متقدم' }, path: '/advanced', prefix: 'ADV' },
  industry: { en: 'Industry scenarios', ar: 'سيناريوهات القطاعات', singular: { en: 'Industry scenario', ar: 'سيناريو قطاع' }, path: '/industries', prefix: 'IND' },
} as const;
export type PlaybookKind = keyof typeof playbookKinds;
export const categoryLabel = (category: string, lang: 'en' | 'ar') => playbookCategories[category]?.[lang] ?? category;
export const playbookSearchText = (p: Playbook, lang: 'en' | 'ar') => {
  const parts: string[] = [p.id, p.title[lang], p.path[lang], categoryLabel(p.category, lang), ...p.steps.map(s => s[lang]), p.example.setup[lang], p.example.input[lang], p.example.expected[lang]];
  if (p.kind === 'advanced') parts.push(p.goal[lang], p.case[lang], ...p.checks.map(s => s[lang]), ...p.risks.map(s => s[lang]));
  else parts.push(p.profile[lang], p.challenge[lang], p.boundary[lang], ...p.controls.map(s => s[lang]), ...p.kpis.map(s => s[lang]));
  return parts.join(' ').toLowerCase();
};
export const playbookProgress = (ids: string[], completed: string[]) => ({ total: ids.length, completed: ids.filter(id => completed.includes(id)).length });
