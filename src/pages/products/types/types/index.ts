import { Product, Brand, Category, CreateProductData } from '../../../../services/productService';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export interface FormErrors {
  name?: string;
  brandId?: string;
  categoryId?: string;
}

export type { Product, Brand, Category, CreateProductData };
