import React from 'react';
import {
  TablePagination,
  Box,
  Typography
} from '@mui/material';

interface PaginationControlsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  // Tính toán hiển thị thông tin về số lượng bản ghi
  const startRecord = count === 0 ? 0 : page * rowsPerPage + 1;
  const endRecord = Math.min((page + 1) * rowsPerPage, count);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Hiển thị {startRecord}-{endRecord} trong tổng số {count} bản ghi
      </Typography>
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Số dòng:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Box>
  );
};

export default PaginationControls;
