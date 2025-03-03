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
  FormHelperText
} from '@mui/material';
import { CreateAccountData } from '../../../services/accountService';

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
  };
  formErrors: Record<string, string>;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const AddAccountDialog: React.FC<AddAccountDialogProps> = ({
  open,
  onClose,
  onAccountCreated,
  newAccount,
  formErrors,
  loading,
  onChange,
  onSubmit
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
              type="date"
              value={newAccount.dateOfBirth}
              onChange={onChange}
              error={!!formErrors.dateOfBirth}
              helperText={formErrors.dateOfBirth || 'Định dạng: YYYY-MM-DD'}
              required
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
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
