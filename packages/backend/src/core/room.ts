import { Entity, IEntity } from "./entity";
import { IUserGameState } from "./userReadyState";

export interface IRoom extends IEntity {
  users: IUserGameState[];
  spectators: string[];
}

export namespace Room {
  export const create = ({
    users,
    spectators = [],
  }: {
    users: IUserGameState[];
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

  export const setUserReady = (room: IRoom, userId: string): IRoom => {
    const users = room.users;
    const user = users.find((usr) => usr._id === userId);

    if (!user) {
      return room;
    }

    const newUsers = users.map((usr) => {
      if (usr === user) {
        return {
          ...usr,
          isReady: true,
        };
      }

      return usr;
    });

    return {
      ...room,
      users: newUsers,
    };
  };
}
