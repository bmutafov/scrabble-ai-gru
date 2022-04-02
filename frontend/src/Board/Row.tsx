import React from "react";
import Cell from "./Cell";
import style from "./Board.module.css";

interface RowProps {
  row: string[];
  index: number;
  isIndex?: boolean;
}

const Row: React.FC<RowProps> = ({ row, index, isIndex = false }) => {
  return (
    <div className={style.row}>
      <Cell position={[index, -1]} content={index.toString()} isIndex />
      {row.map((letter, i) => (
        <Cell position={[index, i]} content={letter} key={`cell-${i}`} isIndex={isIndex} />
      ))}
    </div>
  );
};

export default Row;
