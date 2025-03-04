import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  AccountBox as AccountBoxIcon,
  ContactPage as ContactPageIcon,
  Category as CategoryIcon,
  Layers as LayersIcon,
  Business as BusinessIcon,
  ViewList as ViewListIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Receipt as ReceiptIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { MenuItem } from '../types/layout';

export const useMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubMenuToggle = (menuId: string) => {
    setOpenSubMenu(openSubMenu === menuId ? null : menuId);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { 
      text: 'Người dùng', 
      icon: <PeopleIcon />, 
      path: '/users',
      subItems: [
        { text: 'Tài khoản', icon: <AccountBoxIcon />, path: '/users/accounts' },
        { text: 'Thông tin', icon: <ContactPageIcon />, path: '/users/profiles' },
        { text: 'Vai trò', icon: <AdminPanelSettingsIcon />, path: '/users/roles' },
        { 
          text: 'Quyền hạn', 
          icon: <SecurityIcon />, 
          path: '/users/permissions'
        }
      ]
    },
    { 
      text: 'Sản phẩm', 
      icon: <InventoryIcon />, 
      path: '/products',
      subItems: [
        { text: 'Loại Sản Phẩm', icon: <CategoryIcon />, path: '/products/types' },
        { text: 'Biến Thể', icon: <LayersIcon />, path: '/products/variants' },
        { text: 'Hãng', icon: <BusinessIcon />, path: '/products/brands' },
        { text: 'Danh mục', icon: <ViewListIcon />, path: '/products/categories' }
      ]
    },
    { 
      text: 'Đặt hàng', 
      icon: <ShoppingCartIcon />, 
      path: '/orders',
      subItems: [
        { text: 'Giỏ Hàng', icon: <ShoppingBasketIcon />, path: '/orders/carts' },
        { text: 'Đơn Hàng', icon: <ReceiptIcon />, path: '/orders/orders' }
      ]
    },
    { text: 'Báo cáo', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Xác định tiêu đề trang dựa trên đường dẫn hiện tại
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/products/types')) return 'Loại Sản Phẩm';
    if (path.startsWith('/products/variants')) return 'Biến Thể Sản Phẩm';
    if (path.startsWith('/products/brands')) return 'Hãng Sản Phẩm';
    if (path.startsWith('/products/categories')) return 'Danh Mục Sản Phẩm';
    if (path.startsWith('/products')) return 'Sản phẩm';
    if (path.startsWith('/orders/carts')) return 'Giỏ Hàng';
    if (path.startsWith('/orders/orders')) return 'Đơn Hàng';
    if (path.startsWith('/orders')) return 'Đơn hàng';
    if (path.startsWith('/users/accounts')) return 'Tài khoản người dùng';
    if (path.startsWith('/users/profiles')) return 'Thông tin cá nhân người dùng';
    if (path.startsWith('/users/roles')) return 'Vai trò người dùng';
    if (path.startsWith('/users/permissions')) return 'Phân quyền người dùng';
    if (path.startsWith('/users')) return 'Người dùng';
    if (path.startsWith('/reports')) return 'Báo cáo';
    if (path.startsWith('/settings')) return 'Cài đặt';
    return 'Dashboard';
  };

  return {
    menuItems,
    openSubMenu,
    isCollapsed,
    handleSubMenuToggle,
    handleCollapseToggle,
    getPageTitle,
    navigate,
    location
  };
};
