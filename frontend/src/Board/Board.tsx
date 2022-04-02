import React, { useRef, useState } from "react";
import Row from "./Row";
import style from "./Board.module.css";
import { Box, Button, Paper } from "@mantine/core";
import Hand from "./Hand";
import { BoardContext } from "../contexts/board-context";

type Hand = string[];
type Board = string[][];
const INITIAL_BOARD: Board = [
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
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [hand, setHand] = useState<Hand>(["а", "б", "в", "г", "д", "е", "ж"]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

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

  const clear = () => {
    setBoard(INITIAL_BOARD);
  };

  const switchEdit = () => {
    setIsEdit((prev) => !prev);
  };

  return (
    <BoardContext.Provider value={{ board, isEdit, editBoard }}>
      <div>
        <div className={style.board}>
          <Row row={INDEX_ROW} isIndex index={-1} />
          {board.map((row, i) => (
            <Row row={row} key={i} index={i} isIndex={false} />
          ))}
        </div>

        <Paper mt={20} shadow="lg" radius="md" p="xl" withBorder className={style.paper}>
          <Hand letters={hand} />
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button variant="default" color="gray" radius="md" size="md" uppercase onClick={switchEdit}>
              Clear
            </Button>
            <Button variant="light" color="blue" radius="md" size="md" uppercase onClick={switchEdit}>
              Edit
            </Button>
            <Button color="pink" radius="md" size="md" uppercase>
              AI Next
            </Button>
          </Box>
        </Paper>
      </div>
    </BoardContext.Provider>
  );
};

export default Board;
