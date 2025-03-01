import axios from 'axios';
import { BASE_URL, TOKEN } from '../utils/config';

export interface Role {
  id: string;
  name: string;
  description?: string;
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
    
    console.log('API roles response:', response.data);
    
    // Kiểm tra cấu trúc dữ liệu trả về từ API
    if (response.data && response.data.data) {
      // Nếu API trả về cấu trúc data.data
      const roles = response.data.data;
      
      if (Array.isArray(roles)) {
        return roles.map((role: any) => ({
          id: role.id.toString(),
          name: role.name,
          description: role.description
        }));
      }
    }
    
    // Nếu API trả về mảng trực tiếp
    if (Array.isArray(response.data)) {
      return response.data.map((role: any) => ({
        id: role.id.toString(),
        name: role.name,
        description: role.description
      }));
    }
    
    // Nếu không phân tích được, trả về dữ liệu mẫu
    console.log('Không thể phân tích cấu trúc dữ liệu API roles, sử dụng dữ liệu mẫu');
    return getMockRoles();
    
  } catch (error) {
    console.error('Lỗi khi lấy danh sách vai trò:', error);
    
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
      description: 'Quản trị viên hệ thống'
    },
    {
      id: '2',
      name: 'MANAGER',
      description: 'Quản lý'
    },
    {
      id: '3',
      name: 'STAFF',
      description: 'Nhân viên'
    },
    {
      id: '4',
      name: 'USER',
      description: 'Người dùng thông thường'
    }
  ];
};
