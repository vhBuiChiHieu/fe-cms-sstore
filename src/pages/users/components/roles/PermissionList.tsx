import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  Paper,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { PermissionListProps } from './types';

const PermissionList: React.FC<PermissionListProps> = ({
  permissions,
  selectedPermissionIds,
  searchQuery,
  loadingPermissions,
  permissionError,
  onTogglePermission,
  onSearchChange,
  onClearSearch,
  onSearchKeyDown,
  onSearch
}) => {
  const theme = useTheme();

  // Lọc danh sách quyền theo tìm kiếm
  const filteredPermissions = permissions.filter(permission => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    return (
      permission.name.toLowerCase().includes(query) ||
      (permission.description && permission.description.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1, 
          mb: 2,
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderRadius: 1,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <TextField
          placeholder="Tìm kiếm quyền..."
          fullWidth
          value={searchQuery}
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={onClearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button 
          variant="contained" 
          onClick={onSearch}
          disabled={loadingPermissions}
          sx={{ minWidth: '80px' }}
        >
          Tìm
        </Button>
      </Box>
      
      <Paper 
        variant="outlined" 
        sx={{ 
          maxHeight: 300, 
          overflow: 'auto', 
          mb: 2,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        {loadingPermissions ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : permissionError ? (
          <Box sx={{ p: 2, color: 'error.main' }}>
            <Typography>{permissionError}</Typography>
          </Box>
        ) : (
          <List dense sx={{ p: 0 }}>
            {filteredPermissions.length > 0 ? (
              filteredPermissions.map((permission) => (
                <ListItem 
                  key={permission.id} 
                  dense 
                  disablePadding
                  divider
                >
                  <ListItemButton 
                    onClick={() => onTogglePermission(permission.id)}
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                      },
                      ...(selectedPermissionIds.includes(permission.id) && {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.12)
                        }
                      })
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedPermissionIds.includes(permission.id)}
                        tabIndex={-1}
                        disableRipple
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="body2" 
                          fontWeight={selectedPermissionIds.includes(permission.id) ? 600 : 400}
                        >
                          {permission.name}
                        </Typography>
                      }
                      secondary={
                        permission.description && (
                          <Typography variant="caption" color="text.secondary">
                            {permission.description}
                          </Typography>
                        )
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText 
                  primary={
                    searchQuery 
                      ? "Không tìm thấy quyền nào phù hợp" 
                      : "Không có quyền nào"
                  } 
                />
              </ListItem>
            )}
          </List>
        )}
      </Paper>
    </>
  );
};

export default PermissionList;
