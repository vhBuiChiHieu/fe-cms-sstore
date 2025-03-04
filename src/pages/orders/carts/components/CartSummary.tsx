import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { CartItem } from '../../../../services/cartService';
import { formatCurrency } from '../../../../utils/formatters';

interface CartSummaryProps {
  cartItems: CartItem[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ cartItems }) => {
  const totalValue = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.productVariant.price,
    0
  );

  return (
    <Card variant="outlined" sx={{ borderRadius: 1, bgcolor: 'primary.50' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            Tổng số sản phẩm: <Chip 
              size="small" 
              label={cartItems.length} 
              color="primary" 
              sx={{ ml: 1, fontWeight: 'bold' }}
            />
          </Typography>
          <Typography variant="subtitle1">
            Tổng giá trị: <Typography component="span" variant="h6" color="primary.main" fontWeight="bold">
              {formatCurrency(totalValue)}
            </Typography>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
