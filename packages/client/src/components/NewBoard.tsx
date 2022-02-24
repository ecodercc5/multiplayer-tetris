import React from "react";
import { IBoard } from "../core/board";
import { tetrisBoard, tetrisGame } from "../core/game";
import { IUser } from "../core/user";
import { Cell } from "./Cell";
import { Divider } from "./Divider";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  size?: "lg" | "sm";
  user: IUser;
  board: IBoard;
}

console.log(tetrisBoard);

const SIZE_TO_WIDTH = {
  lg: "w-[350px]",
  sm: "w-[300px]",
};

// const board = tetrisBoard.board;

export const NewBoard: React.FC<Props> = ({
  className,
  size = "lg",
  user,
  board,
  ...props
}) => {
  const width = SIZE_TO_WIDTH[size];

  // console.log(board);

  return (
    <div
      className={`py-2 shadow-[0_2px_10px_0_rgba(0,0,0,0.07)] bg-white ${width} rounded-md ${className}`}
      {...props}
    >
      <div className="px-4 mb-2">
        <h6 className="font-medium text-zinc-900">{user.username}</h6>
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
                // const isPlaceholder = !color;

                // console.log(cell);

                return (
                  <Cell
                    key={j}
                    // placeholder={isPlaceholder}
                    size={size}
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
