import "mobx-react/batchingOptOut";

import { Circle, Layer, Line, Rect, Stage } from "react-konva";

import React from "react";
import { observer } from "mobx-react";
import store from "./store";
import { takeRight } from "lodash";

export default observer(() => {
  return (
    <Stage width={store.maxX} height={store.maxY}>
      <Layer fill="#000">
        <Rect width={store.maxX} height={store.maxY} fill="black" />

        {store.planets.map((p, pi) => {
          return (
            <Line
              key={pi}
              points={takeRight(p.trail, 250)}
              stroke="#ddd"
              strokeWidth={1}
            />
          );
        })}

        {store.planets.map((p, pi) => {
          return (
            <Circle
              key={pi}
              x={p.xViewport}
              y={p.yViewport}
              radius={p.radius}
              fill={p.color}
            />
          );
        })}
      </Layer>
    </Stage>
  );
});
