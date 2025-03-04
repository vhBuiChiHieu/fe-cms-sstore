import axiosInstance from '../utils/axiosInstance';
import { BASE_URL } from '../utils/config';
import logger from '../utils/logger';

/**
 * Tham số cho việc lấy danh sách sản phẩm
 */
export interface ProductListParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  categoryId?: string | number;
  typeId?: string | number;
  brandId?: string | number;
}

/**
 * Thông tin thương hiệu
 */
export interface Brand {
  id: string | number;
  name: string;
  description?: string;
  logoUrl?: string | null;
}

/**
 * Thông tin danh mục
 */
export interface Category {
  id: string | number;
  name: string;
  description?: string;
  slug?: string;
}

/**
 * Thông tin sản phẩm cơ bản
 */
export interface Product {
  id: string | number;
  name: string;
  description?: string;
  brand?: Brand;
  category?: Category;
  price?: number;
  salePrice?: number;
  discount?: number;
  quantity?: number;
  sold?: number;
  status?: number;
  images?: string[];
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Kết quả phân trang danh sách sản phẩm
 */
export interface ProductPaginationResult {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  beginIndex: number;
  endIndex: number;
  data: Product[];
}

/**
 * Kết quả trả về từ API danh sách sản phẩm
 */
export interface ProductApiResponse {
  requestId: string;
  code: number;
  message: string;
  path: string;
  timestamp: string;
  data: ProductPaginationResult | null;
}

/**
 * Dữ liệu để tạo sản phẩm mới
 */
export interface CreateProductData {
  name: string;
  description?: string;
  price?: number;
  salePrice?: number;
  quantity?: number;
  categoryId?: string | number;
  brandId?: string | number;
  images?: string[];
  thumbnail?: string;
}

/**
 * Service xử lý các thao tác liên quan đến sản phẩm
 */
class ProductService {
  /**
   * Lấy danh sách sản phẩm
   * @param params Tham số tìm kiếm và phân trang
   * @returns Danh sách sản phẩm và thông tin phân trang
   */
  async getProducts(params: ProductListParams = {}): Promise<{ products: Product[], totalCount: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      // pageIndex bắt đầu từ 1 trong API
      if (params.pageIndex !== undefined) queryParams.append('pageIndex', params.pageIndex.toString());
      if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());
      if (params.typeId) queryParams.append('typeId', params.typeId.toString());
      if (params.brandId) queryParams.append('brandId', params.brandId.toString());
      
      const response = await axiosInstance.get<ProductApiResponse>(`${BASE_URL}/api/product/page?${queryParams.toString()}`);
      
      if (response.data.data) {
        const paginationResult = response.data.data;
        return {
          products: paginationResult.data || [],
          totalCount: paginationResult.totalItems || 0
        };
      } else {
        return {
          products: [],
          totalCount: 0
        };
      }
    } catch (error) {
      logger.error('Error fetching products:', error);
      return { products: [], totalCount: 0 };
    }
  }

  /**
   * Lấy thông tin chi tiết sản phẩm
   * @param productId ID của sản phẩm
   * @returns Thông tin chi tiết sản phẩm hoặc null nếu không tìm thấy
   */
  async getProductById(productId: string | number): Promise<Product | null> {
    try {
      const response = await axiosInstance.get<ProductApiResponse>(`${BASE_URL}/api/product/${productId}`);
      
      if (response.data.data && 'data' in response.data.data) {
        const products = response.data.data.data;
        return products.length > 0 ? products[0] : null;
      }
      
      return null;
    } catch (error) {
      logger.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Tạo sản phẩm mới
   * @param data Dữ liệu sản phẩm mới
   * @returns true nếu tạo thành công, false nếu thất bại
   */
  async createProduct(data: CreateProductData): Promise<boolean> {
    try {
      await axiosInstance.post(`${BASE_URL}/api/product`, data);
      return true;
    } catch (error) {
      logger.error('Error creating product:', error);
      return false;
    }
  }

  /**
   * Cập nhật thông tin sản phẩm
   * @param productId ID của sản phẩm cần cập nhật
   * @param data Dữ liệu cập nhật
   * @returns true nếu cập nhật thành công, false nếu thất bại
   */
  async updateProduct(productId: string | number, data: Partial<CreateProductData>): Promise<boolean> {
    try {
      await axiosInstance.put(`${BASE_URL}/api/product/${productId}`, data);
      return true;
    } catch (error) {
      logger.error(`Error updating product ${productId}:`, error);
      return false;
    }
  }

  /**
   * Xóa sản phẩm
   * @param productId ID của sản phẩm cần xóa
   * @returns true nếu xóa thành công, false nếu thất bại
   */
  async deleteProduct(productId: string | number): Promise<boolean> {
    try {
      await axiosInstance.delete(`${BASE_URL}/api/product/${productId}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting product ${productId}:`, error);
      return false;
    }
  }
}

// Export một instance của ProductService
const productService = new ProductService();
export default productService;
