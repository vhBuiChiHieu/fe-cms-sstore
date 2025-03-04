import { BASE_URL } from '../utils/config';
import logger from '../utils/logger';
import axiosInstance from '../utils/axiosInstance';

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
    const response = await axiosInstance.get('/api/role/page');
    
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
    logger.debug('Chi tiết lỗi:', error);
    
    if (axiosInstance.isAxiosError(error)) {
      logger.error('AxiosError:', error.response?.data);
    }
    
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
    
    // Sử dụng axiosInstance thay vì axios để tận dụng token tự động
    const response = await axiosInstance.get(`/api/role/page?${queryParams.toString()}`);
    
    logger.debug('API paginated roles response:', response.data);
    
    // Cấu trúc API thực tế có phân trang: { code, data: { data: Role[], totalItems, totalPages, ... }, ... }
    if (response.data && response.data.data && response.data.data.data) {
      const paginationData = response.data.data;
      const roles = paginationData.data.map((role: any) => ({
        id: role.id.toString(),
        name: role.name,
        description: role.description,
        permissions: role.permissions || []
      }));
      
      // Trả về kết quả với thông tin phân trang
      return {
        data: roles,
        totalItems: paginationData.totalItems || roles.length,
        totalPages: paginationData.totalPages || 1,
        currentPage: paginationData.pageIndex || pageIndex,
        pageSize: paginationData.pageSize || pageSize
      };
    }
    
    // Nếu dữ liệu không đúng định dạng thì sử dụng dữ liệu mẫu
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
    logger.debug('Chi tiết lỗi:', error);
    
    if (axiosInstance.isAxiosError(error)) {
      logger.error('AxiosError:', error.response?.data);
    }
    
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
/**
 * Lấy chi tiết vai trò từ API theo ID
 */
export const getRoleById = async (roleId: string): Promise<Role> => {
  try {
    const response = await axiosInstance.get(`/api/role/${roleId}`);
    
    logger.debug('API role detail response:', response.data);
    
    // Kiểm tra cấu trúc dữ liệu trả về từ API
    if (response.data && response.data.data) {
      const roleData = response.data.data;
      return {
        id: roleData.id.toString(),
        name: roleData.name,
        description: roleData.description,
        permissions: Array.isArray(roleData.permissions) ? roleData.permissions : []
      };
    }
    
    // Nếu API trả về trực tiếp đối tượng vai trò
    if (response.data && response.data.id) {
      const roleData = response.data;
      return {
        id: roleData.id.toString(),
        name: roleData.name,
        description: roleData.description,
        permissions: Array.isArray(roleData.permissions) ? roleData.permissions : []
      };
    }
    
    // Nếu không phân tích được, trả về dữ liệu mẫu
    logger.warn(`Không thể phân tích cấu trúc dữ liệu API vai trò ID ${roleId}, sử dụng dữ liệu mẫu`);
    return getMockRoleById(roleId);
    
  } catch (error) {
    logger.error(`Lỗi khi lấy chi tiết vai trò ID ${roleId}:`, error);
    
    if (axiosInstance.isAxiosError(error)) {
      logger.error('AxiosError:', error.response?.data);
    }
    
    // Trả về dữ liệu mẫu khi API bị lỗi hoặc không có sẵn
    return getMockRoleById(roleId);
  }
};

/**
 * Lấy dữ liệu mẫu cho vai trò theo ID
 */
export const getMockRoleById = (roleId: string): Role => {
  const allMockRoles = getMockRoles();
  const foundRole = allMockRoles.find(role => role.id === roleId);
  return foundRole || allMockRoles[0]; // Trả về vai trò đầu tiên nếu không tìm thấy
};

/**
 * Dữ liệu để tạo vai trò mới
 */
export interface CreateRoleData {
  name: string;
  description?: string;
  permissionIds?: number[];
}

/**
 * Tạo vai trò mới
 * @param data Dữ liệu để tạo vai trò mới (tên, mô tả và danh sách ID quyền)
 * @returns Trả về true nếu tạo thành công, ngược lại trả về false
 */
export const createRole = async (data: CreateRoleData): Promise<boolean> => {
  try {
    // Chuyển đổi định dạng dữ liệu thành format API yêu cầu
    const apiPayload = {
      name: data.name,
      description: data.description || '',
      permissions: data.permissionIds ? data.permissionIds.map(id => ({ id })) : []
    };
    
    logger.debug('Tạo vai trò với dữ liệu:', apiPayload);
    
    // Gọi API để tạo vai trò mới
    const response = await axiosInstance.post('/api/role', apiPayload);
    
    logger.debug('Kết quả tạo vai trò:', response.data);
    
    // Kiểm tra kết quả trả về từ API
    if (response.data && response.data.code === 200) {
      logger.info('Tạo vai trò thành công:', data.name);
      return true;
    }
    
    logger.warn('Tạo vai trò thất bại:', response.data);
    return false;
  } catch (error) {
    logger.error('Lỗi khi tạo vai trò mới:', error);
    
    if (axiosInstance.isAxiosError(error)) {
      logger.error('Chi tiết lỗi API:', error.response?.data);
    }
    
    return false;
  }
};

/**
 * Xóa vai trò theo ID
 * @param roleId ID của vai trò cần xóa
 * @returns Trả về true nếu xóa thành công, ngược lại trả về false
 */
export const deleteRole = async (roleId: string | number): Promise<boolean> => {
  try {
    logger.debug(`Xóa vai trò có ID: ${roleId}`);
    
    // Gọi API để xóa vai trò
    const response = await axiosInstance.delete(`/api/role/${roleId}`);
    
    logger.debug('Kết quả xóa vai trò:', response.data);
    
    // Kiểm tra kết quả trả về từ API
    if (response.data && response.data.code === 200) {
      logger.info(`Xóa vai trò thành công ID: ${roleId}`);
      return true;
    }
    
    logger.warn(`Xóa vai trò thất bại ID: ${roleId}`, response.data);
    return false;
  } catch (error) {
    logger.error(`Lỗi khi xóa vai trò ID: ${roleId}`, error);
    
    if (axiosInstance.isAxiosError(error)) {
      logger.error('Chi tiết lỗi API:', error.response?.data);
    }
    
    return false;
  }
};

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
