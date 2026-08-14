// Shared data shapes for the app's mock layer.
// These mirror CLAUDE.md's Notion data model: Topic Name / Date / Area on the
// Learnings database, a 5-section note body, a Domains list, and the
// Selected Topic field used by both the "pick tomorrow" and Add flows.

export type CategoryKey = "science" | "history" | "math" | "tech" | "mind" | "health";

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

export interface NoteDetail extends NoteSummary {
  brief: string;
  conceptIndex: string[];
  detailedNotes: string;
  table: NoteTable;
  hasDiagram: boolean;
  resources: NoteResource[];
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
  length: string;
  destination: string;
  rotation: string;
}
