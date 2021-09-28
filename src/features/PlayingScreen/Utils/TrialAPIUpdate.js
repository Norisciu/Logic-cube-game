import { Parser } from "../../../Engine/CubeDSL/Parser/CubeParserUpdate";

import { Evaluator } from "../../../Engine/CubeDSL/Evaluator/Evaluator";
import SettingsModule from "../PlayingScreenSettings";
import {
  makeExpression,
  makeProblem,
} from "../../../Engine/ProblemBuilder/problemBuilder";
import { GameActions } from "../../../Keyboard/GameActions";

const parser = new Parser("");
const evaluator = new Evaluator();

const SIDE_COLORS = "red green blue yellow".split(" ");

export const newInstruction = ({ form, colorsCount }) => makeExpression(form);

export const newProblem = ({ form, colorsCount, differentColorsCount }) =>
  makeProblem(form, colorsCount, differentColorsCount);

export function configureSideColors(
  statement,
  colorSidesCount = 4,
  colorTypesCount = 2
) {
  let colors = statement.match(/blue|red|green|yellow/gi) || [];
  let sideColors = randomColors(colors, colorSidesCount, colorTypesCount);
  let entries = shuffle(["left", "right", "top", "bottom"]).map((side, idx) => [
    side,
    sideColors[idx],
  ]);
  let colorSides = Object.fromEntries(entries);

  return colorSides;
}

function randomColors(givenColors = [], colorsCount, colorTypesCount) {
  colorsCount = randomRange(1, 4);
  colorTypesCount = randomRange(1, 4);
  if (givenColors.length === colorsCount) {
    return givenColors;
  }
  let sliceCount = colorTypesCount - givenColors.length;
  let colorsSet = SIDE_COLORS.filter(
    (color) => !givenColors.includes(color)
  ).slice(0, sliceCount);
  let result = shuffle(colorsSet).concat(givenColors);
  for (let k = 0; k < colorsCount - result.length; k++) {
    let randomColor = randomFromList(result);
    result.push(randomColor);
  }
  return result;
}

export function checkAllSides(sides, instruction) {
  let sidesCheckResults = {
    [SettingsModule.DIRECTION_UP]: null,
    [SettingsModule.DIRECTION_RIGHT]: null,
    [SettingsModule.DIRECTION_DOWN]: null,
    [SettingsModule.DIRECTION_LEFT]: null,
  };
  for (const [direction, color] of Object.entries(sides)) {
    sidesCheckResults[direction] = checkSide(direction, color, instruction);
  }

  return sidesCheckResults;
}

export function checkSide(direction, color, instruction) {
  let checkObject = { direction: direction, color: color };
  let parseInstruction = parser.parse(instruction);

  let evaluation = evaluator.evaluate(parseInstruction, checkObject);

  return evaluation ? SettingsModule.MARK_CORRECT : SettingsModule.MARK_WRONG;
}

export function evaluateUserAnswer(key, checkSides) {
  let direction = convertArrowKeyToDirection(key);

  if (isNothing(direction)) {
    let everySideIsWrong = Object.entries(checkSides).every(
      ([_, mark]) => mark === SettingsModule.MARK_WRONG
    );
    return everySideIsWrong
      ? SettingsModule.CORRECT_ANSWER
      : SettingsModule.WRONG_ANSWER;
  } else if (isDirection(direction)) {
    return checkSides[direction] === SettingsModule.MARK_CORRECT
      ? SettingsModule.CORRECT_ANSWER
      : SettingsModule.WRONG_ANSWER;
  } else {
    throw new Error(`given side is unknown : ${key}`);
  }
}

export function evaluateUserAnswerGameAction(gameAction, checkSides) {
  let direction = convertGameActionToDirection(gameAction);

  if (isNothing(direction)) {
    let everySideIsWrong = Object.entries(checkSides).every(
      ([_, mark]) => mark === SettingsModule.MARK_WRONG
    );
    return everySideIsWrong
      ? SettingsModule.CORRECT_ANSWER
      : SettingsModule.WRONG_ANSWER;
  } else if (isDirection(direction)) {
    return checkSides[direction] === SettingsModule.MARK_CORRECT
      ? SettingsModule.CORRECT_ANSWER
      : SettingsModule.WRONG_ANSWER;
  } else {
    throw new Error(`given side is unknown : ${gameAction}`);
  }
}

export function convertArrowKeyToDirection(arrowKey) {
  let arrowKeyToDirectionMap = new Map([
    ["ArrowUp", SettingsModule.DIRECTION_UP],
    ["ArrowRight", SettingsModule.DIRECTION_RIGHT],
    ["ArrowDown", SettingsModule.DIRECTION_DOWN],
    ["ArrowLeft", SettingsModule.DIRECTION_LEFT],
    [SettingsModule.NOTHING_KEYBOARD, SettingsModule.NOTHING],
  ]);

  const result = arrowKeyToDirectionMap.get(arrowKey) || SettingsModule.NOTHING;

  return result;
}

export function convertGameActionToDirection(gameAction) {
  let gameActionToDirectionMap = new Map([
    [GameActions.TOP_PRESS_ACTION, SettingsModule.DIRECTION_UP],
    [GameActions.BOTTOM_PRESS_ACTION, SettingsModule.DIRECTION_DOWN],
    [GameActions.RIGHT_PRESS_ACTION, SettingsModule.DIRECTION_RIGHT],
    [GameActions.LEFT_PRESS_ACTION, SettingsModule.DIRECTION_LEFT],
    [GameActions.NOTHING_PRESS_ACTION, SettingsModule.NOTHING],
  ]);

  const result =
    gameActionToDirectionMap.get(gameAction) || SettingsModule.NOTHING;

  return result;
}

export function isUserAnswerKey(candidate) {
  return isArrowKey(candidate) || isNothingKey(candidate);
}

export function isArrowKey(candidate) {
  let arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

  return arrowKeys.includes(candidate);
}

export function isNothingGameAction(candidate) {
  return candidate === GameActions.NOTHING_PRESS_ACTION;
}

export function isNothingKey(candidate) {
  return candidate === SettingsModule.NOTHING_KEYBOARD;
}

export function isNothing(candidate) {
  return candidate === SettingsModule.NOTHING;
}

function isDirection(candidate) {
  let directions = [
    SettingsModule.DIRECTION_LEFT,
    SettingsModule.DIRECTION_RIGHT,
    SettingsModule.DIRECTION_UP,
    SettingsModule.DIRECTION_DOWN,
  ];

  return directions.includes(candidate);
}

function randomFromList(list) {
  let randomIdx = Math.floor(Math.random() * list.length);
  return list[randomIdx];
}

function randomRange(low, high) {
  let difference = Math.abs(high - low) + 1;
  return low + Math.floor(Math.random() * difference);
}

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function computeDifficulty(points) {
  const pointsDifficultyAssocs = [
    [500, SettingsModule.DIFFICULTY_EASY],
    [1000, SettingsModule.DIFFICULTY_MEDIUM],
    [Number.POSITIVE_INFINITY, SettingsModule.DIFFICULTY_HARD],
  ];

  return pointsDifficultyAssocs.find(
    ([pointsBreak, difficulty]) => points <= pointsBreak
  )[1];
}

export function isCorrectAnswer(value) {
  return value === SettingsModule.CORRECT_ANSWER;
}

export function isWrongAnswer(value) {
  return value === SettingsModule.WRONG_ANSWER;
}

export function randomAndDifferentCubeFace(face) {
  let cubeFaces = ["front", "back", "right", "left", "top", "bottom"];
  let possibleFaces = cubeFaces.filter((cubeFace) => cubeFace != face);
  return randomFromList(possibleFaces);
}
