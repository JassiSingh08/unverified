import React from "react";
import GameOver from "./GameOver";

const GameControls = ({ gameOver, points, isPlaying, onClick }) => {
  return (
    <div>
      {gameOver ? (
        <GameOver score={points} />
      ) : (
        <button onClick={onClick}>{isPlaying ? "STOP" : "START"} GAME</button>
      )}
    </div>
  );
};

export default GameControls;
