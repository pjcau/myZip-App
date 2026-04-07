export interface Cell {
  row: number;
  col: number;
}

export interface Puzzle {
  id: string;
  size: number; // grid size (e.g., 5 = 5x5)
  anchors: { cell: Cell; value: number }[]; // fixed numbered cells
  solution: Cell[]; // the correct path visiting all cells in order
}

export interface Score {
  id: string;
  playerName: string;
  puzzleId: string;
  time: number; // seconds
  score: number;
  date: string;
}
