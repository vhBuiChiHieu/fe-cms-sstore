import React, { useState } from 'react';
import { Container, Snackbar, Alert } from '@mui/material';

import { PageHeader, SearchBar, ProductsTable } from './components';
import { CreateProductDialog, ProductDetailsDialog } from './dialogs';
import { useProducts, useCreateProductDialog, useProductDetailsDialog } from './hooks';
import { SnackbarState } from './types';

const ProductTypesPage: React.FC = () => {
  // State cho thông báo
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Sử dụng các custom hooks
  const {
    products,
    loading,
    totalCount,
    page,
    rowsPerPage,
    searchTerm,
    setSearchTerm,
    handleRefresh,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch
  } = useProducts();

  const {
    createDialogOpen,
    newProduct,
    createLoading,
    brands,
    categories,
    formErrors,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    handleCreateInputChange,
    handleSelectChange,
    handleCreateProduct
  } = useCreateProductDialog(handleRefresh, setSnackbar);

  const {
    detailDialogOpen,
    selectedProduct,
    detailLoading,
    handleOpenDetailDialog,
    handleCloseDetailDialog
  } = useProductDetailsDialog();

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg">
      <PageHeader title="Danh Sách Sản Phẩm" />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleRefresh={handleRefresh}
        handleOpenCreateDialog={handleOpenCreateDialog}
      />

      <ProductsTable
        products={products}
        loading={loading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleOpenDetailDialog={handleOpenDetailDialog}
      />

      {/* Dialog tạo sản phẩm mới */}
      <CreateProductDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        newProduct={newProduct}
        formErrors={formErrors}
        createLoading={createLoading}
        brands={brands}
        categories={categories}
        handleCreateInputChange={handleCreateInputChange}
        handleSelectChange={handleSelectChange}
        handleCreateProduct={handleCreateProduct}
      />

      {/* Dialog xem chi tiết sản phẩm */}
      <ProductDetailsDialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        product={selectedProduct}
        loading={detailLoading}
      />
      
      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductTypesPage;
