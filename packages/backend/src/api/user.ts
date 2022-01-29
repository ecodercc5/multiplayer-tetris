import { Router } from "express";
import { User } from "../core/user";
import { redisClient } from "../redis";

const router = Router();

router.get("/", async (req, res) => {
  console.log("[getting users]");

  // i'm doing this the stupid way for now -> this is completely unsafe
  // sending username in the header for auth -> use jwt later
  const username = req.header("user");

  // console.log({ username });

  try {
    // get all user keys -> highly unscalable I know
    const userKeys = await redisClient.keys("user:*");

    // current user key
    const userKey = `user:${username}`;

    // filter the keys to exclude the current user
    const filterUserKeys = userKeys.filter((key) => key !== userKey);

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

    const parsedUserData = usersDataStrArray.map((data) => JSON.parse(data)[0]);

    // console.log(parsedUserData);

    return res.json({ users: parsedUserData });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: "Something went wrong bozo" });
  }
});

router.delete("/:username", async (req, res) => {
  const username = req.params.username;

  console.log({ username });

  const key = `user:${username}`;

  await redisClient.sendCommand(["JSON.DEL", key]);

  return res.sendStatus(204);
});

export { router };
