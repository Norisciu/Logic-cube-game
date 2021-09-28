import { useEffect } from "react";
import { useSelector } from "react-redux";

export function useOnPauseResume(onPauseCallback, onResumeCallback) {
  let pause = useSelector((state) => state.playingScreen.isOnPause);
  useEffect(() => {
    if (pause) {
      return onPauseCallback();
    } else if (!pause) {
      return onResumeCallback();
    } else {
      throw new Error(`unknown state.playingScreen.isOnPause value `);
    }
  }, [pause]);
}
