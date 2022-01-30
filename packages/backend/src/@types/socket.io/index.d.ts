import * as socketio from "socket.io";
import { IUser } from "../../core/user";

declare module "socket.io" {
  export interface Socket {
    user?: IUser;
    // other additional attributes here, example:
    // surname?: string;
  }
}
