import React from "react";
import { useContext, useState } from "react";

interface IScoresContext {
  playerScore: number;
  aiScore: number;
  addPlayerScore: (score: number) => void;
  addAiScore: (score: number) => void;
}

export const ScoresContext = React.createContext<IScoresContext>({ playerScore: 0, aiScore: 0, addAiScore: () => undefined, addPlayerScore: () => undefined })

export const useScoresProvider = (): IScoresContext => {
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [aiScore, setAiScore] = useState<number>(0);

  const addPlayerScore = (score: number) => {
    setPlayerScore((prev) => prev + score);
  }

  const addAiScore = (score: number) => {
    setAiScore((prev) => prev + score);
  }

  return {
    playerScore,
    aiScore,
    addPlayerScore,
    addAiScore
  }
}

export const useScoresContext = () => {
  const context = useContext(ScoresContext);
  return context;
}