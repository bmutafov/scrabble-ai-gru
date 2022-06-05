import { useClassState } from "./hooks/class-state";
import { GameStateController } from "./state/game-state";
import { Alert, Box, Group, Title } from "@mantine/core";
import PlayerColumn from "./components/PlayerColumn";
import TileContainer from "./Framer/TileContainer";
import TileComponent from "./Framer/Tile";
import PlayingBoard from "./components/PlayingBoard";
import { onTileMoveOnBoardFn, onTileMoveToHandFn, TileContextProvider } from "./contexts/tile-context";
import Controls from "./components/Controls";
import { useAi } from "./hooks/useAi";
import { snooze } from "./utils/snooze";
import { AlertCircle } from "tabler-icons-react";
import ScoresDisplay from "./components/ScoresDisplay/ScoresDisplay";
import { ScoresContext, useScoresProvider } from "./contexts/scores-context";
import { calculateScore } from "./hooks/useAi/useAi";

function App() {
  const scoresProviderValues = useScoresProvider();
  const state = useClassState(GameStateController);
  const solveAi = useAi(state);
  const currentState = state.get();

  const onTileMoveOnBoard: onTileMoveOnBoardFn = (r, c, tile, prevPosition) => {
    state.setTileOnBoard(r, c, tile);
    if (prevPosition) {
      state.removeOnPosition(prevPosition);
    }
    if (tile) {
      state.addMovedTile(tile, r, c);
    }
    state.set();
  };

  const onTileMoveToHand: onTileMoveToHandFn = (tile) => {
    state.setTileInHand(tile).set();
  };

  const scorePlayerWord = () => {
    const data = state.getMovedTilesData()
    const score = calculateScore(state.getBackedUpBoard(), data.word, data.tiles[0].row, data.tiles[0].col);
    scoresProviderValues.addPlayerScore(score);
  }

  const handleEndTurn = async () => {
    scorePlayerWord();
    state.setError(null);
    state.resetMovedTiles().lockPlayedLetters().setLoading(true).set();
    try {
      await snooze(500);
      const move = await solveAi();
      scoresProviderValues.addAiScore(move.score);
      state.backupCurrentBoard();
    } catch (e) {
      console.log(e);
      state.setError("No words can be played").set();
    } finally {
      state.setLoading(false);
    }
    state.lockPlayedLettersBot().set();
  };

  return (
    <TileContextProvider onTileMoveToHand={onTileMoveToHand} onTileMoveOnBoard={onTileMoveOnBoard}>
      <ScoresContext.Provider value={scoresProviderValues}>
        <Group spacing="lg" position="center" sx={{ height: "100%", alignItems: "center" }}>
          <Box sx={{ width: "340px" }}>
            <PlayerColumn avatarUrl="https://avatars.dicebear.com/api/bottts/malcolm.svg" name="Gru Bot">
              <TileContainer>
                {currentState.allTiles
                  .filter((tile) => tile.controlledPosition || currentState.botHand.includes(tile))
                  .map((tile, index) => (
                    <TileComponent
                      key={tile.id}
                      tile={tile}
                      index={currentState.botHand.indexOf(tile)}
                      controlled
                      controlledPosition={tile.controlledPosition}
                    />
                  ))}
              </TileContainer>
            </PlayerColumn>
          </Box>
          <Box>
            <Title order={2} align="center" m={20}>
              Scrabble AI
            </Title>
            <PlayingBoard board={currentState.board} isLoading={currentState.isLoading} />
            {state.error && (
              <Alert icon={<AlertCircle size={16} />} title={state.error} color="red" sx={{ marginTop: 20 }}>
                You're lucky! It is your turn again.
              </Alert>
            )}
            <Controls
              onEndTurn={handleEndTurn}
              isLoading={currentState.isLoading}
              board={currentState.board}
              allTiles={currentState.allTiles}
            />
            <ScoresDisplay />
          </Box>
          <Box sx={{ width: "340px" }}>
            <PlayerColumn avatarUrl="https://avatars.dicebear.com/api/avataaars/sss.svg" name="You">
              <TileContainer active>
                {currentState.allTiles
                  .filter((tile) => tile.isDrawn && !currentState.botHand.includes(tile) && !tile.controlledPosition)
                  .map((tile, index) => (
                    <TileComponent key={tile.id} tile={tile} index={currentState.playerHand.indexOf(tile)} />
                  ))}
              </TileContainer>
            </PlayerColumn>
          </Box>
        </Group>
      </ScoresContext.Provider>
    </TileContextProvider>
  );
}

export default App;
