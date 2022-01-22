import { generateRandomNumber } from "../utils/random";
import { createNullPosition, createShape, IShape, IShapeStruct } from "./shape";

export interface IShapeGenerator {
  generate(): IShape;
}

interface IShapeParams {
  color: string;
  struct: IShapeStruct;
}

const createShapeGenerator = (
  shapesParams: IShapeParams[]
): IShapeGenerator => {
  if (shapesParams.length === 0) {
    throw new Error("shapesArgs must be greater than length 0");
  }

  return {
    generate: (): IShape => {
      const randomIndex = generateRandomNumber(shapesParams.length - 1);
      const shapeParam = shapesParams[randomIndex];

      const shape = createShape({
        ...shapeParam,
        position: createNullPosition(),
      });

      return shape;
    },
  };
};

const defaultShapesParams: IShapeParams[] = [
  {
    color: "blue",
    struct: [
      [false, true, false],
      [true, true, true],
    ],
  },
  {
    color: "green",
    struct: [
      [true, true],
      [true, true],
    ],
  },
];

export const defaultShapeGenerator = createShapeGenerator(defaultShapesParams);

// console.log(defaultShapeGenerator.generate());
