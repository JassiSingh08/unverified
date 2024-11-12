import React, { useState, useEffect } from "react";
import "./SnakeGame.css";

const ROWS = 19;
const COLS = 19;
const INITIAL_SNAKE = [{ row: 10, col: 10 }];
const INITIAL_DIRECTION = "RIGHT";

const generateFood = () => {
  return {
    row: Math.floor(Math.random() * ROWS),
    col: Math.floor(Math.random() * COLS),
  };
};

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(generateFood());
  const [gameOver, setGameOver] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [score, setScore] = useState(0);

  const checkCollision = (snake) => {
    const head = snake[0];
    return (
      snake
        .slice(1)
        .some(
          (segment) => segment.row === head.row && segment.col === head.col
        ) ||
      head.row < 0 ||
      head.row >= ROWS ||
      head.col < 0 ||
      head.col >= COLS
    );
  };

  useEffect(() => {
    if (gameOver) {
      const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          resetGame();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [gameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    if (!gameOver && !isPause) {
      const moveSnake = () => {
        const newSnake = snake.map((segment) => ({ ...segment }));

        const head = { ...newSnake[0] };

        switch (direction) {
          case "UP":
            head.row = (head.row - 1 + ROWS) % ROWS;
            break;
          case "DOWN":
            head.row = (head.row + 1) % ROWS;
            break;
          case "LEFT":
            head.col = (head.col - 1 + COLS) % COLS;
            break;
          case "RIGHT":
            head.col = (head.col + 1) % COLS;
            break;
          default:
            break;
        }

        newSnake.unshift(head);

        if (head.row === food.row && head.col === food.col) {
          setFood(generateFood());
          setScore(score + 10);
        } else {
          newSnake.pop();
        }

        if (checkCollision(newSnake)) {
          setGameOver(true);
        } else {
          setSnake(newSnake);
        }
      };

      const gameInterval = setInterval(moveSnake, 100);

      return () => {
        clearInterval(gameInterval);
      };
    }
  }, [snake, direction, food, gameOver, isPause, score]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection("UP");
          break;
        case "ArrowDown":
          setDirection("DOWN");
          break;
        case "ArrowLeft":
          setDirection("LEFT");
          break;
        case "ArrowRight":
          setDirection("RIGHT");
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="App">
      <h3>Play a Snake Game Until</h3>
      <div className="game-board">
        <p className="absolute"> 🚀 {score}</p>
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: COLS }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${
                  snake.some(
                    (segment) =>
                      segment.row === rowIndex && segment.col === colIndex
                  )
                    ? "snake"
                    : ""
                } ${
                  food.row === rowIndex && food.col === colIndex ? "food" : ""
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="reset">
          <p>
            Game Over! <b>Your Score 🐍 {score}</b>
          </p>
          <button onClick={resetGame}>Press Enter to Restart</button>
        </div>
      )}
      <div className="control">
        <button
          onClick={() => {
            setIsPause(!isPause);
          }}
        >
          {" "}
          {isPause ? "Resume" : "Pause"}
        </button>
        <p> Score : 🚀 {score}</p>
        <div className="button">
          <button className="up" onClick={() => setDirection("UP")}>
            ↑
          </button>
          <br />
          <button className="left" onClick={() => setDirection("LEFT")}>
            ←
          </button>
          <button className="right" onClick={() => setDirection("RIGHT")}>
            →
          </button>
          <br />
          <button className="down" onClick={() => setDirection("DOWN")}>
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
