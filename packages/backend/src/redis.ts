import { Client } from "redis-om";

export const redisClient = new Client();

export const connectToRedis = async (url: string) => {
  // check if redis client is opne
  if (!redisClient.isOpen()) {
    // connect to redis
    await redisClient.open(url);
  }
};
