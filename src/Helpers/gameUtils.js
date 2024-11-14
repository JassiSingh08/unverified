import { UP, DOWN, LEFT, RIGHT, ROWS, COLS, DEFAULT_LENGTH, bonusAudio } from "../Constants/constants";

// Direction handling
export const getNewDirection = (key, currentDirection) => {
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
            return currentDirection;
    }
};

// Collision checking
export const collisionCheck = (snakeHead, snakeCoordinatesMap) => {
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

// Food positioning
export const populateFoodBall = (foodCoords) => {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);

    foodCoords.current = { row, col };
};

export const syncSnakeCoordinatesMap = (snakeCoordinates, snakeCoordinatesMap) => {
    const snakeCoordsSet = new Set(
        snakeCoordinates.current.map((coord) => `${coord.row}:${coord.col}`)
    );
    snakeCoordinatesMap.current = snakeCoordsSet;
};

export const snakePositions = (snakeCoordinates) => {
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
}

// Move Snake
export const moveSnake = (gameOver, setPlaying, snakeCoordinates, foodCoords, currentDirection, setPoints, snakeCoordinatesMap, stopGame) => {
    if (gameOver) return;

    setPlaying((s) => s + 1);

    const coords = snakeCoordinates.current;
    const snakeTail = coords[0];
    const snakeHead = coords.pop();

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
    switch (currentDirection) {
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
        default:
            break;
    }

    // If food ball is consumed, update points and new position of food
    if (foodConsumed) {
        setPoints((points) => points + 10);
        populateFoodBall(foodCoords);
        bonusAudio.play();
    }

    // If there is no collision for the movement, continue the game
    const collided = collisionCheck(snakeHead, snakeCoordinatesMap);
    if (collided) {
        stopGame();
        return;
    }

    // Create new coords with new snake head
    coords.push(snakeHead);
    snakeCoordinates.current = foodConsumed
        ? [snakeTail, ...coords]
        : coords;
    syncSnakeCoordinatesMap(snakeCoordinates, snakeCoordinatesMap);
};
