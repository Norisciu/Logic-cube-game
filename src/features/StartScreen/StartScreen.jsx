import React from "react";
import { useNavigate } from "react-router";
import "./StartScreenStyle.css";

export function StartScreen() {
  const navigate = useNavigate();
  const handleButtonClick = (event) => {
    if (event.target.nodeName != "BUTTON") {
      return;
    }
    let buttonInnerText = event.target.innerText;
    let url = `${buttonInnerText.toLowerCase()}Screen`;
    navigate(url);
  };

  return (
    <div
      onClick={handleButtonClick}
      className="game-screen game-screen--start-screen"
    >
      <h2 className="screen-header">Cube of logic</h2>
      <div className="game-menu game-menu--start-screen">
        <button className="game-button button--menu-button">Play</button>
        <button className="game-button button--menu-button">Tutorial</button>
        <button className="game-button button--menu-button">Settings</button>
        <button className="game-button button--menu-button">Highscores</button>
      </div>
    </div>
  );
}
