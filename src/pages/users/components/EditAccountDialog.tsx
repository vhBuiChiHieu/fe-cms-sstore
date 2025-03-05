import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Chip,
  SelectChangeEvent,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  HighlightOff as HighlightOffIcon
} from '@mui/icons-material';
import { Role } from '../../../services/roleService';

interface EditAccountDialogProps {
  open: boolean;
  onClose: () => void;
  account: {
    id: string;
    email: string;
    status: number;
    selectedRoles: Role[];
  } | null;
  roles: Role[];
  loading: boolean;
  profileLoading: boolean;
  submitting: boolean;
  onStatusChange: (event: SelectChangeEvent) => void;
  onRoleChange: (event: SelectChangeEvent<string[]>) => void;
  onSubmit: () => void;
  onAccountUpdated?: () => void;
}

const EditAccountDialog: React.FC<EditAccountDialogProps> = ({
  open,
  onClose,
  account,
  roles,
  loading,
  profileLoading,
  submitting,
  onStatusChange,
  onRoleChange,
  onSubmit,
  onAccountUpdated
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  // Cập nhật selectedRoleIds khi account thay đổi (mở dialog hoặc thay đổi account từ bên ngoài)
  useEffect(() => {
    if (account && account.selectedRoles) {
      // Đảm bảo lấy đúng danh sách role IDs từ selectedRoles
      const roleIds = account.selectedRoles.map(role => role.id);
      
      // Luôn cập nhật khi dialog mở hoặc account thay đổi
      setSelectedRoleIds(roleIds);
      console.log('Selected roles from account updated:', account.selectedRoles);
      console.log('Set selected role IDs:', roleIds);
    }
  }, [account, open]);
  
  // Debug để theo dõi thay đổi của selectedRoleIds
  useEffect(() => {
    console.log('selectedRoleIds updated:', selectedRoleIds);
  }, [selectedRoleIds]);

  if (!account) return null;

  // Lọc danh sách vai trò theo tìm kiếm
  const filteredRoles = roles.filter(role => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    return (
      role.name.toLowerCase().includes(query) ||
      (role.description && role.description.toLowerCase().includes(query))
    );
  });

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Xử lý chọn/bỏ chọn vai trò
  const handleToggleRole = (roleId: string) => {
    // Tạo bản sao của mảng để tránh thay đổi trực tiếp state
    const currentSelectedRoles = [...selectedRoleIds];
    const index = currentSelectedRoles.indexOf(roleId);
    
    let newSelectedRoles: string[];
    if (index === -1) {
      // Thêm vai trò nếu chưa có
      newSelectedRoles = [...currentSelectedRoles, roleId];
    } else {
      // Xóa vai trò nếu đã có
      currentSelectedRoles.splice(index, 1);
      newSelectedRoles = currentSelectedRoles;
    }
    
    // Cập nhật state trong component
    setSelectedRoleIds(newSelectedRoles);
    console.log('Toggled role:', roleId, 'New selected roles:', newSelectedRoles);
    
    // Gọi callback để cập nhật state trong component cha
    // Tạo event giả để gọi hàm onRoleChange
    const fakeEvent = {
      target: {
        value: newSelectedRoles,
        name: 'roles'
      }
    } as unknown as SelectChangeEvent<string[]>;
    
    // Đảm bảo thông tin mới nhất được truyền lên component cha
    onRoleChange(fakeEvent);
  };

  // Xóa tất cả vai trò đã chọn
  const handleClearAllRoles = () => {
    setSelectedRoleIds([]);
    
    // Tạo event giả để gọi hàm onRoleChange
    const fakeEvent = {
      target: {
        value: [] as string[],
        name: 'roles'
      }
    } as unknown as SelectChangeEvent<string[]>;
    
    onRoleChange(fakeEvent);
  };

  // Lấy danh sách vai trò đã chọn
  const selectedRoles = roles.filter(role => selectedRoleIds.includes(role.id));

  // Hiển thị tên vai trò dễ đọc
  const getRoleDisplayName = (roleName: string) => {
    // Trả về tên vai trò trực tiếp từ dữ liệu API
    return roleName;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        bgcolor: '#f8f9fa',
        px: 3,
        py: 2,
        fontWeight: "600"
      }}>
        Chỉnh sửa tài khoản
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {profileLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Email: <strong>{account.email}</strong>
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Trạng thái</InputLabel>
              <Select
                labelId="status-select-label"
                value={account.status.toString()}
                label="Trạng thái"
                onChange={onStatusChange}
                disabled={loading}
              >
                <MenuItem value="0">Hoạt động</MenuItem>
                <MenuItem value="1">Chưa kích hoạt</MenuItem>
                <MenuItem value="2">Đã khóa</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 3 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="600" 
                color="primary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <FilterListIcon fontSize="small" />
                Danh sách vai trò
              </Typography>
              
              {/* Thanh tìm kiếm vai trò */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mb: 2,
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <TextField
                  placeholder="Tìm kiếm vai trò..."
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearchChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClearSearch}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              
              {/* Danh sách vai trò */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  maxHeight: 200, 
                  overflow: 'auto', 
                  mb: 2,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <List dense sx={{ p: 0 }}>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <ListItem 
                        key={role.id} 
                        dense 
                        disablePadding
                        divider
                      >
                        <ListItemButton 
                          onClick={() => handleToggleRole(role.id)}
                          sx={{
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.05)
                            },
                            ...(selectedRoleIds.includes(role.id) && {
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.12)
                              }
                            })
                          }}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={selectedRoleIds.includes(role.id)}
                              onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ListItemButton
                              onChange={(e) => {
                                e.stopPropagation();
                                handleToggleRole(role.id);
                              }}
                              tabIndex={-1}
                              disableRipple
                              color="primary"
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography 
                                variant="body2" 
                                fontWeight={selectedRoleIds.includes(role.id) ? 600 : 400}
                              >
                                {getRoleDisplayName(role.name)}
                              </Typography>
                            }
                            secondary={
                              role.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {role.description}
                                </Typography>
                              )
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText 
                        primary={
                          searchQuery 
                            ? "Không tìm thấy vai trò nào phù hợp" 
                            : "Không có vai trò nào"
                        } 
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
              
              {/* Vai trò đã chọn */}
              <Box 
                sx={{ 
                  mt: 2,
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="600">
                    Vai trò đã chọn ({selectedRoles.length})
                  </Typography>
                  
                  {selectedRoles.length > 0 && (
                    <Button 
                      size="small" 
                      onClick={handleClearAllRoles}
                      color="error"
                      variant="outlined"
                      startIcon={<HighlightOffIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </Box>
                
                {selectedRoles.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {selectedRoles.map(role => (
                      <Chip
                        key={role.id}
                        label={getRoleDisplayName(role.name)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        onDelete={() => handleToggleRole(role.id)}
                        sx={{ 
                          borderRadius: '4px',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Chưa chọn vai trò nào
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit"
          sx={{ borderRadius: 1, mr: 1 }}
        >
          Hủy
        </Button>
        <Button
          onClick={() => {
            onSubmit();
            if (onAccountUpdated) {
              onAccountUpdated();
            }
          }}
          variant="contained"
          color="primary"
          disabled={submitting || profileLoading}
          sx={{ borderRadius: 1 }}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccountDialog;
