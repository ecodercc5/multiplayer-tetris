import { nanoid } from "nanoid";

export interface IEntity {
  _id: string;
}

export namespace Entity {
  export const create = (): IEntity => {
    return {
      _id: nanoid(),
    };
  };

  export const createAndExtend = <T extends IEntity>(
    extend: (entity: IEntity) => T
  ): T => {
    const newEntity = Entity.create();
    const extendedEntity = extend(newEntity);

    return extendedEntity;
  };
}
