import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { SessionCounter } from "./SessionCounter/SessionCounter.jsx";
import { useGameStateChange } from "../../Hooks/useGameStateChange";
import { addHighscore } from "../HighscoresScreen/highscoresSlice";
import SettingsModule from "./PlayingScreenSettings";
import {
  displayAnswerResult,
  newTrial,
  sessionEnd,
  setDefaultValues,
  startWaitingForPlayer,
  togglePause,
} from "./playingScreenSlice";
import "./PlayingScreenStyle.css";
import { Score } from "./Score.jsx";
import useKeyboard from "../../Keyboard/useKeyboard";
import PauseButton from "../../GameComponents/GameUI/PauseButton/PauseButton";
import PauseMenu from "../../GameComponents/GameUI/PauseMenu/PauseMenu";

import { useUnmountCleanup } from "../../Hooks/useUnmountCleanup";
import { CubeReusable } from "../../GameComponents/ReusableCube/CubeReusable.jsx";
import { GameActions } from "../../Keyboard/GameActions";

export function PlayingScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [sessionActive, setSessionActive] = useState(true);
  const screenRef = useRef();
  const score = useSelector(
    (state) => state.playingScreen.currentTrial.userScore
  );
  const lvel = useSelector((state) => state.playingScreen.currentLvel);
  const currentCubeFaceOnFront = useSelector(
    (state) => state.playingScreen.currentTrial.cubeFace
  );

  const { instruction, sides, checkSides, userAnswerEvaluation, cubeFace } =
    useSelector((state) => state.playingScreen.currentTrial);

  useEffect(() => beginSession(), []);

  const actionFun = (gameAction) => {
    if (gameAction === GameActions.PAUSE_ACTION) {
      return pauseGame();
    }
    dispatch(displayAnswerResult({ gameAction }));
  };

  useKeyboard(actionFun);

  const beginSession = () => {
    setSessionActive(true);
    setTimeout(() => dispatch(newTrial()), 1000);
  };

  // TO DO : remove highscoreEntry format to only pass the
  // score value {score : score} as action.payload
  const endSession = () => {
    // clean the playing screen state and set it to it's
    // relevant default values
    dispatch(setDefaultValues());

    // "announce" the value of the current score to the
    //  highscoreScreen slice so that it can be usd for
    //  displaying and persisting it
    dispatch(addHighscore({ score }));

    // once all preparatory operations are done navigate
    // to the highscoreScreen
    navigation("/highscoresScreen");
  };

  // annouce that the session has ende to the store and wait for user
  // to finish the last trial. We first announce the store of the ending
  // of the session such that we can let the user end the trial
  // before finishing the session as opposd ending the playing
  // session abruptly without letting the user finish the last trial.
  const announceSessionEnd = () => {
    dispatch(sessionEnd());
  };

  useGameStateChange(SettingsModule.TRIAL_STATE_SESSION_END, endSession);

  useUnmountCleanup(() => dispatch(setDefaultValues()));

  const pauseGame = () => {
    dispatch(togglePause());
  };

  const startWaitingPlayer = () => dispatch(startWaitingForPlayer());

  return (
    <div className="game-screen game-screen--playing" ref={screenRef}>
      <PauseMenu />
      <div className="menu menu--top-menu">
        <PauseButton onClickCallback={pauseGame} />
        <Score className="top-menu--label" score={score} />

        <span className="top-menu--label">{lvel}</span>

        {sessionActive && (
          <SessionCounter
            className="top-menu--label"
            onTimeEndCallback={announceSessionEnd}
          />
        )}
      </div>
      <div className="playing-screen-main">
        <CubeReusable
          faceOnFront={cubeFace}
          trialInstruction={instruction}
          sideColors={sides}
          checkSides={checkSides}
          animation={userAnswerEvaluation}
          onRotationEnd={() => startWaitingPlayer()}
          onAnimationEnd={() => dispatch(newTrial())}
          trialTime={SettingsModule.TRIAL_TIME}
        />
      </div>
    </div>
  );
}
