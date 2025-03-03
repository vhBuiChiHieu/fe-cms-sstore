import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
  CircularProgress,
  Divider
} from '@mui/material';
import { UserProfile } from '../../../services/accountService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Person as PersonIcon } from '@mui/icons-material';
import AuthenticatedAvatar from '../../../components/AuthenticatedAvatar'; // Import AuthenticatedAvatar

interface ViewAccountDialogProps {
  open: boolean;
  onClose: () => void;
  accountProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const ViewAccountDialog: React.FC<ViewAccountDialogProps> = ({
  open,
  onClose,
  accountProfile,
  loading,
  error
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
  const getRoleChip = (role: { id: number | string; name: string; description?: string }) => {
    let color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default' = 'default';
    let label = role.name;
    
    switch (role.name) {
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
    
    return <Chip label={label} color={color} size="small" sx={{ mr: 1, mb: 1 }} />;
  };

  // Hàm tạo nhãn trạng thái
  const getStatusLabel = (status: number | undefined) => {
    if (status === undefined) return <Chip label="N/A" size="small" />;
    
    switch (status) {
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Thông tin chi tiết tài khoản</Typography>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 2 }}>
            {error}
          </Typography>
        ) : !accountProfile ? (
          <Typography align="center" sx={{ py: 2 }}>
            Không tìm thấy thông tin tài khoản
          </Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <AuthenticatedAvatar
                sx={{ width: 120, height: 120, mb: 2 }}
                avatarUrl={accountProfile.avatar || null}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </AuthenticatedAvatar>
              <Typography variant="h6" gutterBottom>
                {accountProfile.fullName || `${accountProfile.firstName} ${accountProfile.lastName}`}
              </Typography>
              {getStatusLabel(accountProfile.status)}
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {accountProfile.roles && accountProfile.roles.map((role, index) => (
                  <Box key={index} sx={{ m: 0.5 }}>
                    {getRoleChip(role)}
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">Thông tin cơ bản</Typography>
                  <Divider sx={{ mb: 1 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">ID</Typography>
                  <Typography variant="body1">{accountProfile.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{accountProfile.email || accountProfile.mail || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Họ</Typography>
                  <Typography variant="body1">{accountProfile.firstName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Tên</Typography>
                  <Typography variant="body1">{accountProfile.lastName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Ngày sinh</Typography>
                  <Typography variant="body1">
                    {accountProfile.dateOfBirth ? format(new Date(accountProfile.dateOfBirth), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Số điện thoại</Typography>
                  <Typography variant="body1">{accountProfile.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Mô tả</Typography>
                  <Typography variant="body1">{accountProfile.description || 'Không có mô tả'}</Typography>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Thông tin thời gian</Typography>
                  <Divider sx={{ mb: 1 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Ngày tạo</Typography>
                  <Typography variant="body1">{formatDate(accountProfile.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Cập nhật lần cuối</Typography>
                  <Typography variant="body1">{formatDate(accountProfile.updatedAt)}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAccountDialog;
