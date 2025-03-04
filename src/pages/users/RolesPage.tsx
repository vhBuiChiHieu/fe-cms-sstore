import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  CircularProgress,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { getRolesPaginated, Role, PaginatedResponse } from '../../services/roleService';
import logger from '../../utils/logger';
import RoleDetailDialog from './components/RoleDetailDialog';

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);

  // Hàm lấy danh sách vai trò
  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getRolesPaginated({
        pageIndex: page + 1, // API bắt đầu từ 1
        pageSize: rowsPerPage
      });
      
      setRoles(response.data);
      setTotalItems(response.totalItems);
      
    } catch (err: any) {
      logger.error('Lỗi khi tải danh sách vai trò:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải danh sách vai trò');
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount hoặc khi thay đổi trang/số dòng
  useEffect(() => {
    fetchRoles();
  }, [page, rowsPerPage]);

  // Xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng trên mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý làm mới dữ liệu
  const handleRefresh = () => {
    fetchRoles();
  };

  // Xử lý xem chi tiết vai trò
  const handleViewRoleDetail = (role: Role) => {
    setSelectedRole(role);
    setDetailDialogOpen(true);
  };

  // Đóng dialog chi tiết vai trò
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };

  // Hiển thị số lượng quyền
  const renderPermissionCount = (role: Role) => {
    const count = role.permissions?.length || 0;
    return (
      <Chip 
        label={`${count} quyền`} 
        size="small" 
        color={count > 0 ? "primary" : "default"}
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Danh sách vai trò
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={loading}
        >
          Làm mới
        </Button>
      </Box>

      {error && (
        <Card sx={{ mb: 3, bgcolor: 'error.light' }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="Bảng danh sách vai trò">
            <TableHead>
              <TableRow>
                <TableCell width={80}>ID</TableCell>
                <TableCell>Tên vai trò</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="center">Số quyền</TableCell>
                <TableCell align="center" width={100}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">Không có dữ liệu</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>{role.id}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {role.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                    <TableCell align="center">
                      {renderPermissionCount(role)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewRoleDetail(role)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Dòng trên trang:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Dialog xem chi tiết vai trò */}
      <RoleDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        role={selectedRole}
      />
    </Box>
  );
};

export default RolesPage;
