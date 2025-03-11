import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Container,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import OrderSearchBar from './components/OrderSearchBar';
import OrdersTable from './components/OrdersTable';
import OrderDetailDialog from './components/OrderDetailDialog';
import orderService, { Order, OrderStatus } from '../../../services/orderService';
import logger from '../../../utils/logger';

const OrdersPage: React.FC = () => {
  // State cho danh sách đơn hàng
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // State cho phân trang
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  // State cho danh sách trạng thái
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  
  // State cho dialog chi tiết và chỉnh sửa trạng thái đơn hàng
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailDialogOpen, setOrderDetailDialogOpen] = useState<boolean>(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState<boolean>(false);
  
  // State cho thông báo
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Hàm tải danh sách đơn hàng
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await orderService.getOrders({
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined
      });
      
      // API trả về dữ liệu
      setOrders(result.data || []);
      setTotalItems(result.totalItems || 0);
    } catch (err) {
      logger.error('Lỗi khi tải danh sách đơn hàng:', err);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  // Tải danh sách trạng thái đơn hàng
  const fetchOrderStatuses = useCallback(async () => {
    try {
      const statuses = await orderService.getOrderStatuses();
      setOrderStatuses(statuses);
    } catch (err) {
      logger.error('Lỗi khi tải danh sách trạng thái đơn hàng:', err);
      // Sử dụng danh sách trạng thái mặc định từ service
    }
  }, []);

  // Tải dữ liệu khi component mount
  useEffect(() => {
    fetchOrderStatuses();
  }, [fetchOrderStatuses]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Xử lý sự kiện tìm kiếm
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchOrders();
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
    // Thêm setTimeout để đảm bảo state đã được cập nhật trước khi gọi API
    setTimeout(() => {
      fetchOrders();
    }, 0);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(0);
    // Thêm setTimeout để đảm bảo state đã được cập nhật trước khi gọi API
    setTimeout(() => {
      fetchOrders();
    }, 0);
  };

  // Xử lý phân trang
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý xem chi tiết đơn hàng
  const handleViewOrder = async (order: Order) => {
    setLoadingOrderDetail(true);
    try {
      const orderDetail = await orderService.getOrderDetail(order.id.toString());
      setSelectedOrder(orderDetail);
      setOrderDetailDialogOpen(true);
    } catch (err) {
      logger.error('Lỗi khi tải chi tiết đơn hàng:', err);
      setSnackbar({
        open: true,
        message: 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.',
        severity: 'error',
      });
    } finally {
      setLoadingOrderDetail(false);
    }
  };

  // Xử lý mở dialog cập nhật trạng thái đơn hàng
  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setStatusDialogOpen(true);
  };

  // Xử lý đóng dialog chi tiết đơn hàng
  const handleCloseOrderDetail = () => {
    setOrderDetailDialogOpen(false);
    setSelectedOrder(null);
  };

  // Xử lý đóng dialog cập nhật trạng thái
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
    setSelectedStatus('');
  };

  // Xử lý thay đổi trạng thái đơn hàng trong dialog
  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  // Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !selectedStatus) return;
    
    setUpdatingStatus(true);
    
    try {
      // Tìm id của trạng thái từ tên
      const statusObj = orderStatuses.find(s => s.value === selectedStatus);
      if (!statusObj) {
        throw new Error('Không tìm thấy thông tin trạng thái');
      }
      
      // Gọi API cập nhật trạng thái
      const success = await orderService.updateOrderStatus(selectedOrder.id.toString(), statusObj.id);
      
      if (success) {
        setSnackbar({
          open: true,
          message: 'Cập nhật trạng thái đơn hàng thành công!',
          severity: 'success',
        });
        fetchOrders();
      } else {
        throw new Error('Cập nhật không thành công');
      }
    } catch (err) {
      logger.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
      setSnackbar({
        open: true,
        message: 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.',
        severity: 'error',
      });
    } finally {
      setUpdatingStatus(false);
      handleCloseStatusDialog();
    }
  };

  // Xử lý đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý Đơn hàng
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }} elevation={0} variant="outlined">
        <OrderSearchBar
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          statuses={orderStatuses}
          onSearchChange={handleSearchChange}
          onSearchKeyPress={handleSearchKeyPress}
          onSearchClick={handleSearch}
          onRefresh={handleRefresh}
          onStatusFilterChange={handleStatusFilterChange}
        />
        
        <OrdersTable
          orders={orders}
          totalCount={totalItems}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          error={error}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onViewClick={handleViewOrder}
          onEditClick={handleEditOrder}
        />
      </Paper>
      
      {/* Dialog xem chi tiết đơn hàng */}
      <OrderDetailDialog
        open={orderDetailDialogOpen}
        onClose={handleCloseOrderDetail}
        order={selectedOrder}
      />

      {/* Dialog cập nhật trạng thái đơn hàng */}
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Đơn hàng: {selectedOrder.orderNumber || `#${selectedOrder.id}`}
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-select-label">Trạng thái</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={selectedStatus}
                  label="Trạng thái"
                  onChange={handleStatusChange}
                  disabled={updatingStatus}
                >
                  {orderStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.value}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} disabled={updatingStatus}>
            Hủy
          </Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color="primary"
            disabled={updatingStatus || selectedStatus === selectedOrder?.status}
            startIcon={updatingStatus ? <CircularProgress size={20} /> : null}
          >
            {updatingStatus ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrdersPage;
