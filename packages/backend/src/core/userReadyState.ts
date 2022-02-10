import { IUser } from "./user";

export interface IUserGameState extends IUser {
  isReady: boolean;
  gameInit: boolean;
}

export namespace UserGameState {
  export const create = (
    user: IUser,
    isReady: boolean = false
  ): IUserGameState => {
    return {
      ...user,
      isReady,
      gameInit: false,
    };
  };

  export const setIsReady = (
    userReadyState: IUserGameState
  ): IUserGameState => {
    return {
      ...userReadyState,
      isReady: true,
    };
  };

  export const gameInit = (userGameState: IUserGameState): IUserGameState => {
    return {
      ...userGameState,
      gameInit: true,
    };
  };
}
