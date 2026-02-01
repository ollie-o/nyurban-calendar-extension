import React from 'react';
import { Game } from '../../../../../lib/types';
import { formatDate } from '../../../../../lib/helpers/formatDate';
import { formatTime } from '../../../../../lib/helpers/formatTime';
import {
  GameTableContainer,
  SelectAllLabel,
  SelectAllCheckbox,
  SelectAllText,
  StyledTable,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  DateTimeDiv,
  RowCheckbox,
} from '../../styles';

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
          <SelectAllCheckbox
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
        <RowCheckbox
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
