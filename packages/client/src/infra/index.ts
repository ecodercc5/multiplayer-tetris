import { socket } from "../web-socket";
import { UserModule } from "./user";
import { UsersModule } from "./users";

export const userModule = new UserModule(socket);
export const users = new UsersModule(socket);
