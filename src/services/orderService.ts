import axiosInstance from '../utils/axiosInstance';
import logger from '../utils/logger';

export type OrderStatusValue = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED' | string;

export interface OrderStatus {
  id: number;
  name: string;
  value: OrderStatusValue;
  description?: string;
}

export interface OrderItem {
  id: number;
  productVariantId: number;
  quantity: number;
  price: number;
  productVariant?: {
    id: number;
    sku: string;
    price: number;
    productName?: string;
    color?: string;
    size?: string;
  };
}

export interface Order {
  id: number;
  accountId: number;
  status: OrderStatusValue;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt?: string;
  updatedAt?: string;
  orderItems?: OrderItem[];
  paymentStatus?: string;
  note?: string;
}

export interface OrdersListParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  status?: string;
}

export interface OrdersListResponse {
  data: Order[];
  totalItems: number;
  totalPages: number;
  pageSize: number;
  pageIndex: number;
  beginIndex?: number;
  endIndex?: number;
}

class OrderService {
  /**
   * Lấy danh sách đơn hàng
   * @param params Tham số tìm kiếm và phân trang
   * @returns Danh sách đơn hàng và thông tin phân trang
   */
  async getOrders(params: OrdersListParams): Promise<OrdersListResponse> {
    try {
      const response = await axiosInstance.get('/api/orders/page', {
        params: {
          pageIndex: params.pageIndex || 1,
          pageSize: params.pageSize || 10,
          search: params.search,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
          status: params.status
        }
      });

      logger.debug('API response orders:', response.data);

      // Trích xuất dữ liệu từ phản hồi API
      const responseData = response.data.data;
      
      // Trả về dữ liệu đơn hàng từ API
      return {
        data: responseData.data || [],
        totalItems: responseData.totalItems || 0,
        totalPages: responseData.totalPages || 1,
        pageSize: responseData.pageSize || params.pageSize || 10,
        pageIndex: responseData.pageIndex || params.pageIndex || 1,
        beginIndex: responseData.beginIndex || 0,
        endIndex: responseData.endIndex || 0
      };
    } catch (error) {
      logger.error('Error fetching orders:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.response.status === 403) {
          throw new Error('Bạn không có quyền truy cập tài nguyên này.');
        } else if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
    }
  }

  /**
   * Lấy thông tin chi tiết đơn hàng
   * @param orderId ID của đơn hàng
   * @returns Thông tin chi tiết của đơn hàng
   */
  async getOrderDetail(orderId: string): Promise<Order> {
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}`);
      
      logger.debug('API response order detail:', response.data);
      
      const orderData = response.data.data || response.data;
      
      return {
        id: orderData.id,
        orderNumber: orderData.orderNumber || `ORD-${orderData.id}`,
        total: orderData.total || orderData.totalAmount || 0,
        status: orderData.status || 'PENDING',
        createdAt: orderData.createdAt,
        updatedAt: orderData.updatedAt,
        accountId: orderData.accountId,
        customerName: orderData.customerName || 'Không có thông tin',
        customerEmail: orderData.customerEmail || 'Không có thông tin',
        customerPhone: orderData.customerPhone || 'Không có thông tin',
        shippingAddress: orderData.shippingAddress || 'Không có thông tin',
        orderItems: orderData.items || [],
        paymentMethod: orderData.paymentMethod || 'Không có thông tin',
        paymentStatus: orderData.paymentStatus || 'Chưa thanh toán',
        note: orderData.note
      };
    } catch (error) {
      logger.error('Error fetching order detail:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new Error('Không tìm thấy đơn hàng.');
        } else if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
    }
  }

  /**
   * Cập nhật trạng thái đơn hàng
   * @param orderId ID của đơn hàng
   * @param statusId ID trạng thái mới
   * @returns true nếu cập nhật thành công
   */
  async updateOrderStatus(orderId: string, statusId: number): Promise<boolean> {
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/status`, { statusId });
      
      logger.debug('API response update order status:', response.data);
      
      return response.status === 200;
    } catch (error) {
      logger.error('Error updating order status:', error);
      
      if (axiosInstance.isAxiosError(error) && error.response) {
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.');
    }
  }

  /**
   * Lấy danh sách các trạng thái đơn hàng
   * @returns Danh sách trạng thái đơn hàng
   */
  async getOrderStatuses(): Promise<OrderStatus[]> {
    try {
      const response = await axiosInstance.get('/api/orders/statuses');
      
      logger.debug('API response order statuses:', response.data);
      
      return response.data.data || response.data || [];
    } catch (error) {
      logger.error('Error fetching order statuses:', error);
      
      // Trả về danh sách trạng thái mặc định nếu không thể lấy từ API
      return [
        { id: 0, name: 'Chờ xử lý', value: 'PENDING', description: 'Đơn hàng đang chờ xử lý' },
        { id: 1, name: 'Đang xử lý', value: 'PROCESSING', description: 'Đơn hàng đang được xử lý' },
        { id: 2, name: 'Đang giao hàng', value: 'SHIPPED', description: 'Đơn hàng đang được giao' },
        { id: 3, name: 'Đã giao hàng', value: 'DELIVERED', description: 'Đơn hàng đã được giao thành công' },
        { id: 4, name: 'Đã hủy', value: 'CANCELED', description: 'Đơn hàng đã bị hủy' }
      ];
    }
  }
}

const orderService = new OrderService();
export default orderService;
