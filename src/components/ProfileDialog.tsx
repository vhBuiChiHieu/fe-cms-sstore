import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Divider,
  Avatar,
  CircularProgress,
  Box,
  Chip,
  Alert,
  Paper,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import { 
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  AccessTime as AccessTimeIcon,
  Update as UpdateIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import accountService, { UserProfile } from '../services/accountService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BASE_URL } from '../utils/config';
import axios from 'axios';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

// Styled components
const ProfileHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  padding: theme.spacing(3),
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    backgroundSize: '150% 150%',
    backgroundPosition: 'center',
    zIndex: 0
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
  margin: '0 auto',
  backgroundColor: theme.palette.primary.light,
  '& .MuiSvgIcon-root': {
    fontSize: 60
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main
  }
}));

const RoleChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  boxShadow: theme.shadows[1]
}));

const StatusChip = styled(Chip)(({ theme, status }: { theme?: any, status: number }) => {
  let color;
  switch (status) {
    case 0:
      color = theme.palette.success.main;
      break;
    case 1:
      color = theme.palette.warning.main;
      break;
    case 2:
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.grey[500];
  }
  
  return {
    backgroundColor: alpha(color, 0.1),
    color: color,
    border: `1px solid ${alpha(color, 0.3)}`,
    fontWeight: 600
  };
});

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
 * Hàm lấy URL của avatar từ API
 * @param avatarPath Đường dẫn avatar
 * @returns URL đầy đủ của avatar
 */
const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
  if (!avatarPath) return null;
  return `${BASE_URL}/api/file/${avatarPath}`;
};

/**
 * Hàm tải ảnh avatar từ API với token trong header
 * @param avatarPath Đường dẫn avatar
 * @returns Promise với URL blob của ảnh
 */
const loadAvatarWithToken = async (avatarPath: string | null | undefined): Promise<string | null> => {
  if (!avatarPath) return null;
  
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('authState') 
      ? JSON.parse(localStorage.getItem('authState') || '{}').token 
      : '';
    
    if (!token) return null;
    
    // Gọi API với token trong header
    const response = await axios.get(`${BASE_URL}/api/file/${avatarPath}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob'
    });
    
    // Tạo URL từ blob
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Lỗi khi tải avatar:', error);
    return null;
  }
};

/**
 * Dialog hiển thị thông tin cá nhân của người dùng đang đăng nhập
 */
const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const theme = useTheme();

  // Fetch profile khi dialog mở
  useEffect(() => {
    if (open) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const data = await accountService.getProfile();
          setProfile(data);
          setError(null);
          
          // Nếu có avatar, tải ảnh với token
          if (data && data.avatar) {
            const url = await loadAvatarWithToken(data.avatar);
            setAvatarUrl(url);
          } else {
            setAvatarUrl(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin cá nhân');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [open]);
  
  // Cleanup URL khi component unmount
  useEffect(() => {
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, []);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: { 
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 0, 
        m: 0, 
        position: 'relative',
        height: 0
      }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            zIndex: 2,
            bgcolor: 'rgba(0,0,0,0.2)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.3)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      {loading ? (
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </DialogContent>
      ) : error ? (
        <DialogContent>
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        </DialogContent>
      ) : !profile ? (
        <DialogContent>
          <Alert severity="info" sx={{ my: 2 }}>Không tìm thấy thông tin cá nhân.</Alert>
        </DialogContent>
      ) : (
        <>
          <ProfileHeader>
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              {profile.avatar ? (
                <StyledAvatar>
                  <img 
                    src={avatarUrl || undefined} 
                    alt="Avatar"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      // Nếu lỗi khi tải ảnh, hiển thị icon mặc định
                      e.currentTarget.style.display = 'none';
                      const iconEl = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                      if (iconEl) iconEl.style.display = 'block';
                    }}
                  />
                  <PersonIcon className="fallback-icon" style={{ display: 'none' }} />
                </StyledAvatar>
              ) : (
                <StyledAvatar>
                  <PersonIcon />
                </StyledAvatar>
              )}
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                {profile.fullName || `${profile.firstName} ${profile.lastName}`}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, opacity: 0.9 }}>
                {profile.email || profile.mail}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {profile.roles && profile.roles.map((role) => (
                  <RoleChip 
                    key={role.id} 
                    label={role.name} 
                    color="secondary"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </ProfileHeader>
          
          <DialogContent sx={{ px: 3, py: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    pb: 1.5, 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontWeight: 600,
                    color: theme.palette.primary.main
                  }}>
                    Thông tin cá nhân
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <InfoItem>
                      <PersonIcon />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Họ và tên</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {profile.firstName} {profile.lastName}
                        </Typography>
                      </Box>
                    </InfoItem>
                    
                    <InfoItem>
                      <EmailIcon />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Email</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {profile.email || profile.mail || 'N/A'}
                        </Typography>
                      </Box>
                    </InfoItem>
                    
                    <InfoItem>
                      <PhoneIcon />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Số điện thoại</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {profile.phone || 'N/A'}
                        </Typography>
                      </Box>
                    </InfoItem>
                    
                    <InfoItem>
                      <CakeIcon />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Ngày sinh</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(profile.dateOfBirth)}
                        </Typography>
                      </Box>
                    </InfoItem>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    pb: 1.5, 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontWeight: 600,
                    color: theme.palette.primary.main
                  }}>
                    Thông tin tài khoản
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <InfoItem>
                      <VerifiedUserIcon />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Trạng thái</Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <StatusChip 
                            label={mapStatusToString(profile.status)} 
                            size="small"
                            status={typeof profile.status === 'string' ? parseInt(profile.status, 10) : profile.status}
                          />
                        </Box>
                      </Box>
                    </InfoItem>
                    
                    <InfoItem>
                      <AccessTimeIcon />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Ngày tạo</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(profile.createdAt)}
                        </Typography>
                      </Box>
                    </InfoItem>
                    
                    <InfoItem>
                      <UpdateIcon />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Cập nhật lần cuối</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(profile.updatedAt)}
                        </Typography>
                      </Box>
                    </InfoItem>
                    
                    {profile.description && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>Mô tả</Typography>
                        <Typography variant="body1">
                          {profile.description}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default ProfileDialog;
