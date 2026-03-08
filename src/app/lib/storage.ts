import type { Entry } from './types';

const STORAGE_KEY = 'thought-journal-entries';

function readEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeEntries(entries: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function saveEntry(entry: Entry): void {
  const entries = readEntries();
  entries.push(entry);
  writeEntries(entries);
}

export function getEntry(id: string): Entry | null {
  const entries = readEntries();
  return entries.find((e) => e.id === id) ?? null;
}

export function getAllEntries(): Entry[] {
  const entries = readEntries();
  return entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function deleteEntry(id: string): void {
  const entries = readEntries();
  const filtered = entries.filter((e) => e.id !== id);
  writeEntries(filtered);
}
