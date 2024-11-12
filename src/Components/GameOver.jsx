import React from "react";

function GameOver({ score }) {
  const handleReload = () => {
    window.location.reload(); // This will reload the page
  };

  return (
    <div id="GameBoard">
      <div id="GameOverText">
        <span className="game-over">Your score: {score}</span>

        <button onClick={handleReload}>Reload</button>
      </div>
    </div>
  );
}

export default GameOver;
