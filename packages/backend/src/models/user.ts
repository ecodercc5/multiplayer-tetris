import { Entity, Schema, Repository } from "redis-om";
import { redisClient } from "../redis";

class User extends Entity {}

export const userSchema = new Schema(
  User,
  {
    username: { type: "string" },
    joined: { type: "number" },
    _id: { type: "string", textSearch: true },
  },
  { dataStructure: "JSON" }
);

export const userRedisRepository = new Repository(userSchema, redisClient);
