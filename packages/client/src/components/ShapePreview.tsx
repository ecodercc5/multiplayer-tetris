import React from "react";
import { createShape, IShape } from "../core/shape";
import { Cell } from "./Cell";

const initShape = createShape({
  color: "#F87171",
  position: { row: 4, col: 0 },
  struct: [
    [false, true, false],
    [true, true, true],
  ],
});

interface Props {
  shape: IShape;
}

export const ShapePreview: React.FC<Props> = ({ shape }) => {
  return (
    <div className="flex flex-col">
      {shape.struct.map((row, i) => {
        return (
          <span
            key={i}
            className="inline-block leading-[0px] mt-1 first:mt-[0px]"
          >
            {row.map((cell, j) => {
              const color = cell ? initShape.color : undefined;
              const isPlaceholder = !cell;

              return <Cell key={j} placeholder={isPlaceholder} color={color} />;
            })}
          </span>
        );
      })}
    </div>
  );
};
