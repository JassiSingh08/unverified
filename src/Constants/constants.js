// assets
import gameplayAudio from '../assets/gameplay.mp3';
import pointAudio from '../assets/point.mp3';
import errorAudio from '../assets/error.mp3';

// Constants and settings
const COLS = 48;
const ROWS = 48;
const DEFAULT_LENGTH = 10;
const SPEED = 50;

// Direction symbols
const UP = Symbol("up");
const DOWN = Symbol("down");
const RIGHT = Symbol("right");
const LEFT = Symbol("left");

// Audio files
const gameAudio = new Audio(gameplayAudio);
const bonusAudio = new Audio(pointAudio);
const errorPlayAudio = new Audio(errorAudio);

const VolumeKnob = () => <span>🔊</span>;
const VolumeMute = () => <span>🔇</span>;

// Export everything
export {
    COLS,
    ROWS,
    DEFAULT_LENGTH,
    SPEED,
    UP,
    DOWN,
    RIGHT,
    LEFT,
    gameAudio,
    bonusAudio,
    errorPlayAudio,
    VolumeKnob,
    VolumeMute,
};
