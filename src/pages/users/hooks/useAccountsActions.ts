import { useCallback } from 'react';
import { SelectChangeEvent } from '@mui/material';
import accountService, { Account } from '../../../services/accountService';
import { AccountsState, AccountsStateActions } from './useAccountsState';

export interface AccountsActions {
  // API calls
  fetchAccounts: () => Promise<void>;
  fetchAccountsWithParams: (
    pageIndex: number,
    pageSize: number,
    search?: string,
    status?: string,
    role?: string
  ) => Promise<void>;
  
  // Event handlers
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchKeyPress: (event: React.KeyboardEvent) => void;
  handleSearchClick: () => void;
  handleStatusFilterChange: (event: SelectChangeEvent) => void;
  handleRoleFilterChange: (event: SelectChangeEvent) => void;
  handleRefresh: () => void;
  handlePageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleCloseSnackbar: () => void;
}

export const useAccountsActions = (
  state: AccountsState,
  actions: AccountsStateActions
): AccountsActions => {
  const {
    page,
    rowsPerPage,
    searchTerm,
    statusFilter,
    roleFilter,
    snackbar
  } = state;

  const {
    setAccounts,
    setLoading,
    setError,
    setTotalCount,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    setPage,
    setRowsPerPage,
    setSnackbar
  } = actions;

  // Fetch accounts with search and filter parameters
  const fetchAccountsWithParams = useCallback(async (
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
  }, [setAccounts, setLoading, setError, setTotalCount]);

  // Hàm fetchAccounts để đảm bảo tính tương thích với các phần khác của code
  const fetchAccounts = useCallback(async () => {
    await fetchAccountsWithParams(page, rowsPerPage, searchTerm, statusFilter, roleFilter);
  }, [fetchAccountsWithParams]);

  // Handle search term change
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, [setSearchTerm]);

  // Handle search key press (Enter)
  const handleSearchKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setPage(0);
      fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
    }
  }, [fetchAccountsWithParams, rowsPerPage, searchTerm, statusFilter, roleFilter, setPage]);

  // Handle search button click
  const handleSearchClick = useCallback(() => {
    setPage(0);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, roleFilter);
  }, [fetchAccountsWithParams, rowsPerPage, searchTerm, statusFilter, roleFilter, setPage]);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((event: SelectChangeEvent) => {
    const newStatus = event.target.value;
    setStatusFilter(newStatus);
    setPage(0);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, newStatus, roleFilter);
  }, [fetchAccountsWithParams, rowsPerPage, searchTerm, roleFilter, setStatusFilter, setPage]);

  // Handle role filter change
  const handleRoleFilterChange = useCallback((event: SelectChangeEvent) => {
    const newRole = event.target.value;
    setRoleFilter(newRole);
    setPage(0);
    fetchAccountsWithParams(0, rowsPerPage, searchTerm, statusFilter, newRole);
  }, [fetchAccountsWithParams, rowsPerPage, searchTerm, statusFilter, setRoleFilter, setPage]);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('');
    setRoleFilter('');
    setPage(0);
    fetchAccountsWithParams(0, rowsPerPage, '', '', '');
  }, [fetchAccountsWithParams, rowsPerPage, setSearchTerm, setStatusFilter, setRoleFilter, setPage]);

  // Handle page change
  const handlePageChange = useCallback((
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    fetchAccountsWithParams(newPage, rowsPerPage, searchTerm, statusFilter, roleFilter);
  }, [fetchAccountsWithParams, rowsPerPage, searchTerm, statusFilter, roleFilter, setPage]);

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchAccountsWithParams(0, newRowsPerPage, searchTerm, statusFilter, roleFilter);
  }, [fetchAccountsWithParams, searchTerm, statusFilter, roleFilter, setRowsPerPage, setPage]);

  // Handle close snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  }, [snackbar, setSnackbar]);

  return {
    fetchAccounts,
    fetchAccountsWithParams,
    handleSearchChange,
    handleSearchKeyPress,
    handleSearchClick,
    handleStatusFilterChange,
    handleRoleFilterChange,
    handleRefresh,
    handlePageChange,
    handleRowsPerPageChange,
    handleCloseSnackbar
  };
};

export default useAccountsActions;
