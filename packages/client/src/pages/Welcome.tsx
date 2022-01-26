import React, { useState } from "react";
import { socket } from "../web-socket";

interface Props {}

socket.on("connect", () => console.log("Connected"));

export const Welcome: React.FC<Props> = () => {
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    socket.emit("user:create", { username });
  };

  return (
    <div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleSubmit}>Create User</button>
    </div>
  );
};
