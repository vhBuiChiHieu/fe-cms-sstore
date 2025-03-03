import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import logger from '../utils/logger';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Log trạng thái xác thực
  useEffect(() => {
    logger.debug('ProtectedRoute - isAuthenticated:', isAuthenticated);
    logger.debug('ProtectedRoute - isLoading:', isLoading);
    logger.debug('ProtectedRoute - current location:', location.pathname);
  }, [isAuthenticated, isLoading, location]);

  // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  if (!isAuthenticated) {
    logger.debug('ProtectedRoute - Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung của route
  logger.debug('ProtectedRoute - Rendering protected content');
  return <Outlet />;
};

export default ProtectedRoute;
