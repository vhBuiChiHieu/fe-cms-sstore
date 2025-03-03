//cSpell:disable
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Collapse,
  CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
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
  Home as HomeIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileDialog from '../components/ProfileDialog';
import CartMenu from '../components/CartMenu';
import accountService, { UserProfile } from '../services/accountService';
import cartService from '../services/cartService';
import permissionService, { Permission } from '../services/permissionService';
import logger from '../utils/logger';
import { BASE_URL } from '../utils/config';
import axios from 'axios';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

interface DynamicSubMenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface SubMenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  dynamicSubItems?: DynamicSubMenuItem[];
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  subItems?: SubMenuItem[];
}

interface MainLayoutProps {
  window?: () => Window;
}

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { window } = props;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(0);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState<boolean>(false);

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

  // Lấy số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const result = await cartService.getCarts({ pageIndex: 1, pageSize: 1 });
        setCartCount(result.totalCount);
      } catch (error) {
        logger.error('Lỗi khi tải số lượng giỏ hàng:', error);
      }
    };

    fetchCartCount();
    // Có thể thêm interval để cập nhật số lượng giỏ hàng định kỳ
    const interval = setInterval(fetchCartCount, 60000); // Cập nhật mỗi phút
    
    return () => clearInterval(interval);
  }, []);

  // Lấy danh sách quyền hạn
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoadingPermissions(true);
        const result = await permissionService.getPermissions({ pageIndex: 1, pageSize: 100 });
        setPermissions(result.permissions);
      } catch (error) {
        logger.error('Lỗi khi tải danh sách quyền hạn:', error);
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSubMenuToggle = (menuId: string) => {
    setOpenSubMenu(openSubMenu === menuId ? null : menuId);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCartMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCartMenuClose = () => {
    setCartAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleProfileClick = () => {
    handleMenuClose();
    setProfileDialogOpen(true);
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

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%' }}>
          <HomeIcon 
            sx={{ 
              color: 'primary.main', 
              mr: isCollapsed ? 0 : 1, 
              fontSize: isCollapsed ? 32 : 28,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.7 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.7 }
              },
              filter: isCollapsed ? 'drop-shadow(0 0 3px #2196F3)' : 'none'
            }} 
          />
          {!isCollapsed && (
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
                fontSize: '1.3rem'
              }}
            >
              S-STORE CMS
            </Typography>
          )}
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <Tooltip title={isCollapsed ? item.text : ""} placement="right" arrow>
                <ListItemButton 
                  onClick={() => {
                    if (item.subItems) {
                      if (!isCollapsed) {
                        handleSubMenuToggle(item.text);
                      } else {
                        navigate(item.path);
                      }
                    } else {
                      navigate(item.path);
                    }
                  }}
                  selected={
                    item.path === '/' 
                      ? location.pathname === '/' 
                      : location.pathname.startsWith(item.path)
                  }
                  sx={{ 
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 1 : 2
                  }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <>
                      <ListItemText primary={item.text} />
                      {item.subItems && (
                        openSubMenu === item.text ? <ExpandLessIcon /> : <ExpandMoreIcon />
                      )}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            {item.subItems && !isCollapsed && (
              <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <React.Fragment key={subItem.text}>
                      <ListItem disablePadding>
                        <ListItemButton 
                          onClick={() => {
                            if ('dynamicSubItems' in subItem && subItem.dynamicSubItems) {
                              handleSubMenuToggle(subItem.text);
                            } else {
                              navigate(subItem.path);
                            }
                          }}
                          selected={location.pathname.startsWith(subItem.path)}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText primary={subItem.text} />
                          {'dynamicSubItems' in subItem && subItem.dynamicSubItems && (
                            openSubMenu === subItem.text ? <ExpandLessIcon /> : <ExpandMoreIcon />
                          )}
                        </ListItemButton>
                      </ListItem>
                      
                      {/* Hiển thị danh sách quyền hạn động */}
                      {'dynamicSubItems' in subItem && subItem.dynamicSubItems && (
                        <Collapse in={openSubMenu === subItem.text} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {subItem.dynamicSubItems.map((dynamicItem: DynamicSubMenuItem) => (
                              <ListItem key={dynamicItem.text} disablePadding>
                                <ListItemButton 
                                  onClick={() => navigate(dynamicItem.path)}
                                  selected={location.pathname.startsWith(dynamicItem.path) && location.search.includes(dynamicItem.path.split('?')[1] || '')}
                                  sx={{ pl: 6 }}
                                >
                                  <ListItemIcon>
                                    {dynamicItem.icon}
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={dynamicItem.text} 
                                    primaryTypographyProps={{ 
                                      noWrap: true, 
                                      sx: { fontSize: '0.85rem' } 
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  const currentDrawerWidth = isCollapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          boxShadow: 1,
          transition: 'width 0.2s, margin-left 0.2s'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="toggle drawer collapse"
            onClick={handleCollapseToggle}
            sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getPageTitle()}
          </Typography>
          <IconButton 
            color="inherit"
            onClick={handleCartMenuOpen}
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                userProfile?.firstName 
                  ? userProfile.firstName.charAt(0) 
                  : user?.name 
                    ? user.name.charAt(0) 
                    : 'A'
              )}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Hồ sơ</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Đăng xuất</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { sm: currentDrawerWidth }, 
          flexShrink: { sm: 0 },
          transition: 'width 0.2s'
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              transition: 'width 0.2s'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              transition: 'width 0.2s'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` }, 
          mt: '64px',
          transition: 'width 0.2s'
        }}
      >
        <Outlet />
      </Box>
      <ProfileDialog 
        open={profileDialogOpen} 
        onClose={() => setProfileDialogOpen(false)} 
      />
      <CartMenu
        anchorEl={cartAnchorEl}
        onClose={handleCartMenuClose}
      />
    </Box>
  );
};

export default MainLayout;
