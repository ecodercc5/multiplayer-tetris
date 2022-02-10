import { useState } from "react";
import { TetrisGame } from "../core/game";

export const useOpponentGameBoard = () => {
  const [gameState, setGameState] = useState(() =>
    TetrisGame.createEmptyGame()
  );

  return gameState;
};
