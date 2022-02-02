import { BehaviorSubject } from "rxjs";
import { Socket } from "socket.io-client";

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

  constructor(socket: Socket<any, any>) {
    this._socket = socket;

    this._socket.on("room:joined", (room: any) => {
      console.log("[on room joined]");
      console.log(room);

      const roomState = { ...this._roomState.value, isInRoom: true, room };

      this._roomState.next(roomState);
    });
  }

  get state() {
    return this._roomState;
  }
}
