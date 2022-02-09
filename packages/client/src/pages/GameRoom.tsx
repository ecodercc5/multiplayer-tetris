import React from "react";
import { Navigate } from "react-router-dom";
import { map } from "rxjs";
import { useObservableState } from "../hooks/use-observable-state";
import { room } from "../infra";
import { useUser } from "../providers/UserProvider";

export const GameRoom = () => {
  const { user } = useUser();

  const roomState = useObservableState(room.state);
  const userGameState = useObservableState(
    room.state.pipe(
      map((roomState) =>
        roomState
          ? roomState.room.users.find((usr: any) => usr._id === user!._id)
          : []
      )
    )
  );

  if (!user) {
    return <Navigate to="/" />;
  }

  const isUserReady = userGameState.isReady;
  const areBothUsersReady = roomState.room.users.every(
    (usr: any) => usr.isReady
  );

  if (!roomState.isInRoom) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {areBothUsersReady ? (
        <div>game</div>
      ) : (
        <>
          <pre>{JSON.stringify(roomState, null, 4)}</pre>
          <pre>{JSON.stringify(userGameState, null, 4)}</pre>
        </>
      )}

      {!isUserReady && (
        <button onClick={() => room.setIsReady()}>I'm Ready</button>
      )}
    </div>
  );
};
