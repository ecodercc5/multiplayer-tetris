import { Entity, IEntity } from "./entity";

export interface IRoom extends IEntity {
  users: {
    challengerId: string;
    otherId: string;
  };
  spectators: string[];
}

export namespace Room {
  export const create = ({
    users,
    spectators = [],
  }: {
    users: { challengerId: string; otherId: string };
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
}
