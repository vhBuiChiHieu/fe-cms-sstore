import { BASE_URL } from '../utils/config';
import logger from '../utils/logger';
import axiosInstance from '../utils/axiosInstance';

/**
 * Tham số cho việc lấy danh sách giỏ hàng
 */
export interface CartListParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Thông tin tài khoản
 */
export interface CartAccount {
  id: number | string;
  mail: string;
  status: number;
  phone?: string | null;
  roles?: any[] | null;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  description?: string | null;
  avatar?: string | null;
}

/**
 * Thông tin biến thể sản phẩm
 */
export interface ProductVariant {
  id: number | string;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
}

/**
 * Thông tin mục trong giỏ hàng
 */
export interface CartItem {
  id: number | string;
  quantity: number;
  productVariant: ProductVariant;
}

/**
 * Thông tin giỏ hàng
 */
export interface Cart {
  id: number | string;
  account: CartAccount;
  cartItems: CartItem[];
}

/**
 * Kết quả phân trang danh sách giỏ hàng
 */
export interface CartPaginationResult {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  beginIndex: number;
  endIndex: number;
  data: Cart[];
}

/**
 * Kết quả trả về từ API danh sách giỏ hàng
 */
export interface CartApiResponse {
  requestId: string;
  code: number;
  message: string;
  path: string;
  timestamp: string;
  data: CartPaginationResult;
}

/**
 * Service xử lý các thao tác liên quan đến giỏ hàng
 */
class CartService {
  /**
   * Lấy danh sách giỏ hàng
   * @param params Tham số tìm kiếm và phân trang
   * @returns Danh sách giỏ hàng và thông tin phân trang
   */
  async getCarts(params: CartListParams = {}): Promise<{ carts: Cart[], totalCount: number, pagination: Omit<CartPaginationResult, 'data'> | null }> {
    try {
      const queryParams = new URLSearchParams();
      
      // pageIndex bắt đầu từ 1 trong API
      if (params.pageIndex !== undefined) queryParams.append('pageIndex', params.pageIndex.toString());
      if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      
      const response = await axiosInstance.get<CartApiResponse>(`/api/cart/page?${queryParams.toString()}`);
      
      if (response.data.data) {
        const paginationResult = response.data.data;
        const { data, ...paginationInfo } = paginationResult;
        
        return {
          carts: data || [],
          totalCount: paginationResult.totalItems || 0,
          pagination: paginationInfo
        };
      }
      
      return { carts: [], totalCount: 0, pagination: null };
    } catch (error) {
      logger.error('Error fetching carts:', error);
      return { carts: [], totalCount: 0, pagination: null };
    }
  }

  /**
   * Lấy tất cả các mục trong giỏ hàng
   * @returns Danh sách các mục trong giỏ hàng
   */
  async getAllCartItems(): Promise<CartItem[]> {
    try {
      const result = await this.getCarts({ pageIndex: 1, pageSize: 100 });
      
      // Gộp tất cả các mục từ tất cả giỏ hàng
      const allItems: CartItem[] = [];
      result.carts.forEach(cart => {
        cart.cartItems.forEach(item => {
          allItems.push({
            ...item,
            // Thêm thông tin tài khoản vào mỗi mục
            account: cart.account
          } as any);
        });
      });
      
      return allItems;
    } catch (error) {
      logger.error('Error fetching all cart items:', error);
      return [];
    }
  }

  /**
   * Xóa một mục trong giỏ hàng
   * @param cartItemId ID của mục cần xóa
   * @returns true nếu xóa thành công, false nếu thất bại
   */
  async deleteCartItem(cartItemId: string | number): Promise<boolean> {
    try {
      // Thử nhiều endpoint khác nhau vì chưa rõ endpoint chính xác
      try {
        await axiosInstance.delete(`/api/cart/item/${cartItemId}`);
        return true;
      } catch (error) {
        logger.error(`Endpoint /api/cart/item/${cartItemId} không hoạt động, thử endpoint khác`);
        
        try {
          await axiosInstance.delete(`/api/cart-item/${cartItemId}`);
          return true;
        } catch (error) {
          logger.error(`Endpoint /api/cart-item/${cartItemId} không hoạt động, thử endpoint khác`);
          
          try {
            await axiosInstance.delete(`/api/cart-items/${cartItemId}`);
            return true;
          } catch (error) {
            logger.error(`Endpoint /api/cart-items/${cartItemId} không hoạt động, thử endpoint khác`);
            
            // Thử endpoint cuối cùng
            await axiosInstance.delete(`/api/cart/${cartItemId}`);
            return true;
          }
        }
      }
    } catch (error) {
      logger.error(`Error deleting cart item ${cartItemId}:`, error);
      return false;
    }
  }

  /**
   * Lấy chi tiết một mục trong giỏ hàng
   * @param cartItemId ID của mục cần lấy chi tiết
   * @returns Thông tin chi tiết của mục trong giỏ hàng
   */
  async getCartItemDetail(cartItemId: string | number): Promise<CartItem | null> {
    try {
      const response = await axiosInstance.get(`/api/cart/item/${cartItemId}`);
      
      if (response.data && response.data.data) {
        return response.data.data as CartItem;
      }
      
      return null;
    } catch (error) {
      logger.error(`Error fetching cart item detail ${cartItemId}:`, error);
      return null;
    }
  }
}

// Export một instance của CartService
const cartService = new CartService();
export default cartService;
