import React, { useEffect } from "react";

export function CorrectComponent({ onAnimationEnd }) {
  useEffect(() => {
    let timeout = setTimeout(onAnimationEnd, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return <div className="correct-component-replacer" />;
}
