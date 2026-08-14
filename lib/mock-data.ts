import type { Domain, NoteDetail, NoteSummary, PromptInfo, Stats, TomorrowOption } from "./types";

// ---------------------------------------------------------------------------
// Static mock data standing in for Notion. Shapes mirror CLAUDE.md's data
// model (Topic Name / Date / Area, 5-section body, Domains list, Selected
// Topic field) but nothing here is fetched live — this file is the only
// "source of truth" for the demo build.
// ---------------------------------------------------------------------------

export const DOMAINS: Domain[] = [
  { id: "science", name: "Science & Nature", category: "science", noteCount: 14 },
  { id: "history", name: "History & Civilization", category: "history", noteCount: 9 },
  { id: "math", name: "Math & Logic", category: "math", noteCount: 6 },
  { id: "tech", name: "Technology", category: "tech", noteCount: 11 },
  { id: "mind", name: "Mind & Psychology", category: "mind", noteCount: 5 },
  { id: "health", name: "Health & Medicine", category: "health", noteCount: 7 },
];

export const TODAY_NOTE_ID = "n-today";
export const YESTERDAY_NOTE_ID = "n-yesterday";

const NOTE_SUMMARIES: NoteSummary[] = [
  { id: TODAY_NOTE_ID, topicName: "The Halting Problem", date: "2026-08-14", domainId: "math" },
  { id: YESTERDAY_NOTE_ID, topicName: "Mycorrhizal Networks", date: "2026-08-13", domainId: "science" },
  { id: "n-3", topicName: "The Byzantine Iconoclasm", date: "2026-08-12", domainId: "history" },
  { id: "n-4", topicName: "Attention Is All You Need", date: "2026-08-11", domainId: "tech" },
  { id: "n-5", topicName: "Cognitive Load Theory", date: "2026-08-10", domainId: "mind" },
  { id: "n-6", topicName: "The Krebs Cycle", date: "2026-08-09", domainId: "health" },
  { id: "n-7", topicName: "Gödel's Incompleteness Theorems", date: "2026-08-08", domainId: "math" },
  { id: "n-8", topicName: "Plate Tectonics", date: "2026-08-07", domainId: "science" },
  { id: "n-9", topicName: "The Silk Road's Middlemen", date: "2026-08-06", domainId: "history" },
  { id: "n-10", topicName: "CRDTs and Conflict-Free Sync", date: "2026-08-05", domainId: "tech" },
  { id: "n-11", topicName: "The Spacing Effect", date: "2026-08-04", domainId: "mind" },
  { id: "n-12", topicName: "CRISPR Base Editing", date: "2026-08-03", domainId: "health" },
];

export function getAllNoteSummaries(): NoteSummary[] {
  return NOTE_SUMMARIES;
}

export function getNoteSummariesForDomain(domainId: string): NoteSummary[] {
  return NOTE_SUMMARIES.filter((n) => n.domainId === domainId);
}

export function getDomain(domainId: string): Domain | undefined {
  return DOMAINS.find((d) => d.id === domainId);
}

export function getDomainForNote(note: NoteSummary): Domain | undefined {
  return getDomain(note.domainId);
}

const NOTE_DETAILS: Record<string, NoteDetail> = {
  [TODAY_NOTE_ID]: {
    id: TODAY_NOTE_ID,
    topicName: "The Halting Problem",
    date: "2026-08-14",
    domainId: "math",
    brief:
      "In 1936 Alan Turing proved that no general algorithm can decide, for every possible " +
      "program and input, whether that program will eventually halt or run forever. It's the " +
      "foundational result showing some questions about programs are <span color=\"yellow_bg\">" +
      "provably undecidable</span> — not just hard, but impossible for any algorithm to answer in general.",
    conceptIndex: ["Brief", "Concept Index", "Detailed Notes", "Resources"],
    detailedNotes:
      "The proof works by contradiction: assume a halting-decider H exists, then construct a " +
      "program that feeds itself to H and does the opposite of whatever H predicts. This creates " +
      "a paradox, so no such H can exist. The result underpins the limits of static analysis, " +
      "type checkers, and any tool that claims to catch every infinite loop ahead of time.",
    table: {
      headers: ["Concept", "Decidable?", "Example"],
      rows: [
        ["Halting", "No", "Does this program terminate?"],
        ["Type checking", "Yes (usually)", "Sound but incomplete"],
        ["Equivalence", "No", "Do two programs compute the same fn?"],
      ],
    },
    hasDiagram: true,
    resources: [
      { label: "Turing's 1936 paper (On Computable Numbers)", url: "https://example.com/turing-1936" },
      { label: "Computerphile — Halting Problem", url: "https://example.com/computerphile-halting" },
      { label: "Rice's Theorem, explained", url: "https://example.com/rices-theorem" },
    ],
  },
  [YESTERDAY_NOTE_ID]: {
    id: YESTERDAY_NOTE_ID,
    topicName: "Mycorrhizal Networks",
    date: "2026-08-13",
    domainId: "science",
    brief:
      "Underground fungal networks connect the roots of separate trees, letting them trade " +
      "carbon, nitrogen, and water — sometimes dubbed the <span color=\"yellow_bg\">\"wood wide web.\"" +
      "</span> Older, larger trees often act as hubs, subsidizing shaded seedlings.",
    conceptIndex: ["Brief", "Concept Index", "Detailed Notes", "Resources"],
    detailedNotes:
      "Mycorrhizal fungi colonize roots in exchange for sugars, then extend hyphae far beyond " +
      "what roots alone could reach. Isotope-tracing studies show carbon moving between trees of " +
      "different species along these networks, though the ecological significance of that transfer " +
      "is still debated in the literature.",
    table: {
      headers: ["Type", "Host Plants", "Exchange"],
      rows: [
        ["Ectomycorrhizal", "Conifers, oaks", "Sugars for water & N"],
        ["Arbuscular", "Most crops", "Sugars for P & micronutrients"],
        ["Ericoid", "Heathland shrubs", "Sugars for organic N"],
      ],
    },
    hasDiagram: true,
    resources: [
      { label: "Suzanne Simard — Finding the Mother Tree", url: "https://example.com/mother-tree" },
      { label: "Nature: common mycorrhizal networks", url: "https://example.com/nature-cmn" },
    ],
  },
};

// A shallow fallback so every note id in NOTE_SUMMARIES resolves to
// something readable, even without bespoke detail content above.
function fallbackDetail(summary: NoteSummary): NoteDetail {
  return {
    ...summary,
    brief:
      `A short primer on ${summary.topicName.toLowerCase()} — the core idea, why it matters, and ` +
      `where it shows up in practice. <span color="yellow_bg">Key definitions</span> are called out inline.`,
    conceptIndex: ["Brief", "Concept Index", "Detailed Notes", "Resources"],
    detailedNotes:
      `Expanding on the brief: ${summary.topicName} connects to a handful of adjacent ideas worth ` +
      "tracking. This section is where the note goes deeper than the summary above, with concrete " +
      "examples and the reasoning that ties them together.",
    table: {
      headers: ["Term", "Definition", "Why it matters"],
      rows: [
        ["Term A", "Working definition", "Sets up the rest"],
        ["Term B", "Working definition", "Common pitfall"],
        ["Term C", "Working definition", "Where it's used"],
      ],
    },
    hasDiagram: false,
    resources: [{ label: "Further reading", url: "https://example.com/further-reading" }],
  };
}

export function getNoteDetail(id: string): NoteDetail | undefined {
  if (NOTE_DETAILS[id]) return NOTE_DETAILS[id];
  const summary = NOTE_SUMMARIES.find((n) => n.id === id);
  return summary ? fallbackDetail(summary) : undefined;
}

export const TOMORROW_OPTIONS: TomorrowOption[] = [
  { id: "opt-1", topicName: "The Monty Hall Problem", domainId: "math" },
  { id: "opt-2", topicName: "Coral Bleaching", domainId: "science" },
  { id: "opt-3", topicName: "The Printing Press's Ripple Effects", domainId: "history" },
  { id: "opt-4", topicName: "Homomorphic Encryption", domainId: "tech" },
];

export const STATS: Stats = {
  totalNotes: NOTE_SUMMARIES.length,
  domainCount: DOMAINS.length,
  mostActiveDomain: "Science & Nature",
};

export const PROMPT_INFO: PromptInfo = {
  activePrompt:
    "Every morning, pick one topic from the Domains list (rotating so no domain repeats within " +
    "5 days), curate 2-4 short resources, and write a structured 5-section note — Topic, Brief, " +
    "Concept Index, Detailed Notes, Resources — to the Learnings database in Notion. Also propose " +
    "3-4 options for tomorrow and clear the Selected Topic field once consumed.",
  schedule: "Daily, 6:00 AM",
  length: "~450 words",
  destination: "Notion — Learnings",
  rotation: "No domain repeats within 5 days",
};
