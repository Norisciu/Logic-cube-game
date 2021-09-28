import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";
import { Mark } from "./Mark.jsx";
import { useUnmountCleanup } from "../../../../Hooks/useUnmountCleanup";

const getSideMarks = (answerObject, refs) => {
  let sideMarks = [];
  let idx = -1;

  const windowDimensions = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  };

  const { windowWidth, windowHeight } = windowDimensions;

  const vmin = Math.min(windowWidth, windowHeight);
  let cubeSize = Math.min(200, (48 / 100) * vmin);
  const markSize = (15 / 100) * vmin;
  const tooltipSize = 8;
  let offset = (2 / 100) * vmin;

  if (vmin < 500) {
    cubeSize = (39 / 100) * vmin;
    offset = (1 / 100) * vmin;
  }

  const displacement =
    cubeSize / 2 + markSize / 2 + tooltipSize + offset || 157;
  const sideToMotionMap = new Map([
    ["top", { duration: 2, y: -displacement, opacity: 1, direction: "top" }],
    ["right", { duration: 2, x: displacement, opacity: 1, direction: "right" }],
    [
      "bottom",
      { duration: 2, y: displacement, opacity: 1, direction: "bottom" },
    ],
    ["left", { duration: 2, x: -displacement, opacity: 1, direction: "left" }],
  ]);

  for (const [side, value] of Object.entries(answerObject)) {
    idx++;
    if (value) {
      let currentRef = React.createRef();
      let mark = <Mark side={side} value={value} ref={currentRef} />;
      let markObject = {
        side: side,
        animationDirection: sideToMotionMap.get(side),
        ref: currentRef,
      };

      sideMarks.push(mark);
      refs.push(markObject);
    }
  }

  return sideMarks;
};

function MarkGroupAnimation({ onAnimationEnd, checkSides }) {
  const markRefs = [];

  const sideMarks = getSideMarks(checkSides, markRefs);
  const tweenRef = useRef();

  const startGroupAnimation = () => {
    if (sideMarks.length === 0) {
      return;
    }

    tweenRef.current = gsap.timeline();

    let refs = markRefs.map((elem) => elem.ref.current);

    tweenRef.current.set(".tooltip-box", { xPercent: -50, yPercent: -50 });

    tweenRef.current
      .to(refs, {
        autoAlpha: 1,
        x: (idx, target) => markRefs[idx].animationDirection.x || target.x,
        y: (idx, target) => markRefs[idx].animationDirection.y || target.y,

        duration: 0.5,
        stagger: 0.5,
        opacity: 1,
      })
      .eventCallback("onComplete", onAnimationEnd);
  };

  useEffect(() => startGroupAnimation(), [checkSides]);

  useUnmountCleanup(() => {
    tweenRef.current && tweenRef.current.kill();
  });

  return <> {sideMarks} </>;
}

const equalSides = (side, other) => {
  const sides = Object.entries(side);
  const otherSides = Object.entries(other);
  if (sides.length === 0 && otherSides.length === 0) {
    return true;
  }
  if (sides.length != 0 && otherSides.length === 0) {
    return false;
  }
  if (sides.length === 0 && otherSides.length != 0) {
    return false;
  }

  for (let k = 0; k < sides.length; k++) {
    if ([sides[k][1]] != otherSides[k][1]) {
      return false;
    }
  }

  return true;
};

// we use React.memo here to check if the 'next' props are the
// same as the `prev` props and not render an animation twice
export default React.memo(MarkGroupAnimation, (prev, next) => {
  const prevSides = prev.checkSides;
  const nextSides = next.checkSides;
  const result = equalSides(prevSides, nextSides);

  return result;
});
