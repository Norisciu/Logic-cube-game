import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { CubeFaceUpdate } from "./CubeFace/CubeFaceUpdate.jsx";
import { SelectionCubeFace } from "./CubeFace/SelectionCubeFace.jsx";
import { CorrectComponent } from "./Animations/TrialSolvdAnimation/CorrectComponent.jsx";
import MarkGroupAnimation from "./Animations/TrialFailAnimation/MarkGroupAnimation.jsx";
import SettingsModule from "../../features/PlayingScreen/PlayingScreenSettings";

import "./cubeReusableStyle.css";

const cubeSides = ["front", "back", "right", "left", "top", "bottom"];

export function CubeReusable({
  faceOnFront,
  trialInstruction,
  trialTime,
  animation,
  sideColors,
  checkSides,
  onTrialTimeout,
  onRotationEnd,
  onAnimationEnd,
  className,
}) {
  const cubeRef = useRef(null);
  const isGameOnPause = useSelector((state) => state.playingScreen.isOnPause);

  useEffect(() => {
    cubeRef.current.addEventListener("transitionend", onRotationEnd);
    cubeRef.current.addEventListener("animationend", onAnimationEnd);
  }, []);

  const checkIsRunning = () =>
    trialInstruction != "" && !animation && !isGameOnPause;

  const cubeFaces = cubeSides.map((side, idx) => {
    let isOnCubeFront = side === faceOnFront;
    const hasInstruction = trialInstruction != "";

    return hasInstruction && isOnCubeFront ? (
      <SelectionCubeFace
        key={idx}
        side={side}
        trialInstruction={trialInstruction}
        trialTime={trialTime}
        onTrialTimeout={onTrialTimeout}
        sideColors={sideColors}
        isRunning={checkIsRunning()}
      />
    ) : (
      <CubeFaceUpdate key={idx} side={side} />
    );
  });

  const animationElement = () => {
    if (!animation) {
      return;
    }
    if (animation === SettingsModule.CORRECT_ANSWER) {
      return <CorrectComponent onAnimationEnd={onAnimationEnd} />;
    }

    if (animation === SettingsModule.WRONG_ANSWER) {
      return (
        <MarkGroupAnimation
          onAnimationEnd={onAnimationEnd}
          checkSides={checkSides}
        />
      );
    }
  };

  return (
    <div className={`cube-wrapper`}>
      <div className={`cube show-${faceOnFront} ${className}`} ref={cubeRef}>
        {cubeFaces}
      </div>
      {animationElement()}
    </div>
  );
}

CubeReusable.defaultProps = {
  trialInstruction: "",
  trialTime: undefined,
  onTrialTimeout: (f) => f,
  onAnimationEnd: (f) => f,
  sideColors: {},
  animation: undefined,
  className: "",
};
