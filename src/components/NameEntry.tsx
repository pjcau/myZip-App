"use client";

import { useState } from "react";
import Link from "next/link";
import Tutorial from "./Tutorial";

interface NameEntryProps {
  onSubmit: (name: string) => void;
}

export default function NameEntry({ onSubmit }: NameEntryProps) {
  const [name, setName] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length >= 2) {
      onSubmit(trimmed);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4">
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">⚡ GLaDOS Zip</h1>
          <p className="text-purple-200 text-lg">
            Draw a path. Connect every cell.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-purple-200 mb-2"
            >
              Enter your name to play
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name..."
              maxLength={20}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full py-3 px-6 bg-purple-500 hover:bg-purple-400 disabled:bg-purple-500/30 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-lg"
          >
            Play Now
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setShowTutorial(true)}
            className="text-purple-300 hover:text-white transition-colors text-sm underline underline-offset-4"
          >
            How to Play
          </button>
          <span className="text-white/20">|</span>
          <Link
            href="/leaderboard"
            className="text-purple-300 hover:text-white transition-colors text-sm underline underline-offset-4"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
