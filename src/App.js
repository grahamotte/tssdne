import "mobx-react/batchingOptOut";

import { Circle, Layer, Line, Rect, Stage, Text } from "react-konva";

import React from "react";
import { observer } from "mobx-react";
import store from "./store";

export default observer(() => {
  return (
    <Stage width={store.maxX} height={store.maxY}>
      <Layer fill="#000">
        <Rect width={store.maxX} height={store.maxY} fill="black" />
        {["This", "Solar", "System", "Does", "Not", "Exist"].map((w, wi) => (
          <Text
            key={wi}
            text={w}
            fill="#fff"
            fontSize={40}
            y={store.maxY - 6 * 50 + wi * 50}
            x={10}
            fontFamily="Courier New"
            fontStyle="bold"
          />
        ))}

        {store.planets.map((p, pi) => {
          return (
            <Line
              key={pi}
              points={p.trailViewport}
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
