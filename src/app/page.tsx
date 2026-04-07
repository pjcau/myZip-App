"use client";

import { useState, useEffect } from "react";
import NameEntry from "@/components/NameEntry";
import GameBoard from "@/components/GameBoard";

type Screen = "name" | "game";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("name");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("playerName");
    if (saved) {
      setPlayerName(saved);
      setScreen("game");
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    sessionStorage.setItem("playerName", name);
    setPlayerName(name);
    setScreen("game");
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

  if (screen === "name") {
    return <NameEntry onSubmit={handleNameSubmit} />;
  }

  return <GameBoard playerName={playerName} onGameEnd={handleGameEnd} />;
}
