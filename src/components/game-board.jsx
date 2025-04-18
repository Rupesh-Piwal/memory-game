import React, { useState } from "react";

const GameBoard = () => {
  const [gridSize, setGridSize] = useState(4);
  // TODOs1: create local state for => 1.gridsize keep it 4 as default, 2.flipped cards empty-array, 3.empty aray for cards, 4.matched empty array, 5.disabled state, 6.won state.

  // TODOs2: create a function handleGridSize which has a variable size

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  return (
    <div>
      <h2>Memory Card Game</h2>
      <input
        className="border border-gray-700 rounded px-2 py-1"
        type="number"
        name="grid-size"
        id="gridSize"
        min={2}
        max={10}
        value={gridSize}
        onChange={handleGridSize}
      />
    </div>
  );
};

export default GameBoard;
