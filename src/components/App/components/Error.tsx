import React from 'react';
import { ErrorContainer, ErrorTitle, ErrorMessage, DismissButton } from './styles';

interface ErrorProps {
  error: Error;
  onDismiss: () => void;
}

/**
 * Component to display an error message on the page.
 */
export const Error: React.FC<ErrorProps> = ({ error, onDismiss }) => (
  <ErrorContainer role="alert">
    <ErrorTitle>Error</ErrorTitle>
    <ErrorMessage>{error.message}</ErrorMessage>
    <DismissButton onClick={onDismiss}>Dismiss</DismissButton>
  </ErrorContainer>
);
