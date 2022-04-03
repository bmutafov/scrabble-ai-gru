import { Input } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import React from "react";
import { useBoard } from "../contexts/board-context";

interface HandLetterProps {
  letter: string;
  index: number;
}

const HandLetter: React.FC<HandLetterProps> = ({ letter, index }) => {
  const boardContext = useBoard();

  return (
    <Input
      sx={{ width: "55px", "& input": { textAlign: "center" } }}
      variant="filled"
      placeholder="X"
      size="xl"
      onChange={(e: React.SyntheticEvent<HTMLInputElement>) => boardContext.editHand(index, e.currentTarget.value)}
      value={letter}
    />
  );
};

export default HandLetter;
