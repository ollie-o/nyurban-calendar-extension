import styled from 'styled-components';

/** Styled table header cell with optional checkbox styling. */
export const TableHeaderCell = styled.th<{ isCheckbox?: boolean }>`
  padding: 12px 8px;
  text-align: ${(props) => (props.isCheckbox ? 'center' : 'left')};
  font-weight: bold;
  color: #000;
  width: ${(props) => (props.isCheckbox ? '40px' : 'auto')};
`;
