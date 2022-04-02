import React from "react";
import HandLetter from "./HandLetter";
import style from "./Board.module.css";

interface HandProps {
  letters: string[];
}

const Hand: React.FC<HandProps> = ({ letters }) => {
  return (
    <div className={style.handContainer}>
      {letters.map((letter, i) => (
        <HandLetter letter={letter} key={`${letter}-${i}`} />
      ))}
    </div>
  );
};

export default Hand;
