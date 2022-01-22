export interface IUnit {
  color: string | null;
}

export namespace Unit {
  export const createUnit = (color?: string) => {
    return {
      color: color ? color : null,
    };
  };

  export const isFilled = (unit: IUnit) => {
    return unit.color ? true : false;
  };
}
