export interface Puzzle {
  id: string;
  groups: Group[];
}

export interface Group {
  name: string;
  words: string[];
  color: string;
  difficulty: number; // 1-4
}

export interface GameState {
  puzzle: Puzzle;
  selectedWords: string[];
  foundGroups: Group[];
  attempts: number;
  mistakes: number;
  startTime: number;
  endTime: number | null;
  isComplete: boolean;
}

export interface Score {
  id: string;
  playerName: string;
  puzzleId: string;
  time: number; // seconds
  mistakes: number;
  score: number;
  date: string;
}

export interface LeaderboardEntry extends Score {
  rank: number;
}
