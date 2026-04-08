"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Cell } from "@/types";
import { generatePuzzle, calculateScore } from "@/lib/puzzles";
import GameGrid from "./GameGrid";
import Tutorial from "./Tutorial";

interface GameBoardProps {
  playerName: string;
  onGameEnd: (score: number, time: number, puzzleId: string) => void;
}

function cellKey(c: Cell) {
  return `${c.row},${c.col}`;
}

function areAdjacent(a: Cell, b: Cell): boolean {
  return (
    (Math.abs(a.row - b.row) === 1 && a.col === b.col) ||
    (Math.abs(a.col - b.col) === 1 && a.row === b.row)
  );
}

interface GameData {
  puzzleId: string;
  size: number;
  anchors: Map<string, number>;
  anchorPositions: Map<number, string>; // value -> "row,col"
  totalCells: number;
}

function createGame(gridSize: number): {
  gameData: GameData;
  initialPath: Cell[];
} {
  const puzzle = generatePuzzle(gridSize, Math.max(3, Math.floor(gridSize * 1.2)));

  const anchorsMap = new Map<string, number>();
  const anchorPositions = new Map<number, string>();
  for (const a of puzzle.anchors) {
    const key = cellKey(a.cell);
    anchorsMap.set(key, a.value);
    anchorPositions.set(a.value, key);
  }

  return {
    gameData: {
      puzzleId: puzzle.id,
      size: puzzle.size,
      anchors: anchorsMap,
      anchorPositions,
      totalCells: puzzle.size * puzzle.size,
    },
    initialPath: [],
  };
}

const GRID_SIZES = [5, 6, 7];

export default function GameBoard({ playerName, onGameEnd }: GameBoardProps) {
  const [gridSize, setGridSize] = useState(5);
  const [gameData, setGameData] = useState<GameData>(() => createGame(5).gameData);
  const [path, setPath] = useState<Cell[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [message, setMessage] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const lastCell = useRef<string>("");

  const initGame = useCallback((size: number) => {
    const { gameData: gd } = createGame(size);
    setGameData(gd);
    setPath([]);
    setIsComplete(false);
    setElapsed(0);
    setStartTime(Date.now());
    setMessage("");
    lastCell.current = "";
  }, []);

  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  const validatePath = useCallback(
    (newPath: Cell[]): boolean => {
      // Check that all anchors encountered so far are in the right order
      for (let i = 0; i < newPath.length; i++) {
        const key = cellKey(newPath[i]);
        const anchorVal = gameData.anchors.get(key);
        if (anchorVal !== undefined) {
          // This anchor should be at position anchorVal (1-based)
          if (i + 1 !== anchorVal) return false;
        }
      }
      return true;
    },
    [gameData.anchors]
  );

  const handlePathStart = useCallback(
    (cell: Cell) => {
      const key = cellKey(cell);
      // Must start from cell with anchor value 1
      const anchorVal = gameData.anchors.get(key);
      if (anchorVal === 1) {
        setPath([cell]);
        lastCell.current = key;
        setMessage("");
      } else {
        setMessage("Start from cell 1!");
      }
    },
    [gameData.anchors]
  );

  const handleCellEnter = useCallback(
    (cell: Cell) => {
      const key = cellKey(cell);
      if (key === lastCell.current) return;

      setPath((prev) => {
        if (prev.length === 0) return prev;

        const last = prev[prev.length - 1];

        // Allow backtracking: if entering the second-to-last cell, undo
        if (prev.length >= 2) {
          const secondLast = prev[prev.length - 2];
          if (cellKey(secondLast) === key) {
            lastCell.current = key;
            return prev.slice(0, -1);
          }
        }

        // Must be adjacent
        if (!areAdjacent(last, cell)) return prev;

        // Can't revisit
        if (prev.some((c) => cellKey(c) === key)) return prev;

        const newPath = [...prev, cell];

        // Validate anchor order
        if (!validatePath(newPath)) return prev;

        lastCell.current = key;
        return newPath;
      });
    },
    [validatePath]
  );

  const handlePathEnd = useCallback(() => {
    if (path.length === gameData.totalCells) {
      // Verify all anchors are correctly placed
      const valid = validatePath(path);
      if (valid) {
        setIsComplete(true);
        const time = Math.floor((Date.now() - startTime) / 1000);
        const score = calculateScore(time, gameData.size);
        onGameEnd(score, time, gameData.puzzleId);
        setMessage("Puzzle Complete!");
      }
    } else if (path.length > 0) {
      setMessage(`${path.length}/${gameData.totalCells} cells — keep going!`);
    }
  }, [path, gameData, validatePath, startTime, onGameEnd]);

  const handleNewGame = (size: number) => {
    setGridSize(size);
    initGame(size);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4">
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-2xl font-bold text-white">⚡ GLaDOS Zip</h1>
              <p className="text-purple-300 text-sm">
                Playing as{" "}
                <span className="font-semibold text-white">{playerName}</span>
              </p>
            </div>
            <button
              onClick={() => setShowTutorial(true)}
              className="ml-1 w-7 h-7 rounded-full border border-white/20 text-purple-300 hover:text-white hover:bg-white/10 transition-all text-sm font-bold flex items-center justify-center"
              title="How to play"
            >
              ?
            </button>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-white">
              {formatTime(elapsed)}
            </div>
            <div className="text-purple-300 text-sm">
              {path.length}/{gameData.totalCells} cells
            </div>
          </div>
        </div>

        {/* Grid size selector */}
        <div className="flex gap-2 mb-4 justify-center">
          {GRID_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => handleNewGame(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                gridSize === s
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {s}x{s}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <p className="text-purple-200 text-center mb-3 text-sm">
          Draw a path through all cells, hitting numbers in order
        </p>

        {/* Message */}
        {message && (
          <div
            className={`text-center mb-3 py-2 px-4 rounded-lg font-medium text-sm ${
              isComplete
                ? "bg-green-500/20 text-green-300"
                : "bg-purple-500/20 text-purple-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Game Grid */}
        <GameGrid
          key={gameData.puzzleId}
          size={gameData.size}
          anchors={gameData.anchors}
          path={path}
          onCellEnter={handleCellEnter}
          onPathStart={handlePathStart}
          onPathEnd={handlePathEnd}
          isComplete={isComplete}
        />

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              setPath([]);
              lastCell.current = "";
              setMessage("");
            }}
            className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all font-medium"
          >
            Clear Path
          </button>
          <button
            onClick={() => initGame(gridSize)}
            className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-medium transition-all"
          >
            New Puzzle
          </button>
        </div>

        {/* Complete state */}
        {isComplete && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="text-3xl font-bold text-white mb-2">
              ⚡ {calculateScore(elapsed, gameData.size)} pts
            </div>
            <div className="text-purple-200 mb-4">
              Solved in {formatTime(elapsed)}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => initGame(gridSize)}
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
