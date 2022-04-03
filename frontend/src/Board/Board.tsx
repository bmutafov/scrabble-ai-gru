import React, { useRef, useState } from "react";
import Row from "./Row";
import style from "./Board.module.css";
import { ActionIcon, Alert, Box, Button, LoadingOverlay, Paper, Title, Tooltip } from "@mantine/core";
import Hand, { getRandLetter } from "./Hand";
import { BoardContext } from "../contexts/board-context";
import { AnchorFinder } from "../solver/solver";
import { AxiosCalls } from "../solver/axios-calls";
import { AlertCircle, Dice, Lock, Pencil, PlayerTrackNext, Rotate360, Trash, X } from "tabler-icons-react";
import { BoardController } from "../solver/board-controller";
import Legend from "./Legend";

function toSolverFormat(board: IBoard, i: number): string[] {
  return board.map((row) => (row[i] === "" ? "*" : row[i]));
}

function findBestWord(words: Move[]) {
  const [longest] = words.sort((a, b) => b.word.length - a.word.length);
  return longest;
}

export type Move = { word: string; row: number; col: number; direction: "bottom" | "right" };
export type IHand = string[];
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
  const [board, setBoard] = useState<IBoard>(INITIAL_BOARD);
  const [hand, setHand] = useState<IHand>(["а", "б", "в", "г", "д", "е", "ж"]);
  const { current: boardController } = useRef(new BoardController(setBoard));

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.count("Board rerenders: ");

  const editBoard = (r: number, c: number, value: string) => {
    const newState = boardController.setValueAtPosition(r, c, value).getState();
    setBoard(newState);
  };

  const reset = () => {
    boardController.reset().setState();
  };

  const transposeBoard = () => {
    boardController.transpose().setState();
  };

  const refreshGuesses = () => {
    console.clear();
    setError(null);
    setIsLoading(false);

    boardController.clearNonWords().setState();
  };

  const editHand = (index: number, letter: string): void => {
    setHand((prev) =>
      prev.map((_l, i) => {
        if (i === index) return letter;
        return _l;
      })
    );
  };

  const randomizeHand = () => {
    hand.forEach((l, i) => {
      editHand(i, getRandLetter());
    });
  };

  const switchEdit = () => {
    setIsEdit((prev) => !prev);
  };

  const makeLastMovePermanent = (): IBoard => {
    boardController.makeLastMovePermanent().clearNonWords().setState();

    return boardController.getState();
  };

  const solveForDimension = async (dimension: "normal" | "transposed" = "normal") => {
    let newBoard = makeLastMovePermanent();

    if (dimension === "transposed") {
      newBoard = boardController.getTransposedState();
    }

    const anchorFinder = new AnchorFinder(newBoard);
    const words: Move[] = [];

    anchorFinder.findAnchors();
    anchorFinder.findWordsNextToAnchor();
    await anchorFinder.addPossibleLettersOnBoard();
    for (let i = 0; i < 14; i++) {
      const column = toSolverFormat(anchorFinder.getBoard(), i);

      const possibleWords = await AxiosCalls.solve(column, hand);
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

  const solve2 = async () => {
    setIsLoading(true);
    const [wordsVertical, anchorFinderV] = await solveForDimension("normal");
    const [wordsHorizontal, anchorFinederH] = await solveForDimension("transposed");

    const bestMove = findBestWord([...wordsVertical, ...wordsHorizontal]);
    if (!bestMove) {
      setIsLoading(false);
      setError("No words can be played with this board and hand.");
      return;
    }

    if (bestMove.direction === "bottom") {
      boardController
        .inheritAnchors(anchorFinderV.getBoard())
        .transpose()
        .inheritAnchors(anchorFinederH.getBoard())
        .transpose()
        .playWord(bestMove.word, bestMove.row, bestMove.col)
        .setState();
    } else {
      boardController
        .inheritAnchors(anchorFinderV.getBoard())
        .transpose()
        .inheritAnchors(anchorFinederH.getBoard())
        .playWord(bestMove.word, bestMove.col, bestMove.row)
        .transpose()
        .setState();
    }
    setIsLoading(false);
  };

  return (
    <BoardContext.Provider value={{ board, isEdit, editBoard, editHand, hand }}>
      <div>
        <Title order={1} my={20} align="center" sx={{ fontWeight: "lighter" }}>
          Board
        </Title>
        <Box className={style.board}>
          <LoadingOverlay visible={isLoading} />
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
        <Title order={2} my={20} align="center" sx={{ fontWeight: "lighter" }}>
          Hand
        </Title>
        <Hand letters={hand} />
        <Paper mt={20} shadow="lg" radius="md" p="xl" withBorder>
          <div className={style.paper}>
            <Box sx={{ display: "flex", gap: "10px", justifyContent: "space-between", width: "100%" }}>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Tooltip withArrow label="Randomize letters in hand">
                  <ActionIcon color="gray" size="xl" variant="light" onClick={randomizeHand}>
                    <Dice size={15} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip withArrow label="Transpose the board">
                  <ActionIcon color="gray" size="xl" variant="light" onClick={transposeBoard}>
                    <Rotate360 size={15} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip withArrow label="Delete everything on board">
                  <ActionIcon color="gray" size="xl" variant="light" onClick={reset}>
                    <Trash size={15} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip withArrow label="Delete AI guesses">
                  <ActionIcon color="gray" size="xl" variant="light" onClick={refreshGuesses}>
                    <X size={15} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip withArrow label="Edit board">
                  <ActionIcon color={!isEdit ? "gray" : "blue"} size="xl" variant="light" onClick={switchEdit}>
                    <Pencil size={15} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip withArrow label="Lock the last AI move in place">
                  <ActionIcon title="test" size="xl" variant="light" onClick={makeLastMovePermanent}>
                    <Lock size={15} />
                  </ActionIcon>
                </Tooltip>
              </Box>
              <Box>
                <Button
                  leftIcon={<PlayerTrackNext size={15} />}
                  variant="gradient"
                  gradient={{ from: "orange", to: "red", deg: 140 }}
                  radius="md"
                  size="md"
                  uppercase
                  onClick={solve2}
                  loading={isLoading}
                  disabled={board.every((row) => row.every((cell) => !cell)) || isEdit}
                  styles={{
                    root: {
                      transition: "box-shadow 0.5s",
                      "&:not(:disabled)": {
                        boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
                      },
                      "&:disabled": {
                        background: "#cfcfcf",
                      },
                    },
                  }}
                >
                  Move
                </Button>
              </Box>
            </Box>
          </div>
        </Paper>
        <Legend />
      </div>
    </BoardContext.Provider>
  );
};

export default Board;
