/**
 * Cấu hình chung cho ứng dụng
 */

export const BASE_URL = 'http://localhost:8080';
export const TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpZCI6MSwidHlwZSI6IkFDQ0VTUyIsImlhdCI6MTc0MDk2ODczMSwiZXhwIjoxNzQzNTYwNzMxfQ.l11ce56yGUZKomoUDF9teauavscoZzbYK49Jm6B5urvS1edBy3EjNn7HrGzk6h_n';

export const APP_CONFIG = {
  apiUrl: BASE_URL,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  appName: 'S-Store CMS',
  version: '1.0.0'
};
