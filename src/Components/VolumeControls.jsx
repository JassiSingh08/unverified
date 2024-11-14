import React from "react";
import { VolumeKnob, VolumeMute } from "../Constants/constants";

const VolumeControls = ({ isMuted, onclick }) => {
  return (
    <div className="volume" onClick={onclick}>
      {isMuted ? <VolumeMute /> : <VolumeKnob />}
    </div>
  );
};

export default VolumeControls;
