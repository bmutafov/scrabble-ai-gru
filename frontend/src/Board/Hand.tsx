import React from "react";
import HandLetter from "./HandLetter";
import style from "./Board.module.css";

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

export const getRandLetter = () => {
  const randomIndex = Math.floor(Math.random() * allLetters.length);
  return allLetters[randomIndex];
};

const Hand: React.FC<HandProps> = ({ letters }) => {
  return (
    <div className={style.handContainer}>
      <div className={style.handLetters}>
        {letters.map((letter, i) => (
          <HandLetter letter={letter} index={i} key={`${letter}-${i}`} />
        ))}
      </div>
    </div>
  );
};

export default Hand;
