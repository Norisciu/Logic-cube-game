import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SettingsModule from "../../../features/PlayingScreen/PlayingScreenSettings";
import { useGameStateChange } from "../../../Hooks/useGameStateChange";
import { useUnmountCleanup } from "../../../Hooks/useUnmountCleanup";

export function BorderCounter({
  onTrialTimeout,
  trialTimeLittleProp,
  isRunning,
}) {
  let prev = useRef(0);

  let timeRemainingRef = useRef(trialTimeLittleProp);

  let counterFillRef = useRef(null);
  let animationIterationsRef = useRef(0);
  let animationRef = useRef(null);

  const isAnimationRunningRef = useRef(true);

  const isGameOnPause = useSelector((state) => state.playingScreen.isOnPause);
  useEffect(() => {
    if (isGameOnPause) {
      return stopCounter();
    }

    resumeCounter();
  }, [isGameOnPause]);

  const animateBorderCounter = (timestamp) => {
    if (!isAnimationRunningRef.current) {
      return;
    }
    if (!counterFillRef.current) {
      return;
    }
    animationIterationsRef.current++;
    let delta = timestamp - prev.current;
    prev.current = timestamp;

    let counterFillLength = counterFillRef.current.getTotalLength();

    timeRemainingRef.current -= delta;
    let timeRemaining = timeRemainingRef.current;

    let trialTime = trialTimeLittleProp;

    let progressPercent = Math.min(1, (trialTime - timeRemaining) / trialTime);
    let progress = counterFillLength - counterFillLength * progressPercent;
    counterFillRef.current.setAttribute("stroke-dashoffset", progress);
    counterFillRef.current.setAttribute("stroke-dasharray", counterFillLength);

    if (progressPercent < 1) {
      animationRef.current = requestAnimationFrame(animateBorderCounter);
    } else {
      onTrialTimeout();
    }
  };

  useEffect(() => {
    if (!isRunning) {
      stopCounter();
    }
  }, [isRunning]);

  const startCounter = () => {
    prev.current = performance.now();

    timeRemainingRef.current = trialTimeLittleProp;

    animationRef.current = requestAnimationFrame(animateBorderCounter);
  };

  const stopCounter = () => {
    isAnimationRunningRef.current = false;
    cancelAnimationFrame(animationRef.current);
  };

  const resumeCounter = () => {
    prev.current = performance.now();
    isAnimationRunningRef.current = true;
    animationRef.current = requestAnimationFrame(animateBorderCounter);
  };
  useGameStateChange(
    SettingsModule.TRIAL_STATE_WAITING_PLAYER,
    startCounter,
    stopCounter
  );

  useUnmountCleanup(() => {
    stopCounter();
  });

  const [windowDimensions, setWindowDimensions] = useState({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  const svgRef = useRef();

  const obtainPath = () => {
    if (!svgRef.current) {
      return;
    }

    const svgBox = svgRef.current.getBoundingClientRect();
    const { width, height } = svgBox;
    const result = `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} L 0 0`;
    return result;
  };

  if (!trialTimeLittleProp) {
    return null;
  }

  return (
    <svg ref={svgRef} className="test-svg">
      <path
        className="counter-border"
        stroke="black"
        d={obtainPath()}
        fill="none"
      />

      <path
        ref={counterFillRef}
        className="counter-fill"
        stroke="black"
        d={obtainPath()}
        fill="none"
      />
    </svg>
  );
}
