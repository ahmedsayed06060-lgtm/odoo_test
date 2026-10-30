import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, X } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Playbook } from '../lib/types';
import { Card } from './common';

export function SavedPlaybooks() {
  const { state, dispatch, t, tr } = useStore();
  const [items, setItems] = useState<Playbook[] | null>(null);
  useEffect(() => {
    let alive = true;
    Promise.all([import('../data/playbooks/advanced.json'), import('../data/playbooks/industry.json')])
      .then(([a, b]) => { if (alive) setItems([...(a.default as Playbook[]), ...(b.default as Playbook[])]); })
      .catch(() => { if (alive) setItems([]); });
    return () => { alive = false; };
  }, []);
  if (!items) return null;
  const saved = items.filter(p => state.playbookBookmarks.includes(p.id));
  if (!saved.length) return null;
  return <Card className="mt-6 p-6"><div className="card-heading"><div><h2 className="section-title">{t('Saved playbooks', 'الأدلة المحفوظة')}</h2><p className="section-subtitle">{t('Practical guides you bookmarked for later.', 'أدلة عملية حفظتها للرجوع إليها لاحقًا.')}</p></div><Bookmark size={18} className="muted" /></div><div className="saved-playbook-list">{saved.map(p => <div key={p.id}><span className="question-id">{p.id}</span><Link to={`${p.kind === 'advanced' ? '/advanced' : '/industries'}/${p.id}`}>{tr(p.title)}</Link><button className="icon-button" aria-label={t('Remove bookmark', 'إزالة الحفظ')} onClick={() => dispatch({ type: 'playbookBookmark', id: p.id })}><X size={15} /></button></div>)}</div></Card>;
}
