import React from "react";
import { BorderCounter } from "../CubeBorderCounter/BorderCounter.jsx";
import { CubeFaceUpdate } from "./CubeFaceUpdate.jsx";
import { FaceSide } from "./FaceSide/FaceSide.jsx";

import { TrialInstruction } from "../TrialInstruction/TrialInstruction.jsx";

export const SelectionCubeFace = ({
  trialInstruction,
  onTrialTimeout,
  sideColors,
  trialTime,
  isRunning,
  ...props
}) => {
  const faceSides = Object.entries(sideColors)
    .filter(([_, color]) => color)
    .map(([side, color]) => <FaceSide side={side} color={color} key={side} />);
  return (
    <CubeFaceUpdate {...props}>
      <TrialInstruction instruction={trialInstruction} />
      <BorderCounter
        side={props.side}
        trialTimeLittleProp={trialTime}
        onTrialTimeout={onTrialTimeout}
        isRunning={isRunning}
      />
      {faceSides}
    </CubeFaceUpdate>
  );
};

SelectionCubeFace.defaultProps = {
  isRunning: true,
};
