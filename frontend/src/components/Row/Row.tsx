import React from "react";
import Cell from "../Cell";
import styles from "./Row.module.css";

interface RowProps {
  index: number;
  row: string[];
  isIndex?: boolean;
}

const Row: React.FC<RowProps> = ({ index, row, isIndex = false }) => {
  return (
    <div className={styles.row}>
      {row.map((letter, i) => (
        <Cell position={[index, i]} content={letter} key={`cell-${i}`} isIndex={isIndex} />
      ))}
    </div>
  );
};

export default Row;
