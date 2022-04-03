import { IBoard } from "./../Board/Board";
import { SolverUtil } from "./solver";

type StateSetter = React.Dispatch<React.SetStateAction<IBoard>>;

const INITIAL_BOARD: IBoard = [
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
];

const clone = <T>(board: T[][]): T[][] => {
  return [...board.map((row) => row.slice())];
};

const prefixes = ["$", "@", "!"];

export class BoardController {
  private board: IBoard;
  private readonly stateSetter: StateSetter;

  constructor(stateSetter: StateSetter) {
    this.board = clone(INITIAL_BOARD);
    this.stateSetter = stateSetter;
  }

  setState(): this {
    this.stateSetter(this.getState());

    return this;
  }

  getState() {
    return clone(this.board);
  }

  getTransposedState() {
    return this.board[0].map((x, i) => this.board.map((x) => x[i]));
  }

  transpose(): this {
    this.board = this.getTransposedState();
    return this;
  }

  reset(): this {
    this.board = clone(INITIAL_BOARD);

    return this;
  }

  setValueAtPosition(r: number, c: number, value: string): this {
    this.board[r][c] = value;
    return this;
  }

  clearNonWords(): this {
    this.editCells((cellValue) => {
      if (prefixes.some((prefix) => cellValue.startsWith(prefix))) {
        return "";
      } else {
        return cellValue;
      }
    });

    return this;
  }

  makeLastMovePermanent(): this {
    this.editCells((cellValue) => {
      if (cellValue.startsWith("@")) {
        return cellValue.replace("@", "");
      } else {
        return cellValue;
      }
    });

    return this;
  }

  playWord(word: string, row: number, column: number): this {
    for (let i = row; i - row < word.length; i++) {
      if (!SolverUtil.isLetter(this.board[i][column])) {
        this.board[i][column] = "@" + word.charAt(i - row);
      }
    }

    return this;
  }

  inheritAnchors(board: IBoard): this {
    this.editCells((value, r, c) => {
      if (board[r][c].startsWith("$") || board[r][c].startsWith("!")) {
        return board[r][c];
      } else {
        return value;
      }
    });

    return this;
  }

  private editCells(onCellCb: (cell: string, r: number, c: number) => string): void {
    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        this.board[r][c] = onCellCb(this.board[r][c], r, c);
      }
    }
  }
}
