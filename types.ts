
export enum PieceType {
  RAJA = 'RAJA',
  Gaja = 'GAJA',
  ASHVA = 'ASHVA',
  RATHA = 'RATHA',
  PADATI = 'PADATI'
}

export enum Player {
  P1 = 'P1', // South (Red)
  P2 = 'P2', // West (Green)
  P3 = 'P3', // North (Yellow)
  P4 = 'P4'  // East (Black)
}

export enum Language {
  EN = 'EN',
  HI = 'HI',
  SA = 'SA'
}

export interface Piece {
  type: PieceType;
  player: Player;
}

export type Board = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}

export enum GamePhase {
  LANGUAGE_PICKER = 'LANGUAGE_PICKER',
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

export interface GameState {
  board: Board;
  turn: Player;
  phase: GamePhase;
  selectedSquare: Position | null;
  history: string[];
  winners: Player[];
  activePlayers: Player[];
  diceValue: number | null;
  alliances: Record<Player, Player | null>;
  scores: Record<Player, number>;
  initialPlayerCount: number;
  language: Language;
  kingdomNames: Record<Player, string>;
}
