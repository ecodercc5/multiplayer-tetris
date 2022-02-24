import React, { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { IBoard } from "../core/board";
import { IUser } from "../core/user";
import { Tetris } from "../infra/game";
import { NewBoard } from "./NewBoard";

interface Props {
  user: IUser;
  tetris: Tetris;
  board: IBoard;
}

export const GameContainer: React.FC<Props> = ({ user, tetris, board }) => {
  useHotkeys("z, ctrl", () => tetris.rotateShapeLeft());

  useHotkeys("space", () => {
    console.log("space pressed");
    tetris.hardDropShape();
  });

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      // console.log("keydown");

      // console.log(e.keyCode);

      switch (e.keyCode) {
        case 37:
          // alert("left");
          console.log("[left]");

          tetris.moveShapeLeft();
          break;
        case 38:
          // alert("up");
          tetris.rotateShapeRight();

          break;
        case 39:
          // alert("right");
          console.log("[right]");

          tetris.moveShapeRight();
          break;
        case 40:
          // alert("down");

          console.log("[down]");

          tetris.moveShapeDown();
          break;
      }
    };

    // REFACTOR THIS -> NEEDS A UNSUBSCRIBER
    document.addEventListener("keydown", listener);

    return () => document.removeEventListener("keydown", listener);
  }, [tetris]);

  return (
    <div>
      <NewBoard className="relative" user={user} board={board} />
    </div>
  );
};
