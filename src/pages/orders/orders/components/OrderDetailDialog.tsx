import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Chip,
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import { Order, OrderItem } from '../../../../services/orderService';
import { formatNumber } from '../../../../utils/formatters';

interface OrderDetailDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderStatusChip = ({ status }: { status: string }) => (
  <Chip
    label={status}
    size="small"
    sx={{
      fontWeight: 500,
      bgcolor: 
        status === 'DELIVERED' ? 'success.lighter' :
        status === 'PENDING' ? 'warning.lighter' : 
        status === 'PROCESSING' ? 'info.lighter' :
        status === 'CANCELED' ? 'error.lighter' : 
        'default',
      color: 
        status === 'DELIVERED' ? 'success.main' :
        status === 'PENDING' ? 'warning.main' :
        status === 'PROCESSING' ? 'info.main' :
        status === 'CANCELED' ? 'error.main' :
        'default',
    }}
  />
);

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  onClose,
  order,
}) => {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <ShoppingBagIcon />
        Chi tiết đơn hàng #{order.id}
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {/* Thông tin chung */}
        <Paper 
          sx={{ 
            p: 2,
            mb: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: 1
          }}
          elevation={0}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Mã đơn hàng
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                #{order.id}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Trạng thái
              </Typography>
              <OrderStatusChip status={order.status} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Giao hàng
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {order.shippingAddress}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Thanh toán
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {order.paymentMethod}
              </Typography>
            </Grid>

=======
          </Grid>
        </Paper>

        {/* Danh sách sản phẩm */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: 1
          }}
          elevation={0}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID Sản phẩm</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Đơn giá</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Số lượng</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(order.orderItems || []).map((item: OrderItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productVariantId}</TableCell>
                  <TableCell align="right">{formatNumber(item.price)}đ</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{formatNumber(item.price * item.quantity)}đ</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{
                borderTop: '2px solid rgba(224, 224, 224, 1)',
                bgcolor: 'background.default',
                '& .MuiTableCell-root': { py: 1.5 }
              }}>
                <TableCell colSpan={4} sx={{ px: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 3
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <CategoryIcon sx={{ color: 'info.main', fontSize: '1rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {(order.orderItems || []).length} loại sản phẩm
                      </Typography>
                    </Box>
                    
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <InventoryIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {(order.orderItems || []).reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                      </Typography>
                    </Box>
                    
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      bgcolor: 'primary.lighter',
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 1
                    }}>
                      <MonetizationOnIcon sx={{ color: 'primary.main' }} />
                      <Typography sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1rem' }}>
                        {formatNumber(order.total)}đ
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ 
        px: 2, 
        py: 1.5,
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          size="small"
          sx={{
            px: 3,
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;