import { Move } from "./../frontend/src/hooks/useAi/useAi";
import { Board } from "./../frontend/src/state/game-state";
import { INITIAL_BOARD } from "./../frontend/src/state/defaults";
import fs from "fs/promises";
import { Hand } from "../frontend/src/state/game-state";
import { showPossibleMoves } from "./ai";
import { clone } from "../frontend/src/utils/clone";
import { Scorer } from "./scorer";

// transpose an array
function transpose(array: string[][]): string[][] {
  return array[0].map((col, i) => array.map((row) => row[i]));
}

async function parseData(): Promise<string[][]> {
  const dataAsString = await fs.readFile("./turns.csv");
  const dataAsObject = dataAsString
    .toString()
    .split("\n")
    .map((row: string) => {
      return row.split(",").map((entry) => entry.replace(/\"/g, ""));
    });
  return dataAsObject;
}

function startsWithLetter(location: string): boolean {
  const match = location.charAt(0).match(/[A-M]/);
  return Boolean(match);
}

function parseLocation(location: string): string {
  if (!startsWithLetter(location)) {
    return location[location.length - 1] + location.substring(0, location.length - 1);
  } else {
    return location;
  }
}

function parseDirection(location: string): "vertical" | "horizontal" {
  if (startsWithLetter(location)) {
    return "vertical";
  } else {
    return "horizontal";
  }
}

const parseMove = (board: Board, move: Move): Move => {
  if (move.direction === "bottom") {
    for (let r = move.row, c = move.col; r < move.row + move.word.length; r++) {
      if (board[r][c] !== "")
        move.word = move.word.substring(0, r - move.row) + "." + move.word.substring(r - move.row + 1);
    }
  }
  if (move.direction === "right") {
    for (let r = move.row, c = move.col; c < move.col + move.word.length; c++) {
      if (board[r][c] !== "")
        move.word = move.word.substring(0, c - move.col) + "." + move.word.substring(c - move.col + 1);
    }
  }
  return move;
};

function playMove(board: Board, move: string, location: string, direction: "vertical" | "horizontal") {
  const row = location.charCodeAt(0) - "A".charCodeAt(0);
  const col = +location.substring(1);
  const playedTiles: [number, number][] = [];
  if (direction === "vertical") {
    for (let i = col; i < col + move.length; i++) {
      board[i][row] = move[i - col];
      playedTiles.push([i, row]);
    }
  }
  if (direction === "horizontal") {
    const transposedBoard = transpose(board);

    for (let i = row; i < row + move.length; i++) {
      transposedBoard[i][col] = move[i - row];
      playedTiles.push([col, i]);
    }

    Object.assign(board, transpose(transposedBoard));
  }

  return playedTiles;
}

void (async function run() {
  const boards = new Map<string, Board>();
  const data = await parseData();
  data.shift();
  const parsedData = data.filter((row) => row[row.length - 1] === "Play");

  const parsedDataArray: (string | Move[])[][] = [];
  let i = 0;
  for (const playerMove of parsedData) {
    try {
      const [gameId, _turnNumber, _nickname, rack, _location, move, points, score] = playerMove;
      if (!_location) return null;
      const location = parseLocation(_location);
      const direction = parseDirection(_location);
      if (!boards.has(gameId)) {
        boards.set(gameId, clone(INITIAL_BOARD));
      }
      const board = boards.get(gameId)!;
      const keptData = [rack, location, direction, move, points];
      const possibleMoves = (await showPossibleMoves(board, rack.toLocaleLowerCase().split(""))).map((move) => {
        const newBoard = clone(board);
        const placedTiles = playMove(newBoard, move.word, location, direction);

        return {
          originalWord: move.word,
          ...parseMove(board, move),
          score: new Scorer().score(newBoard, placedTiles),
        };
      });
      playMove(board, move.toLocaleLowerCase(), location, direction);
      const newData = [...keptData, possibleMoves];
      parsedDataArray.push(newData);
      console.log("✅ parsed " + ++i + " of " + parsedData.length);
    } catch (err) {
      console.log("❌ error row " + Date.now() + " " + err);
    }
  }

  await fs.writeFile("./data" + Date.now() + ".json", JSON.stringify(parsedDataArray, null, 2), { flag: "w+" });
})();
