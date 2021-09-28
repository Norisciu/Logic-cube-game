import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { tutorialContents } from "../features/TutorialScreen/tutorialContents";
import { isCorrectAnswer } from "../features/PlayingScreen/Utils/TrialAPIUpdate";
import {
  endCheckPlayer,
  initActionChains,
  makeTrial,
  setMovableText,
  startWaitingForPlayerAnswer,
} from "../features/TutorialScreen/tutorialSlice";

let delayDecorator =
  (func) =>
  (...args) =>
  (delay) => {
    if (delay <= 0) {
      return func(...args);
    }
    setTimeout(() => func(...args), delay);
  };

export const useTutorialActions = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initActionChains({ initialActionChains: tutorialActions }));
  }, []);

  // displayMovableText takes a string or a function
  const displayMovableText = delayDecorator(function (string) {
    dispatch(setMovableText({ movableText: string }));
  });

  const displayProblem = delayDecorator(function (
    form,
    colorsCount,
    isTimd = false
  ) {
    dispatch(makeTrial({ form, colorsCount, isTimd }));
  });

  // doesn't work with time delay
  const makeCheckPlayerAction =
    (startText, correctText = "Corect", failText = "Wrong", ...problemData) =>
    (delay) => {
      return [
        () => displayMovableText(startText)(delay),
        () => displayProblem(...problemData)(0),
        () => dispatch(startWaitingForPlayerAnswer({})),
        () =>
          displayMovableText((state) =>
            isCorrectAnswer(state.cube.evaluationResult)
              ? correctText
              : failText
          )(0),
        () => dispatch(endCheckPlayer()),
      ];
    };

  const [tutorialActions, setTutorialActions] = useState([
    [() => displayMovableText(tutorialContents[0])(0)],
    [() => displayMovableText(tutorialContents[1])(0)],
    [() => displayMovableText(tutorialContents[2])(0)],
    [() => displayMovableText(tutorialContents[3])(0)],
    [() => displayMovableText(tutorialContents[4])(0)],
    [() => displayMovableText(tutorialContents[5])(0)],
    [() => displayMovableText(tutorialContents[6])(0)],
    [
      makeCheckPlayerAction(
        tutorialContents[7],
        "Correct! You can now confidently step further into the tutorial!",
        "Wrong. Try again , you should press in the direction your are askd by the cube.",
        "direction",
        0,
        false
      )(0),
    ],
    [
      makeCheckPlayerAction(
        tutorialContents[8],
        "Correct",
        "Wrong",
        "color",
        2,
        false
      )(0),
    ],
    [
      makeCheckPlayerAction(
        tutorialContents[9],
        "Correct",
        "Wrong",
        "left and not left",
        0,
        false
      )(0),
    ],
    [
      makeCheckPlayerAction(
        tutorialContents[10],
        "Correct",
        "Wrong",
        "Nothing",
        0,
        false
      )(0),
    ],

    [
      makeCheckPlayerAction(
        tutorialContents[11],
        "Correct",
        "Wrong",
        "not Nothing",
        0,
        false
      )(0),
    ],

    [() => displayMovableText(tutorialContents[12])(0)],
    [
      makeCheckPlayerAction(
        "Let's try one such statement",
        "Correct! This was a slightly more challenging problem. Others await in the game..",
        "Wrong. Don't get discouragd and try again!",
        "color or color and not direction",
        2,
        0
      )(0),
    ],

    [() => displayMovableText(tutorialContents[13])(0)],
    [() => displayMovableText(tutorialContents[14])(0)],

    [
      makeCheckPlayerAction(
        tutorialContents[15],
        "Correct! You solvd your fist timd problem. Congratulations!",
        "Wrong. Don't panic! Keep calm and solve the trial. Let's try again..",
        "direction",
        0,
        true
      )(0),
    ],
    [() => displayMovableText(tutorialContents[16])(0)],
    [() => displayMovableText(tutorialContents[17])(0)],
    [() => displayMovableText(tutorialContents[18])(0)],
    [() => displayMovableText(tutorialContents[19])(0)],
  ]);

  return { tutorialActions };
};
