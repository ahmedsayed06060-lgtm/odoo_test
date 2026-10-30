import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Search, Bookmark, CheckCircle2, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Clock3, Layers3, RotateCcw, X, ExternalLink, NotebookPen, ShieldCheck, AlertTriangle, Building2, Wrench, ListChecks, Target, Route, Info } from 'lucide-react';
import { useStore } from '../lib/store';
import { moduleMap, difficultyLabels } from '../lib/catalog';
import { playbookKinds, categoryLabel, playbookSearchText, type PlaybookKind } from '../lib/playbooks';
import type { Playbook } from '../lib/types';
import { Card, Badge, PageHeading, Select, Empty, Notice, Progress } from '../components/common';
import { Button } from '../components/ui/button';

function usePlaybookData(kind: PlaybookKind) {
  const [items, setItems] = useState<Playbook[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    setItems(null); setError(false);
    const load = kind === 'advanced' ? import('../data/playbooks/advanced.json') : import('../data/playbooks/industry.json');
    load.then(m => { if (alive) setItems(m.default as Playbook[]); }).catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [kind]);
  return { items, error };
}

export function PlaybooksIndex({ kind }: { kind: PlaybookKind }) {
  const { state, dispatch, t, tr, lang } = useStore();
  const { items, error } = usePlaybookData(kind);
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [module, setModule] = useState(params.get('module') || '');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState(params.get('status') || '');
  const [page, setPage] = useState(0);
  const meta = playbookKinds[kind];
  const pageSize = 12;
  useEffect(() => { setPage(0); }, [search, category, module, difficulty, status, kind]);
  const filtered = useMemo(() => {
    if (!items) return [];
    const q = search.trim().toLowerCase();
    return items.filter(p => (!category || p.category === category) && (!module || p.modules.includes(module)) && (!difficulty || p.difficulty === difficulty) && (!status || (status === 'bookmarked' ? state.playbookBookmarks.includes(p.id) : status === 'completed' ? state.playbookCompleted.includes(p.id) : !state.playbookCompleted.includes(p.id))) && (!q || playbookSearchText(p, lang).includes(q) || playbookSearchText(p, lang === 'en' ? 'ar' : 'en').includes(q)));
  }, [items, search, category, module, difficulty, status, state.playbookBookmarks, state.playbookCompleted, lang]);
  const categories = useMemo(() => items ? [...new Set(items.map(p => p.category))].sort() : [], [items]);
  const modules = useMemo(() => items ? [...new Set(items.flatMap(p => p.modules))].sort() : [], [items]);
  const completed = items ? items.filter(p => state.playbookCompleted.includes(p.id)).length : 0;
  const reset = () => { setSearch(''); setCategory(''); setModule(''); setDifficulty(''); setStatus(''); setParams({}); };
  const change = (fn: (v: string) => void) => (v: string) => { fn(v); setPage(0); };
  const pageItems = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const title = kind === 'advanced' ? t('100 advanced practical playbooks', '١٠٠ دليل عملي متقدم') : t('100 industry & business-activity scenarios', '١٠٠ سيناريو قطاع ونشاط تجاري');
  const description = kind === 'advanced' ? t('Step-by-step functional labs with worked examples, checks, risks, settings paths, and official sources.', 'معامل وظيفية خطوة بخطوة بأمثلة محلولة وفحوص ومخاطر ومسارات إعداد ومصادر رسمية.') : t('End-to-end Odoo operating models for real industries, with explicit boundaries for specialized systems.', 'نماذج تشغيل Odoo من البداية للنهاية لقطاعات حقيقية، مع حدود واضحة للأنظمة المتخصصة.');
  return <div>
    <PageHeading eyebrow={kind === 'advanced' ? t('PRACTICAL FUNCTIONAL LABS', 'معامل وظيفية عملية') : t('BUSINESS-ACTIVITY BLUEPRINTS', 'مخططات الأنشطة التجارية')} title={title} description={description}>
      <Badge tone="purple">{items ? `${completed}/${items.length}` : '…'} {t('completed', 'مكتمل')}</Badge>
    </PageHeading>
    <Notice>{t('These are independent educational playbooks, not official Odoo certification content. Validate configuration in a test database; edition, localization, hosting, and version can change availability.', 'هذه أدلة تعليمية مستقلة وليست محتوى شهادة Odoo رسميًا. تحقق من الإعداد في قاعدة اختبار؛ فقد تغير الطبعة والتوطين والاستضافة والإصدار التوافر.')}</Notice>
    <Card className="filter-card mt-6">
      <div className="search-box mb-5"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('Search titles, steps, examples, or IDs…', 'ابحث في العناوين أو الخطوات أو الأمثلة أو المعرفات…')} aria-label={t('Search playbooks', 'البحث في الأدلة')} />{search && <button className="icon-button" onClick={() => setSearch('')} aria-label={t('Clear search', 'مسح البحث')}><X size={15} /></button>}</div>
      <div className="playbook-filter-grid">
        <Select label={t('Category', 'الفئة')} value={category} onChange={change(setCategory)} allLabel={t('All categories', 'كل الفئات')} options={categories.map(c => ({ value: c, label: categoryLabel(c, lang) }))} />
        <Select label={t('Module', 'الوحدة')} value={module} onChange={change(setModule)} allLabel={t('All modules', 'كل الوحدات')} options={modules.map(m => ({ value: m, label: tr(moduleMap[m].name) }))} />
        <Select label={t('Difficulty', 'الصعوبة')} value={difficulty} onChange={change(setDifficulty)} allLabel={t('All levels', 'كل المستويات')} options={[{ value: 'advanced', label: tr(difficultyLabels.advanced) }, { value: 'expert', label: tr(difficultyLabels.expert) }]} />
        <Select label={t('Status', 'الحالة')} value={status} onChange={change(setStatus)} allLabel={t('All statuses', 'كل الحالات')} options={[{ value: 'bookmarked', label: t('Bookmarked', 'محفوظ') }, { value: 'completed', label: t('Completed', 'مكتمل') }, { value: 'todo', label: t('Not completed', 'غير مكتمل') }]} />
      </div>
      <div className="filter-footer"><span><Layers3 size={14} />{filtered.length} {t('matching playbooks', 'دليل مطابق')}</span><button className="text-link" onClick={reset}><RotateCcw size={13} />{t('Reset filters', 'إعادة ضبط المرشحات')}</button></div>
    </Card>
    {items && <div className="mt-5 mb-5"><Progress value={items.length ? completed / items.length * 100 : 0} label={t('Playbook completion', 'إكمال الأدلة')} /></div>}
    {error && <Card className="mt-6"><Empty icon={AlertTriangle} title={t('Could not load playbooks', 'تعذر تحميل الأدلة')} description={t('Refresh the page or try again later.', 'حدّث الصفحة أو حاول لاحقًا.')} /></Card>}
    {!items && !error && <Card className="mt-6"><Empty icon={Clock3} title={t('Loading playbooks…', 'جارٍ تحميل الأدلة…')} description={t('Preparing the practical library.', 'جارٍ تجهيز المكتبة العملية.')} /></Card>}
    {items && !filtered.length && <Card className="mt-6"><Empty icon={Search} title={t('No playbooks match', 'لا أدلة مطابقة')} description={t('Try a broader search or reset your filters.', 'جرّب بحثًا أوسع أو أعد ضبط المرشحات.')}><Button variant="outline" onClick={reset}>{t('Clear filters', 'مسح المرشحات')}</Button></Empty></Card>}
    <div className="playbook-grid mt-6">{pageItems.map(p => {
      const saved = state.playbookBookmarks.includes(p.id); const done = state.playbookCompleted.includes(p.id);
      const summary = p.kind === 'advanced' ? p.goal : p.profile;
      return <Card className={`playbook-card ${done ? 'is-complete' : ''}`} key={p.id}>
        <div className="flex justify-between items-start gap-3"><div className="flex flex-wrap gap-2"><span className="question-id">{p.id}</span><Badge tone={kind === 'advanced' ? 'purple' : 'blue'}>{categoryLabel(p.category, lang)}</Badge>{done && <Badge tone="teal"><CheckCircle2 size={11} />{t('Done', 'مكتمل')}</Badge>}</div><button className={`bookmark-button ${saved ? 'saved' : ''}`} aria-label={t(saved ? 'Remove bookmark' : 'Bookmark playbook', saved ? 'إزالة الحفظ' : 'حفظ الدليل')} aria-pressed={saved} onClick={() => dispatch({ type: 'playbookBookmark', id: p.id })}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></button></div>
        <h3><Link to={`${meta.path}/${p.id}`}>{tr(p.title)}</Link></h3>
        <p>{tr(summary)}</p>
        <div className="playbook-card-meta"><span><Clock3 size={13} />{p.minutes} {t('min', 'دقيقة')}</span><span className={`difficulty-dot difficulty-${p.difficulty}`}>{tr(difficultyLabels[p.difficulty])}</span><span>Odoo {p.versions.join('/')}</span></div>
        <div className="playbook-card-footer"><div className="playbook-module-tags">{p.modules.slice(0, 3).map(m => <span key={m}>{tr(moduleMap[m].name)}</span>)}</div><Link className="text-link" to={`${meta.path}/${p.id}`}>{t('Open', 'افتح')}<ArrowRight size={13} className="rtl-flip" /></Link></div>
      </Card>;
    })}</div>
    {filtered.length > pageSize && <div className="pagination"><span className="muted text-xs">{page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} {t('of', 'من')} {filtered.length}</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft size={15} className="rtl-flip" />{t('Previous', 'السابق')}</Button><Button variant="outline" size="sm" disabled={(page + 1) * pageSize >= filtered.length} onClick={() => setPage(p => p + 1)}>{t('Next', 'التالي')}<ChevronRight size={15} className="rtl-flip" /></Button></div></div>}
  </div>;
}

function BiList({ items, icon: Icon }: { items: { en: string; ar: string }[]; icon: typeof CheckCircle2 }) {
  const { tr } = useStore();
  return <ul className="playbook-list">{items.map((x, i) => <li key={i}><Icon size={15} /><span>{tr(x)}</span></li>)}</ul>;
}

export function PlaybookDetail({ kind }: { kind: PlaybookKind }) {
  const { id } = useParams();
  const { state, dispatch, t, tr, lang, notify } = useStore();
  const { items, error } = usePlaybookData(kind);
  const meta = playbookKinds[kind];
  const item = items?.find(p => p.id === id);
  const index = items && item ? items.findIndex(p => p.id === item.id) : -1;
  const prev = index > 0 ? items![index - 1] : null;
  const next = items && index >= 0 && index < items.length - 1 ? items[index + 1] : null;
  const [note, setNote] = useState('');
  useEffect(() => { setNote(item ? state.playbookNotes[item.id] || '' : ''); }, [item?.id]);
  if (error) return <Card><Empty icon={AlertTriangle} title={t('Could not load this playbook', 'تعذر تحميل هذا الدليل')} description={t('Return to the library and try again.', 'عد إلى المكتبة وحاول مجددًا.')}><Button asChild variant="outline"><Link to={meta.path}>{t('Back to library', 'العودة للمكتبة')}</Link></Button></Empty></Card>;
  if (!items) return <Card><Empty icon={Clock3} title={t('Loading playbook…', 'جارٍ تحميل الدليل…')} description={t('Preparing the practical guide.', 'جارٍ تجهيز الدليل العملي.')} /></Card>;
  if (!item) return <Card><Empty icon={Search} title={t('Playbook not found', 'الدليل غير موجود')} description={t('This ID does not exist in the library.', 'هذا المعرف غير موجود في المكتبة.')}><Button asChild variant="outline"><Link to={meta.path}>{t('Back to library', 'العودة للمكتبة')}</Link></Button></Empty></Card>;
  const saved = state.playbookBookmarks.includes(item.id); const done = state.playbookCompleted.includes(item.id);
  const saveNote = () => { dispatch({ type: 'playbookNote', id: item.id, note: note.slice(0, 2000) }); notify('Note saved locally.', 'تم حفظ الملاحظة محليًا.'); };
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  return <div className="playbook-detail">
    <div className="playbook-breadcrumb"><Link to={meta.path}>{t(meta.en,meta.ar)}</Link><ChevronRight size={13} className="rtl-flip" /><span>{item.id}</span></div>
    <PageHeading eyebrow={`${tr(meta.singular)} · ${categoryLabel(item.category, lang)}`} title={tr(item.title)} description={item.kind === 'advanced' ? tr(item.goal) : tr(item.profile)}>
      <Button variant={saved ? 'soft' : 'outline'} onClick={() => dispatch({ type: 'playbookBookmark', id: item.id })}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />{t(saved ? 'Saved' : 'Save', saved ? 'محفوظ' : 'حفظ')}</Button>
      <Button variant={done ? 'outline' : 'default'} onClick={() => dispatch({ type: 'playbookComplete', id: item.id })}><CheckCircle2 size={15} />{t(done ? 'Mark incomplete' : 'Mark complete', done ? 'إلغاء الإكمال' : 'وضع مكتمل')}</Button>
    </PageHeading>
    <div className="playbook-detail-meta"><Badge tone="purple">{item.id}</Badge><Badge tone="gray"><Clock3 size={11} />{item.minutes} {t('min', 'دقيقة')}</Badge><Badge tone={item.difficulty === 'expert' ? 'rose' : 'amber'}>{tr(difficultyLabels[item.difficulty])}</Badge><Badge tone="blue">Odoo {item.versions.join(' / ')}</Badge>{item.modules.map(m => <Badge key={m} tone="gray">{tr(moduleMap[m].name)}</Badge>)}</div>
    <div className="playbook-detail-grid">
      <div className="space-y-6">
        <Card className="playbook-section"><h2><Route size={17} />{t('Settings path', 'مسار الإعداد')}</h2><p className="playbook-path" dir="ltr">{tr(item.path)}</p></Card>
        {item.kind === 'advanced' ? <Card className="playbook-section"><h2><Building2 size={17} />{t('Company scenario', 'سيناريو الشركة')}</h2><p>{tr(item.case)}</p></Card> : <Card className="playbook-section"><h2><Building2 size={17} />{t('Business challenge', 'تحدي الأعمال')}</h2><p>{tr(item.challenge)}</p></Card>}
        <Card className="playbook-section"><h2><ListChecks size={17} />{t('Execution steps', 'خطوات التنفيذ')}</h2><ol className="playbook-steps">{item.steps.map((s, i) => <li key={i}><span>{i + 1}</span><p>{tr(s)}</p></li>)}</ol></Card>
        <Card className="playbook-section"><h2><Wrench size={17} />{t('Worked example', 'مثال محلول')}</h2><div className="worked-example"><div><strong>{t('Setup', 'الإعداد')}</strong><p>{tr(item.example.setup)}</p></div><div><strong>{t('Input / action', 'الإدخال / الإجراء')}</strong><p>{tr(item.example.input)}</p></div><div className="expected"><strong>{t('Expected result', 'النتيجة المتوقعة')}</strong><p>{tr(item.example.expected)}</p></div></div></Card>
        {item.kind === 'advanced' ? <>
          <Card className="playbook-section"><h2><ShieldCheck size={17} />{t('Validation checks', 'فحوص التحقق')}</h2><BiList items={item.checks} icon={CheckCircle2} /></Card>
          <Card className="playbook-section"><h2><AlertTriangle size={17} />{t('Common errors & diagnosis', 'أخطاء شائعة وتشخيص')}</h2><BiList items={item.risks} icon={AlertTriangle} /></Card>
        </> : <>
          <Card className="playbook-section"><h2><ShieldCheck size={17} />{t('Controls', 'الضوابط')}</h2><BiList items={item.controls} icon={CheckCircle2} /></Card>
          <Card className="playbook-section"><h2><Target size={17} />{t('KPIs', 'مؤشرات الأداء')}</h2><BiList items={item.kpis} icon={Target} /></Card>
          <Card className="playbook-section boundary"><h2><Info size={17} />{t('Standard Odoo vs specialized systems', 'Odoo القياسي مقابل الأنظمة المتخصصة')}</h2><p>{tr(item.boundary)}</p></Card>
        </>}
      </div>
      <aside className="space-y-6">
        <Card className="playbook-section"><h2><NotebookPen size={17} />{t('Your notes', 'ملاحظاتك')}</h2><textarea className="playbook-notes" value={note} maxLength={2000} onChange={e => setNote(e.target.value)} placeholder={t('Capture configuration decisions, test results, or questions…', 'سجل قرارات الإعداد أو نتائج الاختبار أو الأسئلة…')} aria-label={t('Playbook notes', 'ملاحظات الدليل')} /><div className="flex justify-between items-center mt-3"><span className="muted text-xs">{note.length}/2000</span><Button size="sm" variant="soft" onClick={saveNote}>{t('Save note', 'حفظ الملاحظة')}</Button></div></Card>
        <Card className="playbook-section"><h2><Info size={17} />{t('Edition & version caveats', 'تنبيهات الطبعة والإصدار')}</h2><p className="text-sm leading-7 muted">{tr(item.editionNote)}</p><p className="text-sm leading-7 muted mt-3">{tr(item.versionNote)}</p></Card>
        <Card className="playbook-section"><h2><ExternalLink size={17} />{t('Official sources', 'المصادر الرسمية')}</h2><div className="playbook-sources">{item.sources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer"><span>{s.title}</span><small>{s.version} · {s.kind === 'release' ? t('Release notes', 'ملاحظات الإصدار') : t('Documentation', 'وثائق')}</small><ExternalLink size={13} /></a>)}</div><p className="muted text-xs mt-4 leading-6">{t('Sources retrieved', 'تم استرجاع المصادر')} {item.sources[0]?.retrieved}. {t('Always verify the target release and localization.', 'تحقق دائمًا من الإصدار المستهدف والتوطين.')}</p></Card>
        <Card className="playbook-section"><h2><Layers3 size={17} />{t('Related practice', 'تدريب مرتبط')}</h2><p className="muted text-sm leading-7">{t('Use the question bank to test the underlying functional concepts.', 'استخدم بنك الأسئلة لاختبار المفاهيم الوظيفية الأساسية.')}</p><Button asChild variant="outline" className="mt-4 w-full"><Link to={`/questions?module=${item.modules[0]}`}>{t('Practice related questions', 'تدرّب على أسئلة مرتبطة')}<Arrow size={14} /></Link></Button></Card>
      </aside>
    </div>
    <div className="playbook-navigation"><Button asChild variant="outline" disabled={!prev}>{prev ? <Link to={`${meta.path}/${prev.id}`}><ChevronLeft size={15} className="rtl-flip" />{t('Previous', 'السابق')}</Link> : <span><ChevronLeft size={15} className="rtl-flip" />{t('Previous', 'السابق')}</span>}</Button><Button asChild variant="ghost"><Link to={meta.path}>{t('Back to library', 'العودة للمكتبة')}</Link></Button><Button asChild variant="outline" disabled={!next}>{next ? <Link to={`${meta.path}/${next.id}`}>{t('Next', 'التالي')}<ChevronRight size={15} className="rtl-flip" /></Link> : <span>{t('Next', 'التالي')}<ChevronRight size={15} className="rtl-flip" /></span>}</Button></div>
  </div>;
}
