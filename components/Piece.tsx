
import React from 'react';
import { PieceType, Player } from '../types';
import { PIECE_INFO, PLAYER_INFO } from '../constants';

interface PieceProps {
  type: PieceType;
  player: Player;
  isSelected: boolean;
  isMovable: boolean;
}

const Piece: React.FC<PieceProps> = ({ type, player, isSelected, isMovable }) => {
  const info = PIECE_INFO[type];
  const playerColor = PLAYER_INFO[player].color;

  return (
    <div className={`
      relative flex flex-col items-center justify-center w-full h-full p-1 z-30
      ${isSelected ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'scale-100'}
      transition-all duration-300 select-none
    `}>
      <span 
        className={`text-2xl md:text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none transition-all ${isSelected ? 'brightness-125' : 'brightness-100'}`}
        style={{ color: playerColor }}
      >
        {info.symbol}
      </span>
      
      <span 
        className="devanagari text-[8px] md:text-xs font-bold leading-tight mt-1 transition-opacity duration-300"
        style={{ color: playerColor, opacity: isSelected ? 1 : 0.7 }}
      >
        {info.srv}
      </span>

      {/* Glow effect for movable pieces */}
      {isMovable && !isSelected && (
        <div 
          className="absolute inset-0 rounded-full border border-white/20 animate-pulse pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
          style={{ borderColor: `${playerColor}44` }} 
        />
      )}

      {/* Special persistent Raja effect */}
      {type === PieceType.RAJA && (
        <div className="absolute inset-0 border-2 rounded-full animate-pulse pointer-events-none" style={{ borderColor: playerColor, opacity: 0.3 }} />
      )}

      {/* Subtle selection ring */}
      {isSelected && (
        <div className="absolute inset-0 rounded-md border-2 border-white/20 animate-in fade-in duration-500" />
      )}
    </div>
  );
};

export default Piece;
