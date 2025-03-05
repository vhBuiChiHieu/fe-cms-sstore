import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  CircularProgress,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput
} from '@mui/material';
import { CreateAccountData } from '../../../services/accountService';
import { Role } from '../../../services/roleService';

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onAccountCreated: () => void;
  newAccount: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    phone: string;
    roleIds: (string | number)[];
  };
  formErrors: Record<string, string>;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  roles: Role[]; // Danh sách vai trò để chọn
}

const AddAccountDialog: React.FC<AddAccountDialogProps> = ({
  open,
  onClose,
  onAccountCreated,
  newAccount,
  formErrors,
  loading,
  onChange,
  onSubmit,
  roles
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Thêm tài khoản mới</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Họ"
              name="firstName"
              value={newAccount.firstName}
              onChange={onChange}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              required
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên"
              name="lastName"
              value={newAccount.lastName}
              onChange={onChange}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              required
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={newAccount.email}
              onChange={onChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type="password"
              value={newAccount.password}
              onChange={onChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              required
              autoComplete="new-password"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nhập lại mật khẩu"
              name="rePassword"
              type="password"
              value={newAccount.rePassword}
              onChange={onChange}
              error={!!formErrors.rePassword}
              helperText={formErrors.rePassword}
              required
              autoComplete="new-password"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ngày sinh"
              name="dateOfBirth"
              type="text" 
              value={newAccount.dateOfBirth}
              onChange={onChange}
              error={!!formErrors.dateOfBirth}
              helperText={formErrors.dateOfBirth || 'Nhập theo định dạng: YYYY-MM-DD (ví dụ: 1990-12-31)'}
              required
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              placeholder="YYYY-MM-DD"
              inputProps={{
                pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}', // Định dạng yyyy-MM-dd
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={newAccount.phone}
              onChange={onChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              required
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors.roleIds}>
              <InputLabel id="role-select-label">Vai trò</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                multiple
                name="roleIds"
                value={newAccount.roleIds}
                onChange={(e) => {
                  const event = {
                    target: {
                      name: 'roleIds',
                      value: e.target.value
                    }
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChange(event);
                }}
                input={<OutlinedInput label="Vai trò" />}
                renderValue={(selected) => {
                  return roles
                    .filter(role => selected.includes(role.id))
                    .map(role => role.name)
                    .join(', ');
                }}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Checkbox checked={newAccount.roleIds.includes(role.id)} />
                    <ListItemText primary={role.name} secondary={role.description} />
                  </MenuItem>
                ))}
              </Select>
              {!!formErrors.roleIds && (
                <FormHelperText>{formErrors.roleIds}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Đang thêm...' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccountDialog;
