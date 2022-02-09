import { Route, Routes } from "react-router-dom";
import { Welcome, Game } from "./pages";
import { GameRoom } from "./pages/GameRoom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/gameroom" element={<GameRoom />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;
