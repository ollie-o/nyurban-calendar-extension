import React from 'react';
import { Game } from '../../../../lib/types';
import { GameTable } from './components/GameTable';
import { ContainerDiv, ContainerTitle, ButtonContainer, DownloadButton } from '../styles';

/**
 * Props for the GamesContainer component.
 */
interface GamesContainerProps {
  games: Game[];
  onDownload: (selectedGames: Game[]) => void;
  onError?: (error: Error) => void;
}

/**
 * Container component that manages game selection and download functionality.
 */
export const GamesContainer: React.FC<GamesContainerProps> = ({ games, onDownload, onError }) => {
  const [selectedGameIndices, setSelectedGameIndices] = React.useState<Set<number>>(
    new Set(games.map((_, i) => i))
  );

  const handleGameSelect = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedGameIndices);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedGameIndices(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGameIndices(new Set(games.map((_, i) => i)));
    } else {
      setSelectedGameIndices(new Set());
    }
  };

  const handleDownload = () => {
    if (selectedGameIndices.size === 0) {
      onError?.(new Error('Please select at least one game to download.'));
      return;
    }

    const selectedGames = games.filter((_, i) => selectedGameIndices.has(i));
    onDownload(selectedGames);
  };

  return (
    <ContainerDiv>
      <ContainerTitle>Select games to add to calendar</ContainerTitle>

      <GameTable
        games={games}
        selectedGameIndices={selectedGameIndices}
        onGameSelect={handleGameSelect}
        onSelectAll={handleSelectAll}
      />

      <ButtonContainer>
        <DownloadButton
          onClick={handleDownload}
          aria-label="Download selected games as calendar file"
        >
          Download calendar file (.ics)
        </DownloadButton>
      </ButtonContainer>
    </ContainerDiv>
  );
};
