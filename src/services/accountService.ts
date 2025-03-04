import axiosInstance from '../utils/axiosInstance';
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
  firstName?: string;
  lastName?: string;
  userInfoId?: string;
  status: number | string;
  role?: string;
  selectedRoles?: { id: string; name: string; description?: string }[];
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
 * Thông tin profile của người dùng đăng nhập
 */
export interface UserProfile {
  id: string | number;
  email?: string;
  mail?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  dateOfBirth: string;
  phone?: string;
  description?: string;
  avatar?: string | null;
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
 * Thông tin thống kê tài khoản
 */
export interface AccountStatistics {
  totalAccount: number;
  activeAccount?: number;
  inactiveAccount?: number;
  lockedAccount?: number;
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
      const response = await axiosInstance.get('/api/account/list', {
        params: {
          pageIndex: params.page,
          pageSize: params.size,
          search: params.search,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
          status: params.status,
          role: params.role
        }
      });

      logger.debug('API response:', response.data);

      // Kiểm tra nếu response.data.data tồn tại (cấu trúc mới)
      if (response.data.data) {
        const accounts = (response.data.data.data || []).map((item: any) => ({
          id: item.id,
          email: item.mail || item.email, // Hỗ trợ cả mail và email
          firstName: item.firstName,
          lastName: item.lastName,
          fullName: item.fullName || (item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : undefined),
          userInfoId: item.userInfoId,
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
      
      if (axiosInstance.isAxiosError(error) && error.response) {
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
      const response = await axiosInstance.post('/api/account', data);

      logger.debug('Create account response:', response.data);
      return response.status === 200 || response.status === 201;
    } catch (error) {
      logger.error('Error creating account:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
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
      const response = await axiosInstance.put(`/api/account/change-status/${accountId}?status=${status}`);

      logger.debug('Change account status response:', response.data);
      return response.status === 200;
    } catch (error) {
      logger.error('Error changing account status:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
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
      const response = await axiosInstance.delete(`/api/account/${accountId}`);

      logger.debug('Delete account response:', response.data);
      return response.status === 200;
    } catch (error) {
      logger.error('Error deleting account:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
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
      const response = await axiosInstance.get(`/api/account/${accountId}`);

      logger.debug('Get account profile response:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Error getting account profile:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
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
      const response = await axiosInstance.put(`/api/account/${accountId}`, data);

      logger.debug('Update account response:', response.data);
      return response.status === 200;
    } catch (error) {
      logger.error('Error updating account:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể cập nhật tài khoản. Vui lòng thử lại sau.');
    }
  }

  /**
   * Lấy thông tin profile của người dùng đang đăng nhập
   * @returns Thông tin profile của người dùng hoặc null nếu không tìm thấy
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const token = localStorage.getItem('authState') 
        ? JSON.parse(localStorage.getItem('authState') || '{}').token 
        : '';
        
      const response = await axiosInstance.get('/api/account/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      logger.debug('Get user profile response:', response.data);
      
      // Xử lý dữ liệu từ API
      const responseData = response.data.data || response.data;
      
      // Đảm bảo dữ liệu trả về đúng định dạng
      return {
        id: responseData.id,
        email: responseData.email,
        mail: responseData.mail,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        fullName: responseData.fullName,
        dateOfBirth: responseData.dateOfBirth,
        phone: responseData.phone,
        description: responseData.description,
        avatar: responseData.avatar || null,
        status: responseData.status,
        roles: responseData.roles || [],
        createdAt: responseData.createdAt,
        updatedAt: responseData.updatedAt
      };
    } catch (error) {
      logger.error('Error getting user profile:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          return null;
        } else if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể lấy thông tin cá nhân. Vui lòng thử lại sau.');
    }
  }

  /**
   * Lấy thông tin profile của tài khoản theo ID
   * @param accountId ID của tài khoản cần lấy thông tin
   * @returns Thông tin profile của tài khoản hoặc null nếu không tìm thấy
   */
  async getAccountProfileById(accountId: string): Promise<UserProfile | null> {
    try {
      const token = localStorage.getItem('authState') 
        ? JSON.parse(localStorage.getItem('authState') || '{}').token 
        : '';
      
      let response;
      try {
        // Thử gọi API profile trước
        response = await axiosInstance.get(`/api/account/profile/${accountId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (profileError) {
        logger.warn('Error getting account profile, trying alternative endpoint:', profileError);
        
        // Nếu không thành công, thử gọi API account
        response = await axiosInstance.get(`/api/account/${accountId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      logger.debug('Get account profile by ID response:', response.data);
      
      // Xử lý dữ liệu từ API
      const responseData = response.data.data || response.data;
      
      // Đảm bảo dữ liệu trả về đúng định dạng
      return {
        id: responseData.id,
        email: responseData.email || responseData.mail,
        mail: responseData.mail || responseData.email,
        firstName: responseData.firstName || '',
        lastName: responseData.lastName || '',
        fullName: responseData.fullName || `${responseData.firstName || ''} ${responseData.lastName || ''}`.trim(),
        dateOfBirth: responseData.dateOfBirth || '',
        phone: responseData.phone || '',
        description: responseData.description || '',
        avatar: responseData.avatar || null,
        status: responseData.status,
        roles: responseData.roles || [],
        createdAt: responseData.createdAt,
        updatedAt: responseData.updatedAt
      };
    } catch (error) {
      logger.error('Error getting account profile by ID:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
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
   * Lấy thống kê về tài khoản
   * @returns Thông tin thống kê tài khoản
   */
  async getAccountStatistics(): Promise<AccountStatistics> {
    try {
      const response = await axiosInstance.get('/api/account/static');

      logger.debug('Get account statistics response:', response.data);
      
      // Xử lý dữ liệu từ API
      const responseData = response.data.data || response.data;
      
      return {
        totalAccount: responseData.totalAccount || 0,
        activeAccount: responseData.activeAccount || 0,
        inactiveAccount: responseData.inactiveAccount || 0,
        lockedAccount: responseData.lockedAccount || 0
      };
    } catch (error) {
      logger.error('Error getting account statistics:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể lấy thống kê tài khoản. Vui lòng thử lại sau.');
    }
  }
}

// Export một instance của AccountService
const accountService = new AccountService();
export default accountService;
