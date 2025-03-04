import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface DeleteCartItemDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteCartItemDialog: React.FC<DeleteCartItemDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xóa mục giỏ hàng này không? Hành động này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCartItemDialog;
