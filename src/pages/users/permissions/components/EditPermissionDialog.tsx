import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  FormHelperText,
  Alert
} from '@mui/material';
import permissionService, { Permission } from '../../../../services/permissionService';

interface EditPermissionDialogProps {
  open: boolean;
  permission: Permission | null;
  onClose: () => void;
  onPermissionUpdated: () => void;
}

const EditPermissionDialog: React.FC<EditPermissionDialogProps> = ({
  open,
  permission,
  onClose,
  onPermissionUpdated
}) => {
  // Form state
  const [description, setDescription] = useState<string>('');
  
  // Dialog state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Load permission data when dialog opens
  useEffect(() => {
    if (permission) {
      setDescription(permission.description || '');
    }
  }, [permission]);
  
  // Reset form
  const resetForm = () => {
    setDescription('');
    setError('');
  };
  
  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // Handle submit
  const handleSubmit = async () => {
    if (!permission) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await permissionService.updatePermission(permission.id, {
        description: description.trim()
      });
      
      if (success) {
        resetForm();
        onPermissionUpdated();
      } else {
        setError('Không thể cập nhật quyền hạn. Vui lòng thử lại sau.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi cập nhật quyền hạn. Vui lòng thử lại sau.');
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
      <DialogTitle>Chỉnh sửa quyền hạn</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            label="Mã quyền"
            fullWidth
            value={permission.name || ''}
            margin="normal"
            variant="outlined"
            disabled={true}
            InputProps={{
              readOnly: true,
            }}
          />
          
          <TextField
            label="Mô tả"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            disabled={loading}
            autoFocus
          />
          
          <FormHelperText>
            Mã quyền không thể thay đổi sau khi đã tạo.
          </FormHelperText>
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
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPermissionDialog;
