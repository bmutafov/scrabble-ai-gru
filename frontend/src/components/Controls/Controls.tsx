import { Badge, Button, Paper } from "@mantine/core";
import React from "react";
import { Board, Tile } from "../../state/game-state";

interface ControlsProps {
  onEndTurn: () => void;
  isLoading: boolean;
  board: Board;
  allTiles: Tile[];
}

const Controls: React.FC<ControlsProps> = ({ onEndTurn, isLoading, board, allTiles }) => {
  const remainingLetters = allTiles.filter((letter) => !letter.isDrawn).length;

  return (
    <Paper
      mt={20}
      shadow="lg"
      radius="md"
      p="xl"
      withBorder
      sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "2rem" }}
    >
      <Badge color="gray">Remaining letters {remainingLetters}</Badge>
      <Button
        variant="gradient"
        gradient={{ from: "orange", to: "red", deg: 140 }}
        radius="md"
        size="md"
        uppercase
        onClick={onEndTurn}
        loading={isLoading}
        disabled={board.every((row) => row.every((cell) => !cell))}
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
        End Turn
      </Button>
    </Paper>
  );
};

export default Controls;
