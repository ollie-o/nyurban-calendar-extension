import React from 'react';

import { DismissButton } from './components/DismissButton/DismissButton';
import { ErrorContainer } from './components/ErrorContainer/ErrorContainer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { ErrorTitle } from './components/ErrorTitle/ErrorTitle';

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
