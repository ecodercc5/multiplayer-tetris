import { Entity, IEntity } from "./entity";
import { IUserGameState, UserGameState } from "./userReadyState";

export interface IRoom extends IEntity {
  users: IUserGameState[];
  spectators: string[];
  _locked: boolean;
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
        _locked: false,
      };
    });
  };

  export const lock = (room: IRoom): IRoom => {
    return {
      ...room,
      _locked: true,
    };
  };

  export const addSpectator = (room: IRoom, spectatorId: string): IRoom => {
    return {
      ...room,
      spectators: [...room.spectators, spectatorId],
    };
  };

  const setUserState = (
    room: IRoom,
    userId: string,
    setter: (user: IUserGameState) => IUserGameState
  ): IRoom => {
    const users = room.users;
    const user = users.find((usr) => usr._id === userId);

    if (!user) {
      return room;
    }

    const newUsers = users.map((usr) => {
      if (usr === user) {
        return setter(usr);
      }

      return usr;
    });

    return {
      ...room,
      users: newUsers,
    };
  };

  export const setUserReady = (room: IRoom, userId: string): IRoom => {
    return setUserState(room, userId, (user) => UserGameState.setIsReady(user));
    // const users = room.users;
    // const user = users.find((usr) => usr._id === userId);

    // if (!user) {
    //   return room;
    // }

    // const newUsers = users.map((usr) => {
    //   if (usr === user) {
    //     return UserGameState.setIsReady(usr);
    //   }

    //   return usr;
    // });

    // return {
    //   ...room,
    //   users: newUsers,
    // };
  };

  export const gameInit = (room: IRoom, userId: string) => {
    return setUserState(room, userId, (user) => UserGameState.gameInit(user));
  };
}
