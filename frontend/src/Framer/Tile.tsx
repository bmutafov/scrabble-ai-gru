import { motion, useAnimation } from "framer-motion";
import { ControlsAnimationDefinition } from "framer-motion/types/animation/types";
import React, { useEffect, useRef } from "react";
import { useTileContext } from "../contexts/tile-context";
import { Tile } from "../state/game-state";

interface TileProps {
  tile: Tile;
  index: number;
  controlled?: boolean;
  controlledPosition?: [number, number];
}

const TileComponent: React.FC<TileProps> = ({ tile, index, controlled = false, controlledPosition }) => {
  const prevPosition = useRef<[number, number]>([0, 0]);
  const tileRef = useRef<HTMLDivElement>(null);
  const context = useTileContext();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: 1,
    });
  }, [controls]);

  useEffect(() => {
    if (controlled && controlledPosition) {
      const tileSpot = document.querySelector(
        `[data-row="${controlledPosition[0]}"][data-col="${controlledPosition[1]}"]`
      );

      if (!tileSpot) {
        throw new Error("Could not find tile spot");
      }
      const tileSpotRect = tileSpot.getBoundingClientRect();
      controls.start({
        left: tileSpotRect.left,
        top: tileSpotRect.top,
        x: 0,
        y: 0,
        translateX: 0,
        translateY: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled, JSON.stringify(controlledPosition), controls]);

  return (
    <motion.div
      data-letter={tile.letter}
      ref={tileRef}
      animate={controls}
      initial={{ scale: 0 }}
      style={{
        zIndex: 1,
        position: "absolute",
        display: "inline-flex",
        translateX: 10 + index * 45 + "px",
        translateY: "20px",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.3rem",
        width: "39px",
        height: "39px",
        lineHeight: "39px",
        borderRadius: "5px",
        backgroundColor: "#fffdec",
        boxShadow: "1px 1px 0 #cbc8b2, 2px 2px 0 #cbc8b2, 3px 3px 0 #cbc8b2",
        color: "#3b3b3b",
        fontWeight: "bold",
        textTransform: "uppercase",
        boxSizing: "border-box",
        border: "2px sollid white",
      }}
      whileDrag={{
        pointerEvents: "none",
        scale: 1.1,
        zIndex: 100,
        boxShadow: "1px 1px 0 #cbc8b2, 2px 2px 0 #cbc8b2, 3px 3px 0 #cbc8b2, 8px 8px 5px rgba(0, 0, 0, 0.3)",
      }}
      drag={index > -1 && !controlled}
      transition={{
        type: "just",
      }}
      dragMomentum={false}
      onDragStart={() => {
        context.setIsDragging(true);
      }}
      onDragEnd={(event, info) => {
        context.setIsDragging(false);
        const hovered = context.hovered;
        const animationDefinition: ControlsAnimationDefinition = {
          x: 0,
          y: 0,
          translateX: 0,
          translateY: 0,
          scale: 1,
        };

        if (!hovered) {
          if (context.isInTileContainer) {
            animationDefinition.top = info.point.y - 20;
            animationDefinition.left = info.point.x - 20;
            context.onTileMoveToHand(tile);
            context.onTileMoveOnBoard(prevPosition.current[0], prevPosition.current[1], null);
          }
        } else {
          const boundingRect = hovered.getBoundingClientRect();
          const row = parseInt(hovered.getAttribute("data-row") || "0");
          const col = parseInt(hovered.getAttribute("data-col") || "0");
          context.onTileMoveOnBoard(row, col, tile, prevPosition.current);
          prevPosition.current = [row, col];

          animationDefinition.transform = "none";
          animationDefinition.top = boundingRect.top + window.scrollY;
          animationDefinition.left = boundingRect.left + window.scrollX;
        }

        controls.start(animationDefinition);
      }}
    >
      {(!controlled || controlledPosition) && tile.letter}
      {/* {tile.letter} */}
    </motion.div>
  );
};

export default TileComponent;
