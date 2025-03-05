import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import productService, { ProductListParams } from '../../../../services/productService';
import { Product } from '../types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  refreshTrigger: number;
  handleRefresh: () => void;
  handleChangePage: (_: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (event: React.FormEvent) => void;
}

export const useProducts = (): UseProductsResult => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Tải danh sách sản phẩm
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params: ProductListParams = {
          pageIndex: page + 1, // pageIndex bắt đầu từ 1 trong API
          pageSize: rowsPerPage,
          search: searchTerm,
          sortBy: 'createdAt',
          sortDirection: 'desc'
        };
        
        const result = await productService.getProducts(params);
        setProducts(result.products);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error('Error loading products:', error);
        enqueueSnackbar('Đã xảy ra lỗi khi tải danh sách sản phẩm', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, rowsPerPage, searchTerm, refreshTrigger, enqueueSnackbar]);

  // Xử lý thay đổi trang
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số hàng mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý tìm kiếm
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(0);
  };

  // Xử lý làm mới dữ liệu
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    products,
    loading,
    totalCount,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    searchTerm,
    setSearchTerm,
    refreshTrigger,
    handleRefresh,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch
  };
};
