import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Button from "../Button/Button";
import { togglePause } from "../../../features/PlayingScreen/playingScreenSlice";
import "./PauseMenu.css";

export default function PauseMenu() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const isVisible = useSelector((state) => state.playingScreen.isOnPause);

  const resumeGame = () => {
    dispatch(togglePause());
  };

  const toMainMenu = () => {
    console.log("PauseMenu toMainMenu()");
    navigation("/");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pause-menu-container">
      <div className="game-menu game-menu--pause">
        <h2 className="pause-menu__header">Pause Menu</h2>
        <Button onClick={resumeGame} classes="game-button--pause-menu">
          Resume
        </Button>
        <Button onClick={toMainMenu} classes="game-button--pause-menu">
          MainMenu
        </Button>
      </div>
    </div>
  );
}
