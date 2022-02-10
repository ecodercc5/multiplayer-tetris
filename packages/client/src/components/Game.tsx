import { useEffect } from "react";
import { useGameBoard } from "../hooks/use-game-board";
import { useOpponentGameBoard } from "../hooks/use-opponent-game-board";
import { socket } from "../web-socket";

export const Game: React.FC = () => {
  const { gameState, tetris } = useGameBoard();
  const opponentGameState = useOpponentGameBoard();

  useEffect(() => {
    // emit that you're ready
    console.log("[on mount]");

    socket.emit("game:init");
  }, []);

  return (
    <div>
      <div>
        <h1>My Board</h1>
        <pre>{JSON.stringify(gameState, null, 4)}</pre>
      </div>
      <div>
        <h1>Opponent Board</h1>
        <pre>{JSON.stringify(opponentGameState, null, 4)}</pre>
      </div>
    </div>
  );
};
