import { socket } from "../web-socket";
import { RoomModule } from "./room";
import { UserModule } from "./user";
import { UsersModule } from "./users";

export const userModule = new UserModule(socket);
export const users = new UsersModule(socket);

export const room = new RoomModule(socket, userModule);
