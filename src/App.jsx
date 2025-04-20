import React from "react";
import GameBoard from "./components/game-board";


const App = () => {
  return (
    <div className="bg-[#1a1a1a] min-h-screen flex flex-col justify-center items-center text-[#ffffff]">
      <GameBoard />
    </div>
  );
};

export default App;
