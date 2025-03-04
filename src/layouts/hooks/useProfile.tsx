import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import accountService, { UserProfile } from '../../services/accountService';
import logger from '../../utils/logger';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';

export const useProfile = () => {
  const { user, logout } = useAuth();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Fetch profile khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await accountService.getProfile();
        setUserProfile(data);
        
        // Nếu có avatar, tải ảnh với token
        if (data && data.avatar) {
          const token = localStorage.getItem('authState') 
            ? JSON.parse(localStorage.getItem('authState') || '{}').token 
            : '';
          
          if (token) {
            try {
              const response = await axios.get(`${BASE_URL}/api/file/${data.avatar}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                },
                responseType: 'blob'
              });
              
              // Tạo URL từ blob
              const url = URL.createObjectURL(response.data);
              setAvatarUrl(url);
            } catch (error) {
              logger.error('Lỗi khi tải avatar:', error);
            }
          }
        }
      } catch (err) {
        logger.error('Lỗi khi tải thông tin profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Cleanup URL khi component unmount
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleProfileClick = () => {
    handleMenuClose();
    setProfileDialogOpen(true);
  };

  return {
    user,
    userProfile,
    avatarUrl,
    loading,
    profileDialogOpen,
    anchorEl,
    setProfileDialogOpen,
    handleProfileMenuOpen,
    handleMenuClose,
    handleLogout,
    handleProfileClick
  };
};
