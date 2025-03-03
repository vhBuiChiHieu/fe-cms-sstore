import axios from 'axios';
import { BASE_URL, TOKEN } from '../utils/config';
import logger from '../utils/logger';
import { Permission } from './roleService';

/**
 * Tham số cho việc lấy danh sách tài khoản
 */
export interface AccountListParams {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  status?: string;
  role?: string;
}

/**
 * Thông tin tài khoản cơ bản
 */
export interface Account {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  status: number | string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

/**
 * Kết quả trả về từ API danh sách tài khoản
 */
export interface AccountListResponse {
  data: Account[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
}

/**
 * Thông tin chi tiết của tài khoản từ API
 */
export interface AccountProfile {
  id: string;
  mail: string;
  username?: string;
  fullName?: string;
  status: number;
  roles: {
    id: number | string;
    name: string;
    description?: string;
    permissions?: Permission[];
  }[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Dữ liệu để tạo tài khoản mới
 */
export interface CreateAccountData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
  dateOfBirth: string;
  phone: string;
}

/**
 * Service xử lý các thao tác liên quan đến tài khoản
 */
class AccountService {
  /**
   * Lấy danh sách tài khoản
   * @param params Tham số tìm kiếm và phân trang
   * @returns Danh sách tài khoản và thông tin phân trang
   */
  async getAccounts(params: AccountListParams): Promise<AccountListResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/api/account/list`, {
        params: {
          pageIndex: params.page,
          pageSize: params.size,
          search: params.search,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
          status: params.status,
          role: params.role
        },
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });

      logger.debug('API response:', response.data);

      // Kiểm tra nếu response.data.data tồn tại (cấu trúc mới)
      if (response.data.data) {
        const accounts = (response.data.data.data || []).map((item: any) => ({
          id: item.id,
          email: item.mail || item.email, // Hỗ trợ cả mail và email
          status: item.status,
          role: item.roles && item.roles.length > 0 ? item.roles[0].name : undefined,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          lastLogin: item.lastLogin
        }));

        return {
          data: accounts,
          totalCount: response.data.data.totalItems || 0,
          totalPages: response.data.data.totalPages || 0,
          pageSize: response.data.data.pageSize || 10,
          currentPage: response.data.data.pageIndex || 0
        };
      }

      // Cấu trúc cũ (nếu có)
      return {
        data: response.data.content || [],
        totalCount: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        pageSize: response.data.size || 10,
        currentPage: response.data.number || 0
      };
    } catch (error) {
      logger.error('Error fetching accounts:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.response.status === 403) {
          throw new Error('Bạn không có quyền truy cập tài nguyên này.');
        } else if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
    }
  }

  /**
   * Tạo tài khoản mới
   * @param data Dữ liệu tài khoản mới
   * @returns true nếu tạo thành công, false nếu thất bại
   */
  async createAccount(data: CreateAccountData): Promise<boolean> {
    try {
      const response = await axios.post(`${BASE_URL}/api/account`, data, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });

      logger.debug('Create account response:', response.data);
      return response.status === 200 || response.status === 201;
    } catch (error) {
      logger.error('Error creating account:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể tạo tài khoản mới. Vui lòng thử lại sau.');
    }
  }

  /**
   * Thay đổi trạng thái của tài khoản
   * @param accountId ID của tài khoản cần thay đổi trạng thái
   * @param status Trạng thái mới (0: Hoạt động, 1: Chưa kích hoạt, 2: Đã khóa)
   * @returns true nếu thay đổi thành công, false nếu thất bại
   */
  async changeAccountStatus(accountId: string, status: number): Promise<boolean> {
    try {
      const response = await axios.put(`${BASE_URL}/api/account/change-status/${accountId}?status=${status}`, {}, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });

      logger.debug('Change account status response:', response.data);
      return response.status === 200;
    } catch (error) {
      logger.error('Error changing account status:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể thay đổi trạng thái tài khoản. Vui lòng thử lại sau.');
    }
  }

  /**
   * Xóa tài khoản
   * @param accountId ID của tài khoản cần xóa
   * @returns true nếu xóa thành công, false nếu thất bại
   */
  async deleteAccount(accountId: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${BASE_URL}/api/account/${accountId}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });

      logger.debug('Delete account response:', response.data);
      return response.status === 200;
    } catch (error) {
      logger.error('Error deleting account:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể xóa tài khoản. Vui lòng thử lại sau.');
    }
  }

  /**
   * Lấy thông tin chi tiết của tài khoản
   * @param accountId ID của tài khoản cần lấy thông tin
   * @returns Thông tin chi tiết của tài khoản hoặc null nếu không tìm thấy
   */
  async getAccountProfile(accountId: string): Promise<AccountProfile | null> {
    try {
      const response = await axios.get(`${BASE_URL}/api/account/${accountId}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });

      logger.debug('Get account profile response:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Error getting account profile:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          return null;
        } else if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể lấy thông tin tài khoản. Vui lòng thử lại sau.');
    }
  }

  /**
   * Cập nhật thông tin tài khoản
   * @param accountId ID của tài khoản cần cập nhật
   * @param data Dữ liệu cập nhật
   * @returns true nếu cập nhật thành công, false nếu thất bại
   */
  async updateAccount(accountId: string, data: any): Promise<boolean> {
    try {
      const response = await axios.put(`${BASE_URL}/api/account/${accountId}`, data, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });

      logger.debug('Update account response:', response.data);
      return response.status === 200;
    } catch (error) {
      logger.error('Error updating account:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể cập nhật tài khoản. Vui lòng thử lại sau.');
    }
  }
}

// Export một instance của AccountService
const accountService = new AccountService();
export default accountService;
