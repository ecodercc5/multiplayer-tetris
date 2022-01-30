import { Route, Routes } from "react-router-dom";
import { Welcome, Game } from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;
