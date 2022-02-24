import React, { useEffect, useMemo } from "react";
import { useGameBoard } from "../hooks/use-game-board";
import { useObservableState } from "../hooks/use-observable-state";
import { useOpponentGameBoard } from "../hooks/use-opponent-game-board";
import { room, userModule } from "../infra";
import { useUser } from "../providers/UserProvider";
import { TetrisView } from "../views/game";
import { socket } from "../web-socket";
import { GameContainer } from "./GameContainer";
import { NewBoard } from "./NewBoard";
import { TetrisStats } from "./TetrisStats";

export const Game = () => {
  const { user } = useUser();
  const roomState = useObservableState(room.state);
  const { gameState, tetris } = useGameBoard();

  const gameViewObservable = useMemo(
    () => TetrisView.getGameView(tetris.getState()),
    [tetris]
  );

  const gameView = useObservableState(gameViewObservable);
  const board = gameView.tetrisBoard.board;

  const opponentGameState = useOpponentGameBoard();
  const opponentGameBoard = opponentGameState.tetrisBoard.board;

  const opponent = roomState.room.users.find(
    (usr: any) => usr._id !== user!._id
  );

  // console.log(opponent);

  useEffect(() => {
    // emit that you're ready
    console.log("[on mount]");

    socket.emit("game:init");

    socket.on("game:start", () => {
      console.log("on game start");
      tetris.start();
    });

    socket.on("game:pause", () => {
      console.log("on game pause");

      tetris.pause();
    });

    tetris.getState().subscribe((tetrisGame) => {
      // console.log("[emitting game update]");

      socket.emit("game:update", tetrisGame);
    });
  }, [tetris]);

  // console.log(gameState);

  return (
    <div className="flex items-start m-auto">
      <TetrisStats className="mt-10 relative left-1" stats={gameState} />
      <GameContainer user={user!} board={board} tetris={tetris} />
      <NewBoard
        className="relative -z-10 -left-1 top-10"
        size="sm"
        user={opponent}
        board={opponentGameBoard}
      />
    </div>
  );
};
