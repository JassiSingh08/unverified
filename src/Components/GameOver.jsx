import React from "react";

function GameOver({ score }) {
  const handleReload = () => {
    window.location.reload(); 
  };

  return (
    <>
      <button onClick={handleReload}>Reload</button>
      <div id="GameOverArea">
        <p className="game-over">GAME OVER</p>
        <span className="game-over">Your score: {score}</span>
      </div>
    </>
  );
}

export default GameOver;
