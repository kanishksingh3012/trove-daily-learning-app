// Stand-ins for the real Notion-backed writes described in CLAUDE.md
// (pick tomorrow, queue a custom topic, create a domain, save a note edit).
// Every one of these is, in the real app, a queued write to Notion — here
// they just resolve/reject after a short delay so the pending/success/
// failure UI states are real and demoable.
//
// Failure simulation: append ?fail=1 to the URL, or flip it at runtime with
// setSimulateFailure(true) (e.g. from a dev toggle) — kept intentionally
// tiny, not a feature of its own.

const DEFAULT_DELAY_MS = 900;

let forceFailure: boolean | null = null;

export function setSimulateFailure(value: boolean | null) {
  forceFailure = value;
}

function shouldSimulateFailure(): boolean {
  if (forceFailure !== null) return forceFailure;
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("fail") === "1";
  } catch {
    return false;
  }
}

export function mockMutation<T>(value: T, delayMs: number = DEFAULT_DELAY_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSimulateFailure()) {
        reject(new Error("Simulated network failure"));
      } else {
        resolve(value);
      }
    }, delayMs);
  });
}

// --- Named mutations, matching CLAUDE.md's four Notion-bound actions ------

export async function pickTomorrowTopic(optionId: string): Promise<{ optionId: string }> {
  return mockMutation({ optionId });
}

export async function submitCustomTopic(input: {
  topicName: string;
  domainId: string;
}): Promise<{ topicName: string; domainId: string }> {
  return mockMutation(input, 1100);
}

export async function createDomain(input: {
  name: string;
  category: string;
}): Promise<{ id: string; name: string; category: string }> {
  return mockMutation({ id: `domain-${Date.now()}`, ...input });
}

export async function saveNoteEdit(input: {
  noteId: string;
  content: string;
}): Promise<{ noteId: string }> {
  return mockMutation({ noteId: input.noteId }, 700);
}

export async function saveQuickNote(input: { title: string; body: string }): Promise<{ savedAt: string }> {
  return mockMutation({ savedAt: new Date().toISOString() }, 600);
}
