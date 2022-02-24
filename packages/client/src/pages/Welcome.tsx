import React, { useEffect, useState } from "react";
import { useObservableState } from "../hooks/use-observable-state";
import { room, users } from "../infra";
import { useUser } from "../providers/UserProvider";
import { socket } from "../web-socket";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Container } from "../components/Container";
import { Status } from "../components/Status";
import { PlayerCard } from "../components/PlayerCard";
import { IUser } from "../core/user";

interface Props {}

socket.on("connect", () => console.log("Connected"));

export const Welcome: React.FC<Props> = () => {
  const [username, setUsername] = useState("");
  const { user, userModule } = useUser();
  const roomState = useObservableState(room.state);
  const usersState = useObservableState(users.state);

  const navigate = useNavigate();

  const numPlayers = usersState.length;

  useEffect(() => {
    if (roomState.isInRoom) {
      navigate("/gameroom");
    }
  }, [roomState.isInRoom, navigate]);

  useEffect(() => {
    if (user) {
      users.getUsers();
    }
  }, [user]);

  const handleSubmit = () => {
    userModule.create(username);
  };

  const handleChallenge = (player: IUser) => {
    console.log("on challenge");

    const username = player.username;

    console.log(username);

    socket.emit("user:challenge", username);
  };

  console.log({ users: usersState });

  return (
    <div className="flex flex-col h-full">
      <Header />

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
        <Container className="h-full">
          {/* <h2>user: {user?.username}</h2> */}

          <div className="flex flex-col items-center">
            <span className="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-br from-[#0080EE] to-[#00C7DD]">
              Players
            </span>
            <h1 className="font-bold text-4xl text-zinc-900 mt-1">
              Find Someone To Play
            </h1>

            <Status className="mt-5" name={`${numPlayers} Players Online`} />
          </div>

          <div className="pt-12">
            {usersState.map((userState) => {
              return (
                <PlayerCard
                  key={userState._id}
                  player={userState}
                  onChallenge={handleChallenge}
                />
              );
            })}
          </div>
        </Container>
      )}
    </div>
  );
};
