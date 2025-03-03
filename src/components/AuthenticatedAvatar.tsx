import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import axios from 'axios';
import { BASE_URL } from '../utils/config';

interface AuthenticatedAvatarProps {
  avatarUrl: string | null;
  alt?: string;
  sx?: React.CSSProperties | any;
  children?: React.ReactNode;
}

const AuthenticatedAvatar: React.FC<AuthenticatedAvatarProps> = ({ avatarUrl, alt = '', sx = {}, children }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!avatarUrl) return;

      try {
        setLoading(true);
        setError(false);

        // Lấy token từ localStorage
        const authState = localStorage.getItem('authState');
        const token = authState ? JSON.parse(authState).token : null;

        if (!token) {
          setError(true);
          return;
        }

        // Trích xuất filename từ URL
        const urlParts = avatarUrl.split('/');
        const filename = urlParts[urlParts.length - 1];

        // Gọi API với token trong header
        const response = await axios.get(`${BASE_URL}/api/file/${filename}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        });

        // Chuyển đổi blob thành URL
        const imageUrl = URL.createObjectURL(response.data);
        setImageData(imageUrl);
      } catch (error) {
        console.error('Error loading avatar:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();

    // Cleanup function để tránh memory leak
    return () => {
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [avatarUrl]);

  return (
    <Avatar
      sx={{ ...sx }}
      src={imageData || undefined}
      alt={alt}
    >
      {!imageData && (children || <PersonIcon sx={{ fontSize: sx.width ? sx.width / 2 : 24 }} />)}
    </Avatar>
  );
};

export default AuthenticatedAvatar;
