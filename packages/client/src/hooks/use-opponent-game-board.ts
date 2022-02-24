import { useEffect, useMemo, useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";
import {
  createEmptyBoard,
  createTetrisBoard,
  setShapeAtPosition,
} from "../core/board";
import { TetrisGame } from "../core/game";
import { createShape } from "../core/shape";
import { TetrisState } from "../infra/game";
import { TetrisView } from "../views/game";
import { socket } from "../web-socket";
import { useObservableState } from "./use-observable-state";

// refactor all of this later
const emptyTetrisBoard = createTetrisBoard(createEmptyBoard(20, 10));

const initShape = createShape({
  color: "blue",
  position: { row: -2, col: 0 },
  struct: [
    [false, true, false],
    [true, true, true],
  ],
});

const tetrisBoard = setShapeAtPosition(emptyTetrisBoard, initShape);

const shape = createShape({
  color: "green",
  position: { row: null, col: null },
  struct: [
    [true, true],
    [true, true],
  ],
});

const tetrisGame = TetrisGame.createGame(tetrisBoard, shape);

export const useOpponentGameBoard = () => {
  const opponentGameRef = useRef<TetrisState>(new BehaviorSubject(tetrisGame));

  const viewObservable = useMemo(
    () => TetrisView.getGameView(opponentGameRef.current),
    []
  );

  const opponentGameState = useObservableState(viewObservable);

  useEffect(() => {
    socket.on("game:update", (tetrisGame: any) => {
      console.log("[game:update]");

      opponentGameRef.current.next(tetrisGame);
    });
  }, []);

  return opponentGameState;
};
