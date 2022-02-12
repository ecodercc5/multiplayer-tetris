import React, { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Observable } from "rxjs";
import { IBoard } from "../core/board";
import { ITetrisGame } from "../core/game";
import { useObservableState } from "../hooks/use-observable-state";
import { Tetris } from "../infra/game";

interface Props {
  game: ITetrisGame;
  tetris: Tetris;
}

export const Board: React.FC<Props> = ({ game, tetris }) => {
  const boardView = game.tetrisBoard.board;

  // only run if tetris is running: fix later
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
      {boardView.map((row, i) => {
        return (
          <div key={i}>
            {row.map((unit, j) => {
              const color = unit.color || undefined;

              return (
                <span
                  key={j}
                  style={{
                    display: "inline-block",
                    height: 12,
                    width: 12,
                    border: "1px solid black",
                    background: color,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
