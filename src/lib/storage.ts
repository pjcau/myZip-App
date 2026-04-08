import { put, list } from "@vercel/blob";
import { Score } from "@/types";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const SCORES_BLOB_KEY = "scores.json";
const LOCAL_SCORES_FILE = join(process.cwd(), ".scores.json");

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function getLocalScores(): Score[] {
  try {
    if (!existsSync(LOCAL_SCORES_FILE)) return [];
    return JSON.parse(readFileSync(LOCAL_SCORES_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveLocalScores(scores: Score[]): void {
  writeFileSync(LOCAL_SCORES_FILE, JSON.stringify(scores, null, 2));
}

export async function getScores(): Promise<Score[]> {
  if (!hasBlobToken()) {
    return getLocalScores();
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
    const scores = getLocalScores();
    scores.push(score);
    saveLocalScores(scores);
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
