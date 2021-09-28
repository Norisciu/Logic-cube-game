import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./highscoresStyle.css";
import { HighscoresList } from "./HighscoresList/HighscoresList.jsx";
import TopScoreMenuUpdate from "./TopScoreMenu/TopScoreMenu";
import { useUnmountCleanup } from "../../Hooks/useUnmountCleanup";
import Button from "../../GameComponents/GameUI/Button/Button";
import EnterNameScreen from "./EnterNameScreen/EnterNameScreen";
import { useDispatch } from "react-redux";
import { setHighscoreScreenDefaults, saveScoreEntry } from "./highscoresSlice";

export function HighscoresScreen() {
  const shouldShowEnterNameScreen = () => playerScore != 0;
  const isTopScore = () => {
    let scores = allEntries.map(({ _, score }) => score);
    let allScores = scores.concat([playerScore]);
    allScores.sort((a, b) => b - a);
    const result = allScores.indexOf(playerScore) === 0;

    return result;
  };

  const dispatch = useDispatch();
  const playerScore = useSelector(
    (state) => state.highscoresScreen.playerScore
  );

  const allEntries = useSelector((state) => state.highscoresScreen.scores);
  const [showTopScoreMenu, setShowTopScoreMenu] = useState(isTopScore());
  const [showEnterNameScreen, setShowEnterNameScreen] = useState(
    shouldShowEnterNameScreen()
  );

  const navigate = useNavigate();
  const onReplayButtonClick = () => navigate("/playScreen");

  const closeTopScoreMenu = () => setShowTopScoreMenu(false);

  const storeUserName = (playerName) => {
    dispatch(saveScoreEntry({ playerName }));
    setShowEnterNameScreen(false);
  };

  useUnmountCleanup(() => {
    dispatch(setHighscoreScreenDefaults());
  });

  if (showTopScoreMenu) {
    return (
      <TopScoreMenuUpdate onClose={closeTopScoreMenu} topScore={playerScore} />
    );
  } else if (showEnterNameScreen) {
    return <EnterNameScreen onNameEnterCallback={storeUserName} />;
  }

  const toMainMenu = () => navigate("/");

  return (
    <div className="game-screen game-screen--highscores">
      <div className="highscores__container">
        <h1 className="highscores__header">Highscores</h1>
        <HighscoresList />

        <div className="controls--highscore-screen">
          <Button
            onClick={onReplayButtonClick}
            classes="game-button-highscore-button"
          >
            Replay
          </Button>
          <Button onClick={toMainMenu} classes="game-button-highscore-button">
            MainMenu
          </Button>
        </div>
      </div>
    </div>
  );
}
