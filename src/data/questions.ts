import data from './bank/questions.json';
import type { Question } from '../lib/types';
export const bank = data as unknown as Question[];
export const questionMap = new Map(bank.map(q => [q.id, q]));
export const bankVersion = '1.0.0';
export const bankReviewed = '2026-10-30';
