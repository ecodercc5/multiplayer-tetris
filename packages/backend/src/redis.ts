import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL as string;

export const redisClient = createClient({ url: REDIS_URL });

type RedisClient = typeof redisClient;

redisClient.on("error", (err) => console.error(err));

export const connectToRedis = (client: RedisClient) => {
  return client.connect();
};
