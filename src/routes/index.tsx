import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import AccountsPage from '../pages/users/AccountsPage';

const AppRoutes: React.FC = () => {
  console.log('Rendering AppRoutes');
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Các route được bảo vệ */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Trang chủ chuyển hướng đến dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<div>Trang Sản phẩm</div>} />
          <Route path="orders" element={<div>Trang Đơn hàng</div>} />
          
          {/* Routes người dùng */}
          <Route path="users">
            <Route index element={<Navigate to="/users/accounts" replace />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="profiles" element={<div>Trang Thông tin cá nhân người dùng</div>} />
          </Route>
          
          <Route path="reports" element={<div>Trang Báo cáo</div>} />
          <Route path="settings" element={<div>Trang Cài đặt</div>} />
        </Route>
      </Route>
      
      {/* Trang 404 Not Found */}
      <Route path="404" element={<NotFound />} />
      
      {/* Chuyển hướng các route không hợp lệ đến trang 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
