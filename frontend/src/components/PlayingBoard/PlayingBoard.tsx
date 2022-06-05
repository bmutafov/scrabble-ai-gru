import { LoadingOverlay } from "@mantine/core";
import React from "react";
import { Board } from "../../state/game-state";
import Row from "../Row";
import styles from "./PlayingBoard.module.css";

interface PlayingBoardProps {
  board: Board;
  isLoading: boolean;
}

const PlayingBoard: React.FC<PlayingBoardProps> = ({ board, isLoading }) => {
  return (
    <div className={styles.board}>
      <LoadingOverlay visible={isLoading} />
      {board.map((row, i) => (
        <Row row={row} key={i} index={i} isIndex={false} />
      ))}
    </div>
  );
};

export default PlayingBoard;
