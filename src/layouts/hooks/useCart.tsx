import { useState, useEffect } from 'react';
import cartService from '../../services/cartService';
import logger from '../../utils/logger';

export const useCart = () => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);

  // Lấy số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const result = await cartService.getCarts({ pageIndex: 1, pageSize: 1 });
        setCartCount(result.totalCount);
      } catch (error) {
        logger.error('Lỗi khi tải số lượng giỏ hàng:', error);
      }
    };

    fetchCartCount();
    // Có thể thêm interval để cập nhật số lượng giỏ hàng định kỳ
    const interval = setInterval(fetchCartCount, 60000); // Cập nhật mỗi phút
    
    return () => clearInterval(interval);
  }, []);

  const handleCartMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartMenuClose = () => {
    setCartAnchorEl(null);
  };

  return {
    cartCount,
    cartAnchorEl,
    handleCartMenuOpen,
    handleCartMenuClose
  };
};
