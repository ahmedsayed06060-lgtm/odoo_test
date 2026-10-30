import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Provider, useStore } from './lib/store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Learning } from './pages/Learning';
import { QuestionBank } from './pages/QuestionBank';
import { Exams } from './pages/Exams';
import { ExamRunner } from './pages/ExamRunner';
import { Results } from './pages/Results';
import { ProgressPage, Revision } from './pages/Progress';
import { VersionLab } from './pages/VersionLab';
import { Settings } from './pages/Settings';
import { Card, Empty } from './components/common';
import { Button } from './components/ui/button';
import { Search } from 'lucide-react';
function ScrollReset(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[pathname]);return null;}
function NotFound(){const {t}=useStore();return <Card><Empty icon={Search} title={t('This page took a different route','سلكت هذه الصفحة طريقًا آخر')} description={t('Let’s get you back to your learning space.','لنعد بك إلى مساحة تعلّمك.')}><Button asChild><Link to="/">{t('Back to overview','العودة لنظرة عامة')}</Link></Button></Empty></Card>;}
export default function App(){return <HashRouter><Provider><ScrollReset/><Routes><Route element={<Layout/>}><Route index element={<Dashboard/>}/><Route path="learning" element={<Learning/>}/><Route path="learning/:stageId" element={<Learning/>}/><Route path="questions" element={<QuestionBank/>}/><Route path="bookmarks" element={<QuestionBank key="bookmarks" collection="bookmarks"/>}/><Route path="incorrect" element={<QuestionBank key="incorrect" collection="incorrect"/>}/><Route path="exams" element={<Exams/>}/><Route path="exam" element={<ExamRunner/>}/><Route path="results/:id" element={<Results/>}/><Route path="progress" element={<ProgressPage/>}/><Route path="revision" element={<Revision/>}/><Route path="revision/questions" element={<QuestionBank key="revision" collection="incorrect"/>}/><Route path="versions" element={<VersionLab/>}/><Route path="settings" element={<Settings/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></Provider></HashRouter>;}
