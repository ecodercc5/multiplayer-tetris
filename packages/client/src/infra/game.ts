import { BehaviorSubject } from "rxjs";
import {
  createEmptyBoard,
  createTetrisBoard,
  setShapeAtPosition,
  toString,
} from "../core/board";
import { ITetrisGame, TetrisGame } from "../core/game";
import { createShape } from "../core/shape";
import {
  defaultShapeGenerator,
  IShapeGenerator,
} from "../core/shape-generator";

export type TetrisState = BehaviorSubject<ITetrisGame>;

export class Tetris {
  private _state$: TetrisState;
  private _gameLoop: number | null = null;
  private _shapeGenerator: IShapeGenerator;
  private _lastUpdated: Date | null = null;

  constructor(state$: TetrisState, shapeGenerator: IShapeGenerator) {
    this._state$ = state$;
    this._shapeGenerator = shapeGenerator;
  }

  private markUpdated() {
    this._lastUpdated = new Date();
  }

  start() {
    if (this._gameLoop) {
      return;
    }

    let i = 0;
    let start: boolean = true;

    const startGameState: ITetrisGame = {
      ...this._state$.value,
      isPaused: false,
      time: {
        lastStart: new Date(),
        lastElapsed: 0,
      },
    };

    // starting the game
    this._state$.next(startGameState);

    this.markUpdated();

    // game loop
    const runGameLoop = () => {
      // console.log("yur");
      const secondsPerMove = 1 / this._state$.value.speed;
      const nextUpdateTime = this._lastUpdated!.getTime() + secondsPerMove;
      const now = new Date().getTime();

      const shouldUpdate = nextUpdateTime <= now;

      if (shouldUpdate) {
        console.log("yur");

        const state = start ? startGameState : this._state$.value;
        const nextFrame = TetrisGame.next(state, {
          shapeGenerator: this._shapeGenerator,
          scoring: () => 20,
          level: (totalRowsRemoved) => totalRowsRemoved,
          speed: (level) => (level + 1) * (1 / 1000),
        });
        // i++;

        console.log(toString(nextFrame.tetrisBoard));

        if (nextFrame.isGameOver) {
          this.pause();
        }

        if (i === 14) {
          this.pause();
        }

        if (start) {
          start = false;
        }

        this._state$.next(nextFrame);

        this.markUpdated();
      }

      // window.requestAnimationFrame(runGameLoop);
    };

    // this._gameLoop = window.requestAnimationFrame(runGameLoop);

    this._gameLoop = window.setInterval(() => runGameLoop(), 1000 / 60);
  }

  pause() {
    if (!this._gameLoop) {
      return;
    }

    // pause the game
    const game = this.getState().value;
    const pausedGame = TetrisGame.pause(game);

    // stop the game loop
    window.clearInterval(this._gameLoop);

    // some edition logic needs to put in place: lost / last elapsed

    this._state$.next(pausedGame);
    this._gameLoop = null;
  }

  reset() {
    // new game

    // abstract all of this away into core game logic (functional)
    const emptyTetrisBoard = createTetrisBoard(createEmptyBoard(6, 8));

    const initShape = createShape({
      color: "blue",
      position: { row: -2, col: 0 },
      struct: [
        [false, true, false],
        [true, true, true],
      ],
    });

    const tetrisBoard = setShapeAtPosition(emptyTetrisBoard, initShape);
    const nextShape = this._shapeGenerator.generate();

    const newTetrisGame = TetrisGame.createGame(tetrisBoard, nextShape);

    this._state$.next(newTetrisGame);
  }

  private _moveShape(mover: (game: ITetrisGame) => ITetrisGame) {
    if (!this._gameLoop) {
      return;
    }

    const nextState = mover(this._state$.value);

    this._state$.next(nextState);
    this.markUpdated();
  }

  moveShapeRight() {
    this._moveShape((gameState) => TetrisGame.moveRight(gameState));
  }

  moveShapeLeft() {
    this._moveShape((gameState) => TetrisGame.moveLeft(gameState));
  }

  moveShapeDown() {
    this._moveShape((gameState) => TetrisGame.moveDown(gameState));
  }

  rotateShapeRight() {
    this._moveShape((gameState) => TetrisGame.rotateRight(gameState));
  }

  rotateShapeLeft() {
    this._moveShape((gameState) => TetrisGame.rotateLeft(gameState));
  }

  hardDropShape() {
    this._moveShape((gameState) => TetrisGame.hardDrop(gameState));
  }

  getState() {
    return this._state$;
  }
}

// testing
const emptyTetrisBoard = createTetrisBoard(createEmptyBoard(6, 8));

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

const tetrisState: TetrisState = new BehaviorSubject(tetrisGame);
export const tetris = new Tetris(tetrisState, defaultShapeGenerator);
