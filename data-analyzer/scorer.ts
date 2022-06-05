import { Board } from "./../frontend/src/state/game-state";

export const LETTER_SCORES = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
  "": 0,
};

const cellBoosts: Record<string, string> = {
  "00": "w3",
  "03": "l2",
  "07": "w3",
  "011": "l2",
  "014": "w3",
  "15": "l3",
  "18": "l3",
  "11": "w2",
  "113": "w2",
  "22": "w2",
  "26": "l2",
  "28": "l2",
  "212": "w2",
  "30": "l2",
  "37": "l2",
  "314": "l2",
  "33": "w2",
  "311": "w2",
  "44": "w2",
  "410": "w2",
  "51": "l3",
  "55": "l3",
  "59": "l3",
  "513": "l3",
  "62": "l2",
  "66": "l2",
  "68": "l2",
  "612": "l2",
  "70": "w3",
  "73": "l2",
  "77": "⭐",
  "711": "l2",
  "714": "w3",
  "82": "l2",
  "86": "l2",
  "88": "l2",
  "812": "l2",
  "91": "l3",
  "95": "l3",
  "99": "l3",
  "913": "l3",
  "104": "w2",
  "1010": "w2",
  "110": "l2",
  "117": "l3",
  "1111": "w2",
  "1114": "l2",
  "122": "w2",
  "126": "l2",
  "128": "l2",
  "1212": "w2",
  "131": "w2",
  "135": "l3",
  "139": "l3",
  "1313": "w2",
  "140": "w3",
  "143": "l2",
  "147": "w3",
  "1411": "l2",
  "1414": "w3",
};

type TilePosition = [number, number];

enum Direction {
  HORIZONTAL,
  VERTICAL,
  SINGLE_TILE,
}

export class Scorer {
  private wordDirection = Direction.SINGLE_TILE;

  score(board: Board, playedTiles: TilePosition[]): number {
    this.wordDirection = this.getWordDirection(playedTiles);
    const tiles = this.sortTiles(playedTiles);
    const mainWordScore = this.scoreMainWord(board, tiles);
    const otherScores = playedTiles.reduce((acc, curr) => acc + this.scoreSecondaryWord(board, curr), 0);
    return mainWordScore + otherScores;
  }

  private scoreSecondaryWord(board: Board, startingTile: TilePosition): number {
    const [row, col] = startingTile;
    const wordMultiplier = this.getWordMultiplier(row, col);
    let score = this.getLetterMultiplier(row, col) * LETTER_SCORES[board[row][col].toUpperCase()];

    if (this.wordDirection === Direction.HORIZONTAL) {
      if (!board[row + 1][col] && !board[row - 1][col]) return 0;

      for (let i = row + 1; i < 15; i++) {
        if (board[i][col] === "") break;
        const letter = board[i][col].toUpperCase();
        score += LETTER_SCORES[letter];
      }
      for (let i = row - 1; i >= 0; i--) {
        if (board[i][col] === "") break;
        const letter = board[i][col].toUpperCase();
        score += LETTER_SCORES[letter];
      }
    }
    if (this.wordDirection === Direction.VERTICAL) {
      if (!board[row][col + 1] && !board[row][col - 1]) return 0;

      for (let i = col + 1; i < 15; i++) {
        if (board[row][i] === "") break;
        const letter = board[row][i].toUpperCase();
        score += LETTER_SCORES[letter];
      }
      for (let i = row - 1; i >= 0; i--) {
        if (board[row][i] === "") break;
        const letter = board[row][i].toUpperCase();
        score += LETTER_SCORES[letter];
      }
    }

    return score * wordMultiplier;
  }

  private scoreMainWord(board: Board, tiles: TilePosition[]): number {
    let score = 0;
    let wordMultiplier = 1;

    if (this.wordDirection === Direction.HORIZONTAL) {
      const row = tiles[0][0];
      for (let col = tiles[0][1]; col <= tiles[tiles.length - 1][1]; col++) {
        const letter = board[row][col].toUpperCase();
        const letterMultiplier = this.getLetterMultiplier(row, col);
        wordMultiplier *= this.getWordMultiplier(row, col);
        score += LETTER_SCORES[letter] * letterMultiplier;
      }
    } else if (this.wordDirection === Direction.VERTICAL) {
      const col = tiles[0][1];
      for (let row = tiles[0][0]; row <= tiles[tiles.length - 1][0]; row++) {
        const letter = board[row][col].toUpperCase();
        const letterMultiplier = this.getLetterMultiplier(row, col);
        wordMultiplier *= this.getWordMultiplier(row, col);
        score += LETTER_SCORES[letter] * letterMultiplier;
      }
    } else {
      const [row, col] = tiles[0];
      const letter = board[row][col].toUpperCase();
      const letterMultiplier = this.getLetterMultiplier(row, col);
      wordMultiplier *= this.getWordMultiplier(row, col);
      return LETTER_SCORES[letter] * letterMultiplier * wordMultiplier;
    }

    return score * wordMultiplier;
  }

  private sortTiles(playedTiles: TilePosition[]): TilePosition[] {
    if (this.wordDirection === Direction.HORIZONTAL) {
      return playedTiles.sort((a, b) => a[1] - b[1]);
    } else if (this.wordDirection === Direction.VERTICAL) {
      return playedTiles.sort((a, b) => a[0] - b[0]);
    } else {
      return playedTiles;
    }
  }

  private getWordDirection(playedTiles: TilePosition[]): Direction {
    if (playedTiles.length === 1) return Direction.SINGLE_TILE;

    const [firstLetter, secondLetter] = playedTiles;
    if (firstLetter[0] === secondLetter[0]) return Direction.HORIZONTAL;
    else return Direction.VERTICAL;
  }

  private getLetterMultiplier(row: number, col: number): number {
    const multiplier = cellBoosts[`${row}${col}`];
    if (multiplier === "l2") return 2;
    if (multiplier === "l3") return 3;
    return 1;
  }

  private getWordMultiplier(row: number, col: number): number {
    const multiplier = cellBoosts[`${row}${col}`];
    if (multiplier === "w2") return 2;
    if (multiplier === "w3") return 3;
    return 1;
  }
}

const testBoard: Board = [
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "i", "r", "a", "t", "e", "", "", "", ""],
  ["", "", "", "", "t", "a", "r", "", "v", "", "", "", "", "", ""],
  ["", "", "", "", "", "l", "e", "n", "e", "f", "e", "", "", "", ""],
  ["", "", "", "", "", "", "n", "e", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "b", "e", "t", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "a", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "h", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
];

const scorer = new Scorer();
const playedTiles: TilePosition[] = [
  [9, 5],
  [10, 5],
  [11, 5],
];
const score = scorer.score(testBoard, playedTiles);

playedTiles.forEach((tile) => {
  const [row, col] = tile;
  console.log(`Played tile: ${testBoard[row][col]}`);
});

console.log(score);
