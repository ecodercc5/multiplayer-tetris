import {
  createShape,
  getRow,
  getCol,
  IShape,
  rotateRight,
  moveDown,
  rotateLeft,
  IPosition,
  setAtPosition,
  isSamePosition,
  getRowDimensions,
  getColDimensions,
  moveRight,
  moveLeft,
  createPosition,
  moveShape as moveShapeTo,
} from "./shape";
import { Unit, IUnit } from "./unit";

export type IBoard = IUnit[][];
export interface ITetrisBoard {
  board: IBoard;
  activeShape: IShape | null;
}

export const createTetrisBoard = (board: IBoard): ITetrisBoard => {
  return {
    board,
    activeShape: null,
  };
};

export const createEmptyBoard = (rows: number, cols: number): IBoard => {
  const board: IBoard = [];

  for (let i = 0; i < rows; i++) {
    const row: IUnit[] = [];

    for (let j = 0; j < cols; j++) {
      const unit = Unit.createUnit();

      row.push(unit);
    }

    board.push(row);
  }

  return board;
};

const getBoardDimensions = (board: IBoard): [number, number] => {
  const rows = board.length;
  const cols = board[0].length;

  return [rows, cols];
};

const canShapeFitInBoard = (board: IBoard, shape: IShape): boolean => {
  const { position, struct } = shape;
  const { row, col } = position;

  // console.log(position);

  const endRow = row! + getRow(shape) - 1;
  const endCol = col! + getCol(shape) - 1;

  const [i, j] = getBoardDimensions(board);

  if (endRow > i - 1 || endCol > j - 1 || col! < 0) {
    return false;
  }

  // console.log(shape);

  const startRow = Math.max(row!, 0);
  const startCol = Math.max(col!, 0);

  // check if end row and end col fit within the struct
  for (let i = startRow; i <= endRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      // unit from tetris board
      const unit = board[i][j];

      // section from shape struct
      const shapeSection = struct[i - row!][j - col!];

      const isActive = Unit.isFilled(unit);

      if (shapeSection === isActive && isActive) {
        // nothing happens
        // console.log("yur");

        return false;
      }
    }
  }

  return true;
};

export const setShapeAtPosition = (
  tetrisBoard: ITetrisBoard,
  shape: IShape
): ITetrisBoard => {
  const canFit = canShapeFitInBoard(tetrisBoard.board, shape);

  if (canFit) {
    return {
      ...tetrisBoard,
      activeShape: shape,
    };
  }

  return tetrisBoard;
};

export const moveShape = (
  tetrisBoard: ITetrisBoard,
  mover: (activeShape: IShape) => IShape
) => {
  const { activeShape, board } = tetrisBoard;

  if (!activeShape) {
    return tetrisBoard;
  }

  // calculate new position of shape
  const shapeMovedDown = mover(activeShape);

  // check if shape can fit into new position
  const canFit = canShapeFitInBoard(board, shapeMovedDown);

  // console.log({ canFit });

  if (!canFit) {
    // console.log("[returning same shape]");

    return tetrisBoard;
  }

  return {
    ...tetrisBoard,
    activeShape: shapeMovedDown,
  };
};

export const moveShapeDown = (tetrisBoard: ITetrisBoard) => {
  return moveShape(tetrisBoard, (activeShape) => moveDown(activeShape));
};

export const rotateShapeRight = (tetrisBoard: ITetrisBoard) => {
  return moveShape(tetrisBoard, (activeShape) => rotateRight(activeShape));
};

export const rotateShapeLeft = (tetrisBoard: ITetrisBoard) => {
  return moveShape(tetrisBoard, (activeShape) => rotateLeft(activeShape));
};

export const moveShapeRight = (tetrisBoard: ITetrisBoard) => {
  return moveShape(tetrisBoard, (activeShape) => moveRight(activeShape));
};

export const moveShapeLeft = (tetrisBoard: ITetrisBoard) => {
  return moveShape(tetrisBoard, (activeShape) => moveLeft(activeShape));
};

// make this function
// get the most bottom available space for shape and returns a position
const getMostBottomSpace = (board: IBoard, shape: IShape) => {
  const { position } = shape;
  const rowLength = getRow(shape);
  const colLength = getCol(shape);

  const startingRow = board.length - rowLength;

  // console.log(board);
  // console.log({ startingRow });
  // console.log(board.length);

  for (let i = startingRow; i >= position.row!; i--) {
    const newPosition = { row: i, col: position.col! };
    // console.log({ newPosition });

    const shapeAtPosition = setAtPosition(shape, newPosition);

    // console.log(shapeAtPosition);

    const canFit = canShapeFitInBoard(board, shapeAtPosition);

    // console.log({ canFit });

    if (canFit) {
      return newPosition;
    }
    // const canFit = canShapeFitInBoard();
  }

  return position;
};

// unneccessary function b/c when active shape is moving, it's technically not considered
// to be part of the board
// export const isShapeAtBottomMostPosition = (tetrisBoard: ITetrisBoard): boolean => {
//   const {activeShape, board} = tetrisBoard;

//   if (!activeShape) {
//     return false;
//   }

//   const bottomMostPosition = getMostBottomSpace(board, activeShape);

//   return true;
// }

export const putShapeAtTheTop = (
  tetrisBoard: ITetrisBoard,
  shape: IShape
): ITetrisBoard => {
  const row = -getRow(shape);
  const position = createPosition(row, 0);

  const shapeAtTop = setAtPosition(shape, position);

  const tetrisBoardWithShapeAtTop = setShapeAtPosition(tetrisBoard, shapeAtTop);

  return tetrisBoardWithShapeAtTop;
};

const isRowFilled = (row: IUnit[]): boolean => {
  const hasOneNotFilled = row.some((unit) => !Unit.isFilled(unit));

  return !hasOneNotFilled;
};

export const getRowIndexsFilled = (tetrisBoard: ITetrisBoard): number[] => {
  const board = tetrisBoard.board;
  const rowIndexes: number[] = [];

  board.forEach((row, index) => {
    const filled = isRowFilled(row);

    // console.log({ filled });

    if (filled) {
      rowIndexes.push(index);
    }
  });

  // console.log(rowIndexes);

  return rowIndexes;
};

export const getNumRowsFilled = (tetrisBoard: ITetrisBoard): number => {
  return getRowIndexsFilled(tetrisBoard).length;
};

export const areAnyRowsFilled = (tetrisBoard: ITetrisBoard): boolean => {
  return getNumRowsFilled(tetrisBoard) > 0;
};

export const isAnyColumnFilled = (tetrisBoard: ITetrisBoard): boolean => {
  const board = tetrisBoard.board;

  // convert cols -> rows
  const transposedBoard: IBoard = [];

  for (let j = 0; j < board[0].length; j++) {
    const row = [];

    for (let i = 0; i < board.length; i++) {
      const unit = board[i][j];

      row.push(unit);
    }

    transposedBoard.push(row);
  }

  // console.log(transposedBoard);

  // check if any one of the column "rows" are filled
  const anyColumnFilled = transposedBoard.some((row) => isRowFilled(row));

  // console.log({ anyColumnFilled });

  return anyColumnFilled;
};

// make this function
// fixes a shape at a position (at the very bottom) -> after you can't move it anymore
// removes active shape
export const fixActiveShape = (tetrisBoard: ITetrisBoard) => {
  const { activeShape, board } = tetrisBoard;

  // console.log("fixing active shape");

  // console.log(activeShape);

  if (!activeShape) {
    return tetrisBoard;
  }

  // check if position is valid
  const mostBottomPosition = getMostBottomSpace(board, activeShape);
  const activeShapeIsAtBottomMostPosition = isSamePosition(
    activeShape.position,
    mostBottomPosition
  );

  // console.log({ mostBottomPosition });
  // console.log({ activeShapeIsAtBottomMostPosition });

  if (!activeShapeIsAtBottomMostPosition) {
    return tetrisBoard;
  }

  // set active shape in place
  const [rowStart, rowEnd] = getRowDimensions(activeShape);
  const [colStart, colEnd] = getColDimensions(activeShape);

  // console.log({ rowStart, rowEnd });
  // console.log({ colStart, colEnd });

  // console.log({ rowStart, rowEnd });
  // console.log({ colStart, colEnd });

  // copy over board -> switch to immer?
  const newBoard = [...board];

  const { row, col } = activeShape.position;

  // row, col -> such that they fit into the board
  const rStart = Math.max(0, rowStart);
  // const cStart = Math.max(0, colStart);

  for (let i = rStart; i <= rowEnd; i++) {
    const newRow = newBoard[i].map((unit, j) => {
      if (j < colStart || j > colEnd) {
        return unit;
      }

      // check if shape unit exists at this coordinate
      const shapeSection = activeShape.struct[i - row!][j - col!];

      const color = activeShape.color;

      return shapeSection ? Unit.createUnit(color) : unit;
    });

    newBoard[i] = newRow;
  }

  // console.log(newBoard);

  return {
    ...tetrisBoard,
    activeShape: null,
    board: newBoard,
  };
};

// remove filled rows
export const removeFilledRows = (tetrisBoard: ITetrisBoard): ITetrisBoard => {
  console.log("[removing filled rows]");

  const board = tetrisBoard.board;

  // get dimensions of board
  const [rows, cols] = getBoardDimensions(board);

  // create empty board
  const newBoard = createEmptyBoard(rows, cols);

  let insertRowIndex = rows - 1;

  // console.log(newBoard);

  // console.log({ insertRowIndex });

  for (let i = insertRowIndex; i >= 0; i--) {
    const row = board[i];
    const isFilled = isRowFilled(row);

    // console.log({ isFilled });

    if (!isFilled) {
      newBoard[insertRowIndex] = row;

      insertRowIndex--;
    }
  }

  // console.log({ newBoard });

  return {
    ...tetrisBoard,
    board: newBoard,
  };
};

// moves shape to the bottom of the board and fixes it there
export const hardDropShape = (tetrisBoard: ITetrisBoard) => {
  if (!tetrisBoard.activeShape) {
    return tetrisBoard;
  }

  const mostBottomPosition = getMostBottomSpace(
    tetrisBoard.board,
    tetrisBoard.activeShape
  );
  // console.log(mostBottomPosition);

  const newBoard = moveShape(tetrisBoard, (shape) =>
    moveShapeTo(shape, () => mostBottomPosition)
  );

  // console.log(newBoard.activeShape);

  return newBoard;
};

export const toString = (tetrisBoard: ITetrisBoard) => {
  const board = tetrisBoard.board;
  const activeShape = tetrisBoard.activeShape!;

  //   const { row, col } = activeShape.position;

  //   const maxX = row! + activeShape.struct.length - 1;
  //   const maxY = col! + activeShape.struct[0].length - 1;

  let strRepr = "";

  for (let i = 0; i < board.length; i++) {
    const row = board[i];

    for (let j = 0; j < row.length; j++) {
      const col = row[j];

      const isActive = Unit.isFilled(col);

      // console.log(`[${i}, ${j}]`);

      let containsShape: boolean = false;

      if (activeShape) {
        // console.log(`(${i}, ${j})`);
        const { row, col } = activeShape.position;

        // console.log(`[shape position: (${row}, ${col})]`);
        // console.log("[has active shape]");

        // console.log("\n");

        const maxX = row! + activeShape.struct.length - 1;
        const maxY = col! + activeShape.struct[0].length - 1;

        // console.log({ maxX });
        // console.log({ maxY });

        if (i >= row! && i <= maxX && j >= col! && j <= maxY) {
          const contains = activeShape.struct[i - row!][j - col!];

          // console.log({ contains });

          containsShape = contains;
        }
      }

      const repr = isActive || containsShape ? "[x] " : "[ ] ";

      // console.log(repr);

      strRepr += repr;
    }

    strRepr += "\n";
  }

  return strRepr;
};
