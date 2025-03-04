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
  alpha
} from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import permissionService, { Permission } from '../../../services/permissionService';
import logger from '../../../utils/logger';
import { RoleForm, PermissionList, SelectedPermissions, AddRoleDialogProps, RoleFormData } from './roles';

const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  open,
  onClose,
  onSubmit
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
  }>({});

  // State cho tìm kiếm quyền
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State cho danh sách quyền
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Reset form khi dialog mở
  useEffect(() => {
    if (open) {
      // Reset form data
      setFormData({
        name: '',
        description: '',
        permissionIds: []
      });
      
      // Reset errors
      setErrors({});
      
      // Reset search
      setSearchQuery('');
      
      // Fetch permissions
      fetchPermissions();
    }
  }, [open]);

  // Hàm lấy danh sách quyền từ API
  const fetchPermissions = async () => {
    try {
      setLoadingPermissions(true);
      setPermissionError(null);
      
      const result = await permissionService.getPermissions({
        pageSize: 100 // Lấy tối đa 100 quyền
      });
      
      setPermissions(result.permissions);
    } catch (error) {
      logger.error('Lỗi khi tải danh sách quyền:', error);
      setPermissionError('Không thể tải danh sách quyền. Vui lòng thử lại sau.');
    } finally {
      setLoadingPermissions(false);
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Xóa lỗi khi người dùng nhập lại
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Xử lý chọn/bỏ chọn quyền
  const handleTogglePermission = (permissionId: string | number) => {
    setFormData(prev => {
      const currentPermissionIds = [...prev.permissionIds];
      const index = currentPermissionIds.indexOf(permissionId);
      
      if (index === -1) {
        // Thêm quyền nếu chưa có
        return {
          ...prev,
          permissionIds: [...currentPermissionIds, permissionId]
        };
      } else {
        // Xóa quyền nếu đã có
        currentPermissionIds.splice(index, 1);
        return {
          ...prev,
          permissionIds: currentPermissionIds
        };
      }
    });
  };

  // Xử lý tìm kiếm quyền
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPermissions();
  };

  // Lấy danh sách quyền đã chọn
  const selectedPermissions = permissions.filter(permission => 
    formData.permissionIds.includes(permission.id)
  );

  // Kiểm tra form trước khi submit
  const validateForm = (): boolean => {
    const newErrors: {name?: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên vai trò không được để trống';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = () => {
    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  // Xóa tất cả quyền đã chọn
  const handleClearAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissionIds: []
    }));
  };

  // Tìm kiếm quyền từ API
  const handleSearchPermissions = async () => {
    if (!searchQuery.trim()) {
      fetchPermissions();
      return;
    }
    
    try {
      setLoadingPermissions(true);
      setPermissionError(null);
      
      const result = await permissionService.getPermissions({
        search: searchQuery.trim(),
        pageSize: 100
      });
      
      setPermissions(result.permissions);
    } catch (error) {
      logger.error('Lỗi khi tìm kiếm quyền:', error);
      setPermissionError('Không thể tìm kiếm quyền. Vui lòng thử lại sau.');
    } finally {
      setLoadingPermissions(false);
    }
  };

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchPermissions();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.default,
        px: 3,
        py: 2,
        fontWeight: "600"
      }}>
        Thêm vai trò mới
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Thông tin cơ bản */}
          <RoleForm 
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
          
          <Divider />
          
          {/* Danh sách quyền */}
          <Box>
            <Typography 
              variant="subtitle1" 
              fontWeight="600" 
              color="primary"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
            >
              <FilterListIcon fontSize="small" />
              Danh sách quyền
            </Typography>
            
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
              onSearch={handleSearchPermissions}
            />
            
            <SelectedPermissions 
              selectedPermissions={selectedPermissions}
              onTogglePermission={handleTogglePermission}
              onClearAll={handleClearAllPermissions}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.default,
        px: 3,
        py: 2
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
          sx={{ textTransform: 'none' }}
        >
          Thêm vai trò
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRoleDialog;
