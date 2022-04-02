import React, { useContext } from "react";
import Board from "../Board/Board";

interface IBoardContext {
  board: Board;
  isEdit: boolean;
  editBoard: (r: number, c: number, value: string) => void;
}

export const BoardContext = React.createContext<IBoardContext>({} as IBoardContext);

export const useBoard = () => {
  const boardContext = useContext(BoardContext);
  return boardContext;
};
