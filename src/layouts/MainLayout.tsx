import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Menu, MenuItem, Badge, Tooltip, Collapse, CircularProgress } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon, Inventory as InventoryIcon, Assessment as AssessmentIcon, Settings as SettingsIcon, Notifications as NotificationsIcon, Logout as LogoutIcon, Person as PersonIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, AccountBox as AccountBoxIcon, ContactPage as ContactPageIcon, Category as CategoryIcon, Layers as LayersIcon, Business as BusinessIcon, ViewList as ViewListIcon, Receipt as ReceiptIcon, AdminPanelSettings as AdminPanelSettingsIcon, Security as SecurityIcon, Home as HomeIcon, VpnKey as VpnKeyIcon } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileDialog from '../components/ProfileDialog';
import CartMenu from '../components/CartMenu';
import accountService, { UserProfile } from '../services/accountService';
import cartService from '../services/cartService';
import permissionService, { Permission } from '../services/permissionService';
import logger from '../utils/logger';
import { BASE_URL } from '../utils/config';
import axiosInstance from '../utils/axiosInstance';
import { getToken } from '../utils/authUtils';

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
  const { user, logout, isAuthenticated, updateUserFromProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState<boolean>(false);
  const [initialized, setInitialized] = useState(false);
  const loadAvatar = async () => {
    if (avatarUrl) {
      return;
    }
    
    const token = getToken();
    if (!token) {
      logout();
      return;
    }
    
    const userProfile = await accountService.getProfile().catch(() => null);
    if (!userProfile) {
      return;
    }
    
    const avatarName = userProfile.avatar || 'default-avatar.png';
    
    try {
      const imgUrl = `${BASE_URL}/api/file/${avatarName}`;
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', imgUrl, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.responseType = 'blob';
        
        xhr.onload = function() {
          if (this.status === 200) {
            const url = URL.createObjectURL(this.response);
            setAvatarUrl(url);
            resolve(url);
          } else {
            reject(new Error(`HTTP error ${this.status}`));
          }
        };
        
        xhr.onerror = function(e) {
          reject(e);
        };
        
        xhr.send();
      });
    } catch (e) {
      logger.error('Lỗi khi tải avatar:', e);
    }
  };
  
  useEffect(() => {
    const loadAvatarOnce = async () => {
      await loadAvatar();
    };
    
    loadAvatarOnce();
  }, []);
  
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    
    if (initialized) {
      return;
    }
    
    setInitialized(true);
    
    let isMounted = true;
    
    const fetchProfile = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          const data = await accountService.getProfile();
          
          if (isMounted && data) {
            
            updateUserFromProfile(data);
            
            setUserProfile(data);
            const force = true;
            if (data.avatar || force) {
              const avatarName = data.avatar || 'avatar.jpeg';
              
              try {
                const avatarEndpoint = `/api/file/${avatarName}`;
                
                let token = null;
                try {
                  const authStateString = localStorage.getItem('authState');
                  
                  if (authStateString) {
                    const authState = JSON.parse(authStateString);
                    token = authState.token;
                  }
                } catch (e) {
                }
                
                if (!token) {
                  logout();
                  return;
                }
                const response = await axios.get(`${BASE_URL}${avatarEndpoint}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  },
                  responseType: 'blob'
                });
                
                if (isMounted) {
                  const url = URL.createObjectURL(response.data);
                  setAvatarUrl(url);
                }
              } catch (error) {
                if (isMounted) {
                  setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName || '')}+${encodeURIComponent(data.lastName || '')}&background=random`);
                }
              }
            } else {
              if (isMounted) {
                setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName || '')}+${encodeURIComponent(data.lastName || '')}&background=random`);
              }
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          logger.error('Lỗi khi tải thông tin profile:', err);
          
          const mockUserProfile = {
            id: 1,
            email: 'admin@admin.com',
            firstName: 'Admin',
            lastName: 'User',
            fullName: 'Admin User',
            roles: [{ id: 1, name: 'ADMIN' }],
            status: 1,
            mail: 'admin@admin.com',
            dateOfBirth: '1990-01-01',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setUserProfile(mockUserProfile);
          setAvatarUrl('https://ui-avatars.com/api/?name=Admin+User&background=random');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
    
    return () => {
      isMounted = false;
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [isAuthenticated, initialized, updateUserFromProfile]);

  useEffect(() => {
    if (isAuthenticated && initialized) {
      const fetchCartCount = async () => {
        try {
          const result = await cartService.getCarts({ pageIndex: 1, pageSize: 1 });
          setCartCount(result.totalCount);
        } catch (error) {
          logger.error('Lỗi khi tải số lượng giỏ hàng:', error);
        }
      };

      fetchCartCount();
    }
  }, [isAuthenticated, initialized]);

  useEffect(() => {
    if (isAuthenticated && initialized) {
      const fetchPermissions = async () => {
        try {
          const result = await permissionService.getPermissions({ pageIndex: 1, pageSize: 100 });
          setPermissions(result.permissions);
        } catch (error) {
          logger.error('Lỗi khi tải danh sách quyền hạn:', error);
        }
      };

      fetchPermissions();
    }
  }, [isAuthenticated, initialized]);

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
      text: 'Đơn hàng', 
      icon: <ReceiptIcon />, 
      path: '/orders',
      subItems: [
        { text: 'Giỏ Hàng', icon: <ReceiptIcon />, path: '/orders/carts' },
        { text: 'Đơn Hàng', icon: <ReceiptIcon />, path: '/orders/orders' }
      ]
    },
    { text: 'Báo cáo', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' },
  ];


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
                fontSize: '1.3rem',
                textAlign: 'center'
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
            PaperProps={{
              sx: (theme) => ({
                minWidth: '280px',
                boxShadow: '0 6px 25px rgba(0,0,0,0.12)',
                mt: 1.5,
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                overflow: 'hidden',
                animation: 'fadeIn 0.3s ease-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(-10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' }
                }
              })
            }}
          >
            <Box sx={(theme) => ({ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: `linear-gradient(to bottom, ${theme.palette.primary.light}15, ${theme.palette.background.paper})` 
            })}>
              <Avatar sx={(theme) => ({ 
                width: 70, 
                height: 70, 
                mb: 2, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                border: `2px solid ${theme.palette.background.paper}`,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              })}>
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
              <Typography variant="subtitle1" sx={(theme) => ({ 
                fontWeight: 'bold', 
                textAlign: 'center',
                fontSize: '1.1rem',
                color: theme.palette.text.primary
              })}>
                {userProfile?.firstName && userProfile?.lastName 
                  ? `${userProfile.firstName} ${userProfile.lastName}`
                  : userProfile?.firstName || userProfile?.lastName
                    ? userProfile.firstName || userProfile.lastName
                    : user?.name || 'Người dùng'}
              </Typography>
              <Typography variant="body2" sx={(theme) => ({ 
                textAlign: 'center', 
                mb: 1.5, 
                wordBreak: 'break-word',
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
                maxWidth: '90%'
              })}>
                {userProfile?.email || user?.email || 'Chưa có email'}
              </Typography>
            </Box>
            <MenuItem onClick={handleProfileClick} sx={(theme) => ({
              py: 1.5,
              mx: 1,
              my: 0.5,
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: `${theme.palette.primary.light}20`
              }
            })}>
              <ListItemIcon sx={{ color: 'primary.main' }}>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Hồ sơ" primaryTypographyProps={{ fontWeight: 500 }} />
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={(theme) => ({
              py: 1.5,
              mx: 1,
              my: 0.5,
              mb: 1,
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: `${theme.palette.error.light}20`
              }
            })}>
              <ListItemIcon sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" primaryTypographyProps={{ fontWeight: 500 }} />
            </MenuItem>
          </Menu>
          <Menu
            anchorEl={cartAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(cartAnchorEl)}
            onClose={handleCartMenuClose}
          >
            <MenuItem>Chức năng giỏ hàng đang phát triển</MenuItem>
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
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
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
