import { RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";

const GameBoard = () => {
  const [gridSize, setGridSize] = useState(4);
  const [flipped, setFlipped] = useState([]);
  const [cards, setCards] = useState([]);
  const [matched, setMatched] = useState([]);
  const [won, setWon] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchCount, setMatchCount] = useState(0);

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 6) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setWon(false);
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    setMoves(0);
    setMatchCount(0);
  };

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setMatched([...matched, firstId, secondId]);
      setMatchCount((prev) => prev + 1);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 800);
    }
  };

  const handleClick = (id) => {
    if (disabled || won || flipped.includes(id)) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      setMoves(moves + 1);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || matched.includes(id);
  const isSolved = (id) => matched.includes(id);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [matched, cards]);

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4 sm:px-6 py-8 sm:py-10">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 sm:mb-8 tracking-tight text-center">
        Memory Match
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl gap-6 sm:gap-10 mb-10">
        <div className="w-full sm:w-auto text-center sm:text-left">
          <label
            htmlFor="gridSize"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Grid Size: {gridSize}×{gridSize}
          </label>
          <input
            className="w-full sm:w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            type="range"
            id="gridSize"
            min={2}
            max={6}
            value={gridSize}
            onChange={handleGridSizeChange}
          />
        </div>

        <div className="text-center sm:text-right">
          <p className="text-sm text-gray-600 mb-1">Moves</p>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
            {moves}
          </p>
          <p className="text-sm mt-1 text-gray-600">
            Matches: <span className="font-bold">{matchCount}</span>
          </p>
        </div>
      </div>

      
 {/* GAME-GRID  */}
      <div
        className="grid gap-3 sm:gap-4 mb-10"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(100%, ${gridSize * 5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`aspect-square flex items-center justify-center text-xl sm:text-2xl font-bold rounded-xl cursor-pointer transition-all duration-300 transform ${
              isFlipped(card.id)
                ? isSolved(card.id)
                  ? "bg-emerald-500 text-white scale-105 shadow-lg shadow-emerald-200"
                  : "bg-indigo-500 text-white scale-105 shadow-lg shadow-indigo-200"
                : "bg-white text-gray-300 border border-gray-300 hover:bg-gray-100 hover:scale-105"
            }`}
          >
            {isFlipped(card.id) ? card.number : ""}
          </div>
        ))}
      </div>

    
      {won && (
        <div className="mb-6 text-center text-2xl sm:text-3xl font-semibold text-emerald-600 animate-pulse">
          🎉 You Won in <span className="font-bold">{moves}</span> moves!
        </div>
      )}

    
      <button
        onClick={initializeGame}
        className="px-5 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 text-sm sm:text-base"
      >
        {won ? (
          <>
            Play Again <RotateCcw className="w-4 h-4" />
          </>
        ) : (
          "Reset Game"
        )}
      </button>
    </div>
  );
};

export default GameBoard;
