import { useState, useCallback } from 'react';
import accountService, { Account, UserProfile } from '../../../services/accountService';
import { AccountsState, AccountsStateActions } from './useAccountsState';
import { useAccountsActions } from './useAccountsActions';

export interface AccountsDialogState {
  // Dialog states
  openAddDialog: boolean;
  openEditDialog: boolean;
  openDeleteDialog: boolean;
  openStatusDialog: boolean;
  openViewDialog: boolean;
  selectedAccount: Account | null;
  accountProfile: UserProfile | null;
  loadingProfile: boolean;
  profileError: string | null;
  accountToChangeStatus: {
    id: string;
    email: string;
    currentStatus: number;
    newStatus: number;
    action: 'lock' | 'unlock' | 'activate';
  } | null;
}

export interface AccountsDialogActions {
  // Dialog actions
  handleOpenAddDialog: () => void;
  handleCloseAddDialog: () => void;
  handleAccountCreated: () => void;
  handleOpenEditDialog: (account: Account) => void;
  handleCloseEditDialog: () => void;
  handleAccountUpdated: () => void;
  handleOpenDeleteDialog: (account: Account) => void;
  handleCloseDeleteDialog: () => void;
  handleAccountDeleted: () => void;
  handleLockAccount: (account: Account) => void;
  handleUnlockAccount: (account: Account) => void;
  handleActivateAccount: (account: Account) => void;
  handleCloseStatusDialog: () => void;
  handleConfirmStatusChange: () => Promise<void>;
  handleViewAccountDetails: (account: Account) => Promise<void>;
  handleCloseViewDialog: () => void;
}

export const useAccountsDialogs = (
  state: AccountsState,
  actions: AccountsStateActions,
  accountsActions: ReturnType<typeof useAccountsActions>
): [AccountsDialogState, AccountsDialogActions] => {
  // Destructure state and actions
  const { 
    page, 
    rowsPerPage, 
    searchTerm, 
    statusFilter, 
    roleFilter 
  } = state;
  
  const { 
    setLoading, 
    setSnackbar 
  } = actions;
  
  const { fetchAccountsWithParams } = accountsActions;

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openStatusDialog, setOpenStatusDialog] = useState<boolean>(false);
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountProfile, setAccountProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [accountToChangeStatus, setAccountToChangeStatus] = useState<{
    id: string;
    email: string;
    currentStatus: number;
    newStatus: number;
    action: 'lock' | 'unlock' | 'activate';
  } | null>(null);

  // Handle add account dialog
  const handleOpenAddDialog = useCallback(() => {
    setOpenAddDialog(true);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setOpenAddDialog(false);
  }, []);

  const handleAccountCreated = useCallback(() => {
    setOpenAddDialog(false);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
    setSnackbar({
      open: true,
      message: 'Tạo tài khoản mới thành công!',
      severity: 'success',
    });
  }, [fetchAccountsWithParams, rowsPerPage, searchTerm, statusFilter, roleFilter, setSnackbar]);

  // Handle edit account dialog
  const handleOpenEditDialog = useCallback(async (account: Account) => {
    try {
      setLoadingProfile(true);
      // Lấy thông tin chi tiết của account từ API
      const profile = await accountService.getAccountProfileById(account.id);
      
      if (profile) {
        // Cập nhật selectedAccount với thông tin chi tiết từ profile, bao gồm cả roles
        setSelectedAccount({
          ...account,
          // Thêm thông tin roles từ profile, đảm bảo id luôn là string
          selectedRoles: profile.roles ? profile.roles.map(role => ({
            id: String(role.id), // Chuyển đổi id thành string
            name: role.name,
            description: role.description
          })) : []
        });
      } else {
        // Nếu không lấy được thông tin chi tiết, sử dụng thông tin cơ bản
        setSelectedAccount({
          ...account,
          selectedRoles: account.role ? [{ id: String(account.role), name: account.role }] : []
        });
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
      // Trong trường hợp lỗi, vẫn hiển thị dialog với thông tin cơ bản
      setSelectedAccount({
        ...account,
        selectedRoles: account.role ? [{ id: String(account.role), name: account.role }] : []
      });
    } finally {
      setLoadingProfile(false);
      setOpenEditDialog(true);
    }
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setOpenEditDialog(false);
    setSelectedAccount(null);
  }, []);

  const handleAccountUpdated = useCallback(() => {
    setOpenEditDialog(false);
    setSelectedAccount(null);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
    setSnackbar({
      open: true,
      message: 'Cập nhật tài khoản thành công!',
      severity: 'success',
    });
  }, [fetchAccountsWithParams, rowsPerPage, searchTerm, statusFilter, roleFilter, setSnackbar]);

  // Handle delete account dialog
  const handleOpenDeleteDialog = useCallback((account: Account) => {
    setSelectedAccount(account);
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(false);
    setSelectedAccount(null);
  }, []);

  const handleAccountDeleted = useCallback(() => {
    setOpenDeleteDialog(false);
    setSelectedAccount(null);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
    setSnackbar({
      open: true,
      message: 'Xóa tài khoản thành công!',
      severity: 'success',
    });
  }, [fetchAccountsWithParams, rowsPerPage, searchTerm, statusFilter, roleFilter, setSnackbar]);

  // Handle lock account
  const handleLockAccount = useCallback((account: Account) => {
    setAccountToChangeStatus({
      id: account.id,
      email: account.email,
      currentStatus: typeof account.status === 'string' ? parseInt(account.status, 10) : account.status || 0,
      newStatus: 2, // Locked
      action: 'lock'
    });
    setOpenStatusDialog(true);
  }, []);

  // Handle unlock account
  const handleUnlockAccount = useCallback((account: Account) => {
    setAccountToChangeStatus({
      id: account.id,
      email: account.email,
      currentStatus: typeof account.status === 'string' ? parseInt(account.status, 10) : account.status || 0,
      newStatus: 0, // Active
      action: 'unlock'
    });
    setOpenStatusDialog(true);
  }, []);

  // Handle activate account
  const handleActivateAccount = useCallback((account: Account) => {
    setAccountToChangeStatus({
      id: account.id,
      email: account.email,
      currentStatus: typeof account.status === 'string' ? parseInt(account.status, 10) : account.status || 0,
      newStatus: 0, // Active
      action: 'activate'
    });
    setOpenStatusDialog(true);
  }, []);

  // Handle close status change dialog
  const handleCloseStatusDialog = useCallback(() => {
    setOpenStatusDialog(false);
    setAccountToChangeStatus(null);
  }, []);

  // Handle confirm status change
  const handleConfirmStatusChange = useCallback(async () => {
    if (!accountToChangeStatus) return;

    setLoading(true);
    try {
      await accountService.changeAccountStatus(
        accountToChangeStatus.id,
        accountToChangeStatus.newStatus
      );
      fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
      setSnackbar({
        open: true,
        message: accountToChangeStatus.action === 'lock'
          ? 'Khóa tài khoản thành công!'
          : accountToChangeStatus.action === 'unlock'
            ? 'Mở khóa tài khoản thành công!'
            : 'Kích hoạt tài khoản thành công!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Không thể thay đổi trạng thái tài khoản. Vui lòng thử lại sau.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      handleCloseStatusDialog();
    }
  }, [accountToChangeStatus, setLoading, fetchAccountsWithParams, rowsPerPage, searchTerm, statusFilter, roleFilter, setSnackbar]);

  // Handle view account details
  const handleViewAccountDetails = useCallback(async (account: Account) => {
    setSelectedAccount(account);
    setOpenViewDialog(true);
    setLoadingProfile(true);
    setProfileError(null);
    setAccountProfile(null);

    try {
      const profile = await accountService.getAccountProfileById(account.id);
      if (profile) {
        setAccountProfile(profile);
      } else {
        setProfileError('Không tìm thấy thông tin tài khoản');
      }
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Không thể tải thông tin tài khoản');
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Không thể tải thông tin tài khoản',
        severity: 'error',
      });
    } finally {
      setLoadingProfile(false);
    }
  }, [setSnackbar]);

  const handleCloseViewDialog = useCallback(() => {
    setOpenViewDialog(false);
    setSelectedAccount(null);
    setAccountProfile(null);
    setProfileError(null);
  }, []);

  const dialogState: AccountsDialogState = {
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    openStatusDialog,
    openViewDialog,
    selectedAccount,
    accountProfile,
    loadingProfile,
    profileError,
    accountToChangeStatus
  };

  const dialogActions: AccountsDialogActions = {
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAccountCreated,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleAccountUpdated,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleAccountDeleted,
    handleLockAccount,
    handleUnlockAccount,
    handleActivateAccount,
    handleCloseStatusDialog,
    handleConfirmStatusChange,
    handleViewAccountDetails,
    handleCloseViewDialog
  };

  return [dialogState, dialogActions];
};

export default useAccountsDialogs;
