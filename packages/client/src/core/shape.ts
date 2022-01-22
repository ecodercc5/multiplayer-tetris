interface INullPosition {
  row: null;
  col: null;
}
interface IActivePosition {
  row: number;
  col: number;
}

export type IPosition = IActivePosition | INullPosition;

export const createPosition = (row: number, col: number): IActivePosition => {
  return { row, col };
};

export const createNullPosition = (): INullPosition => {
  return { row: null, col: null };
};

export const isSamePosition = (
  position: IPosition,
  other: IPosition
): boolean => {
  return position.row === other.row && position.col === other.col;
};

export const isNullPosition = (
  position: IPosition
): position is INullPosition => {
  return position.row === null && !position.col === null;
};

export type IShapeStruct = boolean[][];

export interface IShape {
  color: string;
  struct: IShapeStruct;
  position: IPosition;
  _id: string;
}

interface ICreateShapeArgs {
  color: string;
  struct: IShapeStruct;
  position: IPosition;
}

export const createShape = (args: ICreateShapeArgs) => {
  const { color, struct, position } = args;

  const _id = `${Math.random()}`;

  return {
    color,
    struct,
    position,
    _id,
  };
};

export const getRow = (shape: IShape): number => {
  return shape.struct.length;
};

export const getCol = (shape: IShape): number => {
  return shape.struct[0].length;
};

type IStartEnd = [number, number];

export const getRowDimensions = (shape: IShape): IStartEnd => {
  const { row } = shape.position;

  const endRow = row! + getRow(shape) - 1;

  return [row!, endRow];
};

export const getColDimensions = (shape: IShape): IStartEnd => {
  const { col } = shape.position;

  const endCol = col! + getCol(shape) - 1;

  return [col!, endCol];
};

export const moveShape = (
  shape: IShape,
  mover: (position: IActivePosition) => IPosition
) => {
  const position = shape.position;
  const isPosNull = isNullPosition(position);

  if (isPosNull) {
    return shape;
  }

  const newPosition = mover(position);

  return setAtPosition(shape, newPosition);
};

export const moveDown = (shape: IShape): IShape => {
  return moveShape(shape, (position) => {
    const row = position.row + 1;
    const col = position.col;

    const newPosition = createPosition(row, col);

    return newPosition;
  });
};

export const setAtPosition = (shape: IShape, position: IPosition): IShape => {
  return {
    ...shape,
    position,
  };
};

enum Direction {
  LEFT,
  RIGHT,
}

export const moveRight = (shape: IShape): IShape => {
  return moveShape(shape, (position) => {
    const row = position.row;
    const col = position.col + 1;

    const newPosition = createPosition(row!, col);

    return newPosition;
  });
};

export const moveLeft = (shape: IShape): IShape => {
  return moveShape(shape, (position) => {
    const row = position.row;
    const col = position.col - 1;

    const newPosition = createPosition(row, col);

    return newPosition;
  });
};

export const rotateRight = (shape: IShape) => {
  const struct = rotate(shape.struct, Direction.RIGHT);

  const bottomRow = shape.position.row! + getRow(shape) - 1;
  const row = bottomRow - getCol(shape) + 1;

  // const row = shape.position.row! - getCol(shape) + 1;
  console.log(shape.position.row);

  console.log({ row });

  const position = createPosition(row, shape.position.col!); // refactor this later

  return { ...shape, struct, position };
};

export const rotateLeft = (shape: IShape) => {
  const struct = rotate(shape.struct, Direction.LEFT);

  const bottomRow = shape.position.row! + getRow(shape) - 1;
  const row = bottomRow - getCol(shape) + 1;

  // const row = shape.position.row! - getCol(shape) + 1;
  console.log(shape.position.row);

  console.log({ row });

  const position = createPosition(row, shape.position.col!); // refactor this later

  return { ...shape, struct, position };

  // const row = shape.position.row! - getCol(shape) + 1;
  // const position = createPosition(row, shape.position.col!);

  // return { ...shape, struct, position };
};

const rotate = <T>(grid: T[][], direction: Direction) => {
  const rotatedGrid: T[][] = [];

  const rows = grid.length;
  const cols = grid[0].length;

  if (direction === Direction.RIGHT) {
    for (let col = 0; col < cols; col++) {
      const newRow: T[] = [];

      for (let row = 0; row < rows; row++) {
        const elem = grid[row][col];

        // console.log(elem);

        newRow.unshift(elem);
      }

      rotatedGrid.push(newRow);
    }
  } else if (direction === Direction.LEFT) {
    for (let col = 0; col < cols; col++) {
      const newRow: T[] = [];

      for (let row = 0; row < rows; row++) {
        const elem = grid[row][col];

        // console.log(elem);

        newRow.push(elem);
      }

      rotatedGrid.unshift(newRow);
    }
  }

  return rotatedGrid;
};

// const shape = createShape({
//   color: "#f4f4f4",
//   position: { row: 0, col: 0 },
//   struct: [
//     [false, true, false],
//     [true, true, true],
//   ],
// });

// const down = moveShapeLeft(shape);

// console.log({ down });
