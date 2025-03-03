import axios from 'axios';
import { BASE_URL, TOKEN } from '../utils/config';
import logger from '../utils/logger';

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
   * Lấy danh sách quyền hạn
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
      
      const response = await axios.get<PermissionApiResponse>(`${BASE_URL}/api/permission/page?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      
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
   * Tạo quyền hạn mới
   * @param data Dữ liệu quyền hạn mới
   * @returns true nếu tạo thành công, false nếu thất bại
   */
  async createPermission(data: CreatePermissionData): Promise<boolean> {
    try {
      await axios.post(`${BASE_URL}/api/permission`, data, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
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
      await axios.put(`${BASE_URL}/api/permission/${permissionId}`, data, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
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
      await axios.delete(`${BASE_URL}/api/permission/${permissionId}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
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
