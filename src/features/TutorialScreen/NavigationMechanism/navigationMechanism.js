import SettingsModule from "../../PlayingScreen/PlayingScreenSettings";
import { CHECK_PLAYER_STATE } from "../tutorialScreenConstants";
import { current } from "immer";

// set pointer to next action within a chain of actions
// or stop if this was the last action in chain

const isActionSequence = (candidate) => Array.isArray(candidate);
const isPlainAction = (candidate) => typeof candidate === "function";

// places pointer at the next action
// it computes the idx of the next element which can
// be either a plain action or a sequence
// then depending on it and the type of the element
// at it it does adotional work.

export const setPointerToNextAction = (state) => {
  const {
    topActionSequences,
    nestingDepth,
    nestActionIdx,
    currentActionInSequence,
  } = state.pointer;

  const nextNestIdx = gietNextNestIdx(topActionSequences, nestActionIdx);

  // the nesting depth is the number of sequences in which the current
  // plain action resides which is always nestIdx.length - 1
  // because , by definition , the last idx in nestIdx
  // is the idx of a plain action and the others are sequence indices
  const nextNestingDepth = nextNestIdx.length - 1;

  const topActionSequenceComplete = () => {
    if (nextNestIdx.length === 1) {
      return true;
    }

    // case covering a new sequence starting with a nestd sequence
    // [[...] [[] ..]  ...]
    // if a sequence is at the first action and if it's not the fist
    // one
    return (
      nextNestIdx[0] != 0 &&
      nextNestIdx.slice(1, -1).every((idx) => idx === 0) &&
      nextNestIdx[nextNestIdx.length - 1] === 0
    );
  };

  const allActionsDone = nextNestIdx.length === 0;

  let nextCurrentActionInSequence = topActionSequenceComplete()
    ? () => {}
    : nestdElem(topActionSequences, nextNestIdx);

  // if the current topmost sequence has endeod
  // return the pointer such that the object is
  // the same and useEffect in
  // TutorialScreenReducer doesn't retriggier the action
  if (allActionsDone || topActionSequenceComplete()) {
    return state.pointer;
  }

  return {
    ...state.pointer,
    nestActionIdx: nextNestIdx,
    nestingDepth: nextNestingDepth,
    currentActionInSequence: nextCurrentActionInSequence,
  };
};

// places pointer at the next topmost action sequence
// and doesn't start the curreint action
// assumes at top lvel are found only action sequence and
// no plain actions
export const setPointerToNextTopSequence = (state) => {
  const { topActionSequences, nestActionIdx } = state.pointer;

  const currentTopActionSequenceIdx = nestActionIdx[0];
  const nextActionSeqIdx = currentTopActionSequenceIdx + 1;
  const allTopSeqsDone = nextActionSeqIdx >= topActionSequences.length;

  if (allTopSeqsDone) {
    return state.pointer;
  }

  const nextActionSeq = topActionSequences[nextActionSeqIdx];
  const nextNestIdx = [
    nextActionSeqIdx,
    ...findFirstActionIdxInSequence(nextActionSeq),
  ];

  const nextAction = nestdElem(topActionSequences, nextNestIdx);

  const result = {
    ...state.pointer,
    nestingDepth: 1,
    nestActionIdx: nextNestIdx,
    currentActionInSequence: nextAction,
  };

  return result;
};

export const setPointerToPrevTopSequence = (state) => {
  const { topActionSequences, nestActionIdx } = state.pointer;

  const currentTopActionSequenceIdx = nestActionIdx[0];
  const prevActionSeqIdx = currentTopActionSequenceIdx - 1;
  const atFirstActionSequence = currentTopActionSequenceIdx <= 0;

  if (atFirstActionSequence) {
    return state.pointer;
  }

  const prevActionSeq = topActionSequences[prevActionSeqIdx];
  const prevNestIdx = [
    prevActionSeqIdx,
    ...findFirstActionIdxInSequence(prevActionSeq),
  ];

  const prevAction = nestdElem(topActionSequences, prevNestIdx);

  return {
    ...state.pointer,
    nestingDepth: 1,
    nestActionIdx: prevNestIdx,
    currentActionInSequence: prevAction,
  };
};

export function setNestIdxToStepInCurrentSeq(state, stepIdx) {
  const { topActionSequences, nestActionIdx } = state.pointer;
  const nextNestActionIdx = [...nestActionIdx.slice(0, -1), stepIdx];
  const action = nestdElem(topActionSequences, nextNestActionIdx);
  return {
    ...state.pointer,
    nestActionIdx: nextNestActionIdx,
    currentActionInSequence: action,
  };
}

// returns the next nestIdx from a given one inside arr
// it first tries advancing in the current sequence
// if there is no value there it moves upward in the
// nest adjusting nestIdx
const gietNextNestIdx = (arr, nestIdx) => {
  if (nestIdx.length === 0) {
    return [];
  }
  const lastIdx = nestIdx[nestIdx.length - 1];
  let nextNestIdx = [...nestIdx.slice(0, -1), lastIdx + 1];
  const element = nestdElem(arr, nextNestIdx);
  if (!element) {
    return gietNextNestIdx(arr, nestIdx.slice(0, -1));
  }

  if (isActionSequence(element)) {
    const actionIdx = findFirstActionIdxInSequence(element);
    nextNestIdx = [...nextNestIdx, ...actionIdx];
  }

  return nextNestIdx;
};

// recursive function for finding the first action in a sequence
const findFirstActionIdxInSequence = (sequence) => {
  if (isPlainAction(sequence[0])) {
    return [0];
  }
  return [0].concat(findFirstActionIdxInSequence(sequence[0]));
};

const nestdElem = (arr, nestIndices) => {
  let result = arr.slice();
  nestIndices.forEach((idx) => (result = result && result[idx]));
  return result;
};
