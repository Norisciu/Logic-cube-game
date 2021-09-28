import { useEffect } from "react";
import { useSelector } from "react-redux";

// hook for making a component listen to a game state change and trigger a callback
// along with it's eventual cleaning function
// Eg : the PlayingScreen component listens for game state being Session end
// and trigers the endSession() callback

export const useGameStateChange = (gameState, fn, cleanEffectFn = (f) => f) => {
  const currentGameState = useSelector(
    (state) => state.playingScreen.currentTrial.trialState
  );
  useEffect(() => {
    if (gameState != currentGameState) {
      return;
    }
    fn();
    return cleanEffectFn;
  }, [currentGameState]);
};
