/**
 * Cấu hình chung cho ứng dụng
 */

// Sử dụng biến môi trường từ file .env
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const APP_CONFIG = {
  apiUrl: BASE_URL,
  env: process.env.REACT_APP_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  appName: 'S-Store CMS',
  version: '1.0.0'
};
