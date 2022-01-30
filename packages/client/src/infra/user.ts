import { BehaviorSubject } from "rxjs";
import { Socket } from "socket.io-client";
import { IUser, User } from "../core/user";

export class UserModule {
  private _user: BehaviorSubject<IUser | null> =
    new BehaviorSubject<IUser | null>(null);
  private _socket: Socket<any, any>;

  constructor(socket: Socket<any, any>) {
    this._socket = socket;

    this._socket.on("user:created", (userDTO: any) => {
      console.log("[user created]");

      console.log(userDTO);

      const user = User.fromDTO(userDTO);

      console.log(user);

      this._user.next(user);
    });
  }

  create(username: string) {
    console.log("[creating user]");

    this._socket.emit("user:create", { username });
  }

  get state() {
    return this._user;
  }
}
