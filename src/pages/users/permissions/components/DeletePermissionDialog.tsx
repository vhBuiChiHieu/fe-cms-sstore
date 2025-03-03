import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import permissionService, { Permission } from '../../../../services/permissionService';

interface DeletePermissionDialogProps {
  open: boolean;
  permission: Permission | null;
  onClose: () => void;
  onPermissionDeleted: () => void;
}

const DeletePermissionDialog: React.FC<DeletePermissionDialogProps> = ({
  open,
  permission,
  onClose,
  onPermissionDeleted
}) => {
  // Dialog state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Handle close
  const handleClose = () => {
    setError('');
    onClose();
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!permission) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await permissionService.deletePermission(permission.id);
      
      if (success) {
        onPermissionDeleted();
      } else {
        setError('Không thể xóa quyền hạn. Vui lòng thử lại sau.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi xóa quyền hạn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!permission) {
    return null;
  }
  
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Xác nhận xóa quyền hạn</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa quyền hạn sau không?
          </Typography>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1">
              <strong>Mã quyền:</strong> {permission.name}
            </Typography>
            {permission.description && (
              <Typography variant="body2" color="text.secondary">
                <strong>Mô tả:</strong> {permission.description}
              </Typography>
            )}
          </Box>
          
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác. Việc xóa quyền hạn có thể ảnh hưởng đến các vai trò và người dùng đang sử dụng quyền hạn này.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="inherit"
          disabled={loading}
        >
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Đang xóa...' : 'Xóa quyền hạn'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePermissionDialog;
