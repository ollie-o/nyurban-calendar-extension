import styled from 'styled-components';

/** Styled table cell with optional checkbox or details styling. */
export const TableCell = styled.td<{ isCheckbox?: boolean; isDetails?: boolean }>`
  padding: 12px 8px;
  color: ${(props) => (props.isDetails ? '#555' : '#000')};
  text-align: ${(props) => (props.isCheckbox ? 'center' : 'left')};
  max-width: ${(props) => (props.isDetails ? '200px' : 'auto')};
  white-space: ${(props) => (props.isDetails ? 'pre-wrap' : 'normal')};
`;
