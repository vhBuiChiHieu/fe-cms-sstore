import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  Chip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import productService, { Product, ProductListParams } from '../../../services/productService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { BASE_URL } from '../../../utils/config';

const ProductTypesPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  // State cho thông báo
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Tải danh sách sản phẩm
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params: ProductListParams = {
          pageIndex: page + 1, // pageIndex bắt đầu từ 1 trong API
          pageSize: rowsPerPage,
          search: searchTerm,
          sortBy: 'createdAt',
          sortDirection: 'desc'
        };
        
        const result = await productService.getProducts(params);
        setProducts(result.products);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error('Error loading products:', error);
        setSnackbar({
          open: true,
          message: 'Đã xảy ra lỗi khi tải danh sách sản phẩm',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, rowsPerPage, searchTerm, refreshTrigger]);

  // Xử lý thay đổi trang
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số hàng mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý tìm kiếm
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(0);
  };

  // Xử lý làm mới dữ liệu
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Hiển thị trạng thái sản phẩm
  const renderStatus = (status?: number) => {
    switch (status) {
      case 0:
        return <Chip label="Hoạt động" color="success" size="small" />;
      case 1:
        return <Chip label="Ẩn" color="default" size="small" />;
      case 2:
        return <Chip label="Hết hàng" color="error" size="small" />;
      default:
        return <Chip label="Không xác định" color="default" size="small" />;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Danh Sách Sản Phẩm
        </Typography>
        <Divider />
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSearch}>
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ ml: 1 }}
                  >
                    Tìm
                  </Button>
                </Box>
              </form>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{ mr: 1 }}
              >
                Làm mới
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                color="primary"
              >
                Thêm mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Thương hiệu</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>
                      {product.brand ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {product.brand.logoUrl && (
                            <Avatar 
                              src={`${BASE_URL}/api/file/${product.brand.logoUrl}`}
                              sx={{ width: 24, height: 24, mr: 1 }}
                            />
                          )}
                          {product.brand.name}
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{product.category?.name || '-'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton size="small" color="info">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductTypesPage;
