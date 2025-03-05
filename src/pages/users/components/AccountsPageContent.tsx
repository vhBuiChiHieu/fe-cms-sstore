import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Account, UserProfile } from '../../../services/accountService';
import { Role } from '../../../services/roleService';
import AddAccountDialog from './AddAccountDialog';
import EditAccountDialog from './EditAccountDialog';
import DeleteAccountDialog from './DeleteAccountDialog';
import StatusChangeDialog from './StatusChangeDialog';
import ViewAccountDialog from './ViewAccountDialog';
import SearchFilters from './SearchFilters';
import AccountsTable from './AccountsTable';
import PaginationControls from './PaginationControls';
import { AccountsState } from '../hooks/useAccountsState';
import { AccountsActions } from '../hooks/useAccountsActions';
import { AccountsDialogState, AccountsDialogActions } from '../hooks/useAccountsDialogs';

interface AccountsPageContentProps {
  state: AccountsState;
  actions: AccountsActions;
  dialogState: AccountsDialogState;
  dialogActions: AccountsDialogActions;
}

const AccountsPageContent: React.FC<AccountsPageContentProps> = ({
  state,
  actions,
  dialogState,
  dialogActions
}) => {
  // Destructure state
  const {
    accounts,
    loading,
    error,
    totalCount,
    roles,
    searchTerm,
    statusFilter,
    roleFilter,
    page,
    rowsPerPage,
    snackbar
  } = state;

  // Destructure actions
  const {
    handleSearchChange,
    handleSearchKeyPress,
    handleSearchClick,
    handleStatusFilterChange,
    handleRoleFilterChange,
    handleRefresh,
    handlePageChange,
    handleRowsPerPageChange,
    handleCloseSnackbar
  } = actions;

  // Destructure dialog state
  const {
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
  } = dialogState;

  // Destructure dialog actions
  const {
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
  } = dialogActions;

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
      {/* Chỉ render dialog khi cần thiết để tránh re-render không cần thiết */}
      {openAddDialog && (
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
            phone: '',
            roleIds: []
          }}
          formErrors={{}}
          loading={false}
          onChange={() => {}}
          onSubmit={() => {}}
          roles={state.roles}
        />
      )}

      {/* View Account Dialog */}
      {openViewDialog && (
        <ViewAccountDialog
          open={openViewDialog}
          onClose={handleCloseViewDialog}
          accountProfile={accountProfile}
          loading={loadingProfile}
          error={profileError}
        />
      )}

      {openEditDialog && selectedAccount && (
        <EditAccountDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          account={{
            id: selectedAccount.id,
            email: selectedAccount.email,
            status: typeof selectedAccount.status === 'string' ? parseInt(selectedAccount.status as string, 10) : selectedAccount.status,
            // Sử dụng selectedRoles từ selectedAccount nếu có, nếu không thì tạo từ role
            // Đảm bảo id luôn là string
            selectedRoles: selectedAccount.selectedRoles || 
              (selectedAccount.role ? [{ id: String(selectedAccount.role), name: selectedAccount.role }] : [])
          }}
          roles={roles}
          onAccountUpdated={handleAccountUpdated}
          loading={false}
          profileLoading={loadingProfile}
          submitting={false}
          onStatusChange={() => {}}
          onRoleChange={() => {}}
          onSubmit={() => {}}
        />
      )}

      {openDeleteDialog && selectedAccount && (
        <DeleteAccountDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          account={selectedAccount}
          onAccountDeleted={handleAccountDeleted}
          loading={false}
          onConfirm={() => {}}
        />
      )}

      {openStatusDialog && (
        <StatusChangeDialog
          open={openStatusDialog}
          onClose={handleCloseStatusDialog}
          accountToChangeStatus={accountToChangeStatus}
          loading={loading}
          onConfirm={handleConfirmStatusChange}
        />
      )}

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

export default AccountsPageContent;
