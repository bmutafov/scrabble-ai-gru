import { Input } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import React from "react";

interface HandLetterProps {
  letter: string;
}

const HandLetter: React.FC<HandLetterProps> = ({ letter }) => {
  const [letterState, setLetterState] = useInputState(letter);

  return (
    <Input
      sx={{ width: "55px" }}
      variant="filled"
      placeholder="X"
      size="xl"
      onChange={setLetterState}
      value={letterState}
    />
  );
};

export default HandLetter;
