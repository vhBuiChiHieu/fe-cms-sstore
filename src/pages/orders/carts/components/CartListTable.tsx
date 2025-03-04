import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Cart } from '../../../../services/cartService';
import { formatCurrency } from '../../../../utils/formatters';

interface CartListTableProps {
  carts: Cart[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  totalItems: number;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewCartDetail: (cart: Cart) => void;
}

const CartListTable: React.FC<CartListTableProps> = ({
  carts,
  loading,
  page,
  rowsPerPage,
  totalItems,
  onChangePage,
  onChangeRowsPerPage,
  onViewCartDetail,
}) => {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Người dùng</TableCell>
              <TableCell>Số lượng mục</TableCell>
              <TableCell>Tổng giá trị</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : carts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có dữ liệu giỏ hàng
                </TableCell>
              </TableRow>
            ) : (
              carts.map((cart) => {
                // Tính tổng giá trị giỏ hàng
                const totalValue = cart.cartItems.reduce(
                  (sum, item) => sum + item.quantity * item.productVariant.price,
                  0
                );

                return (
                  <TableRow key={cart.id}>
                    <TableCell>{cart.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {cart.account.firstName} {cart.account.lastName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {cart.account.mail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{cart.cartItems.length}</TableCell>
                    <TableCell>{formatCurrency(totalValue)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            color="primary"
                            onClick={() => onViewCartDetail(cart)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </>
  );
};

export default CartListTable;
