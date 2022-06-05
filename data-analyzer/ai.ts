import { INITIAL_BOARD } from "../frontend/src/state/defaults";
import { Board, Hand } from "./../frontend/src/state/game-state";
import { Move } from "./../frontend/src/hooks/useAi/useAi";
import { Trie } from "../trie/trie";
import { TrieSearch } from "../trie/trie-search";
import { TrieSolve } from "../trie/trie-solve";
import { readDictionary } from "../utils/read-dictionary";
import { clone } from "../frontend/src/utils/clone";
import { AnchorFinder } from "./anchor-finder";

const trie = new Trie();

readDictionary(trie);

const getTransposedState = (board: Board) => {
  return board[0].map((x, i) => board.map((x) => x[i]));
};

function toSolverFormat(board: Board, i: number): string[] {
  return board.map((row) => (row[i] === "" ? "*" : row[i]));
}

const solveForDimension = async (dimension: "normal" | "transposed" = "normal", board: Board, hand: string[]) => {
  let newBoard: Board = clone(board);

  if (dimension === "transposed") {
    newBoard = getTransposedState(newBoard);
  }

  const anchorFinder = new AnchorFinder(newBoard, trie);
  const words: Move[] = [];

  anchorFinder.findAnchors();
  anchorFinder.findWordsNextToAnchor();
  await anchorFinder.addPossibleLettersOnBoard();
  for (let i = 0; i < 14; i++) {
    const column = toSolverFormat(anchorFinder.getBoard(), i);

    const possibleWords = TrieSolve.solveForRow(trie, column, hand);
    possibleWords.forEach((w) => {
      if (dimension === "normal") {
        // TODO: Calculate score
        words.push({ word: w.word, row: w.index, col: i, direction: "bottom", score: 0 });
      } else {
        words.push({ word: w.word, row: i, col: w.index, direction: "right", score: 0 });
      }
    });
  }

  return [words, anchorFinder] as [Move[], AnchorFinder];
};

export const showPossibleMoves = async (board: Board, hand: string[]) => {
  const [wordsVertical] = await solveForDimension("normal", board, hand);
  const [wordsHorizontal] = await solveForDimension("transposed", board, hand);

  return [...wordsVertical, ...wordsHorizontal];
};
