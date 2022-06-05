import React from "react";
import { useTileContext } from "../contexts/tile-context";

interface TileContainerProps {
  active?: boolean;
}

const TileContainer: React.FC<TileContainerProps> = ({ children, active = false }) => {
  const context = useTileContext();

  return (
    <div
      style={{ width: "100%", height: "150px", background: "#fff", borderRadius: "10px" }}
      onMouseEnter={() => {
        if (active) {
          context.setIsInTileContainer(true);
        }
      }}
      onMouseLeave={() => {
        if (active) {
          context.setIsInTileContainer(false);
        }
      }}
    >
      {children}
    </div>
  );
};

export default TileContainer;
