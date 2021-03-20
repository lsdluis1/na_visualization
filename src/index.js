import ReactDOM from "react-dom";
import ReactCursorPosition from "react-cursor-position";
import Toggle from "./components/toggleSwitch";
import _ from "lodash";
import React, { useRef, useEffect, useState } from "react";
import { positionParser } from "./api/parsePoints";
import circular from "./animations/relativeAnimations/circular";

import "./styles.css";
import PositionSetter from "./pointSetter";
import linear from "./animations/absoluteAnimations/linear";
import brownianMotion from "./animations/absoluteAnimations/brownianMotion";

const pivotalPoints = [];

function App(props) {
  const [animated, setAnimated] = useState(false);
  const [pivotalP, setPivotalP] = useState([]);
  const [plotP, setPlotP] = useState({ path: [], pivotal: [] });

  useEffect(() => {
    const interval = setInterval(() => {
      setPivotalP([...pivotalPoints]);
      const plotPosition = rootElement.getAttribute("plotPosition");
      const plotPositionParsed =
        plotPosition == null
          ? { path: [], pivotal: [] }
          : JSON.parse(plotPosition);
      plotPositionParsed.path = positionParser(plotPositionParsed.path);
      plotPositionParsed.pivotal = positionParser(plotPositionParsed.pivotal);
      setPlotP(plotPositionParsed);
    }, 1000 / 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDragRef = useRef();
  handleDragRef.current = (draggedPoint) => {
    const updateIndex = _.findIndex(
      pivotalPoints,
      (p) => p.key === draggedPoint.key
    );
    pivotalPoints[updateIndex] = draggedPoint;
  };

  const handleDoubleClickRef = useRef();
  handleDoubleClickRef.current = (position) => {
    const MAX_POINT_NUM = 100;
    const key = Math.random().toString(36);
    if (pivotalPoints.length < MAX_POINT_NUM) {
      pivotalPoints.push({ position, key });
    }
  };

  return (
    <div>
      {props.testString}
      <Toggle onToggle={setAnimated} />
      <ReactCursorPosition style={{ position: "absolute" }}>
        <PositionSetter
          style={{ pointSize: 10, lineWidth: 5 }}
          animated={animated}
          // relativeAnimation={circular(100, 1, true)}
          // absoluteAnimation={linear({ x: 10, y: 20 })}
          absoluteAnimation={brownianMotion(5)}
          handleDoubleClick={handleDoubleClickRef.current}
          handleDrag={handleDragRef.current}
          pivotalPoints={pivotalP}
          plotPoints={plotP === null ? [] : plotP}
        />
      </ReactCursorPosition>
    </div>
  );
}
const rootElement = document.getElementById("root");
var testString = null;

setInterval(() => {
  const str = "";
  rootElement.setAttribute(
    "pivotalPosition",
    str.concat(
      "[",
      pivotalPoints
        .map((point) => JSON.stringify([point.position.x, point.position.y]))
        .toString(),
      "]"
    )
  );
}, 1000 / 60);

ReactDOM.render(<App />, rootElement);
