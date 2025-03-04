import axios from 'axios';
import { BASE_URL, TOKEN } from '../utils/config';
import logger from '../utils/logger';

/**
 * Tham số cho việc lấy danh sách danh mục
 */
export interface CategoryListParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Thông tin danh mục cơ bản
 */
export interface Category {
  id: string | number;
  name: string;
  description?: string;
  slug?: string;
  parentId?: string | number | null;
  level?: number;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  children?: Category[];
}

/**
 * Kết quả phân trang danh sách danh mục
 */
export interface CategoryPaginationResult {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  beginIndex: number;
  endIndex: number;
  data: Category[];
}

/**
 * Kết quả trả về từ API danh sách danh mục
 */
export interface CategoryApiResponse {
  requestId: string;
  code: number;
  message: string;
  path: string;
  timestamp: string;
  data: Category[] | CategoryPaginationResult;
}

/**
 * Dữ liệu để tạo danh mục mới
 */
export interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: string | number | null;
}

/**
 * Service xử lý các thao tác liên quan đến danh mục
 */
class CategoryService {
  /**
   * Lấy danh sách danh mục
   * @param params Tham số tìm kiếm và phân trang
   * @returns Danh sách danh mục và thông tin phân trang
   */
  async getCategories(params: CategoryListParams = {}): Promise<{ categories: Category[], totalCount: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      // pageIndex bắt đầu từ 1 trong API
      if (params.pageIndex !== undefined) queryParams.append('pageIndex', params.pageIndex.toString());
      if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      
      const response = await axios.get<CategoryApiResponse>(`${BASE_URL}/api/category/list?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      
      if (response.data.data && typeof response.data.data === 'object' && 'data' in response.data.data) {
        // Xử lý trường hợp data là CategoryPaginationResult
        const paginationResult = response.data.data as CategoryPaginationResult;
        return {
          categories: paginationResult.data || [],
          totalCount: paginationResult.totalItems || 0
        };
      } else {
        // Xử lý trường hợp data là Category[]
        const categories = response.data.data as Category[];
        return {
          categories: categories || [],
          totalCount: categories?.length || 0
        };
      }
    } catch (error) {
      logger.error('Error fetching categories:', error);
      return { categories: [], totalCount: 0 };
    }
  }

  /**
   * Tạo danh mục mới
   * @param data Dữ liệu danh mục mới
   * @returns true nếu tạo thành công, false nếu thất bại
   */
  async createCategory(data: CreateCategoryData): Promise<boolean> {
    try {
      await axios.post(`${BASE_URL}/api/category`, data, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      return true;
    } catch (error) {
      logger.error('Error creating category:', error);
      return false;
    }
  }

  /**
   * Cập nhật thông tin danh mục
   * @param categoryId ID của danh mục cần cập nhật
   * @param data Dữ liệu cập nhật
   * @returns true nếu cập nhật thành công, false nếu thất bại
   */
  async updateCategory(categoryId: string | number, data: Partial<CreateCategoryData>): Promise<boolean> {
    try {
      await axios.put(`${BASE_URL}/api/category/${categoryId}`, data, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      return true;
    } catch (error) {
      logger.error(`Error updating category ${categoryId}:`, error);
      return false;
    }
  }

  /**
   * Xóa danh mục
   * @param categoryId ID của danh mục cần xóa
   * @returns true nếu xóa thành công, false nếu thất bại
   */
  async deleteCategory(categoryId: string | number): Promise<boolean> {
    try {
      await axios.delete(`${BASE_URL}/api/category/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      return true;
    } catch (error) {
      logger.error(`Error deleting category ${categoryId}:`, error);
      return false;
    }
  }
}

// Export một instance của CategoryService
const categoryService = new CategoryService();
export default categoryService;
