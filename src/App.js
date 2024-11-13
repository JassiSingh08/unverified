import { useCallback, useEffect, useRef, useState } from "react";
import { Joystick } from "react-joystick-component";
import GameOver from "./Components/GameOver";
import { bonusAudio, COLS, DOWN, errorPlayAudio, gameAudio, LEFT, RIGHT, ROWS, UP, DEFAULT_LENGTH, SPEED, VolumeMute, VolumeKnob } from "./Constants/constants";

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
  const [highScore, setHighScore] = useState(0);
  const [gamepadConnected, setGameOverConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const savedMuteState = localStorage.getItem('isMuted');
    return savedMuteState === 'true';
  });

  useEffect(() => {
    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (points > highScore) {
      setHighScore(points);
      localStorage.setItem("highScore", points); // Save to local storage
    }
  }, [points, highScore]);

  useEffect(() => {
    gameAudio.muted = isMuted;
    bonusAudio.muted = isMuted;
    errorPlayAudio.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => handleDirectionChange(e.key));
  }, []);

  useEffect(() => {
    // Default snake length is 4 cell
    const snake_postions = [];
    for (let i = 0; i < DEFAULT_LENGTH; i++) {
      snake_postions.push({
        row: 0,
        col: i,
        isHead: false,
      });
    }

    snake_postions[DEFAULT_LENGTH - 1].isHead = true;
    snakeCoordinates.current = snake_postions;

    syncSnakeCoordinatesMap();
    populateFoodBall();
  }, []);

  const handleDirectionChange = (key) => {
    direction.current = getNewDirection(key);
  };

  const getNewDirection = (key) => {
    switch (key) {
      case "ArrowUp":
        return UP;
      case "ArrowDown":
        return DOWN;
      case "ArrowRight":
        return RIGHT;
      case "ArrowLeft":
        return LEFT;
      default:
        return direction.current;
    }
  };

  const syncSnakeCoordinatesMap = () => {
    const snakeCoordsSet = new Set(
      snakeCoordinates.current.map((coord) => `${coord.row}:${coord.col}`)
    );
    snakeCoordinatesMap.current = snakeCoordsSet;
  };

  useEffect(() => {
    const handleKeyDown = (e) => handleDirectionChange(e.key);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const moveSnake = () => {
    if (gameOver) return;

    setPlaying((s) => s + 1);

    const coords = snakeCoordinates.current;
    const snakeTail = coords[0];
    const snakeHead = coords.pop();
    const curr_direction = direction.current;

    // Check for food ball consumption
    const foodConsumed =
      snakeHead.row === foodCoords.current.row &&
      snakeHead.col === foodCoords.current.col;

    // Update body coords based on direction and its position
    coords.forEach((_, idx) => {
      // Replace last cell with snake head coords [last is the cell after snake head]
      if (idx === coords.length - 1) {
        coords[idx] = { ...snakeHead };
        coords[idx].isHead = false;
        return;
      }

      // Replace current cell coords with next cell coords
      coords[idx] = coords[idx + 1];
    });

    // Update snake head coords based on direction
    switch (curr_direction) {
      case UP:
        snakeHead.row -= 1;
        break;
      case DOWN:
        snakeHead.row += 1;
        break;
      case RIGHT:
        snakeHead.col += 1;
        break;
      case LEFT:
        snakeHead.col -= 1;
        break;
    }

    // If food ball is consumed, update points and new position of food
    if (foodConsumed) {
      setPoints((points) => points + 10);
      populateFoodBall();
      bonusAudio.play();
    }

    // If there is no collision for the movement, continue the game
    const collided = collisionCheck(snakeHead);
    if (collided) {
      stopGame();
      return;
    }

    // Create new coords with new snake head
    coords.push(snakeHead);
    snakeCoordinates.current = foodConsumed
      ? [snakeTail, ...coords]
      : coords;
    syncSnakeCoordinatesMap();
  };

  const collisionCheck = (snakeHead) => {
    if (
      snakeHead.col >= COLS ||
      snakeHead.row >= ROWS ||
      snakeHead.col < 0 ||
      snakeHead.row < 0
    ) {
      return true;
    }
    const coordsKey = `${snakeHead.row}:${snakeHead.col}`;
    if (snakeCoordinatesMap.current.has(coordsKey)) {
      return true;
    }
    return false;
  };


  const populateFoodBall = async () => {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);

    foodCoords.current = {
      row,
      col,
    };
  };

  const startGame = async () => {
    // window.ReactNativeWebView.postMessage("Hello from the website!");
    const interval = setInterval(() => {
      moveSnake();
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
    [isPlaying]
  );

  const toggleAudio = () => {
    setIsMuted((prevState) => {
      const newMutedState = !prevState;
      localStorage.setItem('isMuted', newMutedState);
      return newMutedState;
    });
  };

  const handleJoystickMove = (event) => {
    const { direction } = event;
    // Update direction based on joystick movement

    switch (direction) {
      case "RIGHT":
        handleDirectionChange("ArrowRight")
        break;
      case "LEFT":
        handleDirectionChange("ArrowLeft")
        break;
      case "FORWARD":
        handleDirectionChange("ArrowUp")
        break;
      case "BACKWARD":
        handleDirectionChange("ArrowDown")
        break;
      default:
        break;
    }
  };


  useEffect(() => {
    const gamepadHandler = (event) => {
      setGameOverConnected(true)
      console.log(`Gamepad ${event.type}:`, event.gamepad);
    };

    window.addEventListener("gamepadconnected", gamepadHandler);
    window.addEventListener("gamepaddisconnected", () => { setGameOverConnected(false) });

    // Poll for gamepad input on a timer
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (gamepads[0]) {
        const { buttons } = gamepads[0];

        if (buttons[12]?.pressed) {
          console.log("D-pad Up pressed");
          handleDirectionChange("ArrowUp");
        }
        if (buttons[13]?.pressed) {
          console.log("D-pad Down pressed");
          handleDirectionChange("ArrowDown");
        }
        if (buttons[14]?.pressed) {
          console.log("D-pad Left pressed");
          handleDirectionChange("ArrowLeft");
        }
        if (buttons[15]?.pressed) {
          console.log("D-pad Right pressed");
          handleDirectionChange("ArrowRight");
        }
      }
      requestAnimationFrame(pollGamepad);
    };


    pollGamepad();


    return () => {
      window.removeEventListener("gamepadconnected", gamepadHandler);
      window.removeEventListener("gamepaddisconnected", gamepadHandler);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="volume" onClick={toggleAudio}>
        {isMuted ? <VolumeMute /> : <VolumeKnob />}
      </div>
      <div className="score">
        <div>HIGH-SCORE: {highScore}</div>
        <div >SCORE: {points}</div>
      </div>
      {gameOver ? (
        <>
          <p className="game-over">GAME OVER</p>
          <GameOver score={points} />
        </>
      ) : (
        <>
          {gamepadConnected ? <span>Gamepad Connected</span> : <></>}
          <button onClick={isPlaying ? stopGame : startGame}>
            {isPlaying ? "STOP" : "START"} GAME
          </button>
        </>
      )}
      <div className="board">
        {grid.current?.map((row, row_idx) => (
          <div key={row_idx} className="row">
            {row.map((_, col_idx) => getCell(row_idx, col_idx))}
          </div>
        ))}
      </div>
      <div className="keys-container">
        <Joystick size={130} move={handleJoystickMove} ></Joystick>
      </div>
    </div>
  );
}

export default App;