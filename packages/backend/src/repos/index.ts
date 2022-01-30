import { redisClient } from "../redis";
import { RedisUserRepo } from "./user";

export const userRepo = new RedisUserRepo(redisClient);
