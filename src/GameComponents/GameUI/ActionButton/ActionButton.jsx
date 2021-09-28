import React from "react";

import "./ActionButton.css";

export function ActionButton({ children, ...props }) {
  return (
    <button className="game-button--action" {...props}>
      {children}
    </button>
  );
}
