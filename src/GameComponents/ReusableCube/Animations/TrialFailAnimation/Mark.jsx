import React from "react";

import { ReactComponent as Checkmark } from "../../../../SVGImages/CheckmarkSvgSimple.svg";
import { ReactComponent as CrossIcon } from "../../../../SVGImages/CrossImageSvgSimple.svg";

import SettingsModule from "../../../../features/PlayingScreen/PlayingScreenSettings";
import "./tooltipStyle.css";

export const Mark = React.forwardRef((props, ref) => {
  const { side, value } = props;
  let tooltipIcon =
    value === SettingsModule.MARK_CORRECT ? (
      <Checkmark className="tooltip-mark" />
    ) : (
      <CrossIcon className="tooltip-mark" />
    );
  return (
    <div className="tooltip-box" ref={ref}>
      <div className={`tooltip-tip tooltip-tip--${props.side}`}></div>
      {tooltipIcon}
    </div>
  );
});
