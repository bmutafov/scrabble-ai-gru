import { cellBoosts } from "../../components/Cell/Cell";
import { AxiosCalls } from "../../solver/axios-calls";
import { AnchorFinder, SolverUtil } from "../../solver/solver";
import { Board, GameStateController } from "../../state/game-state";
import { clone } from "../../utils/clone";

export const LETTER_SCORES: Record<string, number> = {
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

export type Move = { word: string; row: number; col: number; direction: "bottom" | "right"; score: number };

function toSolverFormat(board: Board, i: number): string[] {
  return board.map((row) => (row[i] === "" ? "*" : row[i]));
}

function findBestWord(words: Move[]) {
  const [longest] = words.sort((a, b) => b.score - a.score);
  return longest;
}

export function calculateScore(_board: Board, word: string, row: number, col: number): number {
  const board = clone(_board);

  let score = 0;
  let adjacentWordsScores = 0;
  let alreadyPlacedLetters = 0;
  let wordMultiplier = 1;

  for (let i = row; i < row + word.length; i++) {
    if (i >= 15) return -1;
    if (SolverUtil.isLetter(board[i][col])) {
      alreadyPlacedLetters++;
      score += LETTER_SCORES[board[i][col].toLocaleUpperCase()];
      continue;
    }

    const multiplierSign = cellBoosts[`${i}${col}`] || "";
    const multiplier = multiplierSign.includes("l") ? +multiplierSign.replace("l", "") : 1;
    const currentWordMultiplier = multiplierSign.includes("w") ? +multiplierSign.replace("w", "") : 1;
    if (multiplierSign.includes("w")) {
      wordMultiplier *= currentWordMultiplier;
    }
    score += LETTER_SCORES[word[i - row].toUpperCase()] * multiplier;
    let adjacentWordScore = 0;
    for (let f = col + 1, b = col - 1; true; ) {
      if (!SolverUtil.isLetter(board[i][f]) && !SolverUtil.isLetter(board[i][b])) {
        if (adjacentWordScore > 0) {
          adjacentWordsScores +=
            adjacentWordScore * currentWordMultiplier + LETTER_SCORES[word[i - row].toUpperCase()] * multiplier;
        }
        break;
      } else {
        if (SolverUtil.isLetter(board[i][f])) {
          adjacentWordScore += LETTER_SCORES[board[i][f].toUpperCase()];
          f++;
        }
        if (SolverUtil.isLetter(board[i][b])) {
          adjacentWordScore += LETTER_SCORES[board[i][b].toUpperCase()];
          b--;
        }
      }
    }
  }

  if (alreadyPlacedLetters === word.length) return -1;
  if (word.length - alreadyPlacedLetters === 7) score += 50;
  return adjacentWordsScores + score * wordMultiplier;
}

export const useAi = (state: GameStateController) => {
  const solveForDimension = async (dimension: "normal" | "transposed" = "normal") => {
    let newBoard: Board = state.get().board;
    if (dimension === "transposed") {
      newBoard = state.getTransposedState();
    }

    const anchorFinder = new AnchorFinder(newBoard);
    const words: Move[] = [];

    anchorFinder.findAnchors();
    anchorFinder.findWordsNextToAnchor();
    await anchorFinder.addPossibleLettersOnBoard();
    for (let i = 0; i < 14; i++) {
      const column = toSolverFormat(anchorFinder.getBoard(), i);

      const possibleWords = await AxiosCalls.solve(
        column,
        state.get().botHand.map((tile) => tile.letter)
      );
      possibleWords.forEach((w) => {
        if (dimension === "normal") {
          words.push({
            word: w.word,
            row: w.index,
            col: i,
            direction: "bottom",
            score: calculateScore(newBoard, w.word, w.index, i),
          });
        } else {
          words.push({
            word: w.word,
            row: i,
            col: w.index,
            direction: "right",
            score: calculateScore(newBoard, w.word, w.index, i),
          });
        }
      });
    }

    console.log("🚩 ~ words", words);
    return [words, anchorFinder] as [Move[], AnchorFinder];
  };

  const solve = async () => {
    state.setLoading(true);
    const [wordsVertical] = await solveForDimension("normal");
    const [wordsHorizontal] = await solveForDimension("transposed");

    const bestMove = findBestWord([...wordsVertical, ...wordsHorizontal]);
    if (bestMove.direction === "right") {
      debugger;
      calculateScore(state.getTransposedState(), bestMove.word, bestMove.row, bestMove.col);
    }
    if (!bestMove) {
      state.setLoading(false);
      throw new Error("No words can be played");
    }

    if (bestMove.direction === "bottom") {
      state.playWord(bestMove.word, bestMove.row, bestMove.col).set();
    } else {
      state.transpose().playWord(bestMove.word, bestMove.col, bestMove.row, true).transpose().set();
    }
    state.setLoading(false);

    console.log("🚩 ~ bestMove", bestMove);
    return bestMove;
  };

  return solve;
};
