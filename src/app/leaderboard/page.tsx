"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Score } from "@/types";

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scores")
      .then((r) => r.json())
      .then((data) => {
        setScores(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const getMedal = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `#${i + 1}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4">
      <div className="w-full max-w-lg mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <Link
            href="/"
            className="py-2 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-medium transition-all text-sm"
          >
            Play
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-purple-300 text-lg">Loading scores...</div>
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-purple-200 text-lg">No scores yet!</div>
            <div className="text-purple-400 text-sm mt-1">
              Be the first to play and set a high score.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {scores.map((score, i) => (
              <div
                key={score.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  i < 3
                    ? "bg-white/10 border-purple-400/30"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="text-2xl w-10 text-center font-bold">
                  {getMedal(i)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">
                    {score.playerName}
                  </div>
                  <div className="text-purple-300 text-xs">
                    {formatTime(score.time)} • {score.puzzleId.split("-").slice(0, 2).join(" ")} •{" "}
                    {new Date(score.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-300">
                    {score.score}
                  </div>
                  <div className="text-purple-400 text-xs">pts</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
