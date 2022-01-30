import { IUser, User } from "../core/user";
import { RedisClient } from "../redis";

export class RedisUserRepo {
  constructor(private redisClient: RedisClient) {}

  async getUserByUsername(usernameQuery: string): Promise<IUser | null> {
    const userKey = `user:${usernameQuery}`;

    const userRes = await this.redisClient.sendCommand([
      "JSON.GET",
      userKey,
      "$",
    ]);

    if (!userRes) {
      return null;
    }

    const userStr = userRes.toString();
    const userJSON = JSON.parse(userStr)[0];
    const { username, joined, socketId, _id } = userJSON;

    const user = User.create({ username, joined, socketId, _id });

    return user;
  }
}
