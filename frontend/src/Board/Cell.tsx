import { Input } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useBoard } from "../contexts/board-context";
import style from "./Board.module.css";

interface CellProps {
  content: string;
  position: [number, number];
  isIndex?: boolean;
}

const prefixes = ["$", "@", "!"];
const regex = new RegExp(prefixes.map((prefix) => `\\${prefix}`).join("|"));

const Cell: React.FC<CellProps> = ({ content, position, isIndex = false }) => {
  const boardContext = useBoard();

  const cellValue = content.replace(regex, "");

  const cellClass = classNames({
    [style.indexCell]: isIndex,
    [style.cell]: !isIndex,
    [style.lockedLetter]: content.length === 1 && !content.startsWith("$"),
    [style.suggestedLetter]: content.startsWith("$"),
    [style.placedLetter]: content.startsWith("@"),
    [style.impossiblePlace]: content.startsWith("!"),
    [style.borderless]: boardContext.isEdit,
  });

  const onEdit = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.toLowerCase();
    const [r, c] = position;
    boardContext.editBoard(r, c, value);
  };

  if (position[0] === -1 && position[1] === -1) return <div className={cellClass}>\</div>;

  if (!boardContext.isEdit || isIndex) {
    return <div className={cellClass}>{cellValue}</div>;
  }

  return (
    <Input
      className={cellClass}
      sx={{ width: "50px", textAlign: "center" }}
      size="lg"
      onChange={onEdit}
      value={cellValue}
      disabled={isIndex}
    />
  );
};

export default Cell;
