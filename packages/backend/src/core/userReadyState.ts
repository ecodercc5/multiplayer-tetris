import { IUser } from "./user";

export interface IUserGameState extends IUser {
  isReady: boolean;
}

export namespace UserGameState {
  export const create = (
    user: IUser,
    isReady: boolean = false
  ): IUserGameState => {
    return {
      ...user,
      isReady,
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
}
