import React, { useEffect, useState } from "react";
import "./tutorialScreen.css";
import MovableText from "./TypingText/TypingText";
import { CubeReusable } from "../../GameComponents/ReusableCube/CubeReusable.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useUnmountCleanup } from "../../Hooks/useUnmountCleanup";
import { ActionButton } from "../../GameComponents/GameUI/ActionButton/ActionButton.jsx";
import { ArrowLeft, ArrowRight, Home, SkipForward } from "react-feather";
import {
  isOnDisplayActionsMode,
  nextAction,
  checkUserAnswer,
  setDefaultState,
  setPointerToNextActionSequence,
  setPointerToPrevActionSequence,
  failTrial,
  setToInitialState,
  nextConfigComponentsAction,
} from "./tutorialSlice";
import { useNavigate } from "react-router";
import useKeyboard from "../../Keyboard/useKeyboard";
import { useTutorialActions } from "../../Hooks/useTutorialActions";
import { TUTORIAL_MODES } from "./tutorialScreenConstants";

export function TutorialScreenReducer() {
  const navigate = useNavigate();
  const [displayCube, setDisplayCube] = useState(false);

  const dispatch = useDispatch();
  const tutorialState = useSelector((state) => state.tutorialScreen);
  const { pointer, displayText, cube } = tutorialState;
  const { tutorialActions } = useTutorialActions();

  useKeyboard((gameAction) => {
    if (tutorialState.tutorialMode !== TUTORIAL_MODES.checkPlayerMode) {
      return;
    }

    dispatch(checkUserAnswer({ gameAction }));
  });

  useUnmountCleanup(() => {
    dispatch(setToInitialState());
  });

  useEffect(() => {
    if (!isOnDisplayActionsMode(tutorialState.tutorialMode)) {
      return;
    }

    const { currentActionInSequence } = tutorialState.pointer;
    if (currentActionInSequence) {
      currentActionInSequence();
    }
  }, [tutorialState.pointer, tutorialState.tutorialMode]);

  useEffect(() => {
    if (tutorialState.tutorialMode !== TUTORIAL_MODES.configComponents) {
      return;
    }

    dispatch(nextConfigComponentsAction());
  }, [tutorialState.tutorialMode]);

  const onCubeAnimEnd = (event) => {
    dispatch(nextAction());
  };

  const onTextTypingEnd = () => {
    dispatch(nextAction());
  };

  const nextActionSequence = () => {
    dispatch(setDefaultState());
    dispatch(setPointerToNextActionSequence());
  };

  const prevActionSequence = () => {
    dispatch(setDefaultState());
    dispatch(setPointerToPrevActionSequence());
  };

  const toMainMenu = () => navigate("/");
  const isAtFistActionSequence = () => {
    const topSequenceIdx = tutorialState.pointer.nestActionIdx[0];
    console.log(`isAtFistActionSequence topSequenceIdx ${topSequenceIdx}`);
    return topSequenceIdx <= 0;
  };
  const isAtLastActionSequence = () => {
    const nestIdx = tutorialState.pointer.nestActionIdx;

    const currentTopSeqIdx = nestIdx[0];
    return (
      currentTopSeqIdx + 1 >= tutorialState.pointer.topActionSequences.length
    );
  };

  const drawCube = () => {
    return (
      <CubeReusable
        className={cube.className}
        faceOnFront={cube.faceOnFront}
        trialInstruction={cube.expression}
        sideColors={cube.sides}
        checkSides={cube.checkSides}
        onAnimationEnd={onCubeAnimEnd}
        onRotationEnd={onCubeAnimEnd}
        animation={cube.evaluationResult}
        trialTime={cube.trialTime}
        onTrialTimeout={() => dispatch(failTrial())}
      />
    );
  };

  return (
    <div className="game-menu game-menu--tutorial-screen">
      <h2 style={{ color: "whitesmoke" }}>Tutorial Screen</h2>;{drawCube()}
      <div className="typing-text-container">
        <MovableText
          content={displayText.text}
          onTypingEnd={onTextTypingEnd}
          skipForward={tutorialState.displayText.fast}
        />
      </div>
      <div className="controls">
        <div className="controls__container">
          <ActionButton onClick={toMainMenu}>
            <Home />
          </ActionButton>
          <ActionButton
            disabled={isAtFistActionSequence()}
            onClick={() => prevActionSequence()}
          >
            <ArrowLeft />
          </ActionButton>
          <ActionButton
            disabled={isAtLastActionSequence()}
            onClick={() => nextActionSequence()}
          >
            <ArrowRight />
          </ActionButton>
          <ActionButton>
            <SkipForward />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
