import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const scoreEntries = [];
// const scoreEntries = JSON.parse(localStorage.getItem("cubeGame/highscores")) || [];

let initialState = {
  // all score entries which should be objects
  // of the form { user : String , score : Number}
  scores: scoreEntries,
  playerScore: 0,
  waitingPlayerScore: null,
  topScore: 0,
};

export const HighscoresScreenSlice = createSlice({
  name: "highscoresScreen",
  initialState,
  reducers: {
    addHighscore: (state, action) => {
      state.playerScore = action.payload.score;
    },

    tick: (state, action) => {
      const { points } = action.payload;
      state.topScore = points;
    },

    // rename to saveScoreEntry
    saveScoreEntry: (state, action) => {
      const { playerName } = action.payload;

      const scoreObject = {
        score: state.playerScore,
        userName: playerName,
      };

      if (!scoreEntryAlreadyInList(scoreObject, state.scores)) {
        state.scores.push(scoreObject);
      }

      state.waitingPlayerScore = scoreObject;
      localStorage.setItem("cubeGame/highscores", JSON.stringify(state.scores));
    },

    setHighscoreScreenDefaults: (state, action) => {
      state.playerScore = 0;
      state.waitingPlayerScore = null;
    },
  },
});

// should probably go into a separate file like HighscoresAPI.js
export const scoreEntryAlreadyInList = (score, scoreList) =>
  scoreList.find((elem) => equalScoreEntries(elem, score));
export const equalScoreEntries = (score, other) =>
  score &&
  other &&
  score.score === other.score &&
  score.userName === other.userName;
export const entriesSort = (entries) =>
  entries.sort((entry, other) => compareEntries(entry, other));
export const compareEntries = (entry, other) =>
  entry.score - other.score || entry.userName.localeCompare(other.userName);

export const {
  addHighscore,
  tick,
  saveScoreEntry,
  setHighscoreScreenDefaults,
} = HighscoresScreenSlice.actions;
export default HighscoresScreenSlice.reducer;
