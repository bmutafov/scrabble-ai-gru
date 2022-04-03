import React, { useRef, useState } from "react";
import Row from "./Row";
import style from "./Board.module.css";
import { Box, Button, Header, Paper, Title } from "@mantine/core";
import Hand from "./Hand";
import { BoardContext } from "../contexts/board-context";
import { AnchorFinder } from "../solver/solver";
import { AxiosCalls } from "../solver/axios-calls";

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

const Board: React.FC = () => {
  const [board, setBoard] = useState<IBoard>(INITIAL_BOARD);
  const [hand, setHand] = useState<Hand>(["а", "б", "в", "г", "д", "е", "ж"]);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log(board);

  const editBoard = (r: number, c: number, value: string) => {
    setBoard((prev) => {
      return prev.map((row, _r) => {
        return row.map((col, _c) => {
          if (_r === r && _c === c) {
            return value;
          } else {
            return col;
          }
        });
      });
    });
  };

  const refreshGuesses = () => {
    setBoard((prev) => {
      return prev.map((row, _r) => {
        return row.map((col, _c) => {
          if (col.startsWith("$") || col.startsWith("@") || col.startsWith("!")) {
            return "";
          } else {
            return col;
          }
        });
      });
    });
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

  const solve = async () => {
    setIsLoading(true);
    const anchorFinder = new AnchorFinder(board);
    anchorFinder.findAnchors();
    anchorFinder.findWordsNextToAnchor();
    await anchorFinder.addPossibleLettersOnBoard();
    const words = await AxiosCalls.solve(
      anchorFinder.getBoard().map((row) => (row[6] === "" ? "*" : row[6])),
      hand
    );
    const [longest] = words.sort((a, b) => b.word.localeCompare(a.word));
    anchorFinder.playWord(longest.word, longest.index, 6);
    setBoard(anchorFinder.getBoard());
    setIsLoading(false);
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

        <Paper mt={20} shadow="lg" radius="md" p="xl" withBorder>
          <Title order={2} mb={20}>
            Hand
          </Title>
          <div className={style.paper}>
            <Hand letters={hand} />
            <Box sx={{ display: "flex", gap: "10px" }}>
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
