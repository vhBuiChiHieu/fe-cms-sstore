import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { SelectChangeEvent } from '@mui/material';
import productService from '../../../../services/productService';
import { Brand, Category, CreateProductData, FormErrors, SnackbarState } from '../types';

interface UseCreateProductDialogResult {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  newProduct: CreateProductData;
  setNewProduct: React.Dispatch<React.SetStateAction<CreateProductData>>;
  createLoading: boolean;
  brands: Brand[];
  categories: Category[];
  formErrors: FormErrors;
  handleOpenCreateDialog: () => void;
  handleCloseCreateDialog: () => void;
  handleCreateInputChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  handleSelectChange: (e: SelectChangeEvent<string | number>) => void;
  handleCreateProduct: () => Promise<void>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
}

export const useCreateProductDialog = (
  handleRefresh: () => void,
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>
): UseCreateProductDialogResult => {
  const { enqueueSnackbar } = useSnackbar();
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<CreateProductData>({
    name: '',
    description: '',
    brandId: 0,
    categoryId: 0
  });
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Tải danh sách thương hiệu và danh mục
  useEffect(() => {
    const loadBrandsAndCategories = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          productService.getBrands(),
          productService.getCategories()
        ]);
        
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading brands and categories:', error);
        setSnackbar({
          open: true,
          message: 'Đã xảy ra lỗi khi tải danh sách thương hiệu và danh mục',
          severity: 'error'
        });
      }
    };
    
    loadBrandsAndCategories();
  }, [setSnackbar]);

  // Mở dialog tạo sản phẩm mới
  const handleOpenCreateDialog = () => {
    setNewProduct({
      name: '',
      description: '',
      brandId: brands.length > 0 ? brands[0].id : 0,
      categoryId: categories.length > 0 ? categories[0].id : 0,
    });
    setFormErrors({});
    setCreateDialogOpen(true);
  };
  
  // Đóng dialog tạo sản phẩm mới
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  // Xử lý thay đổi input trong form tạo sản phẩm
  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewProduct(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Xóa lỗi khi người dùng chỉnh sửa
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };
  
  // Xử lý thay đổi select trong form tạo sản phẩm
  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    if (name) {
      setNewProduct(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Xóa lỗi khi người dùng chỉnh sửa
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };
  
  // Xác thực form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!newProduct.name.trim()) {
      errors.name = 'Tên sản phẩm không được để trống';
    }
    
    if (!newProduct.brandId) {
      errors.brandId = 'Vui lòng chọn thương hiệu';
    }
    
    if (!newProduct.categoryId) {
      errors.categoryId = 'Vui lòng chọn danh mục';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Xử lý tạo sản phẩm mới
  const handleCreateProduct = async () => {
    if (!validateForm()) return;
    
    setCreateLoading(true);
    try {
      const success = await productService.createProduct(newProduct);
      
      if (success) {
        setCreateDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Tạo sản phẩm thành công',
          severity: 'success'
        });
        handleRefresh();
      } else {
        setSnackbar({
          open: true,
          message: 'Tạo sản phẩm thất bại',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setSnackbar({
        open: true,
        message: 'Đã xảy ra lỗi khi tạo sản phẩm',
        severity: 'error'
      });
    } finally {
      setCreateLoading(false);
    }
  };

  return {
    createDialogOpen,
    setCreateDialogOpen,
    newProduct,
    setNewProduct,
    createLoading,
    brands,
    categories,
    formErrors,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    handleCreateInputChange,
    handleSelectChange,
    handleCreateProduct,
    setSnackbar
  };
};
