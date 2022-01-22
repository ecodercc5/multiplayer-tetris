import { distinctUntilChanged, map, Observable, Subscriber } from "rxjs";
import { IBoard } from "../core/board";
import { TetrisGame } from "../core/game";
import { Unit } from "../core/unit";
import { TetrisState } from "../infra/game";

export namespace TetrisView {
  export const getBoard = (tetrisState: TetrisState): Observable<IBoard> => {
    return tetrisState.pipe(
      map((state): IBoard => {
        // TODO: refactor this later
        const activeShape = state.tetrisBoard.activeShape;

        const board = state.tetrisBoard.board.map((row, i) =>
          row.map((unit, j) => {
            const isActive = Unit.isFilled(unit);
            let containsShape: boolean = false;

            if (activeShape) {
              const { row, col } = activeShape.position;

              const maxX = row! + activeShape.struct.length - 1;
              const maxY = col! + activeShape.struct[0].length - 1;

              if (i >= row! && i <= maxX && j >= col! && j <= maxY) {
                const contains = activeShape.struct[i - row!][j - col!];

                containsShape = contains;
              }
            }

            // console.log(unit);

            const isUnitOccupied = isActive || containsShape;
            // const unitOccupied = unit.color
            //   ? unit
            //   : Unit.createUnit(activeShape!.color);

            const repr = isUnitOccupied
              ? unit.color
                ? unit
                : Unit.createUnit(activeShape?.color)
              : unit;

            return repr;
          })
        );

        return board;
      })
    );
  };

  export const isGameOver = (tetrisState: TetrisState): Observable<boolean> => {
    return tetrisState.pipe(
      map((tetrisGame) => tetrisGame.isGameOver),
      distinctUntilChanged() // is gameOver hasn't changed, don't emit the value
    );
  };

  export const getTimeElasped = (tetrisState: TetrisState) => {
    let intervalLoop: number | void;

    const getTimeElapsed = () => {
      const now = new Date();
      const timeElasped = TetrisGame.getTimeElapsed(tetrisState.value, now);

      return timeElasped;
    };

    const createObserverHandler = (subscriber: Subscriber<number>) => () => {
      const timeElapsed = getTimeElapsed();

      subscriber.next(timeElapsed);
    };

    return new Observable<number>((subscriber) => {
      // i know i know duplicate code
      const timeElapsed = getTimeElapsed();

      subscriber.next(timeElapsed);

      // create observer handler
      const observerHandler = createObserverHandler(subscriber);

      tetrisState
        .pipe(
          map((state) => state.isPaused),
          distinctUntilChanged()
        )
        .subscribe((isPaused) => {
          if (isPaused) {
            // if the game pauses -> stop emitting values

            console.log("[stop emitting values]");

            intervalLoop = window.clearInterval(intervalLoop!);
            return;
          }

          // game starts again -> start interval and emit values
          intervalLoop = window.setInterval(observerHandler, 200);
        });
    });
  };
}
