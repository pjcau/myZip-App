import { put, list } from "@vercel/blob";
import { Score } from "@/types";

const SCORES_BLOB_KEY = "scores.json";

// In-memory fallback for local dev without Blob token
let inMemoryScores: Score[] = [];

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function getScores(): Promise<Score[]> {
  if (!hasBlobToken()) {
    return inMemoryScores;
  }

  try {
    const { blobs } = await list({ prefix: SCORES_BLOB_KEY });
    if (blobs.length === 0) return [];

    const response = await fetch(blobs[0].url);
    const scores: Score[] = await response.json();
    return scores;
  } catch {
    return [];
  }
}

export async function addScore(score: Score): Promise<void> {
  if (!hasBlobToken()) {
    inMemoryScores.push(score);
    return;
  }

  const scores = await getScores();
  scores.push(score);

  await put(SCORES_BLOB_KEY, JSON.stringify(scores), {
    access: "public",
    addRandomSuffix: false,
  });
}

export async function getLeaderboard(): Promise<Score[]> {
  const scores = await getScores();
  return scores.sort((a, b) => b.score - a.score).slice(0, 50);
}
