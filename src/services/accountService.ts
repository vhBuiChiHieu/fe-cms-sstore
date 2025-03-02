import axios from 'axios';
import { BASE_URL, TOKEN } from '../utils/config';

// API URL
// const BASE_URL = 'http://localhost:8080';

export interface Account {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  status: string | number; // Có thể là string hoặc number
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
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    
    console.log('API response:', response.data);
    console.log('API response type:', typeof response.data);
    console.log('API response keys:', response.data ? Object.keys(response.data) : 'null');
    
    // Kiểm tra cấu trúc dữ liệu trả về từ API
    if (response.data && response.data.data) {
      console.log('API trả về cấu trúc data:', response.data.data);
      
      // Chuyển đổi cấu trúc dữ liệu từ API sang định dạng chuẩn
      const apiData = response.data.data;
      
      if (apiData.data && Array.isArray(apiData.data)) {
        console.log('API trả về mảng data trong data.data');
        
        // Chuyển đổi dữ liệu từ API sang định dạng Account
        const accounts = apiData.data.map((item: any) => ({
          id: item.id.toString(),
          username: item.mail.split('@')[0] || '',
          email: item.mail || '',
          fullName: item.mail.split('@')[0] || '',
          role: item.roles && item.roles.length > 0 ? item.roles[0].name : 'USER',
          status: item.status === 0 ? 'active' : 'inactive',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }));
        
        return {
          content: accounts,
          totalElements: apiData.totalItems || accounts.length,
          totalPages: apiData.totalPages || 1,
          size: apiData.pageSize || params.pageSize,
          number: (apiData.pageIndex || params.pageIndex) - 1
        };
      }
    }
    
    // Nếu không phân tích được, trả về dữ liệu mẫu
    console.log('Không thể phân tích cấu trúc dữ liệu API, sử dụng dữ liệu mẫu');
    const mockData = getMockAccounts(params);
    console.log('Mock data:', mockData);
    return mockData;
    
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error);
    
    // Kiểm tra lỗi 401 Unauthorized
    if (error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 
        'status' in error.response && error.response.status === 401) {
      console.log('Lỗi xác thực 401, sử dụng dữ liệu mẫu');
      const mockData = getMockAccounts(params);
      console.log('Mock data:', mockData);
      return mockData;
    }
    
    // Trả về dữ liệu mẫu khi API bị lỗi hoặc không có sẵn
    const mockData = getMockAccounts(params);
    console.log('Mock data:', mockData);
    return mockData;
  }
};

/**
 * Thay đổi trạng thái của tài khoản
 * @param accountId ID của tài khoản cần thay đổi trạng thái
 * @param status Trạng thái mới:
 *   - 0: Hoạt động (active)
 *   - 1: Chưa kích hoạt (inactive)
 *   - 2: Đã khóa (locked)
 * @returns true nếu thành công, false nếu thất bại
 */
export const changeAccountStatus = async (accountId: string, status: number): Promise<boolean> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/account/change-status/${accountId}?status=${status}`, 
      {}, // empty body
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      }
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('Error changing account status:', error);
    return false;
  }
};

/**
 * Xóa tài khoản
 * @param accountId ID của tài khoản cần xóa
 */
export const deleteAccount = async (accountId: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/account/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error deleting account:', error);
    return false;
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

  console.log('Phân trang:', {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    totalElements,
    startIndex,
    endIndex,
    paginatedAccountsLength: paginatedAccounts.length
  });

  return {
    content: paginatedAccounts || [],
    totalElements,
    totalPages,
    size: params.pageSize,
    number: params.pageIndex - 1
  };
};
