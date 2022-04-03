import React, { useContext } from "react";
import { IHand, IBoard } from "../Board/Board";

interface IBoardContext {
  board: IBoard;
  hand: IHand;
  isEdit: boolean;
  editBoard: (r: number, c: number, value: string) => void;
  editHand: (index: number, letter: string) => void;
}

export const BoardContext = React.createContext<IBoardContext>({} as IBoardContext);

export const useBoard = () => {
  const boardContext = useContext(BoardContext);
  return boardContext;
};
