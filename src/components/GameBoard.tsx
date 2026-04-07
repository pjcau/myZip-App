"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { GameState } from "@/types";
import { shuffleWords, calculateScore, getRandomPuzzle } from "@/lib/puzzles";
import GameGrid from "./GameGrid";

interface GameBoardProps {
  playerName: string;
  onGameEnd: (score: number, mistakes: number, time: number, puzzleId: string) => void;
}

function createInitialState(): { gameState: GameState; words: string[] } {
  const puzzle = getRandomPuzzle();
  const shuffled = shuffleWords(puzzle);
  return {
    words: shuffled,
    gameState: {
      puzzle,
      selectedWords: [],
      foundGroups: [],
      attempts: 0,
      mistakes: 0,
      startTime: Date.now(),
      endTime: null,
      isComplete: false,
    },
  };
}

export default function GameBoard({ playerName, onGameEnd }: GameBoardProps) {
  const [{ gameState: initialGameState, words: initialWords }] = useState(createInitialState);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [words, setWords] = useState<string[]>(initialWords);
  const [message, setMessage] = useState("");
  const [shaking, setShaking] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const initGame = useCallback(() => {
    const initial = createInitialState();
    setWords(initial.words);
    setGameState(initial.gameState);
    setMessage("");
    setElapsed(0);
  }, []);

  useEffect(() => {
    if (!gameState || gameState.isComplete) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - gameState.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleWordClick = (word: string) => {
    if (!gameState || gameState.isComplete) return;

    setGameState((prev) => {
      if (!prev) return prev;
      const selected = prev.selectedWords.includes(word)
        ? prev.selectedWords.filter((w) => w !== word)
        : prev.selectedWords.length < 4
          ? [...prev.selectedWords, word]
          : prev.selectedWords;
      return { ...prev, selectedWords: selected };
    });
  };

  const handleSubmit = () => {
    if (!gameState || gameState.selectedWords.length !== 4) return;

    const matchingGroup = gameState.puzzle.groups.find(
      (group) =>
        !gameState.foundGroups.includes(group) &&
        group.words.every((w) => gameState.selectedWords.includes(w))
    );

    if (matchingGroup) {
      const newFoundGroups = [...gameState.foundGroups, matchingGroup];
      const isComplete = newFoundGroups.length === 4;
      const endTime = isComplete ? Date.now() : null;
      const timeSeconds = endTime
        ? Math.floor((endTime - gameState.startTime) / 1000)
        : 0;

      setMessage(`✓ ${matchingGroup.name}!`);

      const newState: GameState = {
        ...gameState,
        foundGroups: newFoundGroups,
        selectedWords: [],
        attempts: gameState.attempts + 1,
        isComplete,
        endTime,
      };
      setGameState(newState);

      if (isComplete) {
        const score = calculateScore(timeSeconds, gameState.mistakes);
        setTimeout(() => {
          onGameEnd(score, gameState.mistakes, timeSeconds, gameState.puzzle.id);
        }, 1000);
      }
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);

      // Check if 3 out of 4 are correct for a hint
      const almostGroup = gameState.puzzle.groups.find(
        (group) =>
          !gameState.foundGroups.includes(group) &&
          group.words.filter((w) => gameState.selectedWords.includes(w)).length === 3
      );

      setMessage(almostGroup ? "So close! One away..." : "Not quite. Try again!");

      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          selectedWords: [],
          attempts: prev.attempts + 1,
          mistakes: prev.mistakes + 1,
        };
      });
    }
  };

  const handleDeselectAll = () => {
    setGameState((prev) => (prev ? { ...prev, selectedWords: [] } : prev));
  };

  if (!gameState) return null;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">⚡ myZip</h1>
            <p className="text-purple-300 text-sm">
              Playing as <span className="font-semibold text-white">{playerName}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-white">{formatTime(elapsed)}</div>
            <div className="text-purple-300 text-sm">
              Mistakes: <span className="text-red-400 font-semibold">{gameState.mistakes}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-purple-200 text-center mb-4 text-sm">
          Find 4 groups of 4 related words
        </p>

        {/* Message */}
        {message && (
          <div
            className={`text-center mb-3 py-2 px-4 rounded-lg font-medium ${
              message.startsWith("✓")
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Grid */}
        <div className={shaking ? "animate-shake" : ""}>
          <GameGrid
            words={words}
            selectedWords={gameState.selectedWords}
            foundGroups={gameState.foundGroups}
            onWordClick={handleWordClick}
          />
        </div>

        {/* Actions */}
        {!gameState.isComplete && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDeselectAll}
              className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all font-medium"
            >
              Deselect All
            </button>
            <button
              onClick={handleSubmit}
              disabled={gameState.selectedWords.length !== 4}
              className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:bg-purple-500/30 disabled:cursor-not-allowed text-white font-medium transition-all"
            >
              Submit ({gameState.selectedWords.length}/4)
            </button>
          </div>
        )}

        {/* Complete */}
        {gameState.isComplete && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="text-3xl font-bold text-white mb-2">Puzzle Complete!</div>
            <div className="text-purple-200 mb-4">
              Score: {calculateScore(elapsed, gameState.mistakes)} •{" "}
              Time: {formatTime(elapsed)} • Mistakes: {gameState.mistakes}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={initGame}
                className="py-3 px-6 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-medium transition-all"
              >
                Play Again
              </button>
              <Link
                href="/leaderboard"
                className="py-3 px-6 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all font-medium"
              >
                Leaderboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
