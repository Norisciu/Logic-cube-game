import React, { useEffect, useRef, useState } from "react";
import { useUnmountCleanup } from "../../../Hooks/useUnmountCleanup";
import SettingsModule from "../PlayingScreenSettings";
import "./sessionCounterStyle.css";
import { useSelector } from "react-redux";

const formatTime = (seconds) => {
  let minutes = `${Math.floor(seconds / 60)}`.padStart(2, "0");
  seconds = `${seconds % 60}`.padStart(2, "0");
  return `${minutes} : ${seconds}`;
};

export function SessionCounter({ className, onTimeEndCallback = (f) => f }) {
  const [currentTime, setCurrentTime] = useState(
    SettingsModule.SESSION_DURATION_SECONDS
  );
  const isGameOnPause = useSelector((state) => state.playingScreen.isOnPause);
  const isStop = useRef(false);
  const timer = useRef();

  const classes = ["session-counter", className].join(" ");

  useEffect(() => {
    if (isGameOnPause) {
      stopCounter();
    } else {
      startCounter();
    }
  }, [isGameOnPause]);

  useEffect(() => {
    if (currentTime > 0 || isStop.current) {
      return;
    }
    isStop.current = true;
    clearInterval(timer.current);

    onTimeEndCallback();
  }, [currentTime]);

  const stopCounter = () => {
    clearInterval(timer.current);
  };

  const startCounter = () => {
    timer.current = setInterval(() => setCurrentTime((time) => time - 1), 1000);
  };

  return <div className={classes}>Time : {formatTime(currentTime)}</div>;
}
