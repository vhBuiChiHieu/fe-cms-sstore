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
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getAccounts, Account, AccountListParams } from '../../services/accountService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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
  const [error, setError] = useState<string>('');

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
    const token = TOKEN;
    if (!token) {
      console.log('Không có token xác thực, sử dụng dữ liệu mẫu');
      setError('Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn');
    }
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const getStatusChip = (status: string) => {
    if (!status) return <Chip label="N/A" size="small" />;
    
    switch (status.toLowerCase()) {
      case 'active':
        return <Chip label="Hoạt động" color="success" size="small" />;
      case 'inactive':
        return <Chip label="Không hoạt động" color="default" size="small" />;
      case 'locked':
        return <Chip label="Đã khóa" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getRoleChip = (role: string) => {
    if (!role) return <Chip label="N/A" size="small" />;
    
    switch (role.toLowerCase()) {
      case 'admin':
        return <Chip label="Quản trị viên" color="primary" size="small" />;
      case 'manager':
        return <Chip label="Quản lý" color="secondary" size="small" />;
      case 'staff':
        return <Chip label="Nhân viên" color="info" size="small" />;
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
                <MenuItem value="inactive">Không hoạt động</MenuItem>
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
                <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                <MenuItem value="MANAGER">Quản lý</MenuItem>
                <MenuItem value="STAFF">Nhân viên</MenuItem>
                <MenuItem value="USER">Người dùng</MenuItem>
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
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Đang tải dữ liệu...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : !accounts || accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      Không tìm thấy dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => {
                  if (!account) {
                    console.error('Account item is null or undefined');
                    return null;
                  }
                  
                  return (
                    <TableRow key={account.id || `row-${Math.random()}`} hover>
                      <TableCell>{account.id || 'N/A'}</TableCell>
                      <TableCell>{account.username}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.fullName}</TableCell>
                      <TableCell>{getRoleChip(account.role)}</TableCell>
                      <TableCell>{getStatusChip(account.status)}</TableCell>
                      <TableCell>{formatDate(account.createdAt)}</TableCell>
                      <TableCell>{formatDate(account.lastLogin)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton size="small" color="primary" onClick={() => console.log('Edit', account.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {account.status === 'active' ? (
                            <Tooltip title="Khóa tài khoản">
                              <IconButton size="small" color="warning" onClick={() => console.log('Lock', account.id)}>
                                <LockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Mở khóa tài khoản">
                              <IconButton size="small" color="success" onClick={() => console.log('Unlock', account.id)}>
                                <LockOpenIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Xóa">
                            <IconButton size="small" color="error" onClick={() => console.log('Delete', account.id)}>
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
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
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
    </Box>
  );
};

export default AccountsPage;
