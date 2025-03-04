import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Cart, CartItem } from '../../../../services/cartService';
import UserInfoCard from './UserInfoCard';
import CartItemsTable from './CartItemsTable';
import CartSummary from './CartSummary';

interface CartDetailDialogProps {
  open: boolean;
  onClose: () => void;
  cart: Cart | null;
  onViewItemDetail: (item: CartItem) => void;
  onDeleteItem: (item: CartItem) => void;
}

const CartDetailDialog: React.FC<CartDetailDialogProps> = ({
  open,
  onClose,
  cart,
  onViewItemDetail,
  onDeleteItem,
}) => {
  if (!cart) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #e0e0e0', 
        px: 3, 
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <ShoppingCartIcon />
        Chi tiết giỏ hàng #{cart.id}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mt: 1 }}>
          <UserInfoCard account={cart.account} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingCartIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6" fontWeight="medium">
              Danh sách sản phẩm trong giỏ hàng
            </Typography>
          </Box>
          
          <CartItemsTable 
            cartItems={cart.cartItems} 
            onViewDetail={onViewItemDetail}
            onDeleteClick={onDeleteItem}
          />

          <CartSummary cartItems={cart.cartItems} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          color="primary"
          sx={{ px: 3 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartDetailDialog;
