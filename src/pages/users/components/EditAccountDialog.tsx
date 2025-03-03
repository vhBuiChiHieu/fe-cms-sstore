import React from 'react';
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
  SelectChangeEvent
} from '@mui/material';
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
  if (!account) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
      <DialogContent>
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
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="roles-select-label">Vai trò</InputLabel>
              <Select
                labelId="roles-select-label"
                multiple
                value={account.selectedRoles.map(role => role.id)}
                label="Vai trò"
                onChange={onRoleChange}
                disabled={loading}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const role = roles.find(r => r.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={role ? (
                            role.name === 'ADMIN' ? 'Quản trị viên' :
                            role.name === 'MANAGER' ? 'Quản lý' :
                            role.name === 'GUEST' ? 'Khách' :
                            role.name === 'USER' ? 'Người dùng' :
                            role.name
                          ) : value} 
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name === 'ADMIN' ? 'Quản trị viên' :
                      role.name === 'MANAGER' ? 'Quản lý' :
                      role.name === 'GUEST' ? 'Khách' :
                      role.name === 'USER' ? 'Người dùng' :
                      role.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Có thể chọn nhiều vai trò</FormHelperText>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button
          onClick={() => {
            onSubmit();
            if (onAccountUpdated) {
              onAccountUpdated();
            }
          }}
          color="primary"
          variant="contained"
          disabled={submitting || profileLoading}
          startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {submitting ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccountDialog;
