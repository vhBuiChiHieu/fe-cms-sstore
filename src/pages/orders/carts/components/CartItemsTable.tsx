import React from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { CartItem } from '../../../../services/cartService';
import { formatCurrency } from '../../../../utils/formatters';

interface CartItemsTableProps {
  cartItems: CartItem[];
  onViewDetail: (item: CartItem) => void;
  onDeleteClick: (item: CartItem) => void;
}

const CartItemsTable: React.FC<CartItemsTableProps> = ({
  cartItems,
  onViewDetail,
  onDeleteClick,
}) => {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ 
      mb: 3, 
      borderRadius: 1,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: 'grey.100' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Màu sắc</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Kích thước</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Giá</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thành tiền</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.productVariant.sku}</TableCell>
              <TableCell>
                <Chip 
                  size="small" 
                  label={item.productVariant.color} 
                  sx={{ 
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: '4px',
                    fontWeight: 'medium'
                  }} 
                />
              </TableCell>
              <TableCell>
                <Chip 
                  size="small" 
                  label={item.productVariant.size} 
                  sx={{ 
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: '4px',
                    fontWeight: 'medium'
                  }} 
                />
              </TableCell>
              <TableCell align="right">{formatCurrency(item.productVariant.price)}</TableCell>
              <TableCell align="right">
                {item.quantity}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                {formatCurrency(item.quantity * item.productVariant.price)}
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onViewDetail(item)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDeleteClick(item)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CartItemsTable;
