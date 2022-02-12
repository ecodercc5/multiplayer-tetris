import React from "react";
import { Observable } from "rxjs";
import { IBoard } from "../core/board";
import { ITetrisGame } from "../core/game";
import { useObservableState } from "../hooks/use-observable-state";
import { Tetris } from "../infra/game";

interface Props {
  game: ITetrisGame;
}

export const ReadonlyBoard: React.FC<Props> = ({ game }) => {
  const boardView = game.tetrisBoard.board;

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
