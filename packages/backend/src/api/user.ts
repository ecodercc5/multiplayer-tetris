import { Router } from "express";
import { User } from "../core/user";
import { userRedisRepository } from "../models/user";

const router = Router();

interface ICreateUserRequestBody {
  username: string;
  joined: number;
}

router.post("/", async (req, res) => {
  console.log("Creating user");

  const { username, joined } = req.body as ICreateUserRequestBody;

  // check if username already exists

  // create user
  const user = User.create({ username, joined });
  const userData: any = { ...user, joined: user.joined.getTime() };

  console.log(userData);

  const userModel = userRedisRepository.createEntity(userData);

  console.log(userModel);

  // save user to redis
  await userRedisRepository.save(userModel);

  return res.json({
    data: {
      user,
    },
  });
});

router.delete("");

export { router };
