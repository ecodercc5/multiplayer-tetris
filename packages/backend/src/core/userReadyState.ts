import { IUser } from "./user";

export interface IUserReadyState extends IUser {
  isReady: boolean;
}

export namespace UserReadyState {
  export const create = (
    user: IUser,
    isReady: boolean = false
  ): IUserReadyState => {
    return {
      ...user,
      isReady,
    };
  };

  export const setIsReady = (
    userReadyState: IUserReadyState
  ): IUserReadyState => {
    return {
      ...userReadyState,
      isReady: true,
    };
  };
}
