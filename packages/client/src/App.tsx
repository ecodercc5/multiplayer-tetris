import { Route, Routes } from "react-router-dom";
import { Welcome, Game } from "./pages";
import { GameRoom } from "./pages/GameRoom";
import { Test } from "./pages/Test";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/gameroom" element={<GameRoom />} />
        <Route path="/game" element={<Game />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}
