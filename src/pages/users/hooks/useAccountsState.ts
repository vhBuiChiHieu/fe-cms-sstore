import { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import accountService, { Account, UserProfile } from '../../../services/accountService';
import { getRoles, Role } from '../../../services/roleService';

export interface AccountsState {
  // Accounts data
  accounts: Account[];
  loading: boolean;
  error: string;
  totalCount: number;
  
  // Roles
  roles: Role[];
  
  // Search and filters
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
  
  // Pagination
  page: number;
  rowsPerPage: number;
  
  // Notifications
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  };
}

export interface AccountsStateActions {
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  setRoleFilter: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setSnackbar: React.Dispatch<React.SetStateAction<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>>;
}

export const useAccountsState = (): [AccountsState, AccountsStateActions] => {
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

  // Fetch roles
  useEffect(() => {
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

    fetchRoles();
  }, []);

  const state: AccountsState = {
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
  };

  const actions: AccountsStateActions = {
    setAccounts,
    setLoading,
    setError,
    setTotalCount,
    setRoles,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    setPage,
    setRowsPerPage,
    setSnackbar
  };

  return [state, actions];
};

export default useAccountsState;
