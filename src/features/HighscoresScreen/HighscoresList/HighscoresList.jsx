import React from "react";
import { useSelector } from "react-redux";
import {
  compareEntries,
  entriesSort,
  equalScoreEntries,
} from "../highscoresSlice";
import { HighscoreEntry } from "./HighscoreEntry.jsx";

import "./HighscoresList.css";

export function HighscoresList() {
  const playerScore = useSelector(
    (state) => state.highscoresScreen.waitingPlayerScore
  );

  const allEntries = useSelector((state) =>
    state.highscoresScreen.scores.slice().sort((a, b) => compareEntries(b, a))
  );

  let reverseSort = (list) => {
    return list.slice().sort((a, b) => b.score - a.score);
  };

  const highscoreEntriesSlice = () => {
    if (!playerScore) {
      return reverseSort(allEntries);
    }

    let idx = 0;
    let foundPlayerScore = false;
    let result = [];

    for (let k = 0; k < allEntries.length; k++) {
      let entry = allEntries[k];
      foundPlayerScore =
        foundPlayerScore || equalScoreEntries(entry, playerScore);
      if (idx === 4 && !foundPlayerScore) {
        continue;
      }
      if (idx > 5) {
        break;
      }
      idx++;
      result.push(entry);
    }

    return result.sort((a, b) => b.score - a.score);
  };

  return (
    <ul className="highscores-list">
      {highscoreEntriesSlice().map((scoreEntry, idx) => {
        const highlight = equalScoreEntries(playerScore, scoreEntry);
        const rankValue =
          allEntries.findIndex((elem) => equalScoreEntries(elem, scoreEntry)) +
          1;
        return (
          <li className="highscores-list-entry" key={idx}>
            <HighscoreEntry
              {...scoreEntry}
              rank={rankValue}
              selection={highlight}
            />
          </li>
        );
      })}
    </ul>
  );
}
