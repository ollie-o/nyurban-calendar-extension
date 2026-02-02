import styled from 'styled-components';

/** Styled date/time display with optional top margin for time. */
export const DateTimeDiv = styled.div<{ isTime?: boolean }>`
  color: #000;
  margin-top: ${(props) => (props.isTime ? '2px' : '0')};
`;
