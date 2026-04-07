import { Puzzle } from "@/types";

export const puzzles: Puzzle[] = [
  {
    id: "puzzle-1",
    groups: [
      {
        name: "Programming Languages",
        words: ["Python", "Rust", "Swift", "Go"],
        color: "#4CAF50",
        difficulty: 1,
      },
      {
        name: "Planets",
        words: ["Mars", "Venus", "Saturn", "Neptune"],
        color: "#2196F3",
        difficulty: 2,
      },
      {
        name: "Card Games",
        words: ["Poker", "Bridge", "Solitaire", "Blackjack"],
        color: "#FF9800",
        difficulty: 3,
      },
      {
        name: "Types of Dance",
        words: ["Salsa", "Tango", "Waltz", "Swing"],
        color: "#9C27B0",
        difficulty: 4,
      },
    ],
  },
  {
    id: "puzzle-2",
    groups: [
      {
        name: "Fruits",
        words: ["Apple", "Mango", "Cherry", "Lime"],
        color: "#4CAF50",
        difficulty: 1,
      },
      {
        name: "Music Genres",
        words: ["Jazz", "Rock", "Blues", "Punk"],
        color: "#2196F3",
        difficulty: 2,
      },
      {
        name: "Currencies",
        words: ["Dollar", "Euro", "Pound", "Yen"],
        color: "#FF9800",
        difficulty: 3,
      },
      {
        name: "Shades of Blue",
        words: ["Navy", "Cyan", "Azure", "Cobalt"],
        color: "#9C27B0",
        difficulty: 4,
      },
    ],
  },
  {
    id: "puzzle-3",
    groups: [
      {
        name: "Animals",
        words: ["Eagle", "Shark", "Tiger", "Wolf"],
        color: "#4CAF50",
        difficulty: 1,
      },
      {
        name: "Kitchen Tools",
        words: ["Whisk", "Ladle", "Tongs", "Grater"],
        color: "#2196F3",
        difficulty: 2,
      },
      {
        name: "Greek Letters",
        words: ["Alpha", "Beta", "Delta", "Omega"],
        color: "#FF9800",
        difficulty: 3,
      },
      {
        name: "Board Games",
        words: ["Chess", "Risk", "Clue", "Life"],
        color: "#9C27B0",
        difficulty: 4,
      },
    ],
  },
  {
    id: "puzzle-4",
    groups: [
      {
        name: "Sports",
        words: ["Tennis", "Boxing", "Cricket", "Fencing"],
        color: "#4CAF50",
        difficulty: 1,
      },
      {
        name: "Gemstones",
        words: ["Ruby", "Emerald", "Topaz", "Opal"],
        color: "#2196F3",
        difficulty: 2,
      },
      {
        name: "Musical Instruments",
        words: ["Harp", "Flute", "Cello", "Drum"],
        color: "#FF9800",
        difficulty: 3,
      },
      {
        name: "Weather",
        words: ["Storm", "Frost", "Breeze", "Hail"],
        color: "#9C27B0",
        difficulty: 4,
      },
    ],
  },
  {
    id: "puzzle-5",
    groups: [
      {
        name: "Pasta Types",
        words: ["Penne", "Fusilli", "Rigatoni", "Orzo"],
        color: "#4CAF50",
        difficulty: 1,
      },
      {
        name: "Mythical Creatures",
        words: ["Dragon", "Phoenix", "Griffin", "Hydra"],
        color: "#2196F3",
        difficulty: 2,
      },
      {
        name: "Car Brands",
        words: ["Tesla", "Volvo", "Lexus", "Audi"],
        color: "#FF9800",
        difficulty: 3,
      },
      {
        name: "Emotions",
        words: ["Joy", "Anger", "Fear", "Disgust"],
        color: "#9C27B0",
        difficulty: 4,
      },
    ],
  },
  {
    id: "puzzle-6",
    groups: [
      {
        name: "Coffee Drinks",
        words: ["Latte", "Mocha", "Espresso", "Cortado"],
        color: "#4CAF50",
        difficulty: 1,
      },
      {
        name: "Types of Cloud",
        words: ["Cirrus", "Cumulus", "Stratus", "Nimbus"],
        color: "#2196F3",
        difficulty: 2,
      },
      {
        name: "Shakespeare Plays",
        words: ["Hamlet", "Othello", "Macbeth", "Tempest"],
        color: "#FF9800",
        difficulty: 3,
      },
      {
        name: "Martial Arts",
        words: ["Karate", "Judo", "Aikido", "Kendo"],
        color: "#9C27B0",
        difficulty: 4,
      },
    ],
  },
];

export function getRandomPuzzle(): Puzzle {
  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

export function shuffleWords(puzzle: Puzzle): string[] {
  const words = puzzle.groups.flatMap((g) => g.words);
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words;
}

export function calculateScore(timeSeconds: number, mistakes: number): number {
  const baseScore = 1000;
  const timePenalty = Math.floor(timeSeconds * 2);
  const mistakePenalty = mistakes * 100;
  return Math.max(0, baseScore - timePenalty - mistakePenalty);
}
