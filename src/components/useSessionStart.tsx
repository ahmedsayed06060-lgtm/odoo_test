import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { bank } from '../data/questions';
import { createSession } from '../lib/scoring';
import type { ExamConfig } from '../lib/types';
import { Modal } from './ui/dialog';
import { Button } from './ui/button';
export function useSessionStart(){const {state,dispatch,t}=useStore();const navigate=useNavigate();const [pending,setPending]=useState<{config:ExamConfig;index:number}|null>(null);const apply=()=>{if(!pending)return;const session=createSession(bank,pending.config,state);session.index=Math.min(pending.index,session.questionIds.length-1);dispatch({type:'active',session});setPending(null);navigate('/exam');};const start=(config:ExamConfig,index=0)=>{if(state.active&&!state.active.submittedAt)setPending({config,index});else{const session=createSession(bank,config,state);session.index=Math.min(index,Math.max(0,session.questionIds.length-1));dispatch({type:'active',session});navigate('/exam');}};const dialog=<Modal open={!!pending} onOpenChange={v=>!v&&setPending(null)} title={t('Start a new session?','بدء جلسة جديدة؟')} description={t('Your unfinished session will be replaced. Completed results and learning progress are kept.','ستستبدل جلستك غير المكتملة. تبقى النتائج المكتملة وتقدم التعلم.')}><div className="flex justify-end gap-3"><Button variant="outline" onClick={()=>setPending(null)}>{t('Keep current session','إبقاء الجلسة الحالية')}</Button><Button onClick={apply}>{t('Start new session','بدء جلسة جديدة')}</Button></div></Modal>;return {start,dialog};}
export const learningConfig=(stage=0,module=''):ExamConfig=>({mode:'learning',count:1000,duration:60,passing:70,stages:stage?[stage]:[],modules:module?[module]:[],versions:[],difficulties:[],types:[]});
