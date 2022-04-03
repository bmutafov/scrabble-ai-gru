import React from "react";
import HandLetter from "./HandLetter";
import style from "./Board.module.css";
import { useBoard } from "../contexts/board-context";
import { Button } from "@mantine/core";

interface HandProps {
  letters: string[];
}

const allLetters = [
  "а",
  "б",
  "в",
  "г",
  "д",
  "е",
  "ж",
  "з",
  "и",
  "й",
  "к",
  "л",
  "м",
  "н",
  "о",
  "п",
  "р",
  "с",
  "т",
  "у",
  "ф",
  "х",
  "ц",
  "ч",
  "ш",
  "щ",
  "ъ",
  "ь",
  "ю",
  "я",
];

const getRandLetter = () => {
  const randomIndex = Math.floor(Math.random() * allLetters.length);
  return allLetters[randomIndex];
};

const Hand: React.FC<HandProps> = ({ letters }) => {
  const boardContext = useBoard();

  const randomizeHand = () => {
    letters.forEach((l, i) => {
      boardContext.editHand(i, getRandLetter());
    });
  };

  return (
    <div className={style.handContainer}>
      {letters.map((letter, i) => (
        <HandLetter letter={letter} index={i} key={`${letter}-${i}`} />
      ))}
      <Button onClick={randomizeHand}>Randomize</Button>
    </div>
  );
};

export default Hand;
