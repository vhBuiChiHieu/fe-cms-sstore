import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress
} from '@mui/material';
import { Account } from '../../../services/accountService';

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onAccountDeleted: () => void;
  account: Account | null;
  loading: boolean;
  onConfirm: () => void;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onClose,
  onAccountDeleted,
  account,
  loading,
  onConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Xác nhận xóa tài khoản
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Bạn có chắc chắn muốn xóa tài khoản {account?.email} không? 
          Hành động này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="primary"
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog;
