import { boolean } from "fp-ts";
import {
  createEmptyBoard,
  createTetrisBoard,
  fixActiveShape,
  ITetrisBoard,
  moveShapeDown,
  putShapeAtTheTop,
  setShapeAtPosition,
  moveShapeRight,
  toString,
  moveShapeLeft,
  rotateShapeRight,
  areAnyRowsFilled,
  removeFilledRows,
  isAnyColumnFilled,
  getNumRowsFilled,
  rotateShapeLeft,
  hardDropShape,
} from "./board";
import { createShape, IShape } from "./shape";
import { IShapeGenerator } from "./shape-generator";

export interface ITetrisGame {
  tetrisBoard: ITetrisBoard;
  nextShape: IShape;
  isGameOver: boolean;
  isPaused: boolean;
  level: number;
  _moves: number;
  _totalRowsRemoved: number;
  speed: number;
  score: number;
  time: {
    lastStart: Date | null;
    lastElapsed: number;
  };
}

interface ITetrisGameConfig {
  shapeGenerator: IShapeGenerator;
  scoring: (rowsRemoved: number) => number;
  level?: (totalRowsRemoved: number) => number;
  speed: (level: number) => number;
}

export namespace TetrisGame {
  export const createEmptyGame = (): ITetrisGame => {
    const tetrisBoard = createTetrisBoard(createEmptyBoard(6, 8));
    const nextShape = createShape({
      color: "green",
      position: { row: null, col: null },
      struct: [
        [true, true],
        [true, true],
      ],
    });

    return {
      isGameOver: false,
      isPaused: true,
      tetrisBoard,
      nextShape,
      level: 0,
      _moves: 0,
      _totalRowsRemoved: 0,
      speed: 1 / 1000, // 1 move per 1000ms or 1 second
      score: 0,
      time: {
        lastStart: null,
        lastElapsed: 0,
      },
    };
  };

  export const createGame = (
    tetrisBoard: ITetrisBoard,
    nextShape: IShape
  ): ITetrisGame => {
    return {
      isGameOver: false,
      isPaused: true,
      tetrisBoard,
      nextShape,
      level: 0,
      _moves: 0,
      _totalRowsRemoved: 0,
      speed: 1 / 1000, // 1 move per 1000ms or 1 second
      score: 0,
      time: {
        lastStart: null,
        lastElapsed: 0,
      },
    };
  };

  export const createNewGame = () => {};

  export const next = (
    game: ITetrisGame,
    config: ITetrisGameConfig
  ): ITetrisGame => {
    const newBoard = moveShapeDown(game.tetrisBoard);

    const shapeMovedDown = newBoard !== game.tetrisBoard;

    // console.log({ newBoard });
    // console.log(toString(newBoard));

    if (!shapeMovedDown) {
      // console.log("shape not moved down");

      let newBoardd = fixActiveShape(newBoard);

      console.log({ newBoardd });

      // check loss -> are any of the columns filled
      const anyColFilled = isAnyColumnFilled(newBoard);

      if (anyColFilled) {
        console.log("[col filled]");

        return {
          ...game,
          isGameOver: true,
          tetrisBoard: newBoardd,
        };
      }

      // check if any rows are filled
      const anyRowsFilled = areAnyRowsFilled(newBoardd); // maybe this is unneccessary
      const numRowsRemoved = getNumRowsFilled(newBoardd);

      console.log({ anyRowsFilled });

      let newScore = 0;

      if (anyRowsFilled) {
        // remove the filled rows
        console.log("[removing filled rows]");

        newScore = config.scoring(numRowsRemoved);

        // const boardWithRowsRemoved
        newBoardd = removeFilledRows(newBoardd);

        console.log(toString(newBoardd));
      }

      // console.log({ newBoard });

      const newTetrisBoard = putShapeAtTheTop(newBoardd, game.nextShape);

      const nextShape = config.shapeGenerator.generate();
      // console.log({ nextShape });

      // const newTetrisGame = createGame(newTetrisBoard, nextShape);
      const totalRowsRemoved = game._totalRowsRemoved + numRowsRemoved;
      const level = config.level!(totalRowsRemoved);
      const speed = config.speed(level);

      const newTetrisGame: ITetrisGame = {
        ...game,
        tetrisBoard: newTetrisBoard,
        nextShape,
        _moves: game._moves + 1,
        _totalRowsRemoved: totalRowsRemoved,
        level,
        speed,
        score: game.score + newScore,
      };

      return newTetrisGame;
    }

    return {
      ...game,
      tetrisBoard: newBoard,
    };
  };

  export const moveRight = (game: ITetrisGame): ITetrisGame => {
    const newTetrisBoard = moveShapeRight(game.tetrisBoard);

    return {
      ...game,
      tetrisBoard: newTetrisBoard,
    };
  };

  export const moveLeft = (game: ITetrisGame): ITetrisGame => {
    const newTetrisBoard = moveShapeLeft(game.tetrisBoard);

    return {
      ...game,
      tetrisBoard: newTetrisBoard,
    };
  };

  export const moveDown = (game: ITetrisGame): ITetrisGame => {
    const newTetrisBoard = moveShapeDown(game.tetrisBoard);

    return {
      ...game,
      tetrisBoard: newTetrisBoard,
    };
  };

  export const rotateRight = (game: ITetrisGame): ITetrisGame => {
    const newTetrisBoard = rotateShapeRight(game.tetrisBoard);

    return {
      ...game,
      tetrisBoard: newTetrisBoard,
    };
  };

  export const rotateLeft = (game: ITetrisGame): ITetrisGame => {
    const newTetrisBoard = rotateShapeLeft(game.tetrisBoard);

    return {
      ...game,
      tetrisBoard: newTetrisBoard,
    };
  };

  export const hardDrop = (game: ITetrisGame): ITetrisGame => {
    const newTetrisBoard = hardDropShape(game.tetrisBoard);

    return {
      ...game,
      tetrisBoard: newTetrisBoard,
    };
  };

  export const start = (game: ITetrisGame): ITetrisGame => {
    return {
      ...game,
      isPaused: false,
    };
  };

  export const pause = (game: ITetrisGame): ITetrisGame => {
    // requires additional logic for time!!!

    return {
      ...game,
      isPaused: true,
    };
  };

  export const getTimeElapsed = (game: ITetrisGame, now: Date): number => {
    if (!game.time.lastStart) {
      return 0;
    }

    if (game.isPaused) {
      return game.time.lastElapsed;
    }

    const currentTime = now.getTime();
    const lastStartTime = game.time.lastStart.getTime();
    const lastElapsed = game.time.lastElapsed;

    const totalTimeElapsed = currentTime - lastStartTime + lastElapsed;

    return totalTimeElapsed;
  };
}

const emptyTetrisBoard = createTetrisBoard(createEmptyBoard(20, 10));

const initShape = createShape({
  color: "blue",
  position: { row: 4, col: 0 },
  struct: [
    [false, true, false],
    [true, true, true],
  ],
});

export const tetrisBoard = setShapeAtPosition(emptyTetrisBoard, initShape);

const shape = createShape({
  color: "#f4f4f4",
  position: { row: null, col: null },
  struct: [
    [true, true],
    [true, true],
  ],
});

export const tetrisGame = TetrisGame.createGame(tetrisBoard, shape);

// const nextFrame = TetrisGame.next(tetrisGame);

// console.log(nextFrame);
