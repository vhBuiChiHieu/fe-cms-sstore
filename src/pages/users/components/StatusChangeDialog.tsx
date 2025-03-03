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

interface StatusChangeDialogProps {
  open: boolean;
  onClose: () => void;
  accountToChangeStatus: {
    id: string;
    email: string;
    currentStatus: number;
    newStatus: number;
    action: 'lock' | 'unlock' | 'activate';
  } | null;
  loading: boolean;
  onConfirm: () => void;
}

const StatusChangeDialog: React.FC<StatusChangeDialogProps> = ({
  open,
  onClose,
  accountToChangeStatus,
  loading,
  onConfirm
}) => {
  const getActionText = () => {
    if (!accountToChangeStatus) return '';
    
    switch (accountToChangeStatus.action) {
      case 'lock':
        return 'khóa';
      case 'unlock':
        return 'mở khóa';
      case 'activate':
        return 'kích hoạt';
      default:
        return 'thay đổi trạng thái';
    }
  };
  
  const getButtonColor = () => {
    if (!accountToChangeStatus) return 'primary';
    
    switch (accountToChangeStatus.action) {
      case 'lock':
        return 'warning';
      case 'unlock':
      case 'activate':
        return 'success';
      default:
        return 'primary';
    }
  };
  
  const getDialogTitle = () => {
    if (!accountToChangeStatus) return 'Thay đổi trạng thái tài khoản';
    
    switch (accountToChangeStatus.action) {
      case 'lock':
        return 'Xác nhận khóa tài khoản';
      case 'unlock':
        return 'Xác nhận mở khóa tài khoản';
      case 'activate':
        return 'Xác nhận kích hoạt tài khoản';
      default:
        return 'Thay đổi trạng thái tài khoản';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="status-dialog-title"
      aria-describedby="status-dialog-description"
    >
      <DialogTitle id="status-dialog-title">
        {getDialogTitle()}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="status-dialog-description">
          Bạn có chắc chắn muốn {getActionText()} tài khoản {accountToChangeStatus?.email} không?
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
          color={getButtonColor() as any}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? `Đang ${getActionText()}...` : `${getActionText().charAt(0).toUpperCase() + getActionText().slice(1)}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusChangeDialog;
