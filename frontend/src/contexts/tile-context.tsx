import React from "react";
import { Tile } from "../state/game-state";

export type onTileMoveOnBoardFn = (r: number, c: number, value: Tile | null, prevPosition?: [number, number]) => void;
export type onTileMoveToHandFn = (value: Tile) => void;

interface ITileContext {
  hovered: HTMLDivElement | null;
  setHovered: (newHovered: HTMLDivElement | null) => void;
  isInTileContainer: boolean;
  setIsInTileContainer: (newIsInTileContainer: boolean) => void;
  isDragging: boolean;
  setIsDragging: (newValue: boolean) => void;
  onTileMoveOnBoard: onTileMoveOnBoardFn;
  onTileMoveToHand: onTileMoveToHandFn;
}

interface TileContextProviderProps {
  onTileMoveOnBoard: onTileMoveOnBoardFn;
  onTileMoveToHand: onTileMoveToHandFn;
}

export const TileContext = React.createContext<ITileContext>({} as ITileContext);

export const TileContextProvider: React.FC<TileContextProviderProps> = ({
  children,
  onTileMoveOnBoard,
  onTileMoveToHand,
}) => {
  const [hovered, setHovered] = React.useState<ITileContext["hovered"]>(null);
  const [isInTileContainer, setIsInTileContainer] = React.useState<ITileContext["isInTileContainer"]>(false);
  const [isDragging, setIsDragging] = React.useState<ITileContext["isDragging"]>(false);

  return (
    <TileContext.Provider
      value={{
        hovered,
        setHovered,
        isInTileContainer,
        setIsInTileContainer,
        onTileMoveOnBoard,
        onTileMoveToHand,
        isDragging,
        setIsDragging,
      }}
    >
      {children}
    </TileContext.Provider>
  );
};

export const useTileContext = () => {
  const context = React.useContext(TileContext);

  if (!context) {
    throw new Error("useTileContext must be used within a TileContextProvider");
  }

  return context;
};
