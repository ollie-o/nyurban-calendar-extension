import styled from 'styled-components';

/** Styled download button. */
export const DownloadButton = styled.button`
  padding: 10px 24px;
  border: none;
  background: #28a745;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    background: #218838;
  }

  &:active {
    background: #1e7e34;
  }
`;
