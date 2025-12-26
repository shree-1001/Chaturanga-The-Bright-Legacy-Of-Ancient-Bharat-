
import { Board, Position, PieceType, Player } from './types';

export const isValidMove = (
  from: Position,
  to: Position,
  board: Board,
  currentPlayer: Player,
  diceValue: number | null,
  alliances: Record<Player, Player | null>
): boolean => {
  const piece = board[from.row][from.col];
  if (!piece || piece.player !== currentPlayer) return false;

  const target = board[to.row][to.col];
  
  if (target) {
    if (target.player === currentPlayer) return false;
    if (alliances[currentPlayer] === target.player) return false;
  }

  if (diceValue !== null) {
    const diceToType: Record<number, PieceType[]> = {
      5: [PieceType.PADATI, PieceType.RAJA],
      4: [PieceType.Gaja],
      3: [PieceType.ASHVA],
      2: [PieceType.RATHA],
    };
    if (!diceToType[diceValue]?.includes(piece.type)) return false;
  }

  const dr = to.row - from.row;
  const dc = to.col - from.col;
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  switch (piece.type) {
    case PieceType.RAJA:
      return absDr <= 1 && absDc <= 1 && (absDr !== 0 || absDc !== 0);

    case PieceType.RATHA: // Nauka (Boat) moves exactly 2 squares diagonally, jumps
      return absDr === 2 && absDc === 2;

    case PieceType.Gaja: // Gaja (Elephant) moves exactly 2 squares orthogonally, jumps
      return (absDr === 2 && absDc === 0) || (absDr === 0 && absDc === 2);

    case PieceType.ASHVA:
      return (absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2);

    case PieceType.PADATI:
      let moveR = 0, moveC = 0;
      if (currentPlayer === Player.P1) moveR = -1;
      else if (currentPlayer === Player.P2) moveC = 1;
      else if (currentPlayer === Player.P3) moveR = 1;
      else if (currentPlayer === Player.P4) moveC = -1;

      if (dr === moveR && dc === moveC && target === null) return true;

      const isDiagonal = (absDr === 1 && absDc === 1);
      if (isDiagonal && target !== null) {
        if (currentPlayer === Player.P1 && dr === -1) return true;
        if (currentPlayer === Player.P2 && dc === 1) return true;
        if (currentPlayer === Player.P3 && dr === 1) return true;
        if (currentPlayer === Player.P4 && dc === -1) return true;
      }
      return false;

    default:
      return false;
  }
};

export const findLegalMoves = (
  pos: Position,
  board: Board,
  player: Player,
  diceValue: number | null,
  alliances: Record<Player, Player | null>
): Position[] => {
  const moves: Position[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(pos, { row: r, col: c }, board, player, diceValue, alliances)) {
        moves.push({ row: r, col: c });
      }
    }
  }
  return moves;
};

export const playerHasAnyLegalMoves = (
  board: Board,
  player: Player,
  diceValue: number | null,
  alliances: Record<Player, Player | null>
): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.player === player) {
        const moves = findLegalMoves({ row: r, col: c }, board, player, diceValue, alliances);
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
};
