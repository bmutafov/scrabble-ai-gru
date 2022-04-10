import classNames from "classnames";
import React from "react";
import TileSpot from "../../Framer/TileSpot";
import style from "./Cell.module.css";

interface CellProps {
  content: string;
  position: [number, number];
  isIndex?: boolean;
}

const cellBoosts: Record<string, string> = {
  "00": "w3",
  "03": "l2",
  "07": "w3",
  "011": "l2",
  "014": "w3",
  "15": "l3",
  "18": "l3",
  "11": "w2",
  "113": "w2",
  "22": "w2",
  "26": "l2",
  "28": "l2",
  "212": "w2",
  "30": "l2",
  "37": "l2",
  "314": "l2",
  "33": "w2",
  "311": "w2",
  "44": "w2",
  "410": "w2",
  "51": "l3",
  "55": "l3",
  "59": "l3",
  "513": "l3",
  "62": "l2",
  "66": "l2",
  "68": "l2",
  "612": "l2",
  "70": "w3",
  "73": "l2",
  "77": "⭐",
  "711": "l2",
  "714": "w3",
  "82": "l2",
  "86": "l2",
  "88": "l2",
  "812": "l2",
  "91": "l3",
  "95": "l3",
  "99": "l3",
  "913": "l3",
  "104": "w2",
  "1010": "w2",
  "110": "l2",
  "117": "l3",
  "1111": "w2",
  "1114": "l2",
  "122": "w2",
  "126": "l2",
  "128": "l2",
  "1212": "w2",
  "131": "w2",
  "135": "l3",
  "139": "l3",
  "1313": "w2",
  "140": "w3",
  "143": "l2",
  "147": "w3",
  "1411": "l2",
  "1414": "w3",
};

const Cell: React.FC<CellProps> = ({ content, position, isIndex = false }) => {
  const cellBoost = cellBoosts[position.join("")];

  const className = classNames({
    [style.cell]: true,
    [style.star]: cellBoost === "⭐",
    [style.wordX3]: cellBoost === "w3",
    [style.wordX2]: cellBoost === "w2",
    [style.letterX3]: cellBoost === "l3",
    [style.letterX2]: cellBoost === "l2",
  });

  return (
    <TileSpot className={className} position={position}>
      {cellBoost && cellBoost.replace(/l|w/, "x")}
    </TileSpot>
  );
};

export default Cell;
