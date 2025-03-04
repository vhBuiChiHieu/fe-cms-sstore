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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Grid
} from '@mui/material';
import {
  VpnKey as VpnKeyIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

// Interface cho props của component
interface AddPermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onPermissionAdded: () => void;
}

// Danh sách các prefix quyền có sẵn
const PERMISSION_PREFIXES = [
  'ACCOUNT',
  'PRODUCT',
  'ORDER',
  'REPORT',
  'SYSTEM'
];

const AddPermissionDialog: React.FC<AddPermissionDialogProps> = ({
  open,
  onClose,
  onPermissionAdded
}) => {
  // Form state
  const [name, setName] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Validation state
  const [nameError, setNameError] = useState<string>('');
  const [prefixError, setPrefixError] = useState<string>('');
  const [suffixError, setSuffixError] = useState<string>('');

  // Dialog state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Reset form
  const resetForm = () => {
    setName('');
    setPrefix('');
    setSuffix('');
    setDescription('');
    setNameError('');
    setPrefixError('');
    setSuffixError('');
    setError('');
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Cập nhật tên quyền khi thay đổi prefix hoặc suffix
  React.useEffect(() => {
    if (prefix && suffix) {
      setName(`${prefix}_${suffix}`);
    } else {
      setName('');
    }
  }, [prefix, suffix]);

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;

    // Validate prefix
    if (!prefix) {
      setPrefixError('Prefix quyền là bắt buộc');
      isValid = false;
    } else {
      setPrefixError('');
    }

    // Validate suffix
    if (!suffix) {
      setSuffixError('Phần mở rộng quyền là bắt buộc');
      isValid = false;
    } else {
      setSuffixError('');
    }

    // Validate name
    if (!name) {
      setNameError('Tên quyền là bắt buộc');
      isValid = false;
    } else {
      setNameError('');
    }

    return isValid;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      // Mock API call
      // Đây chỉ là giao diện mẫu, chưa cần gọi API thực
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form sau khi thành công
      resetForm();
      
      // Thông báo cho component cha biết đã thêm quyền thành công
      onPermissionAdded();
      
      // Đóng dialog
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi thêm quyền:', err);
      setError(err.message || 'Đã xảy ra lỗi khi thêm quyền');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <VpnKeyIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Thêm Quyền Mới</Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!prefixError} sx={{ mb: 2 }}>
              <InputLabel id="permission-prefix-label">Prefix Quyền</InputLabel>
              <Select
                labelId="permission-prefix-label"
                value={prefix}
                label="Prefix Quyền"
                onChange={(e) => setPrefix(e.target.value)}
                disabled={loading}
              >
                {PERMISSION_PREFIXES.map((pre) => (
                  <MenuItem key={pre} value={pre}>
                    {pre}
                  </MenuItem>
                ))}
              </Select>
              {prefixError && <FormHelperText>{prefixError}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phần mở rộng (SUFFIX)"
              placeholder="Ví dụ: READ, WRITE, DELETE"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value.toUpperCase())}
              error={!!suffixError}
              helperText={suffixError}
              margin="normal"
              sx={{ mb: 2, mt: 0 }}
              disabled={loading}
              InputProps={{
                sx: { textTransform: 'uppercase' }
              }}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Tên Quyền"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError || "Tên quyền được tạo tự động từ prefix và suffix"}
          margin="normal"
          sx={{ mb: 2 }}
          disabled={true}
          InputProps={{
            readOnly: true,
            sx: { fontWeight: 'bold' }
          }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả chi tiết về quyền này"
          margin="normal"
          disabled={loading}
          InputProps={{
            startAdornment: (
              <DescriptionIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            ),
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Đang xử lý...' : 'Thêm Quyền'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPermissionDialog;
