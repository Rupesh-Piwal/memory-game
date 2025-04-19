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
    const numbers = [
      ...Array(pairCount)
        .keys()
        .map((n) => n + 1),
    ];
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setWon(false);
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    console.log(numbers);
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
      <div className="grid grid-cols-4">
        {cards.map((card) => {
          return (
            <div className="bg-slate-700 m-1 rounded flex items-center justify-center h-[60px]" key={card.id}>
              {card.number}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
