import React from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Product } from '../types';
import { BASE_URL } from '../../../../utils/config';

interface ProductDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  loading: boolean;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  open,
  onClose,
  product,
  loading
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Chi tiết sản phẩm
        {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>Đang tải thông tin sản phẩm...</Typography>
          </Box>
        ) : product ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Thông tin cơ bản
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">ID</Typography>
                <Typography variant="body1">{product.id}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Tên sản phẩm</Typography>
                <Typography variant="body1">{product.name}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Mô tả</Typography>
                <Typography variant="body1">{product.description || 'Không có mô tả'}</Typography>
              </Box>
              

            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Thông tin bổ sung
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Thương hiệu</Typography>
                <Typography variant="body1">
                  {product.brand ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {product.brand.logoUrl && (
                        <Avatar
                          src={`${BASE_URL}/api/file/${product.brand.logoUrl}`}
                          sx={{ width: 24, height: 24, mr: 1 }}
                          alt={product.brand.name}
                        />
                      )}
                      {product.brand.name}
                    </Box>
                  ) : 'Không có thông tin'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Danh mục</Typography>
                <Typography variant="body1">{product.category?.name || 'Không có thông tin'}</Typography>
              </Box>
              

            </Grid>
            
            {product.productVariants && product.productVariants.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Biến thể sản phẩm
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã SKU</TableCell>
                        <TableCell>Màu sắc</TableCell>
                        <TableCell>Kích thước</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Số lượng tồn</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.productVariants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell>{variant.sku}</TableCell>
                          <TableCell>{variant.color || '--'}</TableCell>
                          <TableCell>{variant.size || '--'}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)}
                          </TableCell>
                          <TableCell>{variant.stock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
            
            {product.thumbnail && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Hình ảnh
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={`${BASE_URL}/api/file/${product.thumbnail}`}
                    alt={product.name}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <Typography variant="body1">Không có thông tin sản phẩm</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailsDialog;
