export type Lang = 'en' | 'ar';
export type Bi = { en: string; ar: string };
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type QuestionType = 'single' | 'multiple' | 'boolean' | 'scenario' | 'case' | 'configuration' | 'troubleshooting' | 'comparison';
export type Mode = 'learning' | 'practice' | 'simulation';
export interface Source { title: string; url: string; version: string; kind: 'documentation' | 'release'; retrieved: string }
export interface Option { id: string; text: Bi; correct: boolean; rationale: Bi }
export interface Question { id: string; stage: number; module: string; versions: number[]; difficulty: Difficulty; type: QuestionType; text: Bi; options: Option[]; explanation: Bi; example: Bi; sources: Source[]; topic: string }
export interface Stage { id: number; name: Bi; short: Bi; description: Bi; count: number; color: string; modules: string[] }
export interface Module { id: string; name: Bi; description: Bi }
export interface Attempt { questionId: string; selected: string[]; correct: boolean; at: number; mode: Mode }
export interface ExamConfig { mode: Mode; count: number; duration: number; passing: number; stages: number[]; modules: string[]; versions: number[]; difficulties: Difficulty[]; types: QuestionType[]; collection?: 'incorrect' | 'bookmarks' | 'smart'; title?: string }
export interface ExamSession { id: string; config: ExamConfig; questionIds: string[]; selections: Record<string,string[]>; flags: string[]; index: number; startedAt: number; deadline: number | null; submittedAt: number | null; score: number | null; attempts: Attempt[] }
export interface ProgressState { schema: 1; attempts: Attempt[]; bookmarks: string[]; revealed: string[]; exams: ExamSession[]; active: ExamSession | null; learningIndex: number; playbookBookmarks: string[]; playbookCompleted: string[]; playbookNotes: Record<string,string>; preferences: { lang: Lang; theme: 'light' | 'dark' | 'system' } }
export interface PlaybookSource { title: string; url: string; version: string; kind: 'documentation' | 'release'; retrieved: string; audit?: { commit: string; path: string } }
export interface PlaybookExample { setup: Bi; input: Bi; expected: Bi }
export interface PlaybookBase { id: string; number: number; category: string; modules: string[]; title: Bi; path: Bi; steps: Bi[]; example: PlaybookExample; sources: PlaybookSource[]; versions: number[]; editionNote: Bi; versionNote: Bi; difficulty: 'advanced' | 'expert'; minutes: number }
export interface AdvancedPlaybook extends PlaybookBase { kind: 'advanced'; goal: Bi; case: Bi; checks: Bi[]; risks: Bi[] }
export interface IndustryPlaybook extends PlaybookBase { kind: 'industry'; profile: Bi; challenge: Bi; controls: Bi[]; kpis: Bi[]; boundary: Bi }
export type Playbook = AdvancedPlaybook | IndustryPlaybook;
export interface Metric { total: number; answered: number; correct: number; incorrect: number; accuracy: number; completion: number }
