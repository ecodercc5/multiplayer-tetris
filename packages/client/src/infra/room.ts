import { BehaviorSubject } from "rxjs";
import { Socket } from "socket.io-client";
import { UserModule } from "./user";

interface IRoomState {
  isInRoom: boolean;
  room: any | null;
}

export class RoomModule {
  private _socket: Socket<any, any>;
  private _roomState: BehaviorSubject<IRoomState> =
    new BehaviorSubject<IRoomState>({
      isInRoom: false,
      room: null,
    });

  private _userModule: UserModule;

  constructor(socket: Socket<any, any>, userModule: UserModule) {
    this._socket = socket;
    this._userModule = userModule;

    this._socket.on("room:joined", (room: any) => {
      console.log("[on room joined]");
      console.log(room);

      const roomState = { ...this._roomState.value, isInRoom: true, room };

      this._roomState.next(roomState);
    });

    this._socket.on("room:opponent_ready", (room: any) => {
      console.log("[on room opponent ready]");
      console.log(room);

      const roomState = { ...this._roomState.value, isInRoom: true, room };

      this._roomState.next(roomState);
    });

    this._socket.on("game:init", (room: any) => {
      console.log("[on game init]");
      console.log(room);

      const roomState = { ...this._roomState.value, isInRoom: true, room };

      this._roomState.next(roomState);
    });
  }

  setIsReady() {
    const user = this._userModule.state.value;

    if (!user) {
      return;
    }

    const roomState = this._roomState.value;

    if (!roomState.isInRoom) {
      return;
    }

    const users = roomState.room.users!;
    const newUsers = users.map((usr: any) => {
      if (usr._id === user._id) {
        return {
          ...usr,
          isReady: true,
        };
      }

      return usr;
    });

    const newRoomState: IRoomState = {
      ...roomState,
      room: {
        ...roomState.room,
        users: newUsers,
      },
    };

    this._roomState.next(newRoomState);

    console.log(users);

    this._socket.emit("game:player_ready");
  }

  get state() {
    return this._roomState;
  }
}
