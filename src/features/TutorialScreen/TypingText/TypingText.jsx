import React, { useEffect, useRef, useState } from "react";

export default function MovableText({ content, onTypingEnd = (f) => f }) {
  const [letterIdx, setLetterIdx] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    setLetterIdx(0);
    if (content.length === 0) {
      return;
    }
    animationRef.current = setInterval(
      () =>
        setLetterIdx((idx) => {
          return idx + 1;
        }),
      50
    );
    return () => clearInterval(animationRef.current);
  }, [content]);

  useEffect(() => {
    if (letterIdx + 1 > content.length) {
      clearInterval(animationRef.current);
      content != "" && onTypingEnd();
    }
  }, [letterIdx]);

  return (
    <>
      <p className="movable-text">{content.substr(0, letterIdx)}</p>
    </>
  );
}
