import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { User } from "../core/user";
import { redisClient } from "../redis";

interface IUserCreateData {
  username: string;
}

export const registerUserHandlers = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  socket.on("user:create", async (data: IUserCreateData) => {
    console.log("[creating user]");

    const username = data.username;
    const joined = new Date().getTime();

    // check if username already exists
    const key = `user:${username}`;

    // get user json string from redis
    const userJSON = await redisClient.sendCommand(["JSON.GET", key, "$"]);

    // check if user exists
    if (userJSON) {
      // error
      //   return res.status(400).json({ message: "Username taken" });

      return;
    }

    // create user
    const user = User.create({ username, joined });
    const userData = { ...user, joined: user.joined.getTime() };

    const userKey = `user:${userData.username}`;
    const userJSONStr = JSON.stringify(userData);

    // set user in redis -> sendCommand
    await redisClient.sendCommand(["JSON.SET", userKey, "$", userJSONStr]);
  });
};
