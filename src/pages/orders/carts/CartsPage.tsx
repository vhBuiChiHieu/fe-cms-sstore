import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
} from '@mui/icons-material';
import cartService, { Cart, CartItem, CartListParams } from '../../../services/cartService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import logger from '../../../utils/logger';

const CartsPage: React.FC = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [cartDetailDialogOpen, setCartDetailDialogOpen] = useState<boolean>(false);

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: CartListParams = {
        pageIndex: page + 1, // API sử dụng 1-based indexing
        pageSize: rowsPerPage,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      const result = await cartService.getCarts(params);
      setCarts(result.carts);
      setTotalItems(result.totalCount);
    } catch (err) {
      logger.error('Lỗi khi tải danh sách giỏ hàng:', err);
      setError('Không thể tải danh sách giỏ hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(0);
    fetchCarts();
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setPage(0);
    fetchCarts();
  };

  const handleDeleteClick = (cartItem: CartItem) => {
    setSelectedCartItem(cartItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCartItem) return;

    try {
      const success = await cartService.deleteCartItem(selectedCartItem.id);
      if (success) {
        fetchCarts();
      } else {
        setError('Không thể xóa mục giỏ hàng. Vui lòng thử lại sau.');
      }
    } catch (err) {
      logger.error('Lỗi khi xóa mục giỏ hàng:', err);
      setError('Đã xảy ra lỗi khi xóa mục giỏ hàng.');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCartItem(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedCartItem(null);
  };

  const handleViewDetail = (cartItem: CartItem) => {
    setSelectedCartItem(cartItem);
    // setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    // setDetailDialogOpen(false);
    setSelectedCartItem(null);
  };

  const handleViewCartDetail = (cart: Cart) => {
    setSelectedCart(cart);
    setCartDetailDialogOpen(true);
  };

  const handleCloseCartDetail = () => {
    setCartDetailDialogOpen(false);
    setSelectedCart(null);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Quản lý Giỏ Hàng
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <form onSubmit={handleSearch}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm theo email, tên người dùng..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </form>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
                              onClick={() => handleViewCartDetail(cart)}
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa mục giỏ hàng này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xem chi tiết giỏ hàng */}
      <Dialog
        open={cartDetailDialogOpen}
        onClose={handleCloseCartDetail}
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
          Chi tiết giỏ hàng #{selectedCart?.id}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedCart && (
            <Box sx={{ mt: 1 }}>
              <Card variant="outlined" sx={{ mb: 3, borderRadius: 1 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="medium">
                      Thông tin người dùng
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          Họ và tên:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedCart.account.firstName} {selectedCart.account.lastName}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          Email:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedCart.account.mail}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          Số điện thoại:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedCart.account.phone || 'Không có'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CakeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          Ngày sinh:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(selectedCart.account.dateOfBirth)}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCartIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6" fontWeight="medium">
                  Danh sách sản phẩm trong giỏ hàng
                </Typography>
              </Box>
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
                    {selectedCart.cartItems.map((item) => (
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
                                onClick={() => handleViewDetail(item)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(item)}
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

              <Card variant="outlined" sx={{ borderRadius: 1, bgcolor: 'primary.50' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">
                      Tổng số sản phẩm: <Chip 
                        size="small" 
                        label={selectedCart.cartItems.length} 
                        color="primary" 
                        sx={{ ml: 1, fontWeight: 'bold' }}
                      />
                    </Typography>
                    <Typography variant="subtitle1">
                      Tổng giá trị: <Typography component="span" variant="h6" color="primary.main" fontWeight="bold">
                        {formatCurrency(
                          selectedCart.cartItems.reduce(
                            (sum, item) => sum + item.quantity * item.productVariant.price,
                            0
                          )
                        )}
                      </Typography>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={handleCloseCartDetail} 
            variant="contained" 
            color="primary"
            sx={{ px: 3 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartsPage;
