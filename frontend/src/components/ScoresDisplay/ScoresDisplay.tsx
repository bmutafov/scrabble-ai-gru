import { Avatar, List, Paper, ThemeIcon, Title } from '@mantine/core';
import React from 'react';
import { CircleDashed } from 'tabler-icons-react';
import { useScoresContext } from '../../contexts/scores-context';

const ScoresDisplay: React.FC = () => {
  const { aiScore, playerScore } = useScoresContext();
  return <Paper
    mt={20}
    radius="md"
    p="xl"
    withBorder>
    <Title order={4} align="center" mb={10}>
      Scores
    </Title>
    <List
      spacing="md"
      size="sm"
      center

    >
      <List.Item icon={<Avatar src="https://avatars.dicebear.com/api/avataaars/sss.svg" alt="Players score" />}>Player Score: <b>{playerScore}</b></List.Item>
      <List.Item icon={<Avatar src="https://avatars.dicebear.com/api/bottts/malcolm.svg" alt="Gru bot score" />}>Gru Bot Score: <b>{aiScore}</b></List.Item>
    </List>
  </Paper>
}

export default ScoresDisplay;