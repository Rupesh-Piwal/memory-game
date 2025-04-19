import React, { useEffect, useState } from "react";

const GameBoard = () => {
  const [gridSize, setGridSize] = useState(4);
  const [flipped, setFlipped] = useState([]);
  const [cards, setCards] = useState([]);
  const [matched, setMatched] = useState([]);
  const [won, setWon] = useState(false);

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const intializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const number = [
      ...Array(pairCount)
        .keys()
        .map((n) => n + 1),
    ];
    const shuffledCards = [...number, ...number];
    Math.random(shuffledCards.sort((a, b) => a - b));
    setWon(false);
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    console.log(number);
    console.log(shuffledCards);
  };

  useEffect(() => {
    intializeGame();
  }, [gridSize]);

  return (
    <div className="">
      <h2 className="text-[40px] font-bold mb-4">Memory Card Game</h2>
      <input
        className="w-[200px] border border-gray-700 rounded px-2 py-1"
        type="number"
        name="grid-size"
        id="gridSize"
        min={2}
        max={10}
        value={gridSize}
        onChange={handleGridSizeChange}
      />
      <div></div>
    </div>
  );
};

export default GameBoard;
