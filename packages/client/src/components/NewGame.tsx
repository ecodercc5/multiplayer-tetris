import React from "react";
import { NewBoard } from "./NewBoard";
import { TetrisStats } from "./TetrisStats";

export const Game = () => {
  return (
    <div className="flex">
      <TetrisStats className="mt-10 relative left-1" />
      <NewBoard className="relative" />
    </div>
  );
};
