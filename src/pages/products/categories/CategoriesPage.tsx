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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import categoryService, { Category, CategoryListParams, CreateCategoryData } from '../../../services/categoryService';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  // State cho dialog tạo danh mục mới
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<CreateCategoryData>({
    name: '',
    description: ''
  });
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  
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

  // Tải danh sách danh mục
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const params: CategoryListParams = {
          pageIndex: page + 1, // pageIndex bắt đầu từ 1 trong API
          pageSize: rowsPerPage,
          search: searchTerm,
          sortBy: 'createdAt',
          sortDirection: 'desc'
        };
        
        const result = await categoryService.getCategories(params);
        setCategories(result.categories);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
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

  // Mở dialog tạo danh mục mới
  const handleOpenCreateDialog = () => {
    setNewCategory({
      name: '',
      description: ''
    });
    setCreateDialogOpen(true);
  };

  // Đóng dialog tạo danh mục mới
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  // Xử lý thay đổi giá trị trong form tạo danh mục
  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý tạo danh mục mới
  const handleCreateCategory = async () => {
    // Kiểm tra dữ liệu đầu vào
    if (!newCategory.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Tên danh mục không được để trống',
        severity: 'error'
      });
      return;
    }

    setCreateLoading(true);
    try {
      // Gọi API tạo danh mục mới
      const success = await categoryService.createCategory(newCategory);
      
      if (success) {
        // Đóng dialog và hiển thị thông báo thành công
        setCreateDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Tạo danh mục thành công',
          severity: 'success'
        });
        
        // Làm mới danh sách danh mục
        handleRefresh();
      } else {
        // Hiển thị thông báo lỗi
        setSnackbar({
          open: true,
          message: 'Tạo danh mục thất bại',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setSnackbar({
        open: true,
        message: 'Đã xảy ra lỗi khi tạo danh mục',
        severity: 'error'
      });
    } finally {
      setCreateLoading(false);
    }
  };

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Danh Mục Sản Phẩm
        </Typography>
        <Divider />
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton type="submit" edge="end">
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
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
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateDialog}
              >
                Thêm danh mục
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
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell>{category.slug || '-'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Sửa">
                        <IconButton
                          color="primary"
                          // onClick={() => handleOpenEditDialog(category)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          // onClick={() => handleOpenDeleteDialog(category)}
                        >
                          <DeleteIcon />
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

      {/* Dialog tạo danh mục mới */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm Danh Mục Mới</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Tên danh mục"
              name="name"
              value={newCategory.name}
              onChange={handleCreateInputChange}
              required
              error={newCategory.name.trim() === ''}
              helperText={newCategory.name.trim() === '' ? 'Tên danh mục không được để trống' : ''}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mô tả"
              name="description"
              value={newCategory.description || ''}
              onChange={handleCreateInputChange}
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} disabled={createLoading}>
            Hủy
          </Button>
          <Button 
            onClick={handleCreateCategory} 
            variant="contained" 
            color="primary"
            disabled={createLoading || !newCategory.name.trim()}
          >
            {createLoading ? <CircularProgress size={24} /> : 'Tạo'}
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
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoriesPage;
