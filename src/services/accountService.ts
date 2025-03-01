import { BASE_URL } from '../utils/config';
import axios from 'axios';

export interface Account {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  createdAt: string;
  lastLogin: string;
}

export interface AccountListResponse {
  content: Account[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AccountListParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
  status?: string;
  role?: string;
}

/**
 * Lấy danh sách tài khoản
 */
export const getAccounts = async (params: AccountListParams): Promise<AccountListResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/account/list`, {
      params: {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        search: params.search,
        status: params.status,
        role: params.role
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error);
    
    // Trả về dữ liệu mẫu khi API bị lỗi hoặc không có sẵn
    return getMockAccounts(params);
  }
};

/**
 * Tạo dữ liệu mẫu cho danh sách tài khoản
 */
export const getMockAccounts = (params: AccountListParams): AccountListResponse => {
  const mockAccounts: Account[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@sstore.com',
      fullName: 'Admin User',
      role: 'ADMIN',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      lastLogin: '2025-03-01T10:30:00Z'
    },
    {
      id: '2',
      username: 'manager',
      email: 'manager@sstore.com',
      fullName: 'Manager User',
      role: 'MANAGER',
      status: 'active',
      createdAt: '2025-01-15T00:00:00Z',
      lastLogin: '2025-03-01T09:15:00Z'
    },
    {
      id: '3',
      username: 'staff1',
      email: 'staff1@sstore.com',
      fullName: 'Staff One',
      role: 'STAFF',
      status: 'active',
      createdAt: '2025-02-01T00:00:00Z',
      lastLogin: '2025-03-01T08:45:00Z'
    },
    {
      id: '4',
      username: 'staff2',
      email: 'staff2@sstore.com',
      fullName: 'Staff Two',
      role: 'STAFF',
      status: 'inactive',
      createdAt: '2025-02-05T00:00:00Z',
      lastLogin: '2025-02-20T14:30:00Z'
    },
    {
      id: '5',
      username: 'user1',
      email: 'user1@example.com',
      fullName: 'User One',
      role: 'USER',
      status: 'active',
      createdAt: '2025-02-10T00:00:00Z',
      lastLogin: '2025-03-01T16:20:00Z'
    },
    {
      id: '6',
      username: 'user2',
      email: 'user2@example.com',
      fullName: 'User Two',
      role: 'USER',
      status: 'locked',
      createdAt: '2025-02-15T00:00:00Z',
      lastLogin: '2025-02-25T11:10:00Z'
    },
    {
      id: '7',
      username: 'user3',
      email: 'user3@example.com',
      fullName: 'User Three',
      role: 'USER',
      status: 'active',
      createdAt: '2025-02-20T00:00:00Z',
      lastLogin: '2025-03-01T17:45:00Z'
    },
    {
      id: '8',
      username: 'user4',
      email: 'user4@example.com',
      fullName: 'User Four',
      role: 'USER',
      status: 'active',
      createdAt: '2025-02-25T00:00:00Z',
      lastLogin: '2025-03-01T13:30:00Z'
    },
    {
      id: '9',
      username: 'user5',
      email: 'user5@example.com',
      fullName: 'User Five',
      role: 'USER',
      status: 'inactive',
      createdAt: '2025-03-01T00:00:00Z',
      lastLogin: '2025-03-01T10:15:00Z'
    },
    {
      id: '10',
      username: 'user6',
      email: 'user6@example.com',
      fullName: 'User Six',
      role: 'USER',
      status: 'active',
      createdAt: '2025-03-01T00:00:00Z',
      lastLogin: '2025-03-02T09:00:00Z'
    }
  ];

  // Lọc theo tìm kiếm nếu có
  let filteredAccounts = [...mockAccounts];
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredAccounts = filteredAccounts.filter(account => 
      account.username.toLowerCase().includes(searchLower) ||
      account.email.toLowerCase().includes(searchLower) ||
      account.fullName.toLowerCase().includes(searchLower)
    );
  }

  // Lọc theo trạng thái nếu có
  if (params.status) {
    filteredAccounts = filteredAccounts.filter(account => 
      account.status === params.status
    );
  }

  // Lọc theo vai trò nếu có
  if (params.role) {
    filteredAccounts = filteredAccounts.filter(account => 
      account.role.toLowerCase() === params.role?.toLowerCase()
    );
  }

  // Tính toán phân trang
  const totalElements = filteredAccounts.length;
  const totalPages = Math.ceil(totalElements / params.pageSize);
  const startIndex = (params.pageIndex - 1) * params.pageSize;
  const endIndex = Math.min(startIndex + params.pageSize, totalElements);
  const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

  return {
    content: paginatedAccounts,
    totalElements,
    totalPages,
    size: params.pageSize,
    number: params.pageIndex - 1
  };
};
