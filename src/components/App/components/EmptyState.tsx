import { EmptyStateContainer, EmptyStateTitle, EmptyStateMessage } from './styles';

/**
 * Component displayed when no games are found on the page.
 */
export const EmptyState = () => (
  <EmptyStateContainer>
    <EmptyStateTitle>No games found</EmptyStateTitle>
    <EmptyStateMessage>Unable to find any upcoming games on this page.</EmptyStateMessage>
  </EmptyStateContainer>
);
