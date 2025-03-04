import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Tooltip,
  alpha,
  useTheme
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
    <Box 
      sx={{ 
        mt: 2,
        p: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        borderRadius: 1,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
      
      {hasSelectedPermissions ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
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
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Chưa chọn quyền nào
        </Typography>
      )}
    </Box>
  );
};

export default SelectedPermissions;
