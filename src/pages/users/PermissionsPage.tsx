import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import permissionService, { Permission } from '../../services/permissionService';
import { formatDate } from '../../utils/formatters';
import AddPermissionDialog from './permissions/components/AddPermissionDialog';
import EditPermissionDialog from './permissions/components/EditPermissionDialog';
import DeletePermissionDialog from './permissions/components/DeletePermissionDialog';

const PermissionsPage: React.FC = () => {
  // State for permissions data
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>(0);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState<string>('');

  // State for pagination
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // State for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  // State for notifications
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch permissions on component mount
  useEffect(() => {
    fetchPermissions();
  }, []);

  // Fetch permissions with search and pagination parameters
  const fetchPermissionsWithParams = async (
    pageIndex: number,
    pageSize: number,
    search?: string
  ) => {
    setLoading(true);
    setError('');
    try {
      const response = await permissionService.getPermissions({
        pageIndex: pageIndex + 1, // API bắt đầu từ 1
        pageSize: pageSize,
        search: search
      });
      setPermissions(response.permissions || []);
      setTotalCount(response.totalCount || 0);
    } catch (error) {
      setError('Không thể tải danh sách quyền hạn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm fetchPermissions để đảm bảo tính tương thích với các phần khác của code
  const fetchPermissions = async () => {
    fetchPermissionsWithParams(page, rowsPerPage, searchTerm);
  };

  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle search key press (Enter)
  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    setPage(0);
    fetchPermissionsWithParams(0, rowsPerPage, searchTerm);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setSearchTerm('');
    setPage(0);
    fetchPermissionsWithParams(0, rowsPerPage, '');
  };

  // Handle page change
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    fetchPermissionsWithParams(newPage, rowsPerPage, searchTerm);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    
    // Sử dụng giá trị mới trực tiếp thay vì dựa vào state
    setTimeout(() => {
      fetchPermissionsWithParams(0, newRowsPerPage, searchTerm);
    }, 0);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Map status code to text
  const getStatusText = (status?: number) => {
    switch (status) {
      case 0:
        return 'Hoạt động';
      case 1:
        return 'Không hoạt động';
      default:
        return 'Không xác định';
    }
  };

  // Dialog handlers
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleOpenEditDialog = (permission: Permission) => {
    setSelectedPermission(permission);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedPermission(null);
    setEditDialogOpen(false);
  };

  const handleOpenDeleteDialog = (permission: Permission) => {
    setSelectedPermission(permission);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedPermission(null);
    setDeleteDialogOpen(false);
  };

  // Handle permission created
  const handlePermissionCreated = () => {
    setAddDialogOpen(false);
    fetchPermissions();
    setSnackbar({
      open: true,
      message: 'Đã tạo quyền hạn mới thành công',
      severity: 'success',
    });
  };

  // Handle permission updated
  const handlePermissionUpdated = () => {
    setEditDialogOpen(false);
    fetchPermissions();
    setSnackbar({
      open: true,
      message: 'Đã cập nhật quyền hạn thành công',
      severity: 'success',
    });
  };

  // Handle permission deleted
  const handlePermissionDeleted = () => {
    setDeleteDialogOpen(false);
    fetchPermissions();
    setSnackbar({
      open: true,
      message: 'Đã xóa quyền hạn thành công',
      severity: 'success',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Quản lý quyền hạn
        </Typography>
        
        {/* Search and filter controls */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchClick} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Thêm mới
          </Button>
        </Box>
        
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên quyền hạn</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>{permission.id}</TableCell>
                    <TableCell>{permission.name}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditDialog(permission)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteDialog(permission)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>
      
      {/* Dialogs */}
      <AddPermissionDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onPermissionCreated={handlePermissionCreated}
      />
      
      <EditPermissionDialog
        open={editDialogOpen}
        permission={selectedPermission}
        onClose={handleCloseEditDialog}
        onPermissionUpdated={handlePermissionUpdated}
      />
      
      <DeletePermissionDialog
        open={deleteDialogOpen}
        permission={selectedPermission}
        onClose={handleCloseDeleteDialog}
        onPermissionDeleted={handlePermissionDeleted}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PermissionsPage;
