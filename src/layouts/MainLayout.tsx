//cSpell:disable
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  
  // Không cần kiểm tra trạng thái xác thực ở đây vì ProtectedRoute đã làm việc này
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login');
  //   }
  // }, [isAuthenticated, navigate]);

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
  
  // Flag để kiểm soát việc gọi API
  const [initialized, setInitialized] = useState(false);

  // Fetch profile khi component mount - chỉ chạy một lần khi đã xác thực
  // Hàm riêng để tải avatar, có thể gọi bất cứ lúc nào
  // Thử nhiều cách khác nhau để tải avatar
  const loadAvatar = async () => {
    console.log('======= THỬ TẢI AVATAR RIÊNG =======');
    // Sử dụng token test đã biết có hoạt động
    const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpZCI6MSwidHlwZSI6IkFDQ0VTUyIsImlhdCI6MTc0MDk2OTg0OSwiZXhwIjoxNzQ5NjA5ODQ5fQ.yS8s_o8cZdBTM8Jiq6FzFJ8COdsq2PVyoSuBb9JcpsfnlpIxXYLRnivGvqIgywT_";
    const avatarName = 'avatar.jpeg';
    
    // Tạo thẻ hình ảnh và thêm vào DOM để test
    console.log('0. Tạo ngay một thẻ hình ảnh để test trước');
    const imgUrl = `${BASE_URL}/api/file/${avatarName}`;
    
    // Thêm trực tiếp vào trang - cách này có thể hoạt động tốt hơn với CORS
    console.log('0a. Thử tạo hình ảnh bằng XHR...');
    setTimeout(() => {
      const testImg = document.createElement('img');
      testImg.style.width = '50px';
      testImg.style.height = '50px';
      testImg.style.position = 'fixed';
      testImg.style.top = '10px';
      testImg.style.right = '10px';
      testImg.style.zIndex = '9999';
      testImg.style.border = '2px solid red';
      testImg.crossOrigin = 'anonymous';
      
      // Thêm headers 
      const xhr = new XMLHttpRequest();
      xhr.open('GET', imgUrl, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.responseType = 'blob';
      xhr.onload = function() {
        console.log('0c. XHR status:', this.status);
        if (this.status === 200) {
          const url = URL.createObjectURL(this.response);
          testImg.src = url;
          document.body.appendChild(testImg);
          console.log('0d. Đã thêm hình ảnh vào DOM và tạo URL:', url);
        }
      };
      xhr.onerror = function(e) {
        console.error('0e. XHR error:', e);
      };
      console.log('0b. Gọi XHR send...');
      xhr.send();
    }, 1000); // Chờ 1 giây để đảm bảo DOM đã sẵn sàng
    
    try {
      console.log('1. Tải avatar:', `${BASE_URL}/api/file/${avatarName}`);
      const response = await fetch(`${BASE_URL}/api/file/${avatarName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        mode: 'cors' // Thử với CORS
      });
      
      console.log('2. Trạng thái response:', response.status);
      if (response.ok) {
        const blob = await response.blob();
        console.log('3. Đã tải xong, kích thước:', blob.size);
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
        console.log('4. Đã tạo URL cho avatar:', url);
      }
    } catch (e) {
      console.error('Lỗi khi tải avatar:', e);
    }
  };
  
  // Effect chính để tải profile
  useEffect(() => {
    console.log('useEffect fetchProfile - isAuthenticated:', isAuthenticated, 'initialized:', initialized);
    
    // Thử tải avatar độc lập với profile
    loadAvatar();
    
    // Chỉ gọi API khi đã xác thực
    if (!isAuthenticated) {
      return;
    }
    
    // Tránh gọi nhiều lần
    if (initialized) {
      console.log('Profile đã được tải trước đó');
      return;
    }
    
    // Đánh dấu đã khởi tạo
    setInitialized(true);
    console.log('Bắt đầu tải profile...');
    
    // Sử dụng biến cờ để đảm bảo chỉ gọi API một lần
    let isMounted = true;
    
    const fetchProfile = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          console.log('===============================================');
          console.log('FETCHING PROFILE...');
          const data = await accountService.getProfile();
          console.log('PROFILE DATA:', JSON.stringify(data, null, 2));
          console.log('AVATAR VALUE:', data?.avatar);
          console.log('===============================================');
          
          if (isMounted && data) {
            // Cập nhật thông tin vào context và lưu vào localStorage
            updateUserFromProfile(data);
            
            // Lưu vào state của component để dùng
            setUserProfile(data);
            
            // Ghi log rõ trước khi kiểm tra avatar
            console.log('============== CHECKING AVATAR =============');
            console.log('data.avatar type:', typeof data.avatar);
            console.log('data.avatar value:', data.avatar);
            
            // Nếu có avatar hoặc dùng force=true để luôn gọi API
            const force = true; // Set false nếu chỉ muốn gọi khi có avatar
            if (data.avatar || force) {
              // Sử dụng avatar thật hoặc mặc định nếu test
              const avatarName = data.avatar || 'avatar.jpeg';
              console.log('========= BẮT ĐẦU LOGIC TẢI AVATAR =========');
              
              try {
                // Cấu hình URL và các tham số gọi API
                const avatarEndpoint = `/api/file/${avatarName}`;
                console.log('1. Đang tải avatar từ:', BASE_URL + avatarEndpoint);
                
                // Sử dụng axios trực tiếp với token rõ ràng để tránh vấn đề với axiosInstance
                let token = null;
                try {
                  const authStateString = localStorage.getItem('authState');
                  console.log('2a. authStateString:', authStateString);
                  
                  if (authStateString) {
                    const authState = JSON.parse(authStateString);
                    console.log('2b. authState:', authState);
                    token = authState.token;
                  }
                } catch (e) {
                  console.error('2c. Lỗi khi phân tích authState:', e);
                }
                
                console.log('2d. Token có sẵn:', !!token);
                
                // Token cụ thể cho test
                if (!token) {
                  console.log('2e. Sử dụng token test');
                  token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpZCI6MSwidHlwZSI6IkFDQ0VTUyIsImlhdCI6MTc0MDk2OTg0OSwiZXhwIjoxNzQ5NjA5ODQ5fQ.yS8s_o8cZdBTM8Jiq6FzFJ8COdsq2PVyoSuBb9JcpsfnlpIxXYLRnivGvqIgywT_";
                }
                
                // In ra URL và token
                console.log('2f. Full URL:', `${BASE_URL}${avatarEndpoint}`);
                console.log('2g. Authorization:', `Bearer ${token.substring(0, 15)}...`);
                
                // Bước quan trọng: gọi trực tiếp fetch API thay vì dùng axios
                console.log('3. Bắt đầu gọi API...');
                
                // Cố gỏi bằng cả hai cách: axios và fetch
                console.log('3a. Gọi bằng axios...');
                const response = await axios.get(`${BASE_URL}${avatarEndpoint}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  },
                  responseType: 'blob'
                });
                
                console.log('3b. Cũng thử gọi bằng fetch...');
                fetch(`${BASE_URL}${avatarEndpoint}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }).then(r => console.log('Fetch response:', r.status))
                  .catch(e => console.log('Fetch error:', e));
                
                console.log('3. API trả về thành công');
                console.log('4. Response type:', response.data.type);
                console.log('5. Response size:', response.data.size, 'bytes');
                
                // Tạo URL từ blob
                if (isMounted) {
                  const url = URL.createObjectURL(response.data);
                  console.log('6. Avatar URL created:', url);
                  setAvatarUrl(url);
                }
              } catch (error) {
                console.error('Lỗi khi tải avatar:', error);
                // Sử dụng avatar mặc định nếu không tải được avatar từ API
                if (isMounted) {
                  console.log('Sử dụng avatar mặc định cho:', data.firstName, data.lastName);
                  setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName || '')}+${encodeURIComponent(data.lastName || '')}&background=random`);
                }
              }
            } else {
              // Sử dụng avatar mặc định nếu không có avatar
              if (isMounted) {
                console.log('Không có avatar, sử dụng mặc định');
                setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName || '')}+${encodeURIComponent(data.lastName || '')}&background=random`);
              }
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          logger.error('Lỗi khi tải thông tin profile:', err);
          
          // Sử dụng dữ liệu mặc định nếu không tải được profile
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
    
    // Cleanup URL và ngăn chặn các API calls khi component unmount
    return () => {
      isMounted = false;
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [isAuthenticated, initialized, updateUserFromProfile]); // Phụ thuộc vào trạng thái xác thực và trạng thái đã khởi tạo

  // Lấy số lượng sản phẩm trong giỏ hàng - chỉ chạy một lần khi đã xác thực
  useEffect(() => {
    console.log('useEffect fetchCartCount - isAuthenticated:', isAuthenticated, 'initialized:', initialized);
    
    // Tạm thời không gọi API giỏ hàng để tránh vấn đề
    return;
    
    // Chỉ gọi API khi đã xác thực và đã khởi tạo
    if (!isAuthenticated || !initialized) {
      return;
    }
    
    let isMounted = true;
    
    const fetchCartCount = async () => {
      try {
        if (isMounted) {
          console.log('Fetching cart count...');
          const result = await cartService.getCarts({ pageIndex: 1, pageSize: 1 });
          console.log('Cart count result:', result);
          setCartCount(result.totalCount);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Lỗi khi tải số lượng giỏ hàng:', error);
          logger.error('Lỗi khi tải số lượng giỏ hàng:', error);
        }
      }
    };

    fetchCartCount();
    
    // Cleanup function để tránh memory leak và gọi API khi component unmount
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, initialized]); // Phụ thuộc vào trạng thái xác thực và trạng thái đã khởi tạo



  // Lấy danh sách quyền hạn - chỉ chạy một lần khi đã xác thực
  useEffect(() => {
    console.log('useEffect fetchPermissions - isAuthenticated:', isAuthenticated, 'initialized:', initialized);
    
    // Tạm thời không gọi API quyền hạn để tránh vấn đề
    return;
    
    // Chỉ gọi API khi đã xác thực và đã khởi tạo
    if (!isAuthenticated || !initialized) {
      return;
    }
    
    let isMounted = true;
    
    const fetchPermissions = async () => {
      try {
        if (isMounted) {
          console.log('Fetching permissions...');
          setLoadingPermissions(true);
          const result = await permissionService.getPermissions({ pageIndex: 1, pageSize: 100 });
          console.log('Permissions result:', result);
          if (isMounted) {
            setPermissions(result.permissions);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Lỗi khi tải danh sách quyền hạn:', error);
          logger.error('Lỗi khi tải danh sách quyền hạn:', error);
        }
      } finally {
        if (isMounted) {
          setLoadingPermissions(false);
        }
      }
    };

    fetchPermissions();
    
    // Cleanup function để tránh memory leak và gọi API khi component unmount
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, initialized]); // Phụ thuộc vào trạng thái xác thực và trạng thái đã khởi tạo

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
