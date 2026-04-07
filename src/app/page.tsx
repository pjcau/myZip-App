"use client";

import { useState, useSyncExternalStore } from "react";
import NameEntry from "@/components/NameEntry";
import GameBoard from "@/components/GameBoard";

function getSessionName(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("playerName") || "";
}

const subscribe = () => () => {};

export default function Home() {
  const savedName = useSyncExternalStore(subscribe, getSessionName, () => "");
  const [playerName, setPlayerName] = useState(savedName);
  const [playing, setPlaying] = useState(!!savedName);

  const handleNameSubmit = (name: string) => {
    sessionStorage.setItem("playerName", name);
    setPlayerName(name);
    setPlaying(true);
  };

  const handleGameEnd = async (
    score: number,
    mistakes: number,
    time: number,
    puzzleId: string
  ) => {
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName,
          puzzleId,
          time,
          mistakes,
          score,
        }),
      });
    } catch {
      // Score saving failed silently
    }
  };

  if (!playing) {
    return <NameEntry onSubmit={handleNameSubmit} />;
  }

  return <GameBoard playerName={playerName} onGameEnd={handleGameEnd} />;
}
