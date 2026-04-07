"use client";

import { Cell } from "@/types";
import { useCallback, useRef, useState } from "react";

interface GameGridProps {
  size: number;
  anchors: Map<string, number>; // "row,col" -> value
  path: Cell[];
  onCellEnter: (cell: Cell) => void;
  onPathStart: (cell: Cell) => void;
  onPathEnd: () => void;
  isComplete: boolean;
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#c084fc",
  "#d8b4fe", "#7c3aed", "#6d28d9", "#5b21b6",
  "#4c1d95", "#a78bfa",
];

function cellKey(c: Cell) {
  return `${c.row},${c.col}`;
}

export default function GameGrid({
  size,
  anchors,
  path,
  onCellEnter,
  onPathStart,
  onPathEnd,
  isComplete,
}: GameGridProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const pathSet = new Map<string, number>();
  path.forEach((c, i) => pathSet.set(cellKey(c), i + 1));

  const getCellFromEvent = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!gridRef.current) return null;
      const rect = gridRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const col = Math.floor(((clientX - rect.left) / rect.width) * size);
      const row = Math.floor(((clientY - rect.top) / rect.height) * size);
      if (row >= 0 && row < size && col >= 0 && col < size) {
        return { row, col };
      }
      return null;
    },
    [size]
  );

  const handleStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isComplete) return;
      e.preventDefault();
      const cell = getCellFromEvent(e);
      if (cell) {
        setIsDrawing(true);
        onPathStart(cell);
      }
    },
    [getCellFromEvent, isComplete, onPathStart]
  );

  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDrawing || isComplete) return;
      e.preventDefault();
      const cell = getCellFromEvent(e);
      if (cell) {
        onCellEnter(cell);
      }
    },
    [getCellFromEvent, isDrawing, isComplete, onCellEnter]
  );

  const handleEnd = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      onPathEnd();
    }
  }, [isDrawing, onPathEnd]);

  const getPathColor = (index: number) => {
    return COLORS[index % COLORS.length];
  };

  // Build connection lines between consecutive path cells
  const connections: { from: Cell; to: Cell; index: number }[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    connections.push({ from: path[i], to: path[i + 1], index: i });
  }

  return (
    <div
      ref={gridRef}
      className="relative aspect-square w-full max-w-[400px] mx-auto select-none touch-none"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 grid gap-[2px] p-[2px]"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {Array.from({ length: size * size }, (_, i) => {
          const row = Math.floor(i / size);
          const col = i % size;
          const key = cellKey({ row, col });
          const pathIndex = pathSet.get(key);
          const anchorValue = anchors.get(key);
          const isInPath = pathIndex !== undefined;

          return (
            <div
              key={key}
              className={`
                relative rounded-lg flex items-center justify-center
                transition-all duration-100
                ${isInPath
                  ? "scale-[0.98]"
                  : "bg-white/10 border border-white/10"
                }
                ${anchorValue && !isInPath ? "bg-white/20 border-2 border-purple-400" : ""}
              `}
              style={
                isInPath
                  ? {
                      backgroundColor: isComplete
                        ? "#22c55e"
                        : getPathColor(pathIndex - 1),
                    }
                  : anchorValue
                    ? {}
                    : undefined
              }
            >
              {anchorValue && (
                <span
                  className={`
                    font-bold text-white z-10
                    ${size <= 5 ? "text-lg" : size <= 7 ? "text-sm" : "text-xs"}
                  `}
                >
                  {anchorValue}
                </span>
              )}
              {isInPath && !anchorValue && (
                <span
                  className={`
                    font-medium text-white/70 z-10
                    ${size <= 5 ? "text-sm" : "text-[10px]"}
                  `}
                >
                  {pathIndex}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Connection lines SVG overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${size} ${size}`}>
        {connections.map(({ from, to, index }) => (
          <line
            key={`${cellKey(from)}-${cellKey(to)}`}
            x1={from.col + 0.5}
            y1={from.row + 0.5}
            x2={to.col + 0.5}
            y2={to.row + 0.5}
            stroke={isComplete ? "#22c55e" : getPathColor(index)}
            strokeWidth={0.15}
            strokeLinecap="round"
            opacity={0.6}
          />
        ))}
      </svg>
    </div>
  );
}
