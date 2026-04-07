import { NextResponse } from "next/server";
import { addScore, getLeaderboard } from "@/lib/storage";
import { Score } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const leaderboard = await getLeaderboard();
  return NextResponse.json(leaderboard);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { playerName, puzzleId, time, mistakes, score } = body;

  if (!playerName || !puzzleId || score === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newScore: Score = {
    id: uuidv4(),
    playerName: playerName.slice(0, 20),
    puzzleId,
    time,
    mistakes,
    score,
    date: new Date().toISOString(),
  };

  await addScore(newScore);
  return NextResponse.json(newScore, { status: 201 });
}
