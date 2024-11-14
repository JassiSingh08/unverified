import React, { useEffect, useState } from "react";

const Scores = ({ points }) => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (points > highScore) {
      setHighScore(points);
      localStorage.setItem("highScore", points);
    }
  }, [points, highScore]);

  return (
    <div className="score">
      <div>HIGH-SCORE: {highScore}</div>
      <div>SCORE: {points}</div>
    </div>
  );
};

export default Scores;
