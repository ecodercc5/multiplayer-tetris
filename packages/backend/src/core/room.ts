import { Entity, IEntity } from "./entity";
import { IUser } from "./user";

export interface IRoom extends IEntity {
  users: {
    challenger: IUser;
    other: IUser;
  };
  spectators: string[];
}

export namespace Room {
  export const create = ({
    users,
    spectators = [],
  }: {
    users: { challenger: IUser; other: IUser };
    spectators?: string[];
  }): IRoom => {
    return Entity.createAndExtend((base) => {
      return {
        ...base,
        users,
        spectators,
      };
    });
  };

  export const addSpectator = (room: IRoom, spectatorId: string): IRoom => {
    return {
      ...room,
      spectators: [...room.spectators, spectatorId],
    };
  };
}
