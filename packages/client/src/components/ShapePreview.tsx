import React from "react";
import { createShape } from "../core/shape";
import { Cell } from "./Cell";

const initShape = createShape({
  color: "#F87171",
  position: { row: 4, col: 0 },
  struct: [
    [false, true, false],
    [true, true, true],
  ],
});

export const ShapePreview = () => {
  return (
    <div className="flex flex-col">
      {initShape.struct.map((row) => {
        return (
          <span className="inline-block leading-[0px] mt-1 first:mt-[0px]">
            {row.map((cell) => {
              const color = cell ? initShape.color : undefined;
              const isPlaceholder = !cell;

              return (
                <Cell placeholder={isPlaceholder} size="sm" color={color} />
              );
            })}
          </span>
        );
      })}
    </div>
  );
};
