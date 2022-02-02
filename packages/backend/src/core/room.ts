import { Entity, IEntity } from "./entity";
import { IUser } from "./user";
import { IUserReadyState } from "./userReadyState";

export interface IRoom extends IEntity {
  users: {
    challenger: IUserReadyState;
    other: IUserReadyState;
  };
  spectators: string[];
}

export namespace Room {
  export const create = ({
    users,
    spectators = [],
  }: {
    users: { challenger: IUserReadyState; other: IUserReadyState };
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
