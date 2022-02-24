import React, { useEffect, useState } from "react";
import { Banner } from "../components/Banner";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Game } from "../components/NewGame";
import { socket } from "../web-socket";
import { Link, useNavigate } from "react-router-dom";
import { room } from "../infra";

type GameResult = "win" | "loss" | "playing";

export const NewGamePage = () => {
  const [gameResult, setGameResult] = useState<GameResult>("playing");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("game:over", (result) => {
      console.log("game over");
      setGameResult(result);
    });
  }, []);

  return (
    <>
      {gameResult !== "playing" && (
        <Banner>
          <h6 className="font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-br from-[#0080EE] to-[#00C7DD] mr-4">
            You {gameResult === "loss" ? "Lost" : "Won"}
          </h6>
          <button
            className="text-sm font-medium"
            onClick={() => {
              room.clear();
              navigate("/");
            }}
          >
            Return Home
          </button>
        </Banner>
      )}

      <Header />
      <Container className="flex flex-col align-center">
        <Game />
      </Container>
    </>
  );
};
