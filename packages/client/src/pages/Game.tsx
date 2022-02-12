import { useMemo, useState } from "react";
import { Board } from "../components/Board";
import { Tetris, tetris } from "../infra/game";
import { TetrisView } from "../views/game";
import { useObservableState } from "../hooks/use-observable-state";

type Props = {};

export const Game: React.FC<Props> = () => {
  console.log("yo");
  const tetrisState = tetris.getState();
  const board$ = useMemo(() => TetrisView.getBoard(tetrisState), [tetrisState]);
  const isGameOver$ = useMemo(
    () => TetrisView.isGameOver(tetrisState),
    [tetrisState]
  );

  const isGameOver = useObservableState(isGameOver$);

  const tetrisStateObject = useObservableState(tetrisState);

  return (
    <div className="App">
      <h1>Hello Javi</h1>
      {/* <pre>{JSON.stringify(game, null, 4)}</pre> */}
      {/* <Board board$={board$} tetris={tetris} /> */}
      <button onClick={() => tetris.start()}>Start</button>
      <button onClick={() => tetris.pause()}>Pause</button>
      <button onClick={() => tetris.reset()}>Reset</button>
      <h6>Game Over: {isGameOver ? "true" : "false"}</h6>
      <h6>Last Start: {tetrisStateObject.time.lastStart?.getTime()}</h6>
      <h6>Score: {tetrisStateObject.score}</h6>
      <h6>Level: {tetrisStateObject.level}</h6>
      <h6>Moves: {tetrisStateObject._moves}</h6>
      <h6>Total Rows Removed: {tetrisStateObject._totalRowsRemoved}</h6>
    </div>
  );
};
