/**
 * Service for managing game selection state.
 * Separates selection logic from UI rendering.
 */

import { Game } from '../lib/types';

export class GameSelectionService {
  private selectedIndices: Set<number>;

  constructor(totalGames: number) {
    // Start with all games selected.
    this.selectedIndices = new Set(Array.from({ length: totalGames }, (_, i) => i));
  }

  /**
   * Toggle selection for a specific game index.
   */
  toggle(index: number): void {
    if (this.selectedIndices.has(index)) {
      this.selectedIndices.delete(index);
    } else {
      this.selectedIndices.add(index);
    }
  }

  /**
   * Select all games.
   */
  selectAll(totalGames: number): void {
    this.selectedIndices = new Set(Array.from({ length: totalGames }, (_, i) => i));
  }

  /**
   * Deselect all games.
   */
  deselectAll(): void {
    this.selectedIndices.clear();
  }

  /**
   * Check if a game at given index is selected.
   */
  isSelected(index: number): boolean {
    return this.selectedIndices.has(index);
  }

  /**
   * Get all selected games from the full games array.
   */
  getSelected(games: Game[]): Game[] {
    return Array.from(this.selectedIndices)
      .filter((index) => index < games.length)
      .map((index) => games[index]);
  }

  /**
   * Get count of selected games.
   */
  getSelectedCount(): number {
    return this.selectedIndices.size;
  }
}
