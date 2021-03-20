import React, { useEffect, useState } from "react";
import drawFunctionPoints from "./drawing/drawFunctionPoints";
import FloatingPoint from "./components/floatingPoint";
import PointCanvas from "./canvas/pointCanvas";
import _ from "lodash";
import { SCAN_RATE } from "./constant";

export default function PositionSetter(props) {
  const appendPoint = () => {
    const { position } = props;
    props.handleDoubleClick(position);
  };

  const [animationFrameCount, setAnimationFrameCount] = useState(0);

  const {
    animated,
    absoluteAnimation = () => ({ x: 0, y: 0 }),
    relativeAnimation = (_animationFrameCount) => ({ x: 0, y: 0 }),
    lineWidth,
    style,
  } = props;
  const { pointSize } = style;
  useEffect(() => {
    const interval = setInterval(() => {
      if (animated) {
        setAnimationFrameCount((prev) => prev + 1);
      }
    }, 1000 / SCAN_RATE);

    return () => {
      clearInterval(interval);
    };
  }, [animated]);

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        background: "skyblue",
      }}
      onDoubleClick={appendPoint}
    >
      {props.pivotalPoints.map((point) => {
        return (
          <FloatingPoint
            animated={animated}
            absoluteAnimation={absoluteAnimation}
            relativeAnimation={relativeAnimation}
            animationFrameCount={animationFrameCount}
            handleDrag={props.handleDrag}
            point={point}
            pointStyle={{ pointSize: 10, color: "yellow" }}
          />
        );
      })}
      <PointCanvas
        draw={drawFunctionPoints}
        pathPoints={props.plotPoints.path}
        points={props.plotPoints.pivotal}
        lineStyle={{ color: "black", width: lineWidth }}
        pointStyle={{ color: "red", pointSize: pointSize }}
        canvasStyle={{ width: 1600, height: 1000 }}
      />
    </div>
  );
}
