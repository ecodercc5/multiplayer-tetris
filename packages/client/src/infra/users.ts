import { BehaviorSubject } from "rxjs";
import { Socket } from "socket.io-client";
import { IUser, User } from "../core/user";

export class Users {
  private _users: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
  private _socket: Socket<any, any>;

  // has getUsers been called
  private _init: Boolean = false;

  constructor(socket: Socket<any, any>) {
    this._socket = socket;

    this._socket.on("user:added", (userData: any) => {
      if (!this._init) {
        return;
      }

      const user = User.fromDTO(userData);
      const users = [...this._users.value, user];

      this._users.next(users);
    });

    this._socket.on("user:deleted", (username: string) => {
      if (!this._init) {
        return;
      }

      const users = this._users.value.filter(
        (user) => user.username !== username
      );

      this._users.next(users);
    });
  }

  async getUsers() {
    fetch("http://localhost:8000/api/users", {
      headers: {
        user: "eric",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        this._users.next(json.users);
        this._init = true;
      });
  }

  get state() {
    return this._users;
  }
}
