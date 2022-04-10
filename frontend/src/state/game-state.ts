import { INITIAL_BOARD } from "./defaults";
import { ClassState } from "../hooks/class-state";
import { clone } from "../utils/clone";
import { SolverUtil } from "../solver/solver";
import { getAllLettersAsArray } from "../utils/letters";

export type Board = string[][];
export type Tile = {
  id: string;
  letter: string;
  isPlayed: boolean;
  isDrawn: boolean;
  controlledPosition?: [number, number];
};
export type Hand = Tile[];

interface GameState {
  board: Board;
  playerHand: Hand;
  botHand: Hand;
  allTiles: Tile[];
  isLoading: boolean;
}

export class GameStateController extends ClassState<GameState> {
  // UI State
  private isLoading: boolean = false;
  private _error: string | null = null;

  // Playing state
  private board: Board = clone(INITIAL_BOARD);
  private allTiles: Tile[] = [];
  private playerHand: Hand = [];
  private botHand: Hand = [];

  constructor() {
    super();
    const allLetters = getAllLettersAsArray();
    for (let i = 0; i < allLetters.length; i++) {
      const newTile = {
        id: Math.random().toFixed(10),
        letter: allLetters[i],
        isPlayed: false,
        isDrawn: false,
      };
      this.allTiles.push(newTile);
    }

    for (let i = 0; i < 7; i++) {
      const nonDrawnLetters = this.allTiles.filter((t) => !t.isDrawn);
      const randomIndex = Math.floor(Math.random() * nonDrawnLetters.length);
      const newTile = nonDrawnLetters[randomIndex];
      newTile.isDrawn = true;
      this.playerHand.push(newTile);
    }
    for (let i = 0; i < 7; i++) {
      const nonDrawnLetters = this.allTiles.filter((t) => !t.isDrawn);
      const randomIndex = Math.floor(Math.random() * nonDrawnLetters.length);
      const newTile = nonDrawnLetters[randomIndex];
      newTile.isDrawn = true;
      this.botHand.push(newTile);
    }
  }

  get error(): string | null {
    return this._error;
  }

  setError(err: string | null): this {
    this._error = err;
    return this;
  }

  public get(): GameState {
    return {
      board: clone(this.board),
      playerHand: clone(this.playerHand),
      botHand: clone(this.botHand),
      isLoading: this.isLoading,
      allTiles: this.allTiles,
    };
  }

  setLoading(value: boolean): this {
    this.isLoading = value;
    this.set();
    return this;
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

  lockPlayedLetters(): this {
    const playerHandWithNulledPlayed = this.playerHand.map((tile, index) => {
      if (tile.isPlayed) return null;
      return tile;
    });

    this.playerHand = playerHandWithNulledPlayed.map((tile) => {
      if (tile) {
        return tile;
      } else {
        const availableLetters = this.allTiles.filter((t) => !t.isPlayed && !t.isDrawn);
        const randomIndex = Math.floor(Math.random() * availableLetters.length);
        const newTile = availableLetters[randomIndex];
        if (newTile) {
          newTile.isDrawn = true;
          return newTile;
        } else {
          throw new Error("All tile drawn");
        }
      }
    });

    return this;
  }

  lockPlayedLettersBot(): this {
    this.botHand = this.botHand.filter((tile) => !tile.isPlayed);
    for (let i = this.botHand.length; i < 7; i++) {
      const availableLetters = this.allTiles.filter((t) => !t.isPlayed && !t.isDrawn);
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      const newTile = availableLetters[randomIndex];
      if (newTile) {
        newTile.isDrawn = true;
        this.botHand.push(newTile);
      } else {
        throw new Error("All tiles drawn");
      }
    }
    return this;
  }

  removeOnPosition([r, c]: [number, number]): this {
    this.board[r][c] = "";
    return this;
  }

  setTileOnBoard(r: number, c: number, tile: Tile | null): this {
    if (tile) {
      this.board[r][c] = tile.letter;
      tile.isPlayed = true;
    } else {
      this.board[r][c] = "";
    }

    return this;
  }

  setTileInHand(tile: Tile): this {
    tile.isPlayed = false;
    return this;
  }

  playWord(word: string, row: number, column: number, transposed: boolean = false): this {
    for (let i = row; i - row < word.length; i++) {
      console.log(this.board, i, column, this.board[i][column]);
      if (!SolverUtil.isLetter(this.board[i][column])) {
        const letter = word.charAt(i - row);

        this.board[i][column] = letter;

        const tile = this.botHand.find((t) => t.letter === letter);
        if (!tile) {
          throw new Error("Tile not found " + letter);
        }
        this.botHand = this.botHand.filter((t) => t !== tile);
        tile.controlledPosition = transposed ? [column, i] : [i, column];
        tile.isPlayed = true;
      }
    }

    return this;
  }
}
