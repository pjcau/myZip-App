"use client";

import { useState } from "react";

interface TutorialProps {
  onClose: () => void;
}

const steps = [
  {
    title: "Welcome to GLaDOS Zip!",
    description: "A path-drawing puzzle inspired by LinkedIn Zip. Your goal is to connect all cells in the grid with a single continuous path.",
    visual: (
      <div className="grid grid-cols-3 gap-1 w-40 mx-auto">
        {[1, "", "", "", 5, "", "", "", 9].map((v, i) => (
          <div
            key={i}
            className={`aspect-square rounded-md flex items-center justify-center text-sm font-bold ${
              v ? "bg-purple-500 text-white border-2 border-purple-300" : "bg-white/10 border border-white/10"
            }`}
          >
            {v}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Start from 1",
    description: "Tap or click on the cell marked with 1 to begin your path. This is always your starting point.",
    visual: (
      <div className="grid grid-cols-3 gap-1 w-40 mx-auto">
        {[1, "", "", "", 5, "", "", "", 9].map((v, i) => (
          <div
            key={i}
            className={`aspect-square rounded-md flex items-center justify-center text-sm font-bold ${
              i === 0
                ? "bg-green-500 text-white scale-110 ring-2 ring-green-300"
                : v
                  ? "bg-purple-500 text-white border-2 border-purple-300"
                  : "bg-white/10 border border-white/10"
            }`}
          >
            {v || ""}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Draw your path",
    description: "Drag through adjacent cells (up, down, left, right) to create your path. You must visit every single cell exactly once.",
    visual: (
      <div className="grid grid-cols-3 gap-1 w-40 mx-auto">
        {[1, 2, 3, "", 5, 4, "", "", ""].map((v, i) => (
          <div
            key={i}
            className={`aspect-square rounded-md flex items-center justify-center text-sm font-bold ${
              v
                ? "bg-indigo-500 text-white"
                : "bg-white/10 border border-white/10"
            }`}
          >
            {v || ""}
          </div>
        ))}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" />
      </div>
    ),
  },
  {
    title: "Hit numbers in order",
    description: "Your path must pass through the numbered cells in sequence. When your path reaches cell 5, it must be the 5th cell you've visited.",
    visual: (
      <div className="grid grid-cols-3 gap-1 w-40 mx-auto">
        {["1", "2", "3", "6", "5", "4", "7", "8", "9"].map((v, i) => (
          <div
            key={i}
            className={`aspect-square rounded-md flex items-center justify-center text-sm font-bold ${
              [0, 4, 8].includes(i)
                ? "bg-purple-500 text-white ring-2 ring-purple-300"
                : "bg-indigo-500/80 text-white/80"
            }`}
          >
            {v}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Undo mistakes",
    description: "Made a wrong turn? Drag backwards along your path to undo steps. You can also tap \"Clear Path\" to start over completely.",
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="grid grid-cols-3 gap-1 w-40 mx-auto">
          {["1", "2", "3", "", "", "←", "", "", ""].map((v, i) => (
            <div
              key={i}
              className={`aspect-square rounded-md flex items-center justify-center text-sm font-bold ${
                v === "←"
                  ? "bg-red-500/50 text-white animate-pulse"
                  : v
                    ? "bg-indigo-500 text-white"
                    : "bg-white/10 border border-white/10"
              }`}
            >
              {v || ""}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Complete & score!",
    description: "Fill every cell and lift your finger/mouse. Your score is based on speed — the faster you solve, the higher your score. Try all grid sizes: 5x5, 6x6, and 7x7!",
    visual: (
      <div className="flex flex-col items-center gap-2">
        <div className="grid grid-cols-3 gap-1 w-40 mx-auto">
          {["1", "2", "3", "6", "5", "4", "7", "8", "9"].map((v, i) => (
            <div
              key={i}
              className="aspect-square rounded-md flex items-center justify-center text-sm font-bold bg-green-500 text-white"
            >
              {v}
            </div>
          ))}
        </div>
        <div className="text-green-400 font-bold text-lg">⚡ 850 pts</div>
      </div>
    ),
  },
];

export default function Tutorial({ onClose }: TutorialProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-indigo-950 border border-white/20 rounded-2xl p-6 max-w-sm w-full">
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center mb-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-purple-400" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Visual */}
        <div className="relative mb-5 py-4">{current.visual}</div>

        {/* Text */}
        <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
        <p className="text-purple-200 text-sm leading-relaxed mb-6">
          {current.description}
        </p>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all font-medium text-sm"
            >
              Back
            </button>
          )}
          {step === 0 && (
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 hover:bg-white/10 transition-all font-medium text-sm"
            >
              Skip
            </button>
          )}
          <button
            onClick={isLast ? onClose : () => setStep(step + 1)}
            className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-medium transition-all text-sm"
          >
            {isLast ? "Let's Play!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
