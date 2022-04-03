import React, { useRef, useState } from "react";
import Row from "./Row";
import style from "./Board.module.css";
import { Alert, Box, Button, Header, Paper, Title } from "@mantine/core";
import Hand from "./Hand";
import { BoardContext } from "../contexts/board-context";
import { AnchorFinder } from "../solver/solver";
import { AxiosCalls } from "../solver/axios-calls";
import { AlertCircle } from "tabler-icons-react";
import { BoardController } from "../solver/board-controller";

function transpose<T>(m: T[][]): T[][] {
  return m[0].map((x, i) => m.map((x) => x[i]));
}

export type Hand = string[];
export type IBoard = string[][];
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
const INDEX_ROW = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

// const boardController = new BoardController();

const Board: React.FC = () => {
  const { current: boardController } = useRef(new BoardController());
  const [board, setBoard] = useState<IBoard>(INITIAL_BOARD);
  const [hand, setHand] = useState<Hand>(["а", "б", "в", "г", "д", "е", "ж"]);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const editBoard = (r: number, c: number, value: string) => {
    const newState = boardController.setValueAtPosition(r, c, value).getState();
    setBoard(newState);
  };

  const refreshGuesses = () => {
    console.clear();
    setError(null);
    setIsLoading(false);

    const newState = boardController.clearNonWords().getState();
    setBoard(newState);
  };

  const editHand = (index: number, letter: string): void => {
    setHand((prev) =>
      prev.map((_l, i) => {
        if (i === index) return letter;
        return _l;
      })
    );
  };

  const switchEdit = () => {
    setIsEdit((prev) => !prev);
  };

  const makeLastMovePermanent = (): IBoard => {
    console.log(boardController.getState());
    const newBoard = boardController.makeLastMovePermanent().getState();
    console.log("🚩 ~ newBoard", newBoard);
    setBoard(newBoard);
    return newBoard;
  };

  const solve = async () => {
    const newBoard = makeLastMovePermanent();
    setIsLoading(true);
    setError(null);
    const anchorFinder = new AnchorFinder(newBoard);
    const words: { word: string; row: number; col: number; direction: "bottom" | "right" }[] = [];

    anchorFinder.findAnchors();
    anchorFinder.findWordsNextToAnchor();
    await anchorFinder.addPossibleLettersOnBoard();
    for (let i = 0; i < 14; i++) {
      const column = anchorFinder.getBoard().map((row) => (row[i] === "" ? "*" : row[i]));
      const wordsForCol = await AxiosCalls.solve(column, hand);
      wordsForCol.forEach((w) => words.push({ word: w.word, row: w.index, col: i, direction: "bottom" }));
    }

    const transposedBoard = transpose(newBoard);
    const anchorFinderRow = new AnchorFinder(transposedBoard);
    const wordsRow: { word: string; row: number; col: number; direction: "bottom" | "right" }[] = [];

    anchorFinderRow.findAnchors();
    anchorFinderRow.findWordsNextToAnchor();
    await anchorFinderRow.addPossibleLettersOnBoard();
    for (let i = 0; i < 14; i++) {
      const column = anchorFinderRow.getBoard().map((row) => (row[i] === "" ? "*" : row[i]));
      const wordsForCol = await AxiosCalls.solve(column, hand);
      wordsForCol.forEach((w) => wordsRow.push({ word: w.word, row: i, col: w.index, direction: "right" }));
    }

    console.log({ words, wordsRow });
    const [longest] = [...words, ...wordsRow].sort((a, b) => b.word.length - a.word.length);

    console.log("🚩 ~ longest", longest);

    // setBoard(anchorFinder.getBoard());
    setIsLoading(false);

    // TODO: Uncomment code
    // -----------------------------------------------------------------
    if (!longest) {
      setIsLoading(false);
      setError("No words can be played with this board and hand.");
    } else {
      if (longest.direction === "bottom") {
        anchorFinder.playWord(longest.word, longest.row, longest.col);
        setBoard(anchorFinder.getBoard());
        boardController.setState(anchorFinder.getBoard());
        setIsLoading(false);
      } else {
        anchorFinderRow.playWord(longest.word, longest.col, longest.row);
        const retransposed = transpose(anchorFinderRow.getBoard());
        setBoard(retransposed);
        boardController.setState(retransposed);
        setIsLoading(false);
      }
    }
    // -----------------------------------------------------------------
  };

  return (
    <BoardContext.Provider value={{ board, isEdit, editBoard, editHand, hand }}>
      <div>
        <Title order={2} my={20}>
          Board
        </Title>
        <Box mb={40} className={style.board}>
          <Row row={INDEX_ROW} isIndex index={-1} />
          {board.map((row, i) => (
            <Row row={row} key={i} index={i} isIndex={false} />
          ))}
        </Box>

        {error && (
          <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red">
            {error}
          </Alert>
        )}

        <Paper mt={20} shadow="lg" radius="md" p="xl" withBorder>
          <Title order={2} mb={20}>
            Hand
          </Title>
          <div className={style.paper}>
            <Hand letters={hand} />
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant="default"
                color="gray"
                radius="md"
                size="md"
                uppercase
                onClick={() => setBoard((prev) => transpose(prev))}
              >
                Transpose
              </Button>
              <Button variant="default" color="gray" radius="md" size="md" uppercase onClick={refreshGuesses}>
                Clear
              </Button>
              <Button
                variant={isEdit ? "outline" : "light"}
                color="blue"
                radius="md"
                size="md"
                uppercase
                onClick={switchEdit}
              >
                Edit
              </Button>
              <Button color="pink" radius="md" size="md" uppercase onClick={makeLastMovePermanent} loading={isLoading}>
                lock
              </Button>
              <Button color="pink" radius="md" size="md" uppercase onClick={solve} loading={isLoading}>
                AI Next
              </Button>
            </Box>
          </div>
        </Paper>
      </div>
    </BoardContext.Provider>
  );
};

export default Board;
