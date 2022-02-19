import React from "react";
import { tetrisBoard, tetrisGame } from "../core/game";
import { Cell } from "./Cell";
import { Divider } from "./Divider";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

console.log(tetrisBoard);

const board = tetrisBoard.board;

export const NewBoard: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={`py-2 shadow-[0_2px_10px_0_rgba(0,0,0,0.07)] bg-white w-[350px] rounded-md ${className}`}
      {...props}
    >
      <div className="px-4 mb-2">
        <h6 className="font-medium text-zinc-900">Eric Chen</h6>
      </div>

      <Divider />

      <div className="leading-[0px] mt-4 mb-2 flex flex-col items-center">
        {board.map((row, i) => {
          return (
            <span
              key={i}
              className="inline-block leading-[0px] mt-1 first:mt-[0px]"
            >
              {row.map((cell, j) => {
                const color = cell.color || undefined;
                const isPlaceholder = !color;

                return (
                  <Cell
                    key={j}
                    placeholder={isPlaceholder}
                    size="lg"
                    color={color}
                  />
                );
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
};
