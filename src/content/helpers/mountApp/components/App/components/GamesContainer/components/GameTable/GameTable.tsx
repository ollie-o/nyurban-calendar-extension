import React from 'react';

import { Game } from '../../../../shared/types/Game/Game';

import { Checkbox } from './components/Checkbox/Checkbox';
import { DateTimeDiv } from './components/DateTimeDiv/DateTimeDiv';
import { GameTableContainer } from './components/GameTableContainer/GameTableContainer';
import { SelectAllLabel } from './components/SelectAllLabel/SelectAllLabel';
import { SelectAllText } from './components/SelectAllText/SelectAllText';
import { StyledTable } from './components/StyledTable/StyledTable';
import { TableBody } from './components/TableBody/TableBody';
import { TableCell } from './components/TableCell/TableCell';
import { TableHeader } from './components/TableHeader/TableHeader';
import { TableHeaderCell } from './components/TableHeaderCell/TableHeaderCell';
import { TableHeaderRow } from './components/TableHeaderRow/TableHeaderRow';
import { TableRow } from './components/TableRow/TableRow';

/**
 * Formats an ISO date string to a human-readable date.
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats an ISO date string to a human-readable time.
 */
const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Props for the GameTable component.
 */
interface GameTableProps {
  games: Game[];
  selectedGameIndices: Set<number>;
  onGameSelect: (index: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

/**
 * Displays a table of games with checkboxes for selection.
 */
export const GameTable: React.FC<GameTableProps> = ({
  games,
  selectedGameIndices,
  onGameSelect,
  onSelectAll,
}) => {
  const allChecked = games.length > 0 && selectedGameIndices.size === games.length;
  const someChecked = selectedGameIndices.size > 0 && !allChecked;

  return (
    <div>
      <GameTableContainer>
        <SelectAllLabel>
          <Checkbox
            type="checkbox"
            checked={allChecked}
            ref={(el: HTMLInputElement | null) => {
              if (el) {
                el.indeterminate = someChecked;
              }
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSelectAll(e.target.checked)}
          />
          <SelectAllText>{allChecked ? 'Deselect All' : 'Select All'}</SelectAllText>
        </SelectAllLabel>
      </GameTableContainer>

      <StyledTable>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell isCheckbox></TableHeaderCell>
            <TableHeaderCell>Game</TableHeaderCell>
            <TableHeaderCell>Opponent</TableHeaderCell>
            <TableHeaderCell>Date & Time</TableHeaderCell>
            <TableHeaderCell>Location</TableHeaderCell>
            <TableHeaderCell>Details</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {games.map((game, index) => (
            <GameRow
              key={index}
              game={game}
              isSelected={selectedGameIndices.has(index)}
              onSelect={(checked) => onGameSelect(index, checked)}
            />
          ))}
        </TableBody>
      </StyledTable>
    </div>
  );
};

interface GameRowProps {
  game: Game;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

/**
 * A single row in the game table with checkbox and game details.
 */
const GameRow: React.FC<GameRowProps> = ({ game, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <TableRow
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(!isSelected)}
      role="row"
      tabIndex={0}
      aria-label={`Game ${game.gameNumber}: ${game.teamName} vs ${game.opponent} on ${formatDate(game.date)} at ${formatTime(game.date)}`}
      onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(!isSelected);
        }
      }}
    >
      <TableCell
        isCheckbox
        onClick={(e: React.MouseEvent<HTMLTableDataCellElement>) => e.stopPropagation()}
      >
        <Checkbox
          type="checkbox"
          checked={isSelected}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onSelect(e.target.checked);
          }}
          aria-label={`Select game ${game.gameNumber} vs ${game.opponent}`}
        />
      </TableCell>
      <TableCell>#{game.gameNumber}</TableCell>
      <TableCell>{game.opponent}</TableCell>
      <TableCell>
        <DateTimeDiv>{formatDate(game.date)}</DateTimeDiv>
        <DateTimeDiv isTime>{formatTime(game.date)}</DateTimeDiv>
      </TableCell>
      <TableCell>{game.location}</TableCell>
      <TableCell isDetails>{game.locationDetails || ''}</TableCell>
    </TableRow>
  );
};
