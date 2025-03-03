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
