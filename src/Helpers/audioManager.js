import { bonusAudio, errorPlayAudio, gameAudio } from "../Constants/constants";

export const setMuteState = (isMuted) => {
    gameAudio.muted = isMuted;
    bonusAudio.muted = isMuted;
    errorPlayAudio.muted = isMuted;
};

export const toggleAudio = (isMuted, setIsMuted) => {
    const newMutedState = !isMuted;
    localStorage.setItem('isMuted', newMutedState);
    setIsMuted(newMutedState);
};
