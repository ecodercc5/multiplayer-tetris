import React from "react";
import { NewBoard } from "../components/NewBoard";
import { Game } from "../components/NewGame";
import { TetrisStats } from "../components/TetrisStats";

export const Test = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Game />
    </div>
  );
};
