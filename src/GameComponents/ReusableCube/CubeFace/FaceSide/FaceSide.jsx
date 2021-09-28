import React from "react";
import "./FaceSide.css";

// a colord line on the currently selectd cube face
export function FaceSide({ side, color }) {
  return <div className={`face-side face-side--${side} face-side--${color}`} />;
}
