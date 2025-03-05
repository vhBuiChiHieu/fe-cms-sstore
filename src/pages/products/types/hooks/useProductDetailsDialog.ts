import { useState } from 'react';
import { useSnackbar } from 'notistack';
import productService from '../../../../services/productService';
import { Product } from '../types';

interface UseProductDetailsDialogResult {
  detailDialogOpen: boolean;
  selectedProduct: Product | null;
  detailLoading: boolean;
  handleOpenDetailDialog: (product: Product) => Promise<void>;
  handleCloseDetailDialog: () => void;
}

export const useProductDetailsDialog = (): UseProductDetailsDialogResult => {
  const { enqueueSnackbar } = useSnackbar();
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // Mở dialog xem chi tiết sản phẩm
  const handleOpenDetailDialog = async (product: Product) => {
    setSelectedProduct(product); // Đặt sản phẩm ban đầu ngay lập tức
    setDetailDialogOpen(true);
    setDetailLoading(true);
    
    try {
      const productDetail = await productService.getProductById(product.id);
      if (productDetail) {
        setSelectedProduct(productDetail);
      } else {
        // Giữ nguyên sản phẩm hiện tại, chỉ hiển thị thông báo lỗi
        enqueueSnackbar('Không thể tải thông tin chi tiết sản phẩm', { variant: 'warning' });
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      enqueueSnackbar('Lỗi khi tải thông tin sản phẩm', { variant: 'error' });
    } finally {
      setDetailLoading(false);
    }
  };
  
  // Đóng dialog xem chi tiết sản phẩm
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedProduct(null);
  };

  return {
    detailDialogOpen,
    selectedProduct,
    detailLoading,
    handleOpenDetailDialog,
    handleCloseDetailDialog
  };
};
