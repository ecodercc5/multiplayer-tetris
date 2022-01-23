import { Entity, IEntity } from "./entity";

export interface IUser extends IEntity {
  username: string;
  joined: Date;
}

export namespace User {
  export const create = (userArgs: {
    username: string;
    joined: number;
  }): IUser => {
    const { username, joined } = userArgs;

    const joinedDate = new Date(joined);

    const user = Entity.createAndExtend<IUser>((base) => {
      return {
        ...base,
        username,
        joined: joinedDate,
      };
    });

    return user;
  };
}
