import logger from '../utils/logger';
import axiosInstance from '../utils/axiosInstance';

/**
 * Tham số cho việc lấy danh sách quyền hạn
 */
export interface PermissionListParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Thông tin quyền hạn cơ bản
 */
export interface Permission {
  id: string | number;
  name: string; // Đây là mã quyền (ví dụ: ACCOUNT_READ)
  description?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Kết quả phân trang danh sách quyền hạn
 */
export interface PermissionPaginationResult {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  beginIndex: number;
  endIndex: number;
  data: Permission[];
}

/**
 * Kết quả trả về từ API danh sách quyền hạn
 */
export interface PermissionApiResponse {
  requestId: string;
  code: number;
  message: string;
  path: string;
  timestamp: string;
  data: Permission[] | PermissionPaginationResult;
}

/**
 * Dữ liệu để tạo quyền hạn mới
 */
export interface CreatePermissionData {
  name: string; // Đây là mã quyền (ví dụ: ACCOUNT_READ)
  description?: string;
}

/**
 * Service xử lý các thao tác liên quan đến quyền hạn
 */
class PermissionService {
  /**
   * Lấy danh sách quyền hạn có phân trang
   * @param params Tham số tìm kiếm và phân trang
   * @returns Danh sách quyền hạn và thông tin phân trang
   */
  async getPermissions(params: PermissionListParams = {}): Promise<{ permissions: Permission[], totalCount: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      // pageIndex bắt đầu từ 1 trong API
      if (params.pageIndex !== undefined) queryParams.append('pageIndex', params.pageIndex.toString());
      if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      
      const response = await axiosInstance.get<PermissionApiResponse>(`/api/permission/page?${queryParams.toString()}`);
      
      if (response.data.data && typeof response.data.data === 'object' && 'data' in response.data.data) {
        // Xử lý trường hợp data là PermissionPaginationResult
        const paginationResult = response.data.data as PermissionPaginationResult;
        return {
          permissions: paginationResult.data || [],
          totalCount: paginationResult.totalItems || 0
        };
      } else {
        // Xử lý trường hợp data là Permission[]
        const permissions = response.data.data as Permission[];
        return {
          permissions: permissions || [],
          totalCount: permissions?.length || 0
        };
      }
    } catch (error) {
      logger.error('Lỗi khi tải danh sách quyền hạn:', error);
      return { permissions: [], totalCount: 0 };
    }
  }
  
  /**
   * Lấy tất cả quyền hạn không phân trang (sử dụng pageSize lớn)
   * @param search Từ khóa tìm kiếm (tùy chọn)
   * @returns Danh sách tất cả quyền hạn
   */
  async getAllPermissions(search?: string): Promise<Permission[]> {
    try {
      const queryParams = new URLSearchParams();
      // Sử dụng pageSize lớn để lấy tất cả quyền hạn trong một lần gọi API
      queryParams.append('pageSize', '10000');
      queryParams.append('pageIndex', '1');
      if (search) queryParams.append('search', search.trim());
      
      const response = await axiosInstance.get<PermissionApiResponse>(`/api/permission/page?${queryParams.toString()}`);
      
      if (response.data && response.data.data && typeof response.data.data === 'object' && 'data' in response.data.data) {
        // Xử lý trường hợp data là PermissionPaginationResult
        const paginationResult = response.data.data as PermissionPaginationResult;
        return paginationResult.data || [];
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Xử lý trường hợp data là Permission[]
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      logger.error('Lỗi khi tải tất cả quyền hạn:', error);
      return [];
    }
  }

  /**
   * Tạo quyền hạn mới
   * @param data Dữ liệu quyền hạn mới
   * @returns true nếu tạo thành công, false nếu thất bại
   */
  async createPermission(data: CreatePermissionData): Promise<boolean> {
    try {
      await axiosInstance.post('/api/permission', data);
      return true;
    } catch (error) {
      logger.error('Lỗi khi tạo quyền hạn:', error);
      return false;
    }
  }

  /**
   * Cập nhật thông tin quyền hạn
   * @param permissionId ID của quyền hạn cần cập nhật
   * @param data Dữ liệu cập nhật
   * @returns true nếu cập nhật thành công, false nếu thất bại
   */
  async updatePermission(permissionId: string | number, data: Partial<CreatePermissionData>): Promise<boolean> {
    try {
      await axiosInstance.put(`/api/permission/${permissionId}`, data);
      return true;
    } catch (error) {
      logger.error(`Lỗi khi cập nhật quyền hạn ${permissionId}:`, error);
      return false;
    }
  }

  /**
   * Xóa quyền hạn
   * @param permissionId ID của quyền hạn cần xóa
   * @returns true nếu xóa thành công, false nếu thất bại
   */
  async deletePermission(permissionId: string | number): Promise<boolean> {
    try {
      await axiosInstance.delete(`/api/permission/${permissionId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi khi xóa quyền hạn ${permissionId}:`, error);
      return false;
    }
  }
}

// Export một instance của PermissionService
const permissionService = new PermissionService();
export default permissionService;
