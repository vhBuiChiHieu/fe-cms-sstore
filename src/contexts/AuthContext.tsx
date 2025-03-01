import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/config';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedAuthState = localStorage.getItem('authState');
      if (storedAuthState) {
        try {
          setAuthState(JSON.parse(storedAuthState));
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu xác thực:', error);
          localStorage.removeItem('authState');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Cấu hình axios với token
  useEffect(() => {
    if (authState.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authState.token]);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
        refresh: true
      });
      
      // Kiểm tra cấu trúc phản hồi từ API
      console.log('API Response:', response.data);
      
      // Trích xuất dữ liệu từ cấu trúc phản hồi API
      const responseData = response.data;
      const token = responseData.data?.token;
      const refreshToken = responseData.data?.refreshToken;
      
      // Tạo user object từ thông tin trong token
      const user: User = {
        id: '1', // Giả định ID từ token
        email: email,
        name: 'Admin User', // Giả định tên từ token
        role: 'admin' // Giả định vai trò từ token
      };
      
      const newAuthState: AuthState = {
        user,
        token,
        refreshToken
      };
      
      console.log('New Auth State:', newAuthState);
      setAuthState(newAuthState);
      
      // Luôn lưu token khi đăng nhập thành công
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        // Xử lý lỗi từ API
        const errorMessage = error.response.data.message || 'Đăng nhập không thành công';
        setError(errorMessage);
      } else {
        setError('Đã xảy ra lỗi khi kết nối đến máy chủ');
      }
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      token: null,
      refreshToken: null
    });
    localStorage.removeItem('authState');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: !!authState.token, // Chỉ kiểm tra token, không kiểm tra user
        isLoading,
        login,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

export default AuthContext;
