import { Tooltip } from "@mantine/core";
import React from "react";
import style from "./Board.module.css";

const Legend: React.FC = () => {
  return (
    <div className={style.legend}>
      <Tooltip
        withArrow
        width={200}
        wrapLines
        label="The letter has been already placed on the board, before the AI started generating a move"
      >
        <div className={style.legendItem}>
          <div className={style.legendLocked}></div>
          Locked letter
        </div>
      </Tooltip>

      <Tooltip
        withArrow
        width={200}
        wrapLines
        label="A list of possible letters that can be played on this position, so the word will make sense in both directions"
      >
        <div className={style.legendItem}>
          <div className={style.legendSuggest}></div>
          Possible letters
        </div>
      </Tooltip>

      <Tooltip width={200} wrapLines withArrow label="No letter can be played on this position currently">
        <div className={style.legendItem}>
          <div className={style.legendImpossible}></div>
          No letter can be played
        </div>
      </Tooltip>

      <Tooltip width={200} wrapLines withArrow label="This letter has been placed by the AI on the last move">
        <div className={style.legendItem}>
          <div className={style.legendPlaced}></div>
          Move by AI
        </div>
      </Tooltip>
    </div>
  );
};

export default Legend;
