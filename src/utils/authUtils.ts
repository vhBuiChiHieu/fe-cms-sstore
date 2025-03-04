/**
 * Các tiện ích xử lý xác thực
 */

/**
 * Lấy token từ localStorage
 * @returns Token hoặc null nếu không có
 */
export const getToken = (): string | null => {
  // Ưu tiên lấy token từ localStorage
  const token = localStorage.getItem('token');
  if (token) return token;
  
  // Nếu không có token riêng, thử lấy từ authState
  const authState = localStorage.getItem('authState');
  if (authState) {
    try {
      const parsedAuthState = JSON.parse(authState);
      return parsedAuthState.token || null;
    } catch (error) {
      console.error('Lỗi khi phân tích dữ liệu xác thực:', error);
      return null;
    }
  }
  
  return null;
};

/**
 * Lấy refresh token từ localStorage
 * @returns Refresh token hoặc null nếu không có
 */
export const getRefreshToken = (): string | null => {
  // Ưu tiên lấy refresh token từ localStorage
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) return refreshToken;
  
  // Nếu không có refresh token riêng, thử lấy từ authState
  const authState = localStorage.getItem('authState');
  if (authState) {
    try {
      const parsedAuthState = JSON.parse(authState);
      return parsedAuthState.refreshToken || null;
    } catch (error) {
      console.error('Lỗi khi phân tích dữ liệu xác thực:', error);
      return null;
    }
  }
  
  return null;
};

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 * @returns true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Chuyển hướng đến trang đăng nhập
 */
export const redirectToLogin = (): void => {
  window.location.href = '/login';
};
