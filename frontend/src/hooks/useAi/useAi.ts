import { AxiosCalls } from "../../solver/axios-calls";
import { AnchorFinder } from "../../solver/solver";
import { Board, GameStateController } from "../../state/game-state";

export type Move = { word: string; row: number; col: number; direction: "bottom" | "right" };

function toSolverFormat(board: Board, i: number): string[] {
  return board.map((row) => (row[i] === "" ? "*" : row[i]));
}

function findBestWord(words: Move[]) {
  const [longest] = words.sort((a, b) => b.word.length - a.word.length);
  return longest;
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
          words.push({ word: w.word, row: w.index, col: i, direction: "bottom" });
        } else {
          words.push({ word: w.word, row: i, col: w.index, direction: "right" });
        }
      });
    }

    return [words, anchorFinder] as [Move[], AnchorFinder];
  };

  const solve = async () => {
    state.setLoading(true);
    const [wordsVertical] = await solveForDimension("normal");
    const [wordsHorizontal] = await solveForDimension("transposed");

    const bestMove = findBestWord([...wordsVertical, ...wordsHorizontal]);
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
