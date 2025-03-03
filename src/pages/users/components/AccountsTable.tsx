import React, { ReactElement } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Box,
  Typography,
  CircularProgress,
  Button,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Refresh as RefreshIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';
import { Account } from '../../../services/accountService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface AccountsTableProps {
  accounts: Account[];
  loading: boolean;
  error: string;
  onEditClick: (account: Account) => void;
  onDeleteClick: (account: Account) => void;
  onLockClick: (account: Account) => void;
  onUnlockClick: (account: Account) => void;
  onActivateClick: (account: Account) => void;
  onRefresh: () => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({
  accounts,
  loading,
  error,
  onEditClick,
  onDeleteClick,
  onLockClick,
  onUnlockClick,
  onActivateClick,
  onRefresh
}) => {
  // Hàm format ngày tháng
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  // Hàm tạo chip hiển thị vai trò
  const getRoleChip = (role: string | undefined): ReactElement => {
    if (!role) return <Chip label="N/A" size="small" />;
    
    let color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default' = 'default';
    let label = role;
    
    switch (role) {
      case 'ADMIN':
        color = 'error';
        label = 'Quản trị viên';
        break;
      case 'MANAGER':
        color = 'warning';
        label = 'Quản lý';
        break;
      case 'USER':
        color = 'primary';
        label = 'Người dùng';
        break;
      case 'GUEST':
        color = 'info';
        label = 'Khách';
        break;
    }
    
    return <Chip label={label} color={color} size="small" />;
  };

  // Hàm tạo nhãn trạng thái
  const getStatusLabel = (status: number | string | undefined): ReactElement => {
    if (status === undefined) return <Chip label="N/A" size="small" />;
    
    const statusNum = typeof status === 'string' ? parseInt(status, 10) : status;
    
    switch (statusNum) {
      case 0:
        return <Chip label="Hoạt động" color="success" size="small" />;
      case 1:
        return <Chip label="Chưa kích hoạt" color="warning" size="small" />;
      case 2:
        return <Chip label="Đã khóa" color="error" size="small" />;
      default:
        return <Chip label="Không xác định" size="small" />;
    }
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="danh sách tài khoản">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
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
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Đang tải dữ liệu...
                </Typography>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={onRefresh}
                  sx={{ mt: 2 }}
                >
                  Thử lại
                </Button>
              </TableCell>
            </TableRow>
          ) : !accounts || accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <Typography variant="body1">
                  Không tìm thấy dữ liệu
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow
                key={account.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.fullName || 'N/A'}</TableCell>
                <TableCell>{getRoleChip(account.role)}</TableCell>
                <TableCell>{getStatusLabel(account.status)}</TableCell>
                <TableCell>{formatDate(account.createdAt)}</TableCell>
                <TableCell>{formatDate(account.lastLogin)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => onEditClick(account)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {/* Nút thay đổi trạng thái */}
                    {account.status === 0 || account.status === '0' ? (
                      <Tooltip title="Khóa tài khoản">
                        <IconButton
                          aria-label="lock"
                          color="warning"
                          onClick={() => onLockClick(account)}
                        >
                          <LockIcon />
                        </IconButton>
                      </Tooltip>
                    ) : account.status === 2 || account.status === '2' ? (
                      <Tooltip title="Mở khóa tài khoản">
                        <IconButton
                          aria-label="unlock"
                          color="success"
                          onClick={() => onUnlockClick(account)}
                        >
                          <LockOpenIcon />
                        </IconButton>
                      </Tooltip>
                    ) : account.status === 1 || account.status === '1' ? (
                      <Tooltip title="Kích hoạt tài khoản">
                        <IconButton
                          aria-label="activate"
                          color="info"
                          onClick={() => onActivateClick(account)}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <Tooltip title="Xóa">
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => onDeleteClick(account)}
                      >
                        <DeleteIcon />
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
  );
};

export default AccountsTable;
