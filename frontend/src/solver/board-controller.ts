import { IBoard } from "./../Board/Board";
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

const prefixes = ["$", "@", "!"];
const regex = new RegExp(prefixes.map((prefix) => `\\${prefix}`).join("|"));

export class BoardController {
  private board: IBoard = INITIAL_BOARD;

  constructor() {}

  setState(board: IBoard): this {
    this.board = board;

    return this;
  }

  getState() {
    return [...this.board.map((row) => row.slice())];
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

  private editCells(onCellCb: (cell: string) => string): void {
    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        this.board[r][c] = onCellCb(this.board[r][c]);
      }
    }
  }
}
