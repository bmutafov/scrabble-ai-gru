import { Board } from "./../state/game-state";
import { AxiosCalls } from "./axios-calls";

enum AdjacentTo {
  LEFT = -1,
  RIGHT = 1,
  BOTH = 0,
}

class Anchor {
  private _word: string = "";

  constructor(public row: number, public column: number, public adjacentTo: AdjacentTo) {}

  get word() {
    return this._word;
  }

  setWord(word: string): void {
    this._word = word;
  }
}

export class SolverUtil {
  static isLetter = (stringOnBoard: string) =>
    stringOnBoard !== "" && !stringOnBoard.startsWith("$") && stringOnBoard !== "!";
}

export class AnchorFinder {
  public readonly ANCHOR_SIGN = "$";
  private board: Board;
  private anchors: Anchor[] = [];

  constructor(board: Board) {
    this.board = [...board.map((row) => row.slice())];
  }

  getBoard() {
    return this.board;
  }

  findAnchors() {
    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        const value = this.board[r][c];

        // If we are iterating currently on a spot which has a set letter
        if (value && value !== this.ANCHOR_SIGN) {
          // if the previous is empty
          if (this.board[r][c - 1] === "") {
            // set it to the anchor sign and add it to the anchors array
            this.board[r][c - 1] = this.ANCHOR_SIGN;
            this.anchors.push(new Anchor(r, c - 1, AdjacentTo.LEFT));
          }
          // if the previous is NOT empty but has ANCHOR_SIGN
          // it means we already tagged it for right anchor
          // and now it is left as well, so we change it to BOTH
          else if (this.board[r][c - 1] === this.ANCHOR_SIGN) {
            const existingAnchorOnPosition = this.anchors.find((a) => a.row === r && a.column === c - 1); //this.anchorPositions.find((a) => a[0] === r && a[1] === c - 1);
            if (!existingAnchorOnPosition) {
              throw new Error(`ExistingAnchorOnPosition undefined. Trying to access on ${r} - ${c - 1}`);
            }
            existingAnchorOnPosition.adjacentTo = AdjacentTo.BOTH;
          }

          // if the next is empty
          if (this.board[r][c + 1] === "") {
            // set it to the anchor sign and add it to the anchors array
            this.board[r][c + 1] = this.ANCHOR_SIGN;
            this.anchors.push(new Anchor(r, c + 1, AdjacentTo.RIGHT));
          }
        }
      }
    }
  }

  /**
   * For each anchor, find the words that are attached to it so we can search the dictionary
   */
  findWordsNextToAnchor = () => {
    const board = this.board;

    for (const anchor of this.anchors) {
      const { adjacentTo, column, row } = anchor;
      let word: string = this.ANCHOR_SIGN;

      if (adjacentTo === AdjacentTo.LEFT || adjacentTo === AdjacentTo.BOTH) {
        // iterate columns forwards until we reach another anchor or empty cell
        for (let c = column + 1; c < 14; c++) {
          if (SolverUtil.isLetter(board[row][c])) {
            word += board[row][c];
          } else break;
        }
      }

      // iterate columns backwards until we reach another anchor or empty cell
      if (adjacentTo === AdjacentTo.RIGHT || adjacentTo === AdjacentTo.BOTH) {
        for (let c = column - 1; c >= 0; c--) {
          if (SolverUtil.isLetter(board[row][c])) {
            word = board[row][c] + word;
          } else break;
        }
      }

      if (word) {
        anchor.setWord(word);
      }
    }
  };

  addPossibleLettersOnBoard = async () => {
    for (const anchor of this.anchors) {
      const letters = await this.findPossibleLettersOnAnchors(anchor);
      const { row, column } = anchor;

      if (letters.length === 0) {
        this.board[row][column] = "!";
      } else {
        this.board[row][column] += letters.join("");
      }
    }
  };

  findPossibleLettersOnAnchors = async (anchor: Anchor): Promise<string[]> => {
    const { word: anchorWord } = anchor;

    const wordWithoutAnchorSign = anchorWord.replace("$", "");
    let words: string[] = [];
    // if it starts with $ we search all words ending in the word
    if (anchorWord.startsWith(this.ANCHOR_SIGN)) {
      words = await AxiosCalls.endsWith(wordWithoutAnchorSign, anchorWord.length);
    }
    // else if it ends with $ we search all words staring with the prefix word
    else if (anchorWord.endsWith(this.ANCHOR_SIGN)) {
      words = await AxiosCalls.startsWith(wordWithoutAnchorSign, anchorWord.length + 1);
    }
    // else, it is between two tiles, it means we have to do a word on both sides, so we search between
    else {
      const [prefix, suffix] = anchorWord.split(this.ANCHOR_SIGN);
      words = await AxiosCalls.between(prefix, suffix);
    }

    const indexOfAnchorSign = anchorWord.indexOf(this.ANCHOR_SIGN);

    return (
      words
        // remove the same word
        .filter((word) => word !== wordWithoutAnchorSign)
        // get the letter in the position of the $
        .map((word) => {
          return word.charAt(indexOfAnchorSign);
        })
    );
  };

  playWord(word: string, row: number, column: number): void {
    for (let i = row; i - row < word.length; i++) {
      if (!SolverUtil.isLetter(this.board[i][column])) {
        this.board[i][column] = "@" + word.charAt(i - row);
      }
    }
  }
}
