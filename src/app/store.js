import { configureStore } from "@reduxjs/toolkit";
import SettingsModule from "../features/PlayingScreen/PlayingScreenSettings";
import playingScreenReducer from "../features/PlayingScreen/playingScreenSlice";
import highscoreScreenReducer from "../features/HighscoresScreen/highscoresSlice";
import settingsScreenReducer from "../features/SettingsScreen/settingsScreenSlice";
import tutorialScreenReducer, {
  storeAction,
} from "../features/TutorialScreen/tutorialSlice";

// midleware which prvents giving another answer after the user has
// already typd one
const stopMidleware = (store) => (next) => (action) => {
  let currentState = store.getState().playingScreen.currentTrial.trialState;
  let isDisplayAnswerAction =
    action.type === "PlayingScreen/displayAnswerResult";
  let isNotWaitingPlayerState =
    currentState != SettingsModule.TRIAL_STATE_WAITING_PLAYER;
  if (isDisplayAnswerAction && isNotWaitingPlayerState) {
    return;
  }
  return next(action);
};

// midleware which stores all usd actions of a tutorial mechanism
// an "action" here refers to a function which represents a command with
// a side effect and not necessarily to a redux action
// ( check the documentation found in features/tutorialScreen/tutoriaScreen.md
//  for more )
const storeActionForCleaningMechanism = (store) => (next) => (action) => {
  const actionName = action.type.split("/");
  const isTutorialAction = actionName[0] === "TutorialScreenSlice";
  const isStoreAction = actionName[1] === "storeAction";

  if (isTutorialAction && !isStoreAction) {
    store.dispatch(storeAction({ actionName: action.type }));
  }

  const result = next(action);
  return result;
};

export const store = configureStore({
  reducer: {
    playingScreen: playingScreenReducer,
    highscoresScreen: highscoreScreenReducer,
    settingsScreen: settingsScreenReducer,
    tutorialScreen: tutorialScreenReducer,
  },
  middleware: (getDefaultMidleware) =>
    getDefaultMidleware().concat([
      stopMidleware,
      storeActionForCleaningMechanism,
    ]),
});
