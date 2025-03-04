/**
 * Cấu hình Axios
 */
import axios, { AxiosError, AxiosInstance } from 'axios';
import { APP_CONFIG } from './config';
import { getToken, redirectToLogin } from './authUtils';
import logger from './logger';

// Định nghĩa interface mở rộng cho AxiosInstance
interface CustomAxiosInstance extends AxiosInstance {
  isAxiosError: <T = any, D = any>(error: unknown) => error is AxiosError<T, D>;
}

// Tạo instance axios với URL cơ sở
const axiosInstance = axios.create({
  baseURL: APP_CONFIG.apiUrl,
}) as CustomAxiosInstance;

// Thêm interceptor request để tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log các request trong môi trường development
    if (APP_CONFIG.isDevelopment) {
      logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor response để xử lý lỗi xác thực
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      // Nếu lỗi 401 Unauthorized, chuyển hướng đến trang đăng nhập
      if (error.response?.status === 401) {
        logger.warn('Phiên đăng nhập hết hạn hoặc không hợp lệ');
        redirectToLogin();
      }
      
      // Log các lỗi trong môi trường development
      if (APP_CONFIG.isDevelopment) {
        logger.error(`API Error: ${error.response?.status} - ${error.message}`);
      }
    }
    return Promise.reject(error);
  }
);

// Thêm phương thức isAxiosError để kiểm tra lỗi
axiosInstance.isAxiosError = axios.isAxiosError;

export default axiosInstance;
