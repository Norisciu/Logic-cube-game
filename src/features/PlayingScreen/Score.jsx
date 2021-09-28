import React from "react";

export function Score({ score, className }) {
  const classes = [className, "game-score"].join(" ");
  return <div className={classes}>Score : {score}</div>;
}
