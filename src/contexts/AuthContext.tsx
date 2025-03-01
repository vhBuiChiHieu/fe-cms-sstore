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
      
      const { user, token, refreshToken } = response.data;
      
      const newAuthState: AuthState = {
        user,
        token,
        refreshToken
      };
      
      setAuthState(newAuthState);
      
      if (rememberMe) {
        localStorage.setItem('authState', JSON.stringify(newAuthState));
      }
      
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
        isAuthenticated: !!authState.user && !!authState.token,
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
