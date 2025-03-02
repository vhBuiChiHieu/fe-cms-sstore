import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
  SelectChangeEvent,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';
import { getAccounts, Account, AccountListParams, deleteAccount, changeAccountStatus } from '../../services/accountService';
import { getRoles, Role } from '../../services/roleService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TOKEN } from '../../utils/config';

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [accountToChangeStatus, setAccountToChangeStatus] = useState<{id: string, currentStatus: string} | null>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const params: AccountListParams = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        role: roleFilter || undefined
      };
      
      console.log('Gọi API với params:', params);
      const response = await getAccounts(params);
      console.log('Response:', JSON.stringify(response, null, 2));
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'null');
      console.log('Response content:', response?.content);
      console.log('Response content type:', response?.content ? typeof response.content : 'undefined');
      console.log('Response content length:', response?.content?.length);
      
      // Kiểm tra response và response.content
      if (!response) {
        console.error('Response là null hoặc undefined');
        setAccounts([]);
        setTotalElements(0);
        setError('Không thể lấy dữ liệu từ API');
        return;
      }
      
      if (!response.content) {
        console.error('Response.content là null hoặc undefined');
        setAccounts([]);
        setTotalElements(0);
        setError('Không thể lấy dữ liệu từ API');
        return;
      }
      
      if (!Array.isArray(response.content)) {
        console.error('Response.content không phải là mảng:', response.content);
        setAccounts([]);
        setTotalElements(0);
        setError('Không thể lấy dữ liệu từ API');
        return;
      }
      
      console.log('Đã nhận được dữ liệu mảng hợp lệ, độ dài:', response.content.length);
      setAccounts(response.content);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tài khoản:', error);
      setAccounts([]);
      setTotalElements(0);
      setError('Không thể lấy dữ liệu từ API');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, roleFilter]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách vai trò:', error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const token = TOKEN;
    if (!token) {
      console.log('Không có token xác thực, sử dụng dữ liệu mẫu');
      setError('Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn');
    }
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchAccounts();
  };

  const mapStatusToString = (statusValue: number | string): string => {
    if (statusValue === undefined || statusValue === null) {
      return 'unknown';
    }
    
    if (typeof statusValue === 'string') {
      return statusValue.toLowerCase(); // Đảm bảo chuỗi ở dạng lowercase
    }
    
    // Chuyển đổi từ số sang chuỗi
    switch (statusValue) {
      case 0:
        return 'active';
      case 1:
        return 'inactive';
      case 2:
        return 'locked';
      default:
        return 'unknown';
    }
  };

  const getStatusLabel = (status: string | number) => {
    // Đảm bảo status là chuỗi
    const statusString = mapStatusToString(status);
    
    switch (statusString) {
      case 'active':
        return (
          <Chip 
            label="Hoạt động" 
            color="success" 
            size="small" 
            sx={{ fontWeight: 500 }} 
          />
        );
      case 'inactive':
        return (
          <Chip 
            label="Chưa kích hoạt" 
            color="warning" 
            size="small" 
            sx={{ fontWeight: 500 }} 
          />
        );
      case 'locked':
        return (
          <Chip 
            label="Đã khóa" 
            color="error" 
            size="small" 
            sx={{ fontWeight: 500 }} 
          />
        );
      default:
        return (
          <Chip 
            label="Không xác định" 
            color="default" 
            size="small" 
            sx={{ fontWeight: 500 }} 
          />
        );
    }
  };

  const getRoleChip = (role: string) => {
    if (!role) return <Chip label="N/A" size="small" />;
    
    switch (role.toLowerCase()) {
      case 'admin':
        return <Chip label="Quản trị viên" color="primary" size="small" />;
      case 'manager':
        return <Chip label="Quản lý" color="secondary" size="small" />;
      case 'guest':
        return <Chip label="Khách" color="info" size="small" />;
      case 'user':
        return <Chip label="Người dùng" color="default" size="small" />;
      default:
        return <Chip label={role} size="small" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      console.error('Lỗi khi định dạng ngày:', error);
      return dateString || 'N/A';
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  const handleCloseSuccess = () => {
    setSuccessMessage('');
  };

  const handleDeleteClick = (accountId: string) => {
    setAccountToDelete(accountId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
  };

  const handleLockClick = (account: Account) => {
    if (!account || !account.id) return;
    
    // Đảm bảo status là chuỗi
    const currentStatus = mapStatusToString(account.status);
    
    setAccountToChangeStatus({
      id: account.id,
      currentStatus: currentStatus
    });
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setAccountToChangeStatus(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!accountToChangeStatus) return;
    
    setStatusLoading(true);
    try {
      // Xác định trạng thái mới dựa trên trạng thái hiện tại
      let newStatus: number;
      
      const currentStatus = mapStatusToString(accountToChangeStatus.currentStatus);
      
      if (currentStatus === 'active') {
        // Nếu tài khoản đang hoạt động, khóa tài khoản (status = 2)
        newStatus = 2;
      } else if (currentStatus === 'locked') {
        // Nếu tài khoản đang bị khóa, mở khóa tài khoản (status = 0)
        newStatus = 0;
      } else if (currentStatus === 'inactive') {
        // Nếu tài khoản chưa kích hoạt, kích hoạt tài khoản (status = 0)
        newStatus = 0;
      } else {
        // Trường hợp không xác định, mặc định mở khóa (status = 0)
        newStatus = 0;
      }
      
      const success = await changeAccountStatus(accountToChangeStatus.id, newStatus);
      
      if (success) {
        let successMessage = '';
        if (newStatus === 2) {
          successMessage = 'Đã khóa tài khoản thành công';
        } else if (newStatus === 0) {
          if (currentStatus === 'locked') {
            successMessage = 'Đã mở khóa tài khoản thành công';
          } else if (currentStatus === 'inactive') {
            successMessage = 'Đã kích hoạt tài khoản thành công';
          } else {
            successMessage = 'Đã cập nhật trạng thái tài khoản thành công';
          }
        }
        
        setSuccessMessage(successMessage);
        // Cập nhật lại danh sách tài khoản
        fetchAccounts();
      } else {
        setError('Không thể thay đổi trạng thái tài khoản. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái tài khoản:', error);
      setError('Đã xảy ra lỗi khi thay đổi trạng thái tài khoản.');
    } finally {
      setStatusLoading(false);
      setStatusDialogOpen(false);
      setAccountToChangeStatus(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    
    setDeleteLoading(true);
    try {
      const success = await deleteAccount(accountToDelete);
      
      if (success) {
        setSuccessMessage(`Đã xóa tài khoản thành công`);
        // Cập nhật lại danh sách tài khoản
        fetchAccounts();
      } else {
        setError('Không thể xóa tài khoản. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi khi xóa tài khoản:', error);
      setError('Đã xảy ra lỗi khi xóa tài khoản.');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Quản lý tài khoản
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => console.log('Thêm tài khoản mới')}
          >
            Thêm tài khoản
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo tên, email, username..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Trạng thái</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Trạng thái"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Chưa kích hoạt</MenuItem>
                <MenuItem value="locked">Đã khóa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="role-filter-label">Vai trò</InputLabel>
              <Select
                labelId="role-filter-label"
                value={roleFilter}
                label="Vai trò"
                onChange={handleRoleFilterChange}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name === 'ADMIN' ? 'Quản trị viên' : 
                     role.name === 'MANAGER' ? 'Quản lý' : 
                     role.name === 'GUEST' ? 'Khách' : 
                     role.name === 'USER' ? 'Người dùng' : 
                     role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Làm mới
            </Button>
          </Grid>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="danh sách tài khoản">
            <TableHead>
              <TableRow>
                <TableCell width="50px">STT</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Tên đăng nhập</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Đăng nhập cuối</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Đang tải dữ liệu...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : !accounts || accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      Không tìm thấy dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account, index) => {
                  if (!account) {
                    console.error('Account item is null or undefined');
                    return null;
                  }
                  
                  return (
                    <TableRow key={account.id || `row-${Math.random()}`} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{account.id || 'N/A'}</TableCell>
                      <TableCell>{account.username}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.fullName}</TableCell>
                      <TableCell>{getRoleChip(account.role)}</TableCell>
                      <TableCell>{getStatusLabel(account.status)}</TableCell>
                      <TableCell>{formatDate(account.createdAt)}</TableCell>
                      <TableCell>{formatDate(account.lastLogin)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton size="small" color="primary" onClick={() => console.log('Edit', account.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {mapStatusToString(account.status) === 'active' ? (
                            <Tooltip title="Khóa tài khoản">
                              <IconButton 
                                size="small" 
                                color="warning" 
                                onClick={() => handleLockClick(account)}
                              >
                                <LockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : mapStatusToString(account.status) === 'locked' ? (
                            <Tooltip title="Mở khóa tài khoản">
                              <IconButton 
                                size="small" 
                                color="success" 
                                onClick={() => handleLockClick(account)}
                              >
                                <LockOpenIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : mapStatusToString(account.status) === 'inactive' ? (
                            <Tooltip title="Kích hoạt tài khoản">
                              <IconButton 
                                size="small" 
                                color="success" 
                                onClick={() => handleLockClick(account)}
                              >
                                <CheckCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                          <Tooltip title="Xóa">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeleteClick(account.id)}
                            >
                              <DeleteIcon fontSize="small" />
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
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" component="div" sx={{ mr: 2 }}>
              Số hàng mỗi trang:
            </Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
              <Select
                value={rowsPerPage.toString()}
                onChange={handleChangeRowsPerPage}
                displayEmpty
              >
                {[5, 10, 25].map((option) => (
                  <MenuItem key={option} value={option.toString()}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton 
              onClick={(e) => handleChangePage(e, page - 1)} 
              disabled={page === 0}
              size="small"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px',
              borderRadius: '16px',
              bgcolor: 'primary.main',
              color: 'white'
            }}>
              <Typography variant="body2">
                {page + 1}
              </Typography>
            </Box>
            
            <IconButton 
              onClick={(e) => handleChangePage(e, page + 1)} 
              disabled={page >= Math.ceil(totalElements / rowsPerPage) - 1}
              size="small"
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Stack>
          
          <Typography variant="body2">
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, totalElements)} của ${totalElements}`}
          </Typography>
        </Box>
      </Paper>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Dialog xác nhận xóa tài khoản */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>
          Xác nhận xóa tài khoản
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {deleteLoading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận thay đổi trạng thái tài khoản */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
      >
        <DialogTitle>
          {mapStatusToString(accountToChangeStatus?.currentStatus) === 'active' 
            ? 'Xác nhận khóa tài khoản' 
            : mapStatusToString(accountToChangeStatus?.currentStatus) === 'locked'
              ? 'Xác nhận mở khóa tài khoản'
              : mapStatusToString(accountToChangeStatus?.currentStatus) === 'inactive'
                ? 'Xác nhận kích hoạt tài khoản'
                : 'Xác nhận thay đổi trạng thái tài khoản'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mapStatusToString(accountToChangeStatus?.currentStatus) === 'active'
              ? 'Bạn có chắc chắn muốn khóa tài khoản này? Người dùng sẽ không thể đăng nhập cho đến khi tài khoản được mở khóa.'
              : mapStatusToString(accountToChangeStatus?.currentStatus) === 'locked'
                ? 'Bạn có chắc chắn muốn mở khóa tài khoản này? Người dùng sẽ có thể đăng nhập lại vào hệ thống.'
                : mapStatusToString(accountToChangeStatus?.currentStatus) === 'inactive'
                  ? 'Bạn có chắc chắn muốn kích hoạt tài khoản này? Người dùng sẽ có thể đăng nhập vào hệ thống.'
                  : 'Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} color="primary">
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmStatusChange} 
            color={mapStatusToString(accountToChangeStatus?.currentStatus) === 'active' 
              ? 'warning' 
              : 'success'}
            variant="contained" 
            disabled={statusLoading}
            startIcon={statusLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {statusLoading 
              ? 'Đang xử lý...' 
              : (mapStatusToString(accountToChangeStatus?.currentStatus) === 'active' 
                ? 'Khóa' 
                : mapStatusToString(accountToChangeStatus?.currentStatus) === 'locked'
                  ? 'Mở khóa'
                  : mapStatusToString(accountToChangeStatus?.currentStatus) === 'inactive'
                    ? 'Kích hoạt'
                    : 'Xác nhận')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsPage;
