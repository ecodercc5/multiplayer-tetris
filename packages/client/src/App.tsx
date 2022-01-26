import { Route, Routes } from "react-router-dom";
import { Welcome, Game } from "./pages";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:8000");

// socket.on("connect", () => {
//   console.log(socket.id);
// });

// socket.emit("hello");

// socket.on("hello-response", () => console.log("[hello response]"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}

export default App;
