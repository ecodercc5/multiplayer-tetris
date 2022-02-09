import * as socketio from "socket.io";
import { IRoom } from "../../core/room";
import { IUser } from "../../core/user";

declare module "socket.io" {
  export interface Socket {
    user?: IUser;
    room?: IRoom;
    // other additional attributes here, example:
    // surname?: string;
  }
}
