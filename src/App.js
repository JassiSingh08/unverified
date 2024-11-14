import { useCallback, useEffect, useRef, useState } from "react";
import { Joystick } from "react-joystick-component";
import { COLS, DOWN, errorPlayAudio, gameAudio, ROWS, SPEED } from "./Constants/constants";
import { handleJoystickMove } from "./Helpers/inputHandler";
import { setMuteState, toggleAudio } from './Helpers/audioManager';
import { getNewDirection, moveSnake, populateFoodBall, snakePositions, syncSnakeCoordinatesMap } from "./Helpers/gameUtils";
import Scores from "./Components/Scores";
import VolumeControls from "./Components/VolumeControls";
import GameControls from "./Components/GameControls";

function App() {
  const timer = useRef(null);
  const grid = useRef(Array(ROWS).fill(Array(COLS).fill("")));
  const snakeCoordinates = useRef([]);
  const direction = useRef(DOWN);
  const snakeCoordinatesMap = useRef(new Set());
  const foodCoords = useRef({
    row: -1,
    col: -1,
  });
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setPlaying] = useState(0);
  const [isMuted, setIsMuted] = useState(localStorage.getItem('isMuted') === 'true');

  useEffect(() => {
    window.addEventListener("keydown", (e) => handleDirectionChange(e.key));
    snakePositions(snakeCoordinates);
    syncSnakeCoordinatesMap(snakeCoordinates, snakeCoordinatesMap);
    populateFoodBall(foodCoords);
  }, []);

  const handleDirectionChange = (key) => {
    direction.current = getNewDirection(key, direction.current);
  };

  const startGame = async () => {
    // window.ReactNativeWebView.postMessage("Hello from the website!");
    const interval = setInterval(() => {
      moveSnake(
        gameOver, setPlaying, snakeCoordinates, foodCoords, direction.current, setPoints, snakeCoordinatesMap, stopGame
      );
    }, SPEED);

    timer.current = interval;
    gameAudio.play();
  };

  const stopGame = async () => {
    gameAudio.pause();
    errorPlayAudio.play();
    setGameOver(true);
    setPlaying(false);
    if (timer.current) {
      clearInterval(timer.current);
    }
  };

  const getCell = useCallback(
    (row_idx, col_idx) => {
      const coords = `${row_idx}:${col_idx}`;
      const foodPos = `${foodCoords.current.row}:${foodCoords.current.col}`;
      const head =
        snakeCoordinates.current[snakeCoordinates.current.length - 1];
      const headPos = `${head?.row}:${head?.col}`;

      const isFood = coords === foodPos;
      const isSnakeBody = snakeCoordinatesMap.current.has(coords);
      const isHead = headPos === coords;

      let className = "cell";
      if (isFood) {
        className += " food";
      }
      if (isSnakeBody) {
        className += " body";
      }
      if (isHead) {
        className += " head";
      }

      return <div key={col_idx} className={className}></div>;
    },
    []
  );

  useEffect(() => {
    setMuteState(isMuted);
  }, [isMuted]);

  const handleToggleAudio = () => toggleAudio(isMuted, setIsMuted);

  return (
    <div className="app-container">
      <VolumeControls isMuted={isMuted} onclick={handleToggleAudio} />
      <Scores points={points} />
      <GameControls
        gameOver={gameOver}
        points={points}
        isPlaying={isPlaying}
        onClick={isPlaying ? stopGame : startGame} />

      <div className="board">
        {grid.current?.map((row, row_idx) => (
          <div key={row_idx} className="row">
            {row.map((_, col_idx) => getCell(row_idx, col_idx))}
          </div>
        ))}
      </div>

      <div className="keys-container">
        <Joystick size={130} move={(e) => handleJoystickMove(e, handleDirectionChange)} />
      </div>
    </div>
  );
}

export default App;