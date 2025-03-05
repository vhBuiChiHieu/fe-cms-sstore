import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { Brand, Category, CreateProductData, FormErrors } from '../types';

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  newProduct: CreateProductData;
  formErrors: FormErrors;
  createLoading: boolean;
  brands: Brand[];
  categories: Category[];
  handleCreateInputChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  handleSelectChange: (e: SelectChangeEvent<string | number>) => void;
  handleCreateProduct: () => Promise<void>;
}

const CreateProductDialog: React.FC<CreateProductDialogProps> = ({
  open,
  onClose,
  newProduct,
  formErrors,
  createLoading,
  brands,
  categories,
  handleCreateInputChange,
  handleSelectChange,
  handleCreateProduct
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Thêm sản phẩm mới</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, pb: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                name="name"
                value={newProduct.name}
                onChange={handleCreateInputChange}
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={newProduct.description || ''}
                onChange={handleCreateInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.brandId} required>
                <InputLabel id="brand-label">Thương hiệu</InputLabel>
                <Select
                  labelId="brand-label"
                  name="brandId"
                  value={newProduct.brandId || ''}
                  onChange={handleSelectChange}
                  label="Thương hiệu"
                >
                  {[...brands]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                </Select>
                {formErrors.brandId && (
                  <FormHelperText>{formErrors.brandId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.categoryId} required>
                <InputLabel id="category-label">Danh mục</InputLabel>
                <Select
                  labelId="category-label"
                  name="categoryId"
                  value={newProduct.categoryId || ''}
                  onChange={handleSelectChange}
                  label="Danh mục"
                >
                  {[...categories]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Select>
                {formErrors.categoryId && (
                  <FormHelperText>{formErrors.categoryId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={createLoading}>
          Hủy
        </Button>
        <Button 
          onClick={handleCreateProduct} 
          variant="contained" 
          color="primary"
          disabled={createLoading}
        >
          {createLoading ? <CircularProgress size={24} /> : 'Tạo sản phẩm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProductDialog;
