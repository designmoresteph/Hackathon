import type { PipelineResult } from './types';

const PIPELINE_STORAGE_KEY = 'thought-journal-pipeline-results';

function readResults(): PipelineResult[] {
  try {
    const raw = localStorage.getItem(PIPELINE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeResults(results: PipelineResult[]): void {
  localStorage.setItem(PIPELINE_STORAGE_KEY, JSON.stringify(results));
}

export function savePipelineResult(result: PipelineResult): void {
  const results = readResults();
  results.push(result);
  writeResults(results);
}

export function getPipelineResult(id: string): PipelineResult | null {
  const results = readResults();
  return results.find((r) => r.id === id) ?? null;
}

export function getPipelineResultByEntryId(entryId: string): PipelineResult | null {
  const results = readResults();
  const sorted = results
    .filter((r) => r.entryId === entryId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return sorted[0] ?? null;
}

export function getLatestPipelineResult(): PipelineResult | null {
  const results = readResults();
  if (results.length === 0) return null;
  const sorted = results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sorted[0];
}

export function getAllPipelineResults(): PipelineResult[] {
  const results = readResults();
  return results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
