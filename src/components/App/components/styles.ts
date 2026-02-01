import styled from 'styled-components';

/** Styled container for empty state message. */
export const EmptyStateContainer = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 40px 24px;
  margin: 20px auto;
  max-width: 900px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  text-align: center;
`;

/** Styled title for empty state. */
export const EmptyStateTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

/** Styled message text for empty state. */
export const EmptyStateMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

/** Container for the select all checkbox and label. */
export const GameTableContainer = styled.div`
  margin-bottom: 16px;
`;

/** Styled label for select all controls. */
export const SelectAllLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

/** Styled checkbox input for select all. */
export const SelectAllCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

/** Styled text for select all label. */
export const SelectAllText = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

/** Styled game table. */
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #000;
`;

/** Styled table header. */
export const TableHeader = styled.thead``;

/** Styled table header row. */
export const TableHeaderRow = styled.tr`
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
`;

/** Styled table header cell with optional checkbox styling. */
export const TableHeaderCell = styled.th<{ isCheckbox?: boolean }>`
  padding: 12px 8px;
  text-align: ${(props) => (props.isCheckbox ? 'center' : 'left')};
  font-weight: bold;
  color: #000;
  width: ${(props) => (props.isCheckbox ? '40px' : 'auto')};
`;

/** Styled table body. */
export const TableBody = styled.tbody``;

/** Styled table row with optional hover effect. */
export const TableRow = styled.tr<{ isHovered?: boolean }>`
  border-bottom: 1px solid #e9ecef;
  background: ${(props) => (props.isHovered ? '#f8f9fa' : 'white')};
  cursor: pointer;
  color: #000;
`;

/** Styled table cell with optional checkbox or details styling. */
export const TableCell = styled.td<{ isCheckbox?: boolean; isDetails?: boolean }>`
  padding: 12px 8px;
  color: ${(props) => (props.isDetails ? '#555' : '#000')};
  text-align: ${(props) => (props.isCheckbox ? 'center' : 'left')};
  max-width: ${(props) => (props.isDetails ? '200px' : 'auto')};
  white-space: ${(props) => (props.isDetails ? 'pre-wrap' : 'normal')};
`;

/** Styled date/time display with optional top margin for time. */
export const DateTimeDiv = styled.div<{ isTime?: boolean }>`
  color: #000;
  margin-top: ${(props) => (props.isTime ? '2px' : '0')};
`;

/** Styled checkbox input for table rows. */
export const RowCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

/** Styled container for games display. */
export const ContainerDiv = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  margin: 20px auto;
  max-width: 900px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  font-size: 14px;
`;

/** Styled title for container. */
export const ContainerTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

/** Styled container for action buttons. */
export const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

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

/** Styled container for errors. */
export const ErrorContainer = styled.div`
  background: #fff5f5;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 20px;
  margin: 20px auto;
  max-width: 900px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  font-family: Arial, sans-serif;
  color: #8b0000;
`;

/** Styled title for error display. */
export const ErrorTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: #8b0000;
`;

/** Styled message text for error display. */
export const ErrorMessage = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #5a0000;
`;

/** Dismiss button for errors. */
export const DismissButton = styled.button`
  padding: 8px 12px;
  border: none;
  background: #8b0000;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-family: Arial, sans-serif;
  font-size: 13px;
`;
