import React, { useState, useEffect } from 'react';
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Box,
  Button,
  CircularProgress,
  Badge
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import cartService, { CartItem, Cart } from '../services/cartService';
import { formatCurrency } from '../utils/formatters';
import { BASE_URL } from '../utils/config';
import logger from '../utils/logger';
import axios from 'axios';

interface CartMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const CartMenu: React.FC<CartMenuProps> = ({ anchorEl, onClose }) => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [imageUrls, setImageUrls] = useState<Record<string | number, string>>({});
  const [deleting, setDeleting] = useState<string | number | null>(null);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const result = await cartService.getCarts({ pageIndex: 1, pageSize: 5 });
      setCarts(result.carts);
      
      // Tính tổng số mục trong giỏ hàng
      let total = 0;
      result.carts.forEach(cart => {
        total += cart.cartItems.length;
      });
      setTotalItems(total);
      
      // Tải hình ảnh sản phẩm (nếu có)
      // Lưu ý: API hiện tại không có hình ảnh sản phẩm, nhưng chúng ta vẫn giữ code này để sử dụng trong tương lai
    } catch (error) {
      logger.error('Lỗi khi tải giỏ hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCartItem = async (id: string | number) => {
    try {
      setDeleting(id);
      const success = await cartService.deleteCartItem(id);
      if (success) {
        // Cập nhật lại danh sách giỏ hàng
        setCarts(prevCarts => {
          return prevCarts.map(cart => ({
            ...cart,
            cartItems: cart.cartItems.filter(item => item.id !== id)
          }));
        });
        setTotalItems(prev => prev - 1);
      }
    } catch (error) {
      logger.error(`Lỗi khi xóa sản phẩm khỏi giỏ hàng ${id}:`, error);
    } finally {
      setDeleting(null);
    }
  };

  const handleViewDetail = async (id: string | number) => {
    try {
      const detail = await cartService.getCartItemDetail(id);
      if (detail) {
        // Hiển thị chi tiết (có thể mở dialog hoặc chuyển hướng)
        console.log('Chi tiết giỏ hàng:', detail);
      }
    } catch (error) {
      logger.error(`Lỗi khi xem chi tiết giỏ hàng ${id}:`, error);
    }
  };

  useEffect(() => {
    if (anchorEl) {
      fetchCartItems();
    }
    
    // Cleanup URL khi component unmount
    return () => {
      Object.values(imageUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [anchorEl]);

  // Tạo danh sách phẳng các mục giỏ hàng để hiển thị
  const flatCartItems = carts.flatMap(cart => 
    cart.cartItems.map(item => ({
      ...item,
      account: cart.account
    }))
  );

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: { width: 350, maxHeight: 500 }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Giỏ Hàng ({totalItems})
        </Typography>
        <Badge badgeContent={totalItems} color="primary">
          <ShoppingCartIcon />
        </Badge>
      </Box>
      <Divider />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={30} />
        </Box>
      ) : flatCartItems.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">Không có sản phẩm nào trong giỏ hàng</Typography>
        </Box>
      ) : (
        <List sx={{ maxHeight: 350, overflow: 'auto' }}>
          {flatCartItems.slice(0, 5).map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton 
                      edge="end" 
                      aria-label="view"
                      onClick={() => handleViewDetail(item.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDeleteCartItem(item.id)}
                      disabled={deleting === item.id}
                    >
                      {deleting === item.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    {item.productVariant.sku.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${item.productVariant.sku} (${item.productVariant.color}, ${item.productVariant.size})`}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        {formatCurrency(item.productVariant.price)} x {item.quantity}
                      </Typography>
                      <Typography component="div" variant="body2">
                        Tổng: {formatCurrency(item.productVariant.price * item.quantity)}
                      </Typography>
                      <Typography component="div" variant="body2" color="text.secondary">
                        {(item as any).account?.firstName} {(item as any).account?.lastName}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
      
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Đóng</Button>
        <Button 
          variant="contained" 
          color="primary"
          disabled={flatCartItems.length === 0}
          onClick={() => {
            onClose();
            // Chuyển đến trang quản lý giỏ hàng
            window.location.href = '/orders/carts';
          }}
        >
          Xem tất cả
        </Button>
      </Box>
    </Popover>
  );
};

export default CartMenu;
