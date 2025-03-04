import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VpnKey as VpnKeyIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { 
  getRolesPaginated, 
  getRoleById,
  deleteRole,
  Role, 
  PaginatedResponse 
} from '../../services/roleService';
import logger from '../../utils/logger';
import RoleDetailDialog from './components/RoleDetailDialog';
import AddRoleDialog from './components/AddRoleDialog';

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error' | 'info'}>({open: false, message: '', severity: 'info'});

  // Hàm lấy danh sách vai trò
  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy danh sách vai trò từ API phân trang (API /api/role/page đã trả về đầy đủ thông tin permissions)
      const response = await getRolesPaginated({
        pageIndex: page + 1, // API bắt đầu từ 1
        pageSize: rowsPerPage
      });
      
      // Cập nhật danh sách vai trò với thông tin đầy đủ
      setRoles(response.data);
      
      // Cập nhật tổng số mục
      setTotalItems(response.totalItems);
      
    } catch (err: any) {
      logger.error('Lỗi khi tải danh sách vai trò:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải danh sách vai trò');
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount hoặc khi thay đổi trang/số dòng
  useEffect(() => {
    fetchRoles();
  }, [page, rowsPerPage]);
  
  // Xử lý xóa vai trò
  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };
  
  // Đóng dialog xóa vai trò
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTimeout(() => setSelectedRole(null), 300);
  };
  
  // Xác nhận xóa vai trò
  const handleConfirmDelete = async () => {
    if (!selectedRole) return;
    
    try {
      setDeleting(true);
      const success = await deleteRole(selectedRole.id);
      
      if (success) {
        setSnackbar({
          open: true,
          message: `Đã xóa vai trò ${selectedRole.name} thành công!`,
          severity: 'success'
        });
        // Làm mới danh sách vai trò
        fetchRoles();
      } else {
        setSnackbar({
          open: true,
          message: `Không thể xóa vai trò ${selectedRole.name}. Vui lòng thử lại sau.`,
          severity: 'error'
        });
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: `Lỗi khi xóa vai trò: ${err.message || 'Đã xảy ra lỗi'}`,
        severity: 'error'
      });
    } finally {
      setDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  // Xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng trên mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý làm mới dữ liệu
  const handleRefresh = () => {
    fetchRoles();
  };

  // Xử lý xem chi tiết vai trò
  const handleViewRoleDetail = async (role: Role) => {
    try {
      setDetailLoading(true);
      setSelectedRole(role); // Đặt vai trò hiện tại để hiển thị trong dialog
      setDetailDialogOpen(true);
      
      // Lấy chi tiết vai trò từ API
      const roleDetail = await getRoleById(role.id);
      
      // Cập nhật thông tin vai trò đầy đủ
      setSelectedRole(roleDetail);
    } catch (err: any) {
      logger.error('Lỗi khi tải chi tiết vai trò:', err);
      setSnackbar({
        open: true,
        message: `Lỗi khi tải chi tiết vai trò: ${err.message || 'Đã xảy ra lỗi'}`,
        severity: 'error'
      });
    } finally {
      setDetailLoading(false);
    }
  };

  // Đóng dialog chi tiết vai trò
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    // Đặt selectedRole về null sau khi đóng dialog để tránh hiển thị dữ liệu cũ khi mở lại
    setTimeout(() => setSelectedRole(null), 300);
  };
  
  // Mở dialog thêm vai trò
  const handleOpenAddRoleDialog = () => {
    setAddRoleDialogOpen(true);
  };
  
  // Đóng dialog thêm vai trò
  const handleCloseAddRoleDialog = () => {
    setAddRoleDialogOpen(false);
  };
  
  // Xử lý sau khi thêm vai trò thành công
  const handleRoleAdded = () => {
    // Hiển thị thông báo thành công
    setSnackbar({
      open: true,
      message: 'Thêm vai trò mới thành công!',
      severity: 'success'
    });
    
    // Làm mới danh sách vai trò
    fetchRoles();
  };
  
  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  // Hiển thị số lượng quyền
  const renderPermissionCount = (role: Role) => {
    // Hiển thị '-' nếu không có thông tin quyền trong bảng,
    // quyền đầy đủ sẽ được hiển thị sau khi mở dialog xem chi tiết
    if (!role.permissions) {
      return (
        <Chip 
          label="Chờ tải" 
          size="small" 
          color="default"
          sx={{ opacity: 0.7 }}
        />
      );
    }
    
    const count = role.permissions.length;
    return (
      <Chip 
        label={`${count} quyền`} 
        size="small" 
        color={count > 0 ? "primary" : "default"}
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Danh sách vai trò
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddRoleDialog}
          >
            Thêm Vai trò
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            disabled={loading}
          >
            Làm mới
          </Button>
        </Stack>
      </Box>

      {error && (
        <Card sx={{ mb: 3, bgcolor: 'error.light' }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="Bảng danh sách vai trò">
            <TableHead>
              <TableRow>
                <TableCell width={80}>ID</TableCell>
                <TableCell>Tên vai trò</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="center">Số quyền</TableCell>
                <TableCell align="center" width={100}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">Không có dữ liệu</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>{role.id}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {role.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                    <TableCell align="center">
                      {renderPermissionCount(role)}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewRoleDetail(role)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa vai trò">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteRole(role)}
                            disabled={role.name === 'ADMIN' || role.name === 'USER'} // Không cho xóa các vai trò mặc định
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
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
          labelRowsPerPage="Dòng trên trang:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Dialog xem chi tiết vai trò */}
      <RoleDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        role={selectedRole}
        loading={detailLoading}
      />
      
      {/* Dialog thêm vai trò mới */}
      <AddRoleDialog
        open={addRoleDialogOpen}
        onClose={handleCloseAddRoleDialog}
        onRoleAdded={handleRoleAdded}
      />
      
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
      
      {/* Dialog xác nhận xóa vai trò */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa vai trò
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa vai trò <strong>{selectedRole?.name}</strong> không?
            <br />
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary" disabled={deleting}>
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            startIcon={<DeleteIcon />}
            disabled={deleting}
          >
            {deleting ? 'Đang xóa...' : 'Xóa vai trò'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesPage;
