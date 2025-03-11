import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import AccountsPage from '../pages/users/AccountsPage';
import CategoriesPage from '../pages/products/categories/CategoriesPage';
import RolesPage from '../pages/users/RolesPage';
import PermissionsPage from '../pages/users/PermissionsPage';
import logger from '../utils/logger';
import CartsPage from '../pages/orders/carts/CartsPage';
import ProductTypesPage from '../pages/products/types/ProductTypesPage';
import OrdersPage from '../pages/orders/orders/OrdersPage';

const AppRoutes: React.FC = () => {
  logger.debug('Rendering AppRoutes');
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Các route được bảo vệ */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Trang chủ chuyển hướng đến dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Routes sản phẩm */}
          <Route path="products">
            <Route index element={<div>Trang Sản phẩm</div>} />
            <Route path="types" element={<ProductTypesPage />} />
            <Route path="variants" element={<div>Trang Biến thể</div>} />
            <Route path="brands" element={<div>Trang Hãng</div>} />
            <Route path="categories" element={<CategoriesPage />} />
          </Route>
          
          <Route path="orders">
            <Route index element={<Navigate to="/orders/orders" replace />} />
            <Route path="carts" element={<CartsPage />} />
            <Route path="orders" element={<React.Suspense fallback={<div>Đang tải...</div>}>
              <OrdersPage />
            </React.Suspense>} />
          </Route>
          
          {/* Routes người dùng */}
          <Route path="users">
            <Route index element={<Navigate to="/users/accounts" replace />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="profiles" element={<div>Trang Thông tin cá nhân người dùng</div>} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="permissions" element={<PermissionsPage />} />
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
