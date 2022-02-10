import { tetris } from "../infra/game";
import { useObservableState } from "./use-observable-state";

export const useGameBoard = () => {
  const gameState = useObservableState(tetris.getState());

  return { gameState, tetris };
};
