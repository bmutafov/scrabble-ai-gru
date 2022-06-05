import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { useTileContext } from "../contexts/tile-context";

interface TileSpotProps {
  className?: string;
  position: [number, number];
}

const TileSpot: React.FC<TileSpotProps> = ({ className, position, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setHovered, isDragging } = useTileContext();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      data-row={position[0]}
      data-col={position[1]}
      ref={ref}
      className={className}
      style={{
        boxSizing: "border-box",
        boxShadow: isHovered && isDragging ? "0px 0px 10px 3px white" : undefined,
        zIndex: isHovered && isDragging ? 5 : 0,
        border: isHovered && isDragging ? "2px solid #4287f5" : undefined,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setHovered(ref.current);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setHovered(null);
      }}
    >
      {children}
    </motion.div>
  );
};

export default TileSpot;
