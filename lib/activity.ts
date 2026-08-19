"use client";

// Bookmarks + read-tracking shared store.
//
// Schema note: neither is documented in the project's current CLAUDE.md —
// see the comment at the top of lib/types.ts. Modelled here as two
// independent concerns per design.md: bookmarking is "save for later" and
// never touches the activity graph; "I have read this" is a one-time
// per-note lock that both marks the note read AND increments today's cell
// in the activity graph. In the real app both would be queued Notion
// writes (a Bookmarked checkbox; a read-count log, or a rollup over a
// "read at" timestamp per note) — this is an in-memory stand-in, reset on
// reload, matching every other piece of mutable mock state in this app.

import { useSyncExternalStore } from "react";

// Local Y-M-D key — deliberately not toISOString(), which converts to UTC
// and can shift the date by the viewer's timezone offset (this exact bug
// is called out in the prototype's source).
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Seed data — a small, internally-consistent read history for the mock
// notes in lib/mock-data.ts (unlike the prototype's illustrative all-year
// seed, this only backdates activity that lines up with real note dates
// here, plus a little extra density so the graph reads as non-trivial).
const READ_LOG_SEED: Record<string, number> = {
  "2026-08-03": 1,
  "2026-08-04": 1,
  "2026-08-05": 2,
  "2026-08-06": 1,
  "2026-08-07": 1,
  "2026-08-08": 3,
  "2026-08-09": 1,
  "2026-08-10": 1,
  "2026-08-11": 2,
  "2026-08-12": 1,
  "2026-07-22": 1,
  "2026-07-15": 2,
  "2026-07-08": 1,
  "2026-07-01": 2,
  "2026-06-30": 1,
  "2026-06-24": 1,
  "2026-06-17": 2,
  "2026-06-10": 1,
  "2026-06-03": 1,
  "2026-05-27": 2,
  "2026-05-20": 1,
  "2026-05-13": 1,
  "2026-05-06": 2,
  "2026-04-29": 1,
  "2026-04-22": 1,
  "2026-04-15": 2,
  "2026-04-08": 1,
  "2026-04-01": 1,
  "2026-03-25": 2,
  "2026-03-18": 1,
  "2026-03-11": 1,
  "2026-03-04": 2,
  "2026-02-25": 1,
  "2026-02-18": 1,
  "2026-02-11": 2,
  "2026-02-04": 1,
  "2026-01-28": 1,
  "2026-01-21": 2,
  "2026-01-14": 1,
  "2026-01-07": 1,
};

// Notes already marked read (locks the "I have read this" button) —
// everything except today's and yesterday's note, so the demo always has
// something left to mark.
const READ_NOTE_SEED = new Set(["n-3", "n-4", "n-5", "n-6", "n-7", "n-8", "n-9", "n-10", "n-11", "n-12"]);

const BOOKMARKED_SEED = new Set(["n-yesterday"]);

let readLog: Record<string, number> = { ...READ_LOG_SEED };
let readNoteIds = new Set(READ_NOTE_SEED);
let bookmarkedNoteIds = new Set(BOOKMARKED_SEED);

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function isNoteRead(noteId: string): boolean {
  return readNoteIds.has(noteId);
}

export function isBookmarked(noteId: string): boolean {
  return bookmarkedNoteIds.has(noteId);
}

/** Locks the note as read and adds one to today's activity-graph cell. Idempotent. */
export function markNoteRead(noteId: string) {
  if (readNoteIds.has(noteId)) return;
  readNoteIds = new Set(readNoteIds).add(noteId);
  const key = dateKey(new Date());
  readLog = { ...readLog, [key]: (readLog[key] || 0) + 1 };
  emit();
}

// Cached array form of bookmarkedNoteIds — useSyncExternalStore requires a
// referentially-stable snapshot when nothing changed, so this is only
// recomputed inside toggleBookmark, never on every getBookmarkedIds() call.
let bookmarkedIdsCache = Array.from(bookmarkedNoteIds);

export function toggleBookmark(noteId: string): boolean {
  const next = new Set(bookmarkedNoteIds);
  const nowOn = !next.has(noteId);
  if (nowOn) next.add(noteId);
  else next.delete(noteId);
  bookmarkedNoteIds = next;
  bookmarkedIdsCache = Array.from(next);
  emit();
  return nowOn;
}

export function getBookmarkedIds(): string[] {
  return bookmarkedIdsCache;
}

export function getReadLog(): Record<string, number> {
  return readLog;
}

function subscribeAndGetSnapshot<T>(getSnapshot: () => T) {
  return () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const useIsNoteRead = (noteId: string) =>
  useSyncExternalStore(subscribe, () => isNoteRead(noteId), () => READ_NOTE_SEED.has(noteId));

export const useIsBookmarked = (noteId: string) =>
  useSyncExternalStore(subscribe, () => isBookmarked(noteId), () => BOOKMARKED_SEED.has(noteId));

export const useReadLog = subscribeAndGetSnapshot(getReadLog);
export const useBookmarkedIds = subscribeAndGetSnapshot(getBookmarkedIds);

// --- Activity graph geometry ------------------------------------------------
// Ported from Trove Prototype.dc.html's bucket()/buildActivity() — an
// all-time, GitHub-contribution-style calendar, one column per week.

export function activityBucket(count: number): string {
  if (!count) return "var(--well)";
  const pct = count >= 6 ? 100 : count >= 4 ? 80 : count >= 2 ? 55 : 28;
  return `color-mix(in srgb, var(--accent) ${pct}%, var(--well))`;
}

export interface ActivityDay {
  bg: string;
  title: string;
}
export interface ActivityWeek {
  days: ActivityDay[];
  monthLabel: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildActivity(log: Record<string, number>, today: Date): { weeks: ActivityWeek[]; total: number } {
  const start = new Date(today.getFullYear(), 0, 1);
  start.setDate(start.getDate() - start.getDay());
  const weeks: ActivityWeek[] = [];
  let cur = new Date(start);
  let lastMonth = -1;
  let total = 0;

  while (cur <= today) {
    const days: ActivityDay[] = [];
    // Only a week that actually contains the 1st of a month gets labelled —
    // reading whichever month the week's Sunday happened to fall in (the
    // previous approach) mislabels the first week of the year as belonging
    // to the *previous* December whenever Jan 1 isn't a Sunday, producing a
    // "Dec" label immediately followed by "Jan" one column later. Since no
    // month is shorter than 28 days, labelled columns are now never adjacent.
    let weekMonth = -1;
    for (let i = 0; i < 7; i++) {
      if (cur.getDate() === 1) weekMonth = cur.getMonth();
      const isFuture = cur > today;
      const key = dateKey(cur);
      const count = isFuture ? 0 : log[key] || 0;
      if (!isFuture) total += count;
      days.push({
        bg: isFuture ? "transparent" : activityBucket(count),
        title: isFuture ? "" : count ? `${count} read · ${key}` : `No activity · ${key}`,
      });
      cur.setDate(cur.getDate() + 1);
    }
    const monthLabel = weekMonth !== -1 && weekMonth !== lastMonth ? MONTHS[weekMonth] : "";
    if (weekMonth !== -1) lastMonth = weekMonth;
    weeks.push({ days, monthLabel });
  }

  return { weeks, total };
}
