import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Room } from "../core/room";
import { User } from "../core/user";
import { UserGameState } from "../core/userReadyState";
import { redisClient } from "../redis";
import { userRepo } from "../repos";

interface IUserCreateData {
  username: string;
}

export const registerUserHandlers = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("users:get", async () => {
    console.log("[getting users]");

    const user = socket.user;

    // i'm doing this the stupid way for now -> this is completely unsafe
    // sending username in the header for auth -> use jwt later
    if (!user) {
      return socket.emit("user:get", []);
    }

    const username = user.username;

    try {
      // get all user keys -> highly unscalable I know
      const userKeys = await redisClient.keys("user:*");

      // current user key
      const userKey = `user:${username}`;

      // filter the keys to exclude the current user
      const filterUserKeys = userKeys.filter((key) => key !== userKey);

      if (filterUserKeys.length === 0) {
        return socket.emit("users:get", []);
      }

      // get all the users -> $ means get all the contents inside the json
      const usersData = await redisClient.sendCommand([
        "JSON.MGET",
        ...filterUserKeys,
        "$",
      ]);

      // console.log(usersData);

      // console.log("[yur]");

      // console.log(typeof usersData);
      // console.log(JSON.parse(usersData?.toString()));

      // console.log((usersData?.valueOf() as Array<any>).length);

      const usersDataStrArray = usersData?.valueOf() as string[];

      const parsedUserData = usersDataStrArray.map(
        (data) => JSON.parse(data)[0]
      );

      // console.log(parsedUserData);

      return socket.emit("users:get", parsedUserData);
    } catch (err) {
      console.error(err);

      return socket.emit("users:get", []);
    }
  });

  socket.on("user:create", async (data: IUserCreateData) => {
    console.log("[creating user]");

    const username = data.username;
    const joined = new Date().getTime();
    const socketId = socket.id;

    // check if username already exists
    // get user json string from redis

    const preExistingUser = await userRepo.getUserByUsername(username);

    // check if user exists
    if (preExistingUser) {
      return;
    }

    // create user
    const user = User.create({ username, joined, socketId });
    const userData = { ...user, joined: user.joined.getTime() };

    const userKey = `user:${userData.username}`;
    const userJSONStr = JSON.stringify(userData);

    // set user in redis -> sendCommand
    await redisClient.sendCommand(["JSON.SET", userKey, "$", userJSONStr]);

    socket.emit("user:created", userData);

    // user session
    socket.user = user;

    socket.broadcast.emit("user:added", userData);
  });

  socket.on("user:challenge", async (username: string) => {
    console.log("[challenging user]");
    console.log(username);

    const currentUser = socket.user;

    console.log(currentUser);

    if (!currentUser) {
      return;
    }

    // get the user challenged
    const userChallenged = await userRepo.getUserByUsername(username);

    if (!userChallenged) {
      return;
    }

    const challengerReadyState = UserGameState.create(currentUser);
    const otherReadyState = UserGameState.create(userChallenged);

    const users = [challengerReadyState, otherReadyState];

    const room = Room.create({
      users,
    });

    console.log(room);

    const roomKey = `room:${room._id}`;
    const roomJSONStr = JSON.stringify(room);

    await redisClient.sendCommand(["JSON.SET", roomKey, "$", roomJSONStr]);

    const socketIds = [challengerReadyState.socketId, otherReadyState.socketId];

    const roomId = room._id;

    socketIds.forEach((socketId) => {
      console.log(`[joing room: ${roomId}]`);
      io.in(socketId).socketsJoin(roomId);
      const currentSocket = io.sockets.sockets.get(socketId);

      // set the room on the sockets
      currentSocket!.room = room;
    });

    const roomDTO = {
      ...room,
      users: room.users.map((user) => ({
        ...user,
        joined: user.joined.getTime(),
      })),
    };

    console.log(roomDTO);

    io.to(roomId).emit("room:joined", roomDTO);
  });

  socket.on("user:delete", async (username: string) => {
    console.log("[deleting user]");

    const userKey = `user:${username}`;

    await redisClient.sendCommand(["JSON.DEL", userKey]);

    socket.broadcast.emit("user:deleted", username);
  });

  socket.on("disconnect", async () => {
    console.log("[on disconnect]");
    console.log("[deleting user]");

    const user = socket.user;

    if (!user) {
      return;
    }

    const { username } = user;

    const userKey = `user:${username}`;

    await redisClient.sendCommand(["JSON.DEL", userKey]);

    socket.broadcast.emit("user:deleted", username);
  });
};
