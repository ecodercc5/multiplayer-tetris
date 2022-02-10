import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Room } from "../core/room";
import { redisClient } from "../redis";

export const registerGameHandler = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("game:player_ready", async () => {
    const user = socket.user;
    const room = socket.room;

    if (!user || !room) {
      return;
    }

    const roomWithUserReady = Room.setUserReady(room, user._id);

    console.log(user, room);

    console.log(roomWithUserReady);

    roomWithUserReady.users.forEach((user) => {
      const currentSocket = io.sockets.sockets.get(user.socketId);

      currentSocket!.room = roomWithUserReady;
    });

    const roomKey = `room:${roomWithUserReady._id}`;

    const roomStr = JSON.stringify(roomWithUserReady);

    await redisClient.sendCommand(["JSON.SET", roomKey, "$", roomStr]);

    socket.to(room._id).emit("room:opponent_ready", roomWithUserReady);
  });

  socket.on("game:init", () => {
    // could abstract this away
    const user = socket.user;
    const room = socket.room;

    if (!user || !room) {
      return;
    }

    console.log("game:init");
    console.log(user);

    const lockedRoom = Room.lock(room);

    const opponent = room.users.find((usr) => usr._id !== user._id)!;
    const opponentSocket = io.sockets.sockets.get(opponent?.socketId)!;

    opponentSocket.room = lockedRoom;

    // set user init as ready
    const newRoom = Room.gameInit(room, user._id);

    console.log("new:room");
    console.log(newRoom);
  });
};
