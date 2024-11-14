export const handleJoystickMove = (event, handleDirectionChange) => {
    const { direction } = event;
    switch (direction) {
        case "RIGHT":
            handleDirectionChange("ArrowRight");
            break;
        case "LEFT":
            handleDirectionChange("ArrowLeft");
            break;
        case "FORWARD":
            handleDirectionChange("ArrowUp");
            break;
        case "BACKWARD":
            handleDirectionChange("ArrowDown");
            break;
        default:
            break;
    }
};
