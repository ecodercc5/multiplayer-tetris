import React, { useEffect, useState } from "react";
import { useObservableState } from "../hooks/use-observable-state";
import { users } from "../infra";
import { useUser } from "../providers/UserProvider";
import { socket } from "../web-socket";

interface Props {}

socket.on("connect", () => console.log("Connected"));

export const Welcome: React.FC<Props> = () => {
  const [username, setUsername] = useState("");
  const { user, userModule } = useUser();
  const usersState = useObservableState(users.state);

  useEffect(() => {
    if (user) {
      users.getUsers();
    }
  }, [user]);

  const handleSubmit = () => {
    userModule.create(username);
  };

  const handleChallenge = (username: string) => {
    socket.emit("user:challenge", username);
  };

  return (
    <div>
      {!user && (
        <>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleSubmit}>Create User</button>
        </>
      )}

      {user && (
        <>
          <h2>user: {user?.username}</h2>
          {usersState.map((user) => {
            return (
              <div key={user._id}>
                <span>
                  {user.username}

                  <button onClick={() => handleChallenge(user.username)}>
                    Challenge
                  </button>
                </span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
