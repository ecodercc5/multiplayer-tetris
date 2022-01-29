import { socket } from "../web-socket";
import { Users } from "./users";

export const users = new Users(socket);
