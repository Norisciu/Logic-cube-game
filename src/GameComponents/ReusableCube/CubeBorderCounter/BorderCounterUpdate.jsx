import { useRef } from "react";
import { useGameStateChange } from "../../../Hooks/useGameStateChange";
import { useOnPauseResume } from "../../../Hooks/useOnPauseResume";
import { useUnmountCleanup } from "../../../Hooks/useUnmountCleanup";
import SettingsModule from "../../../features/PlayingScreen/PlayingScreenSettings";

// this is not currently beaing usd in the program but an update of the old
// BorderCounter.jsx component
export function BorderCounter({ side }) {
  let prev = useRef(0);
  let timeRemainingRef = useRef(SettingsModule.TRIAL_TIME);
  let counterFillRef = useRef(null);
  let animationRef = useRef(null);

  const animateBorderCounter = (timestamp) => {
    let delta = timestamp - prev.current;
    prev.current = timestamp;

    let counterFillLength = counterFillRef.current.getTotalLength();
    timeRemainingRef.current -= delta;
    let timeRemaining = timeRemainingRef.current;
    let trialTime = SettingsModule.TRIAL_TIME;

    let progressPercent = Math.min(1, (trialTime - timeRemaining) / trialTime);
    let progress = counterFillLength - counterFillLength * progressPercent;
    counterFillRef.current.setAttribute("stroke-dashoffset", progress);

    if (progressPercent < 1) {
      animationRef.current = requestAnimationFrame(animateBorderCounter);
    }
  };

  const startAnimation = () => {
    prev.current = performance.now();
    timeRemainingRef.current = SettingsModule.TRIAL_TIME;
    animationRef.current = requestAnimationFrame(animateBorderCounter);
  };

  const stopAnimation = () => {
    animationRef.current = cancelAnimationFrame(animationRef.current);
  };

  useGameStateChange(
    SettingsModule.TRIAL_STATE_WAITING_PLAYER,
    startAnimation,
    stopAnimation
  );

  useOnPauseResume(stopAnimation, startAnimation);

  useUnmountCleanup(stopAnimation);

  return (
    <svg class="test-svg">
      <path
        class="counter-border"
        stroke="black"
        d="M 0 0 L  200 0 L 200 200 L 0 200 L 0 0"
        fill="none"
      />
      <path
        ref={counterFillRef}
        class="counter-fill"
        stroke="black"
        d="M 0 0 L  200 0 L 200 200 L 0 200 L 0 0"
        fill="none"
      />
    </svg>
  );
}
