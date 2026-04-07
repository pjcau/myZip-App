"use client";

import { Group } from "@/types";

interface GameGridProps {
  words: string[];
  selectedWords: string[];
  foundGroups: Group[];
  onWordClick: (word: string) => void;
}

export default function GameGrid({
  words,
  selectedWords,
  foundGroups,
  onWordClick,
}: GameGridProps) {
  const foundWords = new Set(foundGroups.flatMap((g) => g.words));

  return (
    <div className="space-y-3">
      {/* Found groups */}
      {foundGroups.map((group) => (
        <div
          key={group.name}
          className="rounded-xl p-4 text-center animate-fade-in"
          style={{ backgroundColor: group.color }}
        >
          <div className="font-bold text-white text-lg">{group.name}</div>
          <div className="text-white/80 text-sm">
            {group.words.join(" • ")}
          </div>
        </div>
      ))}

      {/* Word grid */}
      <div className="grid grid-cols-4 gap-2">
        {words
          .filter((w) => !foundWords.has(w))
          .map((word) => {
            const isSelected = selectedWords.includes(word);
            return (
              <button
                key={word}
                onClick={() => onWordClick(word)}
                className={`
                  py-3 px-2 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200
                  ${
                    isSelected
                      ? "bg-purple-500 text-white scale-95 shadow-lg shadow-purple-500/30"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }
                `}
              >
                {word}
              </button>
            );
          })}
      </div>
    </div>
  );
}
