import axios from 'axios';
import { BASE_URL, TOKEN } from '../utils/config';
import logger from '../utils/logger';

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface RoleListParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
}

/**
 * Lấy danh sách vai trò từ API
 */
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/role`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    
    logger.debug('API roles response:', response.data);
    
    // Kiểm tra cấu trúc dữ liệu trả về từ API
    if (response.data && response.data.data) {
      // Nếu API trả về cấu trúc data.data
      const roles = response.data.data;
      
      if (Array.isArray(roles)) {
        return roles.map((role: any) => ({
          id: role.id.toString(),
          name: role.name,
          description: role.description,
          permissions: role.permissions
        }));
      }
    }
    
    // Nếu API trả về mảng trực tiếp
    if (Array.isArray(response.data)) {
      return response.data.map((role: any) => ({
        id: role.id.toString(),
        name: role.name,
        description: role.description,
        permissions: role.permissions
      }));
    }
    
    // Nếu không phân tích được, trả về dữ liệu mẫu
    logger.warn('Không thể phân tích cấu trúc dữ liệu API roles, sử dụng dữ liệu mẫu');
    return getMockRoles();
    
  } catch (error) {
    logger.error('Lỗi khi lấy danh sách vai trò:', error);
    
    // Trả về dữ liệu mẫu khi API bị lỗi hoặc không có sẵn
    return getMockRoles();
  }
};

/**
 * Lấy danh sách vai trò từ API với phân trang
 */
export const getRolesPaginated = async (params: RoleListParams): Promise<PaginatedResponse<Role>> => {
  try {
    const { pageIndex, pageSize, search } = params;
    const queryParams = new URLSearchParams();
    queryParams.append('pageIndex', pageIndex.toString());
    queryParams.append('pageSize', pageSize.toString());
    if (search) queryParams.append('search', search);
    
    const response = await axios.get(`${BASE_URL}/api/role?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    
    logger.debug('API paginated roles response:', response.data);
    
    // Kiểm tra cấu trúc dữ liệu trả về từ API
    if (response.data && response.data.data) {
      // Nếu API trả về cấu trúc data.data
      const responseData = response.data.data;
      
      return {
        data: Array.isArray(responseData.data) ? responseData.data.map((role: any) => ({
          id: role.id.toString(),
          name: role.name,
          description: role.description,
          permissions: role.permissions
        })) : [],
        totalItems: responseData.totalItems || 0,
        totalPages: responseData.totalPages || 1,
        currentPage: responseData.pageIndex || 1,
        pageSize: responseData.pageSize || 10
      };
    }
    
    // Nếu không phân tích được, trả về dữ liệu mẫu
    logger.warn('Không thể phân tích cấu trúc dữ liệu API paginated roles, sử dụng dữ liệu mẫu');
    const mockRoles = getMockRoles();
    return {
      data: mockRoles,
      totalItems: mockRoles.length,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10
    };
    
  } catch (error) {
    logger.error('Lỗi khi lấy danh sách vai trò phân trang:', error);
    
    // Trả về dữ liệu mẫu khi API bị lỗi hoặc không có sẵn
    const mockRoles = getMockRoles();
    return {
      data: mockRoles,
      totalItems: mockRoles.length,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10
    };
  }
};

/**
 * Tạo dữ liệu mẫu cho danh sách vai trò
 */
export const getMockRoles = (): Role[] => {
  return [
    {
      id: '1',
      name: 'ADMIN',
      description: 'Quản trị viên hệ thống',
      permissions: [
        { id: 1, name: 'CREATE_USER', description: 'Tạo người dùng' },
        { id: 2, name: 'UPDATE_USER', description: 'Cập nhật người dùng' },
        { id: 3, name: 'DELETE_USER', description: 'Xóa người dùng' }
      ]
    },
    {
      id: '2',
      name: 'MANAGER',
      description: 'Quản lý',
      permissions: [
        { id: 4, name: 'VIEW_USER', description: 'Xem người dùng' },
        { id: 5, name: 'UPDATE_USER', description: 'Cập nhật người dùng' }
      ]
    },
    {
      id: '3',
      name: 'GUEST',
      description: 'Khách',
      permissions: [
        { id: 6, name: 'VIEW_PUBLIC_INFO', description: 'Xem thông tin công khai' }
      ]
    },
    {
      id: '4',
      name: 'USER',
      description: 'Người dùng thông thường',
      permissions: [
        { id: 7, name: 'VIEW_OWN_INFO', description: 'Xem thông tin cá nhân' }
      ]
    }
  ];
};
