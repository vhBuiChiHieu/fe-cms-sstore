import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Tooltip,
  alpha,
  useTheme,
  Paper
} from '@mui/material';
import { HighlightOff as HighlightOffIcon } from '@mui/icons-material';
import { SelectedPermissionsProps } from './types';

const SelectedPermissions: React.FC<SelectedPermissionsProps> = ({
  selectedPermissions,
  onTogglePermission,
  onClearAll
}) => {
  const theme = useTheme();
  const hasSelectedPermissions = selectedPermissions.length > 0;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tiêu đề và nút xóa tất cả */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 1,
        px: 1
      }}>
        <Typography variant="subtitle2" fontWeight="600">
          Quyền đã chọn ({selectedPermissions.length})
        </Typography>
        
        {hasSelectedPermissions && (
          <Tooltip title="Xóa tất cả quyền đã chọn">
            <Button 
              size="small" 
              onClick={onClearAll}
              color="error"
              variant="outlined"
              startIcon={<HighlightOffIcon />}
              sx={{ textTransform: 'none' }}
            >
              Xóa tất cả
            </Button>
          </Tooltip>
        )}
      </Box>
      
      {/* Danh sách quyền */}
      <Paper 
        variant="outlined" 
        sx={{ 
          flex: 1,
          p: 1.5,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderRadius: 1,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0px 0px 5px ${alpha(theme.palette.primary.main, 0.1)}`,
          maxHeight: '300px' // Tăng chiều cao tối đa của Paper để phù hợp với Box bên trong
        }}
      >
        {hasSelectedPermissions ? (
          <Box sx={{ 
            display: 'flex', 
            flexFlow: 'row wrap',
            gap: 0.5,
            alignContent: 'flex-start', // Bắt đầu hiển thị từ trên xuống
            overflow: 'auto',
            height: '250px', // Tăng chiều cao để phù hợp hơn
            '&::-webkit-scrollbar': {
              width: '6px',
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: '3px',
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
              }
            }
          }}>
            {selectedPermissions.map(permission => (
              <Chip
                key={permission.id}
                label={permission.name}
                size="small"
                color="primary"
                variant="outlined"
                onDelete={() => onTogglePermission(permission.id)}
                sx={{ 
                  borderRadius: '4px',
                  height: '24px',
                  m: 0.25
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Chưa chọn quyền nào
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SelectedPermissions;
