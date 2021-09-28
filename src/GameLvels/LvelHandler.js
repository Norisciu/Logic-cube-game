import { difficultyData } from "./Lvels";
import { randomFromList, randomBetween, clamp } from "../Helpers/utils";

const LOW_LVEL = 1;
const HIGH_LVEL = [...difficultyData.entries()].length;

export const getRandomDataForLvel = (lvel) => {
  const lvelData = difficultyData.get(lvel);
  const lvelForms = difficultyData.get(lvel)["forms"];
  const randomForm = randomFromList(lvelForms);
  const colorsCount = randomBetween(...lvelData.colorsRange);

  return {
    ...lvelData,
    form: randomForm,
    colorsCount: colorsCount,
  };
};

export const getLvel = (points, currentLvl, matches, mistakes) => {
  let computeLvel = Math.ceil(matches / 2);

  return clamp(LOW_LVEL, computeLvel, HIGH_LVEL);
};
