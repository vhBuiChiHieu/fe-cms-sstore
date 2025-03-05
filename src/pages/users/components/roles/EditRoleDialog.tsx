import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import permissionService, { Permission } from '../../../../services/permissionService';
import { Role } from '../../../../services/roleService';
import logger from '../../../../utils/logger';
import { RoleForm, PermissionList, SelectedPermissions } from './';
import { RoleFormData } from './types';

// Interface cho props của component EditRoleDialog
export interface EditRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onRoleUpdated?: () => void;
  role: Role | null;
  loading: boolean;
}

const EditRoleDialog: React.FC<EditRoleDialogProps> = ({
  open,
  onClose,
  onRoleUpdated,
  role,
  loading
}) => {
  const theme = useTheme();
  
  // State cho dữ liệu form
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissionIds: []
  });

  // State cho lỗi validation
  const [errors, setErrors] = useState<{
    name?: string;
    form?: string;
  }>({});

  // State cho tìm kiếm quyền
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State cho danh sách quyền
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  // State cho trạng thái đang gửi form
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Danh sách quyền đã chọn hiển thị
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

  // Lấy danh sách quyền khi component được mount
  useEffect(() => {
    fetchPermissions();
  }, []);
  
  // Cập nhật form khi vai trò được chọn thay đổi
  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        permissionIds: role.permissions ? role.permissions.map(p => p.id) : []
      });
      
      // Cập nhật danh sách quyền đã chọn
      if (role.permissions) {
        setSelectedPermissions(role.permissions);
      }
    }
  }, [role]);

  // Hàm lấy danh sách quyền từ API
  const fetchPermissions = async () => {
    try {
      setLoadingPermissions(true);
      setPermissionError(null);
      
      const result = await permissionService.getAllPermissions();
      setPermissions(result);
      
    } catch (error) {
      logger.error('Lỗi khi tải danh sách quyền:', error);
      setPermissionError('Không thể tải danh sách quyền. Vui lòng thử lại sau.');
    } finally {
      setLoadingPermissions(false);
    }
  };

  // Xử lý thay đổi giá trị trong form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Xử lý bật/tắt quyền
  const handleTogglePermission = (permissionId: string | number) => {
    const isSelected = formData.permissionIds.includes(permissionId);
    
    // Cập nhật danh sách ID quyền đã chọn
    if (isSelected) {
      setFormData((prev) => ({
        ...prev,
        permissionIds: prev.permissionIds.filter(id => id !== permissionId)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissionIds: [...prev.permissionIds, permissionId]
      }));
    }
    
    // Cập nhật danh sách quyền đã chọn để hiển thị
    const permission = permissions.find(p => p.id === permissionId);
    if (permission) {
      if (isSelected) {
        setSelectedPermissions(prev => prev.filter(p => p.id !== permissionId));
      } else {
        setSelectedPermissions(prev => [...prev, permission]);
      }
    }
  };

  // Xóa tất cả quyền đã chọn
  const handleClearAllPermissions = () => {
    setFormData((prev) => ({ ...prev, permissionIds: [] }));
    setSelectedPermissions([]);
  };

  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Xử lý xóa từ khóa tìm kiếm
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Xử lý nhấn phím trong ô tìm kiếm
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = async () => {
    try {
      setLoadingPermissions(true);
      setPermissionError(null);
      
      const result = await permissionService.getAllPermissions(searchQuery);
      setPermissions(result);
      
    } catch (error) {
      logger.error('Lỗi khi tìm kiếm quyền:', error);
      setPermissionError('Không thể tìm kiếm quyền. Vui lòng thử lại sau.');
    } finally {
      setLoadingPermissions(false);
    }
  };

  // Kiểm tra form trước khi gửi
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      form?: string;
    } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên vai trò không được để trống';
    }
    
    setErrors(newErrors);
    
    // Form hợp lệ nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý gửi form
  const handleSubmit = async () => {
    // Kiểm tra form
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Gửi form (sẽ triển khai sau khi có API)
      // Hiện tại chỉ thông báo thành công
      
      logger.debug('Cập nhật vai trò với dữ liệu:', formData);
      
      // Hiện tại chỉ giả lập thành công, API sẽ được triển khai sau
      setTimeout(() => {
        if (onRoleUpdated) {
          onRoleUpdated();
        }
        
        // Đóng dialog và reset form
        onClose();
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          permissionIds: []
        });
        setSelectedPermissions([]);
        setErrors({});
      }, 1000);
      
    } catch (error) {
      logger.error('Lỗi khi cập nhật vai trò:', error);
      setErrors({
        form: 'Đã xảy ra lỗi khi cập nhật vai trò. Vui lòng thử lại sau.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        Chỉnh sửa vai trò
      </DialogTitle>
      
      <DialogContent 
        dividers
        sx={{
          '&.MuiDialogContent-root': {
            overflowY: 'auto' // Thay đổi thành auto để cho phép cuộn khi cần thiết
          }
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            {/* Cột trái: Thông tin vai trò */}
            <Box sx={{ flex: '1 1 40%', minWidth: '250px' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Thông tin vai trò
              </Typography>
              
              <RoleForm 
                formData={formData}
                errors={errors}
                onChange={handleFormChange}
              />
              
              {/* Hiển thị danh sách quyền đã chọn */}
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
                <SelectedPermissions 
                  selectedPermissions={selectedPermissions}
                  onTogglePermission={handleTogglePermission}
                  onClearAll={handleClearAllPermissions}
                />
              </Box>
            </Box>
            
            {/* Đường phân cách */}
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <Divider sx={{ display: { xs: 'block', md: 'none' }, my: 2 }} />
            
            {/* Cột phải: Danh sách quyền */}
            <Box sx={{ flex: '1 1 60%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Danh sách quyền
                </Typography>
                
                <FilterListIcon color="action" />
              </Box>
              
              <PermissionList 
                permissions={permissions}
                selectedPermissionIds={formData.permissionIds}
                searchQuery={searchQuery}
                loadingPermissions={loadingPermissions}
                permissionError={permissionError}
                onTogglePermission={handleTogglePermission}
                onSearchChange={handleSearchChange}
                onClearSearch={handleClearSearch}
                onSearchKeyDown={handleSearchKeyDown}
                onSearch={handleSearch}
              />
            </Box>
          </Box>
        )}
        
        {errors.form && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${theme.palette.error.main}`,
              borderRadius: 1
            }}
          >
            <Typography color="error">{errors.form}</Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={submitting}
        >
          Hủy
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={submitting || loading}
        >
          {submitting ? 'Đang cập nhật...' : 'Cập nhật vai trò'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRoleDialog;
