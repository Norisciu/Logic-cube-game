import React, { useEffect, useRef, useState } from "react";
import SettingsModule from "../PlayingScreenSettings";
import "./sessionCounterStyle.css";

const formatTime = (seconds) => {
  let minutes = `${Math.floor(seconds / 60)}`.padStart(2, "0");
  seconds = `${seconds % 60}`.padStart(2, "0");
  return `${minutes} : ${seconds}`;
};

// not currently in use
// intendeod to be an update to the SessionCounterUpdate.jsx component
export function SessionCounterUpdate({ onTimeEndCallback = (f) => f }) {
  const [currentTime, setCurrentTime] = useState(
    SettingsModule.SESSION_DURATION_SECONDS
  );
  const isStop = useRef(false);
  const timer = useRef();

  const start = () => {
    timer.current = setInterval(() => setCurrentTime((time) => time - 1), 1000);
    isStop.current = false;
  };

  const stop = () => {
    clearInterval(timer.current);
    isStop.current = true;
  };

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  useOnPauseResume(stop, start);
  useUnmountCleanup(stop);

  useEffect(() => {
    if (currentTime > 0 || isStop.current) {
      return;
    }
    stop();
    onTimeEndCallback();
  }, [currentTime]);

  return (
    <div className="session-counter">Time : {formatTime(currentTime)}</div>
  );
}
