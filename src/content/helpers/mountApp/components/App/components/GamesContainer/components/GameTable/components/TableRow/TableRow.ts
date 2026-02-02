import styled from 'styled-components';

/** Styled table row with optional hover effect. */
export const TableRow = styled.tr<{ isHovered?: boolean }>`
  border-bottom: 1px solid #e9ecef;
  background: ${(props) => (props.isHovered ? '#f8f9fa' : 'white')};
  cursor: pointer;
  color: #000;
`;
