import { useCallback, useEffect, useMemo } from "react";
import { ITetrisGame } from "../core/game";
import { useGameBoard } from "../hooks/use-game-board";
import { useObservableState } from "../hooks/use-observable-state";
import { useOpponentGameBoard } from "../hooks/use-opponent-game-board";
import { room } from "../infra";
import { TetrisView } from "../views/game";
import { socket } from "../web-socket";
import { Board } from "./Board";
import { ReadonlyBoard } from "./ReadonlyBoard";

export const Game: React.FC = () => {
  const { tetris } = useGameBoard();
  const opponentGameState = useOpponentGameBoard();
  const roomState = useObservableState(room.state);

  const gameViewObservable = useMemo(
    () => TetrisView.getGameView(tetris.getState()),
    [tetris]
  );

  const gameView = useObservableState(gameViewObservable);

  useEffect(() => {
    // emit that you're ready
    console.log("[on mount]");

    socket.emit("game:init");

    socket.on("game:start", () => {
      tetris.start();
    });

    tetris.getState().subscribe((tetrisGame) => {
      console.log("[emitting game update]");

      socket.emit("game:update", tetrisGame);
    });
  }, [tetris]);

  return (
    <div>
      <pre>{JSON.stringify(roomState, null, 4)}</pre>
      <div>
        <h1>My Board</h1>
        {/* <pre>{JSON.stringify(gameState, null, 4)}</pre> */}

        <Board game={gameView} tetris={tetris} />
      </div>
      <div>
        <h1>Opponent Board</h1>
        {/* <pre>{JSON.stringify(opponentGameState, null, 4)}</pre> */}

        <ReadonlyBoard game={opponentGameState} />
      </div>
      {/* <button onClick={() => socket.emit("game:init")}>Game Init Test</button> */}
    </div>
  );
};
