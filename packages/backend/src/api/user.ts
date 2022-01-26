import { Router } from "express";
import { User } from "../core/user";
import { redisClient } from "../redis";

const router = Router();

interface ICreateUserRequestBody {
  username: string;
  joined: number;
}

router.post("/", async (req, res) => {
  console.log("Creating user");

  const { username, joined } = req.body as ICreateUserRequestBody;

  // check if username already exists
  const key = `user:${username}`;

  // get user json string from redis
  const userJSON = await redisClient.sendCommand(["JSON.GET", key, "$"]);

  // check if user exists
  if (userJSON) {
    return res.status(400).json({ message: "Username taken" });
  }

  // create user
  const user = User.create({ username, joined });
  const userData = { ...user, joined: user.joined.getTime() };

  const userKey = `user:${userData.username}`;
  const userJSONStr = JSON.stringify(userData);

  // set user in redis -> sendCommand
  await redisClient.sendCommand(["JSON.SET", userKey, "$", userJSONStr]);

  return res.json({
    data: {
      user,
    },
  });
});

router.delete("/:username", async (req, res) => {
  const username = req.params.username;

  console.log({ username });

  const key = `user:${username}`;

  await redisClient.sendCommand(["JSON.DEL", key]);

  return res.sendStatus(204);
});

export { router };
