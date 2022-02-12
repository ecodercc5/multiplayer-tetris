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

  socket.on("game:init", async () => {
    // could abstract this away
    const user = socket.user;
    const room = socket.room;

    if (!user || !room) {
      return;
    }

    console.log("game:init");
    console.log(user);

    const roomKey = `room:${room._id}`;

    attemptAndRetry(async () => {
      return redisClient.executeIsolated(async (isolatedClient) => {
        await isolatedClient.watch(roomKey);

        const currentRoom = await isolatedClient.sendCommand([
          "JSON.GET",
          roomKey,
          "$",
        ]);

        const multi = redisClient.multi();

        const currentRoomData = JSON.parse(currentRoom as string)[0];
        const newRoom = Room.gameInit(currentRoomData, user._id);

        console.log("getting current room");
        console.log(currentRoomData);
        console.log(newRoom);

        // multi.json.SET(roomKey, "$", newRoomJSON);

        multi.json.set(roomKey, "$", newRoom as any);

        await multi.exec();

        io.to(room._id).emit("game:init", newRoom);

        const isEverybodyReady = Room.isAllPlayersReady(newRoom);

        if (isEverybodyReady) {
          io.to(room._id).emit("game:start");
        }
      });
    });
  });

  socket.on("game:update", (tetrisGame: any) => {
    const user = socket.user;
    const room = socket.room;

    if (!user || !room) {
      return;
    }

    console.log("[game:update]");

    const roomId = room._id;

    console.log(tetrisGame);

    socket.broadcast.to(roomId).emit("game:update", tetrisGame);
  });
};

const attemptAndRetry = async (func: Function) => {
  try {
    await func();
  } catch {
    setTimeout(() => {
      attemptAndRetry(func);
    }, 100);
  }
};
