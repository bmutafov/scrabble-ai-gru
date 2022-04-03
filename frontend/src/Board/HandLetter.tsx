import { Input } from "@mantine/core";
import React, { useRef } from "react";
import { useBoard } from "../contexts/board-context";

interface HandLetterProps {
  letter: string;
  index: number;
}

const HandLetter: React.FC<HandLetterProps> = ({ letter, index }) => {
  const boardContext = useBoard();
  const ref = useRef<HTMLInputElement>(null);
  const prevValue = useRef(letter);

  const clearValue = () => {
    if (!ref.current) return;

    prevValue.current = ref.current.value;
    ref.current.value = "";
  };

  const restoreValue = () => {
    if (!ref.current || !prevValue) return;

    if (!ref.current.value && prevValue.current) {
      ref.current.value = prevValue.current;
    }
  };

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    boardContext.editHand(index, e.currentTarget.value);
    ref.current?.blur();
  };

  return (
    <Input
      onFocus={clearValue}
      onBlur={restoreValue}
      ref={ref}
      styles={{
        input: {
          width: "60px",
          textAlign: "center",
          caretColor: "transparent",
          transition: "0.2s",
          "&:focus": {
            borderWidth: "2px",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
          },
        },
      }}
      size="xl"
      onChange={handleChange}
      value={letter}
    />
  );
};

export default HandLetter;
