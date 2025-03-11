import React from 'react';
import { Chip, useTheme } from '@mui/material';
import { OrderStatusValue } from '../../../../services/orderService';

interface OrderStatusBadgeProps {
  status: OrderStatusValue;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const theme = useTheme();
  
  // Xác định màu sắc dựa trên trạng thái
  const getStatusColor = (statusValue: OrderStatusValue) => {
    switch (statusValue) {
      case 'PENDING':
        return {
          bg: theme.palette.info.light + '30', // Light blue with opacity
          color: theme.palette.info.dark
        };
      case 'PROCESSING':
        return {
          bg: theme.palette.warning.light + '30', // Light orange with opacity
          color: theme.palette.warning.dark
        };
      case 'SHIPPED':
        return {
          bg: theme.palette.primary.light + '30', // Light primary with opacity
          color: theme.palette.primary.dark
        };
      case 'DELIVERED':
        return {
          bg: theme.palette.success.light + '30', // Light green with opacity
          color: theme.palette.success.dark
        };
      case 'CANCELED':
        return {
          bg: theme.palette.error.light + '30', // Light red with opacity
          color: theme.palette.error.dark
        };
      default:
        return {
          bg: theme.palette.grey[300],
          color: theme.palette.text.secondary
        };
    }
  };

  const statusColor = getStatusColor(status);

  // Chuyển đổi chuỗi status từ API thành tên hiển thị
  const getStatusDisplayName = (statusValue: OrderStatusValue): string => {
    switch (statusValue) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PROCESSING': return 'Đang xử lý';
      case 'SHIPPED': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao hàng';
      case 'CANCELED': return 'Đã hủy';
      default: return statusValue;
    }
  };

  return (
    <Chip
      label={getStatusDisplayName(status)}
      size="small"
      sx={{
        backgroundColor: statusColor.bg,
        color: statusColor.color,
        fontWeight: 'medium',
        borderRadius: '4px',
        px: 0.5,
        '& .MuiChip-label': {
          px: 1
        }
      }}
    />
  );
};

export default OrderStatusBadge;
