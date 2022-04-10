import { Title } from "@mantine/core";
import classNames from "classnames";
import React from "react";
import style from "./PlayerColumn.module.css";

interface PlayerColumnProps {
  avatarUrl: string;
  name: string;
}

const PlayerColumn: React.FC<PlayerColumnProps> = ({ children, avatarUrl, name }) => {
  const classes = classNames(style.column, style.displayColumn);

  return (
    <div className={classes}>
      <img src={avatarUrl} alt={name} className={style.avatar} />
      {/* <img src="https://avatars.dicebear.com/api/bottts/malcolm.svg" alt="bot-avatar" className={style.avatar} /> */}
      <Title order={4}>{name}</Title>
      {children}
    </div>
  );
};

export default PlayerColumn;
