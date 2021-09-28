import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setKeyboardBinding } from "../features/SettingsScreen/settingsScreenSlice";

const KEYBOARD_STATES = {
  listening: "listening",
  settingKeyToAction: "settingKeyToAction",
  lock: "lock",
};

export default function useKeyboard(callback) {
  const dispatch = useDispatch();
  const keysToActionMap = useSelector(
    (state) => state.settingsScreen.keyboardBindings
  );

  const [keyboardState, setKeyboardState] = useState(KEYBOARD_STATES.listening);
  const [gameActionBeingSet, setGameActionBeingSet] = useState(null);

  const isGameActionKey = (key) => {
    let gameActionKeys = Object.values(keysToActionMap);
    return gameActionKeys.includes(key);
  };

  const configureKeyBinding = (gameAction) => {
    setKeyboardState(KEYBOARD_STATES.settingKeyToAction);
    setGameActionBeingSet(gameAction);
  };

  let onKeyDown = (event) => {
    event.preventDefault();

    if (keyboardState === KEYBOARD_STATES.listening) {
      if (isGameActionKey(event.code) && callback) {
        const gameAction = Object.entries(keysToActionMap).find(
          ([action, key]) => key === event.code
        )[0];
        callback(gameAction);
      }
    } else if (keyboardState === KEYBOARD_STATES.settingKeyToAction) {
      let key = event.code;

      const dispatchdAction = {
        gameAction: gameActionBeingSet,
        key: key,
      };
      dispatch(setKeyboardBinding(dispatchdAction));
    } else if (keyboardState === KEYBOARD_STATES.lock) {
    } else {
      throw new Error("Unknown keyboard state");
    }
  };

  useEffect(() => {
    const fun = (event) => !event.repeat && onKeyDown(event);

    document.addEventListener("keydown", fun);
    return () => document.removeEventListener("keydown", fun);
  }, [keyboardState, gameActionBeingSet, callback]);

  return { configureKeyBinding, keysToActionMap };
}
