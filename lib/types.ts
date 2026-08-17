// Shared data shapes for the app's mock layer.
// These mirror the project's data model: Topic Name / Date / Area on the
// Learnings database, a 5-section note body, a Domains list, and the
// Selected Topic field used by both the "pick tomorrow" and Add flows.
//
// Bookmarked and read-tracking below are NOT documented in the project's
// current root CLAUDE.md — that file predates this Trove revision and the
// design handoff bundle didn't include an updated copy. These shapes are
// inferred from design_handoff_daily_learning_app/design.md's behavioural
// description and README's "State management guidance" section (a
// Bookmarked flag on each note; a per-day read-count log driving the
// activity graph). Treat the field names/shapes here as a proposal to
// confirm against the real Notion schema once it's documented, not as
// settled fact.

export type CategoryKey = "science" | "history" | "math" | "tech" | "mind" | "health" | "other";

export interface Domain {
  id: string;
  name: string;
  category: CategoryKey;
  noteCount: number;
}

export interface NoteSummary {
  id: string;
  topicName: string;
  date: string; // ISO date
  domainId: string;
}

export interface NoteTable {
  headers: string[];
  rows: string[][];
}

export interface NoteResource {
  label: string;
  url: string;
}

export interface BriefParagraph {
  pre: string;
  mid: string;
  post: string;
  highlightedByDefault?: boolean;
}

export interface NoteDetail extends NoteSummary {
  // Each paragraph carries one designated highlightable phrase (mid),
  // matching how Trove Prototype.dc.html models highlighting — a per-
  // paragraph toggle, not free text selection. Real Notion writes still
  // land as an inline <span color="yellow_bg">mid</span> within the
  // paragraph's markdown when highlighted.
  briefParagraphs: BriefParagraph[];
  conceptIndex: string[];
  detailedNotes: string;
  table: NoteTable;
  hasDiagram: boolean;
  resources: NoteResource[];
  readMinutes: number;
  blurb: string;
}

export interface TomorrowOption {
  id: string;
  topicName: string;
  domainId: string;
}

export interface Stats {
  totalNotes: number;
  domainCount: number;
  mostActiveDomain: string;
}

export interface PromptInfo {
  activePrompt: string;
  schedule: string;
}
