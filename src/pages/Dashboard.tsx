import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import accountService from '../services/accountService';
import { formatNumber } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccountStatistics = async () => {
      try {
        const statistics = await accountService.getAccountStatistics();
        setTotalAccounts(statistics.totalAccount);
      } catch (error) {
        console.error('Lỗi khi lấy thống kê tài khoản:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountStatistics();
  }, []);

  // Dữ liệu mẫu
  const summaryCards = [
    { title: 'Doanh thu', value: '120.000.000đ', icon: <AttachMoneyIcon sx={{ fontSize: 40 }} color="primary" />, color: '#e3f2fd' },
    { title: 'Đơn hàng', value: '150', icon: <ShoppingCartIcon sx={{ fontSize: 40 }} color="secondary" />, color: '#e8eaf6' },
    { title: 'Khách hàng', value: loading ? '...' : formatNumber(totalAccounts), icon: <PeopleIcon sx={{ fontSize: 40 }} color="success" />, color: '#e8f5e9' },
    { title: 'Tăng trưởng', value: '12%', icon: <TrendingUpIcon sx={{ fontSize: 40 }} color="warning" />, color: '#fff8e1' },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Nguyễn Văn A', date: '01/03/2025', status: 'Đã giao', amount: '1.500.000đ' },
    { id: '#ORD-002', customer: 'Trần Thị B', date: '28/02/2025', status: 'Đang giao', amount: '2.300.000đ' },
    { id: '#ORD-003', customer: 'Lê Văn C', date: '27/02/2025', status: 'Đã giao', amount: '850.000đ' },
    { id: '#ORD-004', customer: 'Phạm Thị D', date: '25/02/2025', status: 'Đã hủy', amount: '1.200.000đ' },
    { id: '#ORD-005', customer: 'Hoàng Văn E', date: '24/02/2025', status: 'Đã giao', amount: '3.100.000đ' },
  ];

  const topProducts = [
    { name: 'Áo thun nam', sold: 120, stock: 80, progress: 60 },
    { name: 'Quần jean nữ', sold: 95, stock: 45, progress: 68 },
    { name: 'Giày thể thao', sold: 85, stock: 30, progress: 74 },
    { name: 'Túi xách nữ', sold: 75, stock: 25, progress: 75 },
    { name: 'Đồng hồ nam', sold: 60, stock: 15, progress: 80 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Thẻ tóm tắt */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 2,
                bgcolor: card.color
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {card.value}
                </Typography>
              </Box>
              {card.icon}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Đơn hàng gần đây và sản phẩm bán chạy */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardHeader 
              title="Đơn hàng gần đây" 
              action={
                <Button color="primary">Xem tất cả</Button>
              }
            />
            <Divider />
            <CardContent>
              <List>
                {recentOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem
                      secondaryAction={
                        <Typography variant="body2" fontWeight="bold">
                          {order.amount}
                        </Typography>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="body1" fontWeight="medium">
                              {order.id}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                ml: 2, 
                                px: 1, 
                                py: 0.5, 
                                borderRadius: 1, 
                                bgcolor: 
                                  order.status === 'Đã giao' ? '#e8f5e9' : 
                                  order.status === 'Đang giao' ? '#e3f2fd' : 
                                  '#ffebee',
                                color:
                                  order.status === 'Đã giao' ? 'success.main' : 
                                  order.status === 'Đang giao' ? 'primary.main' : 
                                  'error.main'
                              }}
                            >
                              {order.status}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {order.customer} • {order.date}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recentOrders.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader 
              title="Sản phẩm bán chạy" 
              action={
                <Button color="primary">Chi tiết</Button>
              }
            />
            <Divider />
            <CardContent>
              <List>
                {topProducts.map((product, index) => (
                  <React.Fragment key={product.name}>
                    <ListItem>
                      <Box sx={{ width: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Typography variant="body2">{product.name}</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {product.sold} đã bán
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={product.progress} 
                          sx={{ height: 8, borderRadius: 5 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Còn {product.stock} sản phẩm
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < topProducts.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
