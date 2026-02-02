import { Game } from '../../../../../../shared/types/Game/Game';

/**
 * Type guard to validate that a game object has all required fields.
 */
export const isValidGame = (game: Partial<Game>): game is Game =>
  !!(game.gameNumber && game.teamName && game.opponent && game.date && game.location);
