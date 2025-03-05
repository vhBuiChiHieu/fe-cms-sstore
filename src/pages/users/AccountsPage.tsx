import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import accountService, { Account, UserProfile } from '../../services/accountService';
import { getRoles, Role } from '../../services/roleService';
import AddAccountDialog from './components/AddAccountDialog';
import EditAccountDialog from './components/EditAccountDialog';
import DeleteAccountDialog from './components/DeleteAccountDialog';
import StatusChangeDialog from './components/StatusChangeDialog';
import ViewAccountDialog from './components/ViewAccountDialog';
import SearchFilters from './components/SearchFilters';
import AccountsTable from './components/AccountsTable';
import PaginationControls from './components/PaginationControls';

const AccountsPage: React.FC = () => {
  // State for accounts data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>(0);

  // State for roles
  const [roles, setRoles] = useState<Role[]>([]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  // State for pagination
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // State for dialogs
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openStatusDialog, setOpenStatusDialog] = useState<boolean>(false);
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editFormData, setEditFormData] = useState<{
    status: string;
    roles: string[];
  }>({ status: '0', roles: [] });
  const [submitting, setSubmitting] = useState<boolean>(false);
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

  // State for notifications
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
    fetchRoles();
  }, []);

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Không thể tải danh sách vai trò. Vui lòng thử lại sau.',
        severity: 'error',
      });
    }
  };

  // Fetch accounts with search and filter parameters
  const fetchAccountsWithParams = async (
    pageIndex: number,
    pageSize: number,
    search?: string,
    status?: string,
    role?: string
  ) => {
    setLoading(true);
    setError('');
    try {
      const response = await accountService.getAccounts({
        page: pageIndex + 1,
        size: pageSize,
        search: search,
        status: status,
        role: role,
      });
      setAccounts(response.data || []);
      setTotalCount(response.totalCount || 0);
    } catch (error) {
      setError('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm fetchAccounts để đảm bảo tính tương thích với các phần khác của code
  const fetchAccounts = async () => {
    fetchAccountsWithParams(page, rowsPerPage, searchTerm, statusFilter, roleFilter);
  };

  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle search key press (Enter)
  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    setPage(0);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
  };

  // Handle status filter change
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('');
    setRoleFilter('');
    setPage(0);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
  };

  // Handle page change
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    fetchAccountsWithParams(newPage, rowsPerPage, searchTerm, statusFilter, roleFilter);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    
    // Sử dụng giá trị mới trực tiếp thay vì dựa vào state
    setTimeout(() => {
      fetchAccountsWithParams(0, newRowsPerPage, searchTerm, statusFilter, roleFilter);
    }, 0);
  };

  // Handle add account dialog
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAccountCreated = () => {
    setOpenAddDialog(false);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
    setSnackbar({
      open: true,
      message: 'Tạo tài khoản mới thành công!',
      severity: 'success',
    });
  };

  // Handle edit account dialog
  const handleOpenEditDialog = async (account: Account) => {
    setSelectedAccount(account);
    setLoadingProfile(true);
    
    try {
      const profile = await accountService.getAccountProfileById(account.id);
      if (profile && profile.roles) {
        // Cập nhật tài khoản với danh sách vai trò đầy đủ
        const selectedRoles = profile.roles.map(role => ({
          id: role.id.toString(),
          name: role.name,
          description: role.description
        }));
        
        // Log để debug
        console.log('Profile roles from API:', profile.roles);
        console.log('Mapped selected roles:', selectedRoles);
        
        // Lấy danh sách role IDs
        const roleIds = selectedRoles.map(role => role.id);
        
        // Cập nhật selected account
        setSelectedAccount({
          ...account,
          selectedRoles: selectedRoles
        });
        
        // Cập nhật form data
        setEditFormData({
          status: typeof account.status === 'string' ? account.status : account.status.toString(),
          roles: roleIds
        });
        
        // Log để debug
        console.log('Initial editFormData.roles set to:', roleIds);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Không thể tải thông tin vai trò tài khoản',
        severity: 'error',
      });
    } finally {
      setLoadingProfile(false);
      setOpenEditDialog(true);
    }
  };

  const handleViewAccountDetails = async (account: Account) => {
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
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedAccount(null);
    setEditFormData({ status: '0', roles: [] });
    setSubmitting(false);
  };

  const handleAccountUpdated = () => {
    setOpenEditDialog(false);
    setSelectedAccount(null);
    setEditFormData({ status: '0', roles: [] });
    setSubmitting(false);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
    setSnackbar({
      open: true,
      message: 'Cập nhật tài khoản thành công!',
      severity: 'success',
    });
  };
  
  // Xử lý thay đổi trạng thái
  const handleStatusChange = (event: SelectChangeEvent) => {
    setEditFormData(prevData => ({
      ...prevData,
      status: event.target.value
    }));
  };
  
  // Xử lý thay đổi vai trò
  const handleRoleChange = (event: SelectChangeEvent<string[]>) => {
    // Nhận giá trị mới từ EditAccountDialog
    const newRoleIds = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    
    // Cập nhật trong editFormData
    setEditFormData(prevData => ({
      ...prevData,
      roles: newRoleIds
    }));
    
    // Log để debug
    console.log('Updated roles in AccountsPage:', newRoleIds);
  };
  
  // Xử lý submit form chỉnh sửa
  const handleSubmitEditForm = async () => {
    if (!selectedAccount) return;
    
    setSubmitting(true);
    
    try {
      // Chuẩn bị dữ liệu gửi đi theo format API yêu cầu
      const updateData = {
        status: parseInt(editFormData.status, 10),
        roles: editFormData.roles.map(roleId => ({ id: parseInt(roleId, 10) }))
      };
      
      // Gọi API cập nhật tài khoản
      const success = await accountService.updateAccount(selectedAccount.id, updateData);
      
      if (success) {
        handleAccountUpdated();
      } else {
        throw new Error('Cập nhật tài khoản không thành công');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Không thể cập nhật tài khoản. Vui lòng thử lại sau.',
        severity: 'error',
      });
      setSubmitting(false);
    }
  };

  // Handle delete account dialog
  const handleOpenDeleteDialog = (account: Account) => {
    setSelectedAccount(account);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedAccount(null);
  };

  const handleAccountDeleted = () => {
    setOpenDeleteDialog(false);
    setSelectedAccount(null);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
    setSnackbar({
      open: true,
      message: 'Xóa tài khoản thành công!',
      severity: 'success',
    });
  };

  // Handle lock account
  const handleLockAccount = (account: Account) => {
    setAccountToChangeStatus({
      id: account.id,
      email: account.email,
      currentStatus: typeof account.status === 'string' ? parseInt(account.status, 10) : account.status || 0,
      newStatus: 2, // Locked
      action: 'lock'
    });
    setOpenStatusDialog(true);
  };

  // Handle unlock account
  const handleUnlockAccount = (account: Account) => {
    setAccountToChangeStatus({
      id: account.id,
      email: account.email,
      currentStatus: typeof account.status === 'string' ? parseInt(account.status, 10) : account.status || 0,
      newStatus: 0, // Active
      action: 'unlock'
    });
    setOpenStatusDialog(true);
  };

  // Handle activate account
  const handleActivateAccount = (account: Account) => {
    setAccountToChangeStatus({
      id: account.id,
      email: account.email,
      currentStatus: typeof account.status === 'string' ? parseInt(account.status, 10) : account.status || 0,
      newStatus: 0, // Active
      action: 'activate'
    });
    setOpenStatusDialog(true);
  };

  // Handle close status change dialog
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setAccountToChangeStatus(null);
  };

  // Handle confirm status change
  const handleConfirmStatusChange = async () => {
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
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedAccount(null);
    setAccountProfile(null);
    setProfileError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Quản lý tài khoản
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Thêm tài khoản
          </Button>
        </Box>

        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          roles={roles}
          onSearchChange={handleSearchChange}
          onSearchKeyPress={handleSearchKeyPress}
          onSearchClick={handleSearchClick}
          onRefresh={handleRefresh}
          onStatusFilterChange={handleStatusFilterChange}
          onRoleFilterChange={handleRoleFilterChange}
        />

        {/* Accounts Table */}
        <AccountsTable
          accounts={accounts}
          loading={loading}
          error={error}
          onEditClick={handleOpenEditDialog}
          onDeleteClick={handleOpenDeleteDialog}
          onLockClick={handleLockAccount}
          onUnlockClick={handleUnlockAccount}
          onActivateClick={handleActivateAccount}
          onViewClick={handleViewAccountDetails}
          onRefresh={handleRefresh}
        />

        {/* Pagination */}
        <PaginationControls
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {/* Dialogs */}
      <AddAccountDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onAccountCreated={handleAccountCreated}
        newAccount={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          rePassword: '',
          dateOfBirth: '',
          phone: ''
        }}
        formErrors={{}}
        loading={false}
        onChange={() => {}}
        onSubmit={() => {}}
      />

      {/* View Account Dialog */}
      <ViewAccountDialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        accountProfile={accountProfile}
        loading={loadingProfile}
        error={profileError}
      />

      {selectedAccount && (
        <EditAccountDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          account={{
            id: selectedAccount.id,
            email: selectedAccount.email,
            status: parseInt(editFormData.status, 10),
            // Tạo danh sách selectedRoles dựa trên roles được chọn trong editFormData
            selectedRoles: selectedAccount.selectedRoles ? 
              // Lọc các roles đã được chọn trong editFormData.roles
              selectedAccount.selectedRoles.filter(role => 
                editFormData.roles.includes(role.id)
              ) : []
          }}
          roles={roles}
          onAccountUpdated={handleAccountUpdated}
          loading={loading}
          profileLoading={loadingProfile}
          submitting={submitting}
          onStatusChange={handleStatusChange}
          onRoleChange={handleRoleChange}
          onSubmit={handleSubmitEditForm}
        />
      )}

      {selectedAccount && (
        <DeleteAccountDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          account={selectedAccount}
          onAccountDeleted={handleAccountDeleted}
          loading={false}
          onConfirm={() => {}}
        />
      )}

      <StatusChangeDialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        accountToChangeStatus={accountToChangeStatus}
        loading={loading}
        onConfirm={handleConfirmStatusChange}
      />

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountsPage;
