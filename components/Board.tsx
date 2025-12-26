
import React from 'react';
import { Board as BoardType, Position, Player } from '../types';
import Piece from './Piece';
import { BOARD_SIZE, PLAYER_INFO } from '../constants';

interface BoardProps {
  board: BoardType;
  selectedSquare: Position | null;
  onSquareClick: (pos: Position) => void;
  possibleMoves: Position[];
  movablePieces: Position[];
}

const Board: React.FC<BoardProps> = ({ board, selectedSquare, onSquareClick, possibleMoves, movablePieces }) => {
  const isMarked = (r: number, c: number) => {
    const marks = [0, 3, 4, 7];
    return marks.includes(r) && marks.includes(c);
  };

  return (
    <div className="relative p-2 bg-[#2d1e14] rounded-sm shadow-2xl border-4 border-[#3c2a1a]">
      <div className="grid grid-cols-8 grid-rows-8 w-[320px] h-[320px] md:w-[600px] md:h-[600px] bg-[#3c2a1a]">
        {board.map((row, rIndex) =>
          row.map((piece, cIndex) => {
            const isSelected = selectedSquare?.row === rIndex && selectedSquare?.col === cIndex;
            const isPossible = possibleMoves.some(m => m.row === rIndex && m.col === cIndex);
            const isMovable = movablePieces.some(m => m.row === rIndex && m.col === cIndex);
            
            return (
              <div
                key={`${rIndex}-${cIndex}`}
                onClick={() => onSquareClick({ row: rIndex, col: cIndex })}
                className={`
                  relative flex items-center justify-center cursor-pointer
                  border-[0.5px] border-[#2d1e14]/50
                  ${isSelected ? 'bg-yellow-500/20 z-10' : 'bg-[#4e3b2b]'}
                  transition-all duration-200 hover:brightness-110
                `}
              >
                {/* Ancient markings */}
                {isMarked(rIndex, cIndex) && (
                  <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                    <div className="w-[80%] h-[1px] bg-white rotate-45" />
                    <div className="w-[80%] h-[1px] bg-white -rotate-45" />
                  </div>
                )}

                {isPossible && (
                  <div className="absolute inset-0 bg-white/10 flex items-center justify-center z-20">
                     <div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-white/40 border border-white/20 animate-pulse" />
                  </div>
                )}

                {piece && (
                  <Piece 
                    type={piece.type} 
                    player={piece.player} 
                    isSelected={isSelected}
                    isMovable={isMovable}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
