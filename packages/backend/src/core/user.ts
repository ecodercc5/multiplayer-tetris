import { Entity, IEntity } from "./entity";

export interface IUser extends IEntity {
  username: string;
  joined: Date;
  socketId: string;
}

export namespace User {
  export const create = (userArgs: {
    username: string;
    joined: number;
    socketId: string;
    _id?: string;
  }): IUser => {
    const { username, joined, socketId, _id } = userArgs;

    const joinedDate = new Date(joined);

    const user = Entity.createAndExtend<IUser>((base) => {
      return {
        ...base,
        username,
        joined: joinedDate,
        socketId,
        _id: _id ? _id : base._id,
      };
    });

    return user;
  };
}
