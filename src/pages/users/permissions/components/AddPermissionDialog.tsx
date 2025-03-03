import React, { useState } from 'react';
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
import permissionService from '../../../../services/permissionService';

interface AddPermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onPermissionCreated: () => void;
}

const AddPermissionDialog: React.FC<AddPermissionDialogProps> = ({
  open,
  onClose,
  onPermissionCreated
}) => {
  // Form state
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Validation state
  const [nameError, setNameError] = useState<string>('');

  // Dialog state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Reset form
  const resetForm = () => {
    setName('');
    setDescription('');
    setNameError('');
    setError('');
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Tên quyền không được để trống');
      isValid = false;
    } else if (!/^[A-Z_]+$/.test(name.trim())) {
      setNameError('Tên quyền chỉ được chứa chữ cái in hoa và dấu gạch dưới');
      isValid = false;
    } else {
      setNameError('');
    }

    return isValid;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await permissionService.createPermission({
        name: name.trim(),
        description: description.trim()
      });

      if (success) {
        resetForm();
        onPermissionCreated();
      } else {
        setError('Không thể tạo quyền hạn. Vui lòng thử lại sau.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tạo quyền hạn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Handle name change
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    setName(value);
    if (value.trim()) {
      setNameError('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Thêm quyền hạn mới</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Tên quyền"
            fullWidth
            value={name}
            onChange={handleNameChange}
            margin="normal"
            variant="outlined"
            error={!!nameError}
            helperText={nameError || "Chỉ sử dụng chữ cái in hoa và dấu gạch dưới (VD: ACCOUNT_READ)"}
            disabled={loading}
            autoFocus
            placeholder="Ví dụ: ACCOUNT_READ"
            required
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
            placeholder="Mô tả chi tiết về quyền hạn này"
          />

          <FormHelperText>
            Các trường có dấu * là bắt buộc
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
          {loading ? 'Đang tạo...' : 'Tạo quyền hạn'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPermissionDialog;
