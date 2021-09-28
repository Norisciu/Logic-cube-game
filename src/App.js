import React from "react";

import "./App.css";

import { PlayingScreen } from "./features/PlayingScreen/PlayingScreen.jsx";

import { Routes, Route } from "react-router-dom";
import { StartScreen } from "./features/StartScreen/StartScreen.jsx";
import { SettingsScreen } from "./features/SettingsScreen/SettingsScreen.jsx";
import { HighscoresScreen } from "./features/HighscoresScreen/HighscoresScreen.jsx";
import { TutorialScreenReducer } from "./features/TutorialScreen/TutorialScreen";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/playScreen" element={<PlayingScreen />} />
        <Route path="/highscoresScreen" element={<HighscoresScreen />} />
        <Route path="/tutorialScreen" element={<TutorialScreenReducer />} />
        <Route path="/settingsScreen" element={<SettingsScreen />} />
      </Routes>
    </div>
  );
}

export default App;
