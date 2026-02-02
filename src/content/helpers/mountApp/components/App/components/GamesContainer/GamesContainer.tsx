import React from 'react';
import { Game } from '../../shared/types/Game/Game';
import { GameTable } from './components/GameTable/GameTable';
import { ContainerDiv } from './components/ContainerDiv/ContainerDiv';
import { ContainerTitle } from './components/ContainerTitle/ContainerTitle';
import { ButtonContainer } from './components/ButtonContainer/ButtonContainer';
import { DownloadButton } from './components/DownloadButton/DownloadButton';
import { generateICS } from './helpers/generateICS/generateICS';
import { handleDownload } from './helpers/handleDownload/handleDownload';

/**
 * Triggers a browser download of the ICS file.
 */
const downloadICS = (icsContent: string, filename = 'nyurban-schedule.ics'): void => {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Converts a string to a filename-safe format.
 */
const sanitizeFilename = (str: string): string =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

/**
 * Props for the GamesContainer component.
 */
interface GamesContainerProps {
  games: Game[];
  onError: (error: Error) => void;
}

/**
 * Container component that manages game selection and download functionality.
 */
export const GamesContainer: React.FC<GamesContainerProps> = ({ games, onError }) => {
  const [selectedGameIndices, setSelectedGameIndices] = React.useState<Set<number>>(
    new Set(games.map((_, i) => i))
  );

  return (
    <ContainerDiv>
      <ContainerTitle>Select games to add to calendar</ContainerTitle>

      <GameTable
        games={games}
        selectedGameIndices={selectedGameIndices}
        onGameSelect={(index, checked) => {
          setSelectedGameIndices((prevSelected) => {
            const nextSelected = new Set(prevSelected);
            if (checked) {
              nextSelected.add(index);
            } else {
              nextSelected.delete(index);
            }
            return nextSelected;
          });
        }}
        onSelectAll={(checked) =>
          setSelectedGameIndices(new Set(checked ? games.map((_, i) => i) : []))
        }
      />

      <ButtonContainer>
        <DownloadButton
          onClick={() => {
            const result = handleDownload(
              games.filter((_, i) => selectedGameIndices.has(i)),
              generateICS,
              downloadICS,
              sanitizeFilename
            );

            if (result.isErr()) {
              onError(result.error);
            }
          }}
          aria-label="Download selected games as calendar file"
        >
          Download calendar file (.ics)
        </DownloadButton>
      </ButtonContainer>
    </ContainerDiv>
  );
};
