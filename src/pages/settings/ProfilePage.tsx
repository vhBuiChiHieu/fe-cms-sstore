import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Avatar,
  CircularProgress,
  Paper,
  Chip,
  Alert
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import accountService, { UserProfile } from '../../services/accountService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Hàm chuyển đổi trạng thái tài khoản từ số sang chuỗi
 * @param status Trạng thái tài khoản (0: Hoạt động, 1: Chưa kích hoạt, 2: Đã khóa)
 * @returns Chuỗi mô tả trạng thái
 */
const mapStatusToString = (status: number | string): string => {
  const statusNum = typeof status === 'string' ? parseInt(status, 10) : status;
  switch (statusNum) {
    case 0:
      return 'Hoạt động';
    case 1:
      return 'Chưa kích hoạt';
    case 2:
      return 'Đã khóa';
    default:
      return 'Không xác định';
  }
};

/**
 * Hàm định dạng ngày tháng
 * @param dateString Chuỗi ngày tháng
 * @returns Chuỗi ngày tháng đã định dạng
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Trang hiển thị thông tin cá nhân của người dùng đang đăng nhập
 */
const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await accountService.getProfile();
        setProfile(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Không tìm thấy thông tin cá nhân.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Thông tin cá nhân
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                <PersonIcon sx={{ fontSize: 80 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.fullName || `${profile.firstName} ${profile.lastName}`}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {profile.email}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {profile.roles && profile.roles.map((role) => (
                  <Chip 
                    key={role.id} 
                    label={role.name} 
                    color="primary" 
                    sx={{ m: 0.5 }} 
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chi tiết tài khoản
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Họ
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profile.firstName || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tên
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profile.lastName || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Ngày sinh
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(profile.dateOfBirth)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Số điện thoại
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profile.phone || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Trạng thái
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {mapStatusToString(profile.status)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Ngày tạo
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(profile.createdAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Cập nhật lần cuối
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(profile.updatedAt)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
