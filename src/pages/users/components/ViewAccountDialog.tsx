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
  Divider,
  Card,
  CardContent,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { UserProfile } from '../../../services/accountService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  Update as UpdateIcon,
  Badge as BadgeIcon,
  Stars as StarsIcon
} from '@mui/icons-material';
import AuthenticatedAvatar from '../../../components/AuthenticatedAvatar';

interface ViewAccountDialogProps {
  open: boolean;
  onClose: () => void;
  accountProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Component để hiển thị thông tin dạng nhãn-giá trị
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
      <Box sx={{ mr: 1, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  );
};

const ViewAccountDialog: React.FC<ViewAccountDialogProps> = ({
  open,
  onClose,
  accountProfile,
  loading,
  error
}) => {
  const theme = useTheme();
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
    
    // Sử dụng tên vai trò trực tiếp từ dữ liệu API
    switch (role.name) {
      case 'ADMIN':
        color = 'error';
        break;
      case 'MANAGER':
        color = 'warning';
        break;
      case 'USER':
        color = 'primary';
        break;
      case 'GUEST':
        color = 'info';
        break;
    }
    
    return <Chip label={role.name} color={color} size="small" sx={{ mr: 1, mb: 1 }} />;
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
      sx: {
        borderRadius: 2,
        overflow: 'hidden'
      }
    }}>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 2 }}>
        Thông tin chi tiết tài khoản
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 2 }}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Paper>
        ) : !accountProfile ? (
          <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2 }}>
            <Typography align="center">
              Không tìm thấy thông tin tài khoản
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              {/* Phần thông tin cá nhân */}
              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                    <Box 
                      sx={{
                        p: 0.5,
                        mb: 2,
                        borderRadius: '50%',
                        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
                        display: 'inline-flex'
                      }}
                    >
                      <AuthenticatedAvatar
                        sx={{
                          width: 140,
                          height: 140,
                          border: `3px solid ${theme.palette.background.paper}`,
                        }}
                        avatarUrl={accountProfile.avatar || null}
                      >
                        <PersonIcon sx={{ fontSize: 70 }} />
                      </AuthenticatedAvatar>
                    </Box>
                    
                    <Typography variant="h5" gutterBottom align="center" fontWeight="500">
                      {accountProfile.fullName || `${accountProfile.firstName || ''} ${accountProfile.lastName || ''}`}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      {getStatusLabel(accountProfile.status)}
                    </Box>
                    
                    <Divider sx={{ width: '100%', my: 2 }} />
                    
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarsIcon fontSize="small" sx={{ mr: 1 }} />
                        Vai trò
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', mt: 1 }}>
                        {accountProfile.roles && accountProfile.roles.map((role, index) => (
                          <Box key={index} sx={{ mr: 1, mb: 1 }}>
                            {getRoleChip(role)}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Phần thông tin chi tiết */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                          Thông tin cá nhân
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <InfoItem 
                              icon={<PersonIcon fontSize="small" />}
                              label="ID"
                              value={accountProfile.id}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InfoItem 
                              icon={<EmailIcon fontSize="small" />}
                              label="Email"
                              value={accountProfile.email || accountProfile.mail || 'N/A'}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InfoItem 
                              icon={<PersonIcon fontSize="small" />}
                              label="Họ"
                              value={accountProfile.firstName || 'N/A'}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InfoItem 
                              icon={<PersonIcon fontSize="small" />}
                              label="Tên"
                              value={accountProfile.lastName || 'N/A'}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InfoItem 
                              icon={<CakeIcon fontSize="small" />}
                              label="Ngày sinh"
                              value={accountProfile.dateOfBirth ? format(new Date(accountProfile.dateOfBirth), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InfoItem 
                              icon={<PhoneIcon fontSize="small" />}
                              label="Số điện thoại"
                              value={accountProfile.phone || 'N/A'}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <InfoItem 
                          icon={<DescriptionIcon fontSize="small" />}
                          label="Mô tả"
                          value={accountProfile.description || 'Không có mô tả'}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                          Thông tin thời gian
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <InfoItem 
                              icon={<AccessTimeIcon fontSize="small" />}
                              label="Ngày tạo"
                              value={formatDate(accountProfile.createdAt)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InfoItem 
                              icon={<UpdateIcon fontSize="small" />}
                              label="Cập nhật lần cuối"
                              value={formatDate(accountProfile.updatedAt)}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAccountDialog;
