
import React, { useState, useMemo } from 'react';
import { Player, Position, PieceType, GameState, GamePhase, Language } from './types';
import { getInitialBoard, PIECE_INFO, PLAYER_INFO, TRANSLATIONS, PIECE_VALUES } from './constants';
import { isValidMove, findLegalMoves, playerHasAnyLegalMoves } from './engine';
import Board from './components/Board';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: getInitialBoard(),
    turn: Player.P1,
    phase: GamePhase.LANGUAGE_PICKER,
    selectedSquare: null,
    history: [],
    winners: [],
    activePlayers: [Player.P1, Player.P2, Player.P3, Player.P4],
    diceValue: null,
    alliances: { [Player.P1]: null, [Player.P2]: null, [Player.P3]: null, [Player.P4]: null },
    scores: { [Player.P1]: 0, [Player.P2]: 0, [Player.P3]: 0, [Player.P4]: 0 },
    initialPlayerCount: 4,
    language: Language.EN,
    kingdomNames: {
      [Player.P1]: PLAYER_INFO[Player.P1].defaultName,
      [Player.P2]: PLAYER_INFO[Player.P2].defaultName,
      [Player.P3]: PLAYER_INFO[Player.P3].defaultName,
      [Player.P4]: PLAYER_INFO[Player.P4].defaultName,
    }
  });

  const [showDiplomacy, setShowDiplomacy] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [tempPlayerSelection, setTempPlayerSelection] = useState<Player[]>([Player.P1, Player.P2, Player.P3, Player.P4]);
  const [submissionTarget, setSubmissionTarget] = useState<Player | null>(null);

  const t = TRANSLATIONS[gameState.language];

  const hasPossibleMoves = useMemo(() => {
    if (!gameState.diceValue || gameState.phase !== GamePhase.PLAYING) return true;
    return playerHasAnyLegalMoves(gameState.board, gameState.turn, gameState.diceValue, gameState.alliances);
  }, [gameState.board, gameState.turn, gameState.diceValue, gameState.alliances, gameState.phase]);

  const movablePieces = useMemo(() => {
    if (!gameState.diceValue || gameState.phase !== GamePhase.PLAYING) return [];
    const movable: Position[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = gameState.board[r][c];
        if (piece && piece.player === gameState.turn) {
          const moves = findLegalMoves({ row: r, col: c }, gameState.board, gameState.turn, gameState.diceValue, gameState.alliances);
          if (moves.length > 0) {
            movable.push({ row: r, col: c });
          }
        }
      }
    }
    return movable;
  }, [gameState.board, gameState.turn, gameState.diceValue, gameState.alliances, gameState.phase]);

  const selectLanguage = (lang: Language) => {
    setGameState(prev => ({ ...prev, language: lang, phase: GamePhase.LOBBY }));
  };

  const startGame = () => {
    if (tempPlayerSelection.length < 2) {
      alert("At least two kingdoms must march to war.");
      return;
    }
    
    const initialBoard = getInitialBoard();
    const filteredBoard = initialBoard.map(row => 
      row.map(cell => (cell && tempPlayerSelection.includes(cell.player) ? cell : null))
    );

    setGameState(prev => ({
      ...prev,
      board: filteredBoard,
      phase: GamePhase.PLAYING,
      activePlayers: tempPlayerSelection,
      turn: tempPlayerSelection[0],
      initialPlayerCount: tempPlayerSelection.length,
      history: ["The Great War of Kingdoms has been declared."],
    }));
  };

  const restartCurrentWar = () => {
    if (window.confirm("Do you wish to restart the battle?")) {
      const initialBoard = getInitialBoard();
      const filteredBoard = initialBoard.map(row => 
        row.map(cell => (cell && gameState.activePlayers.includes(cell.player) ? cell : null))
      );
      
      setGameState(prev => ({
        ...prev,
        board: filteredBoard,
        turn: prev.activePlayers[0],
        selectedSquare: null,
        history: ["The battlefield has been cleared."],
        winners: [],
        diceValue: null,
        alliances: { [Player.P1]: null, [Player.P2]: null, [Player.P3]: null, [Player.P4]: null },
        scores: { [Player.P1]: 0, [Player.P2]: 0, [Player.P3]: 0, [Player.P4]: 0 },
      }));
      setShowDiplomacy(false);
    }
  };

  const submitSovereignty = () => {
    if (!submissionTarget) return;
    const targetPlayer = submissionTarget;
    const currentName = gameState.kingdomNames[gameState.turn];
    const targetName = gameState.kingdomNames[targetPlayer];

    setGameState(prev => {
      const { turn, board, activePlayers, scores, alliances } = prev;
      
      const newBoard = board.map(row => row.map(cell => (cell?.player === turn ? null : cell)));
      const newActive = activePlayers.filter(p => p !== turn);
      
      const newScores = { ...scores };
      newScores[targetPlayer] += scores[turn] + 5; 

      const newAlliances = { ...alliances };
      const partner = newAlliances[turn];
      if (partner) newAlliances[partner] = null;
      newAlliances[turn] = null;

      const newHistory = [`${currentName} has submitted to ${targetName}.`, ...prev.history];
      
      const finalWinners = newActive.length === 1 ? [newActive[0]] : [];
      const nextPh = finalWinners.length > 0 ? GamePhase.GAMEOVER : GamePhase.PLAYING;

      return {
        ...prev,
        board: newBoard,
        turn: nextTurn(turn, newActive),
        activePlayers: newActive,
        winners: finalWinners,
        history: newHistory,
        diceValue: null,
        selectedSquare: null,
        scores: newScores,
        alliances: newAlliances,
        phase: nextPh
      };
    });
    setSubmissionTarget(null);
    setShowDiplomacy(false);
  };

  const rollDice = () => {
    if (gameState.winners.length > 0 || gameState.diceValue) return;
    const val = Math.floor(Math.random() * 4) + 2; 
    setGameState(prev => ({ ...prev, diceValue: val }));
  };

  const nextTurn = (current: Player, active: Player[]): Player => {
    const players = [Player.P1, Player.P2, Player.P3, Player.P4];
    let idx = players.indexOf(current);
    let count = 0;
    do {
      idx = (idx + 1) % 4;
      count++;
      if (count > 8) return active[0]; 
    } while (!active.includes(players[idx]));
    return players[idx];
  };

  const skipTurn = () => {
    setGameState(prev => ({
      ...prev,
      turn: nextTurn(prev.turn, prev.activePlayers),
      diceValue: null,
      selectedSquare: null,
      history: [`${prev.kingdomNames[prev.turn]} passed their turn.`, ...prev.history]
    }));
  };

  const setAlliance = (target: Player | null) => {
    setGameState(prev => {
      const newAlliances = { ...prev.alliances };
      const currentTurn = prev.turn;
      
      const oldTarget = newAlliances[currentTurn];
      if (oldTarget) newAlliances[oldTarget] = null;

      if (target) {
        const targetOldPartner = newAlliances[target];
        if (targetOldPartner) newAlliances[targetOldPartner] = null;

        newAlliances[currentTurn] = target;
        newAlliances[target] = currentTurn;
      } else {
        newAlliances[currentTurn] = null;
      }

      const log = target 
        ? `Pact sealed: ${prev.kingdomNames[currentTurn]} & ${prev.kingdomNames[target]}.`
        : `Alliance with ${prev.kingdomNames[currentTurn]} dissolved.`;

      return {
        ...prev,
        alliances: newAlliances,
        history: [log, ...prev.history]
      };
    });
    setShowDiplomacy(false);
  };

  const handleSquareClick = (pos: Position) => {
    const { board, turn, selectedSquare, diceValue, activePlayers, phase, alliances, scores, kingdomNames } = gameState;
    if (phase !== GamePhase.PLAYING) return;

    if (selectedSquare) {
      if (isValidMove(selectedSquare, pos, board, turn, diceValue, alliances)) {
        const newBoard = board.map(row => [...row]);
        const movingPiece = newBoard[selectedSquare.row][selectedSquare.col]!;
        const capturedPiece = newBoard[pos.row][pos.col];
        
        newBoard[pos.row][pos.col] = movingPiece;
        newBoard[selectedSquare.row][selectedSquare.col] = null;

        let newActive = [...activePlayers];
        let newHistory = [`${kingdomNames[turn]}: ${PIECE_INFO[movingPiece.type].name} moved.`, ...gameState.history];
        let newScores = { ...scores };

        if (capturedPiece) {
          newScores[turn] += PIECE_VALUES[capturedPiece.type];
          if (capturedPiece.type === PieceType.RAJA) {
            newActive = newActive.filter(p => p !== capturedPiece.player);
            newHistory = [`KING OF ${kingdomNames[capturedPiece.player].toUpperCase()} CAPTURED!`, ...newHistory];
            for (let r = 0; r < 8; r++) {
              for (let c = 0; c < 8; c++) {
                if (newBoard[r][c]?.player === capturedPiece.player) newBoard[r][c] = null;
              }
            }
          }
        }

        const finalWinners = newActive.length === 1 ? [newActive[0]] : [];
        const nextPh = finalWinners.length > 0 ? GamePhase.GAMEOVER : GamePhase.PLAYING;

        setGameState(prev => ({
          ...prev,
          board: newBoard,
          turn: nextTurn(turn, newActive),
          selectedSquare: null,
          history: newHistory,
          activePlayers: newActive,
          winners: finalWinners,
          diceValue: null,
          scores: newScores,
          phase: nextPh
        }));
        return;
      }
    }

    const piece = board[pos.row][pos.col];
    if (piece && piece.player === turn && diceValue) {
      setGameState(prev => ({ ...prev, selectedSquare: pos }));
    } else {
      setGameState(prev => ({ ...prev, selectedSquare: null }));
    }
  };

  const possibleMoves = gameState.selectedSquare 
    ? findLegalMoves(gameState.selectedSquare, gameState.board, gameState.turn, gameState.diceValue, gameState.alliances)
    : [];

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-4">
      {/* LANGUAGE PICKER PHASE */}
      {gameState.phase === GamePhase.LANGUAGE_PICKER && (
        <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700 w-full max-w-full">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-12 tracking-widest uppercase animate-pulse text-[#d4af37] break-words">Chaturanga</h1>
          <div className="bg-[#1a1a1a] p-10 rounded border border-[#3c3c3c] shadow-2xl w-full max-w-md">
             <h2 className="text-xl font-bold mb-8 uppercase tracking-widest opacity-70 text-[#d4af37]">Choose Language / भाषा</h2>
             <div className="flex flex-col gap-4">
                <button onClick={() => selectLanguage(Language.EN)} className="py-4 border border-[#d4af37] rounded hover:bg-[#d4af37] hover:text-black transition-all font-bold text-[#d4af37]">English</button>
                <button onClick={() => selectLanguage(Language.HI)} className="py-4 border border-[#d4af37] rounded hover:bg-[#d4af37] hover:text-black transition-all font-bold text-[#d4af37]">हिन्दी</button>
                <button onClick={() => selectLanguage(Language.SA)} className="py-4 border border-[#d4af37] rounded hover:bg-[#d4af37] hover:text-black transition-all font-bold text-[#d4af37]">संस्कृतम्</button>
             </div>
          </div>
        </div>
      )}

      {/* LOBBY PHASE */}
      {gameState.phase === GamePhase.LOBBY && (
        <div className="flex flex-col items-center justify-center p-6 text-center animate-in slide-in-from-bottom-10 duration-500 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] text-[#d4af37] break-words px-2">{t.title}</h1>
          <p className="max-w-xl mb-12 text-[#a08050] text-sm md:text-lg leading-relaxed italic px-4">"{t.subtitle}"</p>

          <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#3c3c3c] shadow-2xl w-full max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-[#d4af37]">
              {[Player.P1, Player.P2, Player.P3, Player.P4].map(p => (
                <div key={p} className={`p-4 rounded border-2 transition-all flex flex-col gap-3 ${tempPlayerSelection.includes(p) ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#333] opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={tempPlayerSelection.includes(p)}
                      onChange={() => {
                        if (tempPlayerSelection.includes(p)) {
                          if (tempPlayerSelection.length > 1) setTempPlayerSelection(tempPlayerSelection.filter(x => x !== p));
                        } else {
                          setTempPlayerSelection([...tempPlayerSelection, p]);
                        }
                      }}
                      className="w-5 h-5 accent-[#d4af37]"
                    />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: PLAYER_INFO[p].color }} />
                    <span className="text-xs font-black uppercase tracking-widest">{PLAYER_INFO[p].side}</span>
                  </div>
                  <input 
                    type="text"
                    value={gameState.kingdomNames[p]}
                    onChange={(e) => setGameState(prev => ({
                      ...prev,
                      kingdomNames: { ...prev.kingdomNames, [p]: e.target.value }
                    }))}
                    className="bg-black border border-[#3c3c3c] p-2 text-xs text-white rounded focus:border-[#d4af37] outline-none"
                    placeholder={t.kingdomLabel}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button onClick={startGame} className="flex-2 py-4 px-8 bg-[#d4af37] text-black font-black uppercase tracking-widest rounded hover:brightness-110 shadow-lg">{t.march}</button>
              <button onClick={() => setShowRules(true)} className="flex-1 py-4 border border-[#d4af37]/50 text-[#d4af37] font-bold uppercase rounded hover:bg-[#d4af37]/10">{t.rules}</button>
            </div>
          </div>
          <footer className="mt-12 text-[#a08050] text-sm font-bold opacity-60 italic">{t.footer}</footer>
        </div>
      )}

      {/* PLAYING PHASE */}
      {(gameState.phase === GamePhase.PLAYING || gameState.phase === GamePhase.GAMEOVER) && (
        <>
          <header className="mb-4 text-center px-2">
            <h1 className="text-3xl md:text-5xl font-bold text-[#d4af37] tracking-[0.2em] uppercase break-words">{t.title}</h1>
            <p className="text-[#a08050] text-[10px] uppercase tracking-widest opacity-60 font-bold">{t.subtitle}</p>
          </header>

          <div className="flex flex-col xl:flex-row gap-6 items-start w-full max-w-7xl text-[#d4af37]">
            <div className="w-full xl:w-72 order-2 xl:order-1 flex flex-col gap-4">
              <div className="bg-[#1a1a1a] p-5 rounded border border-[#3c3c3c] shadow-2xl">
                <h2 className="text-[#d4af37] font-bold mb-4 border-b border-[#3c3c3c] pb-2 text-center uppercase tracking-wider text-xs">{t.sovereigns}</h2>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {[Player.P1, Player.P2, Player.P3, Player.P4].map(p => {
                    const isActive = gameState.activePlayers.includes(p);
                    const isTurn = gameState.turn === p;
                    const canMoveGlow = isTurn && gameState.diceValue !== null;
                    return (
                      <div key={p} className={`p-2 rounded border transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-20 pointer-events-none'} ${isTurn ? 'border-[#d4af37] bg-[#d4af37]/10 ring-1 ring-[#d4af37]' : 'border-transparent'} ${canMoveGlow ? 'shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-pulse' : ''}`}>
                        <div className="w-full h-1 mb-1" style={{ backgroundColor: PLAYER_INFO[p].color }} />
                        <div className="text-[10px] text-center font-black truncate uppercase">{gameState.kingdomNames[p]}</div>
                        <div className="text-[10px] text-center text-[#d4af37] font-bold mt-1">Karma: {gameState.scores[p]}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#121212] p-4 rounded border border-[#3c3c3c] flex flex-col items-center gap-3">
                   {!gameState.diceValue ? (
                     <button onClick={rollDice} className="w-full py-3 bg-[#d4af37] text-black font-black uppercase tracking-widest rounded hover:brightness-110 shadow-lg">{t.roll}</button>
                   ) : (
                     <div className="w-full flex flex-col items-center">
                       <div className="text-6xl font-black text-[#d4af37] animate-bounce">{gameState.diceValue}</div>
                       {!hasPossibleMoves && (
                         <button onClick={skipTurn} className="mt-4 w-full py-2 bg-red-900/40 text-red-400 border border-red-500/50 rounded text-[10px] font-black uppercase">Pass</button>
                       )}
                     </div>
                   )}
                </div>
              </div>

              <div className="bg-[#1a1a1a] p-4 rounded border border-[#3c3c3c] grid grid-cols-1 gap-2">
                <button onClick={() => setShowDiplomacy(true)} className="py-3 bg-[#2d1e14] text-[#d4af37] text-[10px] uppercase font-bold border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black transition-all">{t.pact}</button>
                <button onClick={() => setShowRules(true)} className="py-3 bg-[#2d1e14] text-[#d4af37] text-[10px] uppercase font-bold border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black transition-all">{t.rules}</button>
                <button onClick={restartCurrentWar} className="py-3 bg-[#2d1e14] text-[#d4af37] text-[10px] uppercase font-bold border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black transition-all">{t.restart}</button>
              </div>
            </div>

            <div className="flex-1 order-1 xl:order-2 flex flex-col items-center">
              <Board 
                board={gameState.board} 
                selectedSquare={gameState.selectedSquare} 
                onSquareClick={handleSquareClick} 
                possibleMoves={possibleMoves}
                movablePieces={movablePieces}
              />
              <footer className="mt-4 text-[#a08050] text-xs font-bold opacity-70">{t.footer}</footer>
              {gameState.winners.length > 0 && (
                <div className="mt-4 p-8 bg-[#d4af37] text-black font-black uppercase text-center rounded shadow-2xl border-4 border-black animate-bounce">
                  <div className="text-xl">Samrat {gameState.kingdomNames[gameState.winners[0]]}</div>
                  <button onClick={() => setGameState(prev => ({ ...prev, phase: GamePhase.LOBBY }))} className="mt-4 text-xs underline">Main Menu</button>
                </div>
              )}
            </div>

            <div className="w-full xl:w-72 order-3 flex flex-col">
              <div className="bg-[#1a1a1a] p-5 rounded border border-[#3c3c3c] shadow-2xl h-[550px] flex flex-col">
                <h2 className="text-[#d4af37] font-bold mb-4 border-b border-[#3c3c3c] pb-2 uppercase tracking-wider text-center text-xs">History</h2>
                <div className="overflow-y-auto flex-1 text-[10px] space-y-2 text-[#a08050] font-serif custom-scrollbar">
                   {gameState.history.map((h, i) => <div key={i} className="border-l border-[#d4af37]/20 pl-2">{h}</div>)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SHARED MODALS - Always available */}
      {showRules && (
        <div className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto p-4 md:p-10 flex items-center justify-center backdrop-blur-md">
          <div className="max-w-4xl w-full bg-[#1a1a1a] p-6 md:p-10 border-2 border-[#d4af37] rounded-lg relative shadow-2xl">
            <button onClick={() => setShowRules(false)} className="absolute top-4 right-6 text-4xl text-[#d4af37] hover:text-white transition-colors">&times;</button>
            <h2 className="text-3xl font-bold mb-8 text-center border-b border-[#d4af37]/30 pb-4 uppercase tracking-[0.2em] text-[#d4af37]">{t.rules}</h2>
            <div className="space-y-4 text-[#e0d0b0] text-sm md:text-base leading-relaxed h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
              {t.detailedRules.map((rule, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-[#d4af37] font-black">{idx + 1}.</span>
                  <p>{rule}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowRules(false)} className="mt-8 w-full py-4 bg-[#d4af37] text-black font-black uppercase tracking-widest rounded transition-all hover:scale-[0.98]">Got it</button>
          </div>
        </div>
      )}

      {showDiplomacy && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-[#1e1e1e] p-8 border border-[#d4af37] rounded-lg shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#d4af37]/30 pb-4 mb-6">
               <h3 className="text-[#d4af37] font-black uppercase tracking-widest">Diplomacy: {gameState.kingdomNames[gameState.turn]}</h3>
               <button onClick={() => { setShowDiplomacy(false); setSubmissionTarget(null); }} className="text-3xl text-[#d4af37] leading-none">&times;</button>
            </div>
            
            <div className="space-y-8">
              {!submissionTarget ? (
                <>
                  <div>
                    <h4 className="text-[10px] text-white/40 uppercase font-black mb-3 border-l-2 border-[#d4af37] pl-2">Alliance Pact</h4>
                    <div className="grid gap-2">
                      {[Player.P1, Player.P2, Player.P3, Player.P4]
                        .filter(p => p !== gameState.turn && gameState.activePlayers.includes(p))
                        .map(p => (
                          <button key={p} onClick={() => setAlliance(p)} className={`py-3 px-4 text-[11px] font-bold uppercase rounded border transition-all ${gameState.alliances[gameState.turn] === p ? 'bg-[#d4af37] text-black' : 'bg-black text-[#d4af37] border-[#3c3c3c]'}`}>
                            {gameState.alliances[gameState.turn] === p ? 'Dissolve' : `Pact with ${gameState.kingdomNames[p]}`}
                          </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] text-red-500/60 uppercase font-black mb-3 border-l-2 border-red-500 pl-2">Yield Sovereignty</h4>
                    <div className="grid gap-2">
                      {[Player.P1, Player.P2, Player.P3, Player.P4]
                        .filter(p => p !== gameState.turn && gameState.activePlayers.includes(p))
                        .map(p => (
                          <button key={p} onClick={() => setSubmissionTarget(p)} className="py-3 px-4 bg-red-900/10 border border-red-500/20 text-red-500 text-[11px] font-bold uppercase rounded hover:bg-red-500 hover:text-white transition-all">
                            Yield to {gameState.kingdomNames[p]}
                          </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center animate-in zoom-in-95 duration-200">
                  <h4 className="text-[#d4af37] font-black uppercase text-lg mb-4">Confirm Submission?</h4>
                  <p className="text-[#a08050] text-xs mb-8">
                    Your army will retreat and all your pieces will vanish. Sovereignty of {gameState.kingdomNames[gameState.turn]} will be transferred to {gameState.kingdomNames[submissionTarget]}.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setSubmissionTarget(null)} className="flex-1 py-3 border border-[#3c3c3c] text-white/50 text-[10px] uppercase font-black rounded hover:bg-white/5">Cancel</button>
                    <button onClick={submitSovereignty} className="flex-2 py-3 bg-red-600 text-white text-[10px] uppercase font-black rounded hover:bg-red-700 shadow-lg shadow-red-900/40">Confirm Submit</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default App;
