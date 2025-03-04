import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  useTheme,
  alpha,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  Security as SecurityIcon,
  Check as CheckIcon,
  VpnKey as VpnKeyIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Role, Permission } from '../../../services/roleService';

interface RoleDetailDialogProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  loading?: boolean;
}

const RoleDetailDialog: React.FC<RoleDetailDialogProps> = ({ open, onClose, role, loading = false }) => {
  const theme = useTheme();
  
  if (!role && !loading) return null;

  // Nhóm các quyền theo tiền tố (ví dụ: ACCOUNT_, PRODUCT_, v.v.)
  const groupPermissions = (permissions: Permission[] = []) => {
    const groups: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      const name = permission.name;
      const prefix = name.split('_')[0];
      
      if (!groups[prefix]) {
        groups[prefix] = [];
      }
      
      groups[prefix].push(permission);
    });
    
    return groups;
  };

  // Lấy màu cho từng nhóm quyền
  const getGroupColor = (groupName: string) => {
    const colors = {
      'ACCOUNT': theme.palette.primary.main,
      'PRODUCT': theme.palette.success.main,
      'ORDER': theme.palette.warning.main,
      'REPORT': theme.palette.info.main,
      'SYSTEM': theme.palette.error.main,
    };
    
    return colors[groupName as keyof typeof colors] || theme.palette.primary.main;
  };

  // Sử dụng optional chaining để tránh lỗi khi role là null
  const permissionGroups = groupPermissions(role?.permissions);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          width: '600px',
          maxWidth: '100%'
        }
      }}
    >
      <Box sx={{ 
        bgcolor: theme.palette.primary.main, 
        color: 'white',
        p: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        <VpnKeyIcon sx={{ mr: 2, fontSize: 28 }} />
        <Box>
          <Typography variant="h5" component="span" fontWeight="bold">
            Chi tiết vai trò
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={180} height={20} sx={{ bgcolor: alpha('#fff', 0.3) }} />
          ) : (
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              {role?.description || 'Không có mô tả'}
            </Typography>
          )}
        </Box>
        {loading ? (
          <Skeleton variant="rounded" width={100} height={32} sx={{ ml: 'auto', bgcolor: alpha('#fff', 0.3) }} />
        ) : (
          <Chip 
            label={role?.name} 
            sx={{ 
              ml: 'auto', 
              fontWeight: 'bold',
              bgcolor: 'white',
              color: theme.palette.primary.main
            }} 
          />
        )}
      </Box>
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {!loading && (
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                pb: 1,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <SecurityIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              Danh sách quyền ({role?.permissions?.length || 0})
            </Typography>
            
            {(!role?.permissions || role.permissions.length === 0) ? (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                mt: 2,
                bgcolor: alpha(theme.palette.warning.light, 0.1),
                border: `1px dashed ${theme.palette.warning.main}`
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Vai trò này không có quyền nào
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ mt: 0.5 }}>
              {Object.entries(permissionGroups).map(([group, permissions]) => {
                const groupColor = getGroupColor(group);
                
                return (
                  <Paper 
                    elevation={0}
                    key={group}
                    sx={{ 
                      p: 0, 
                      mb: 2,
                      borderRadius: 1,
                      border: `1px solid ${alpha(groupColor, 0.3)}`,
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ 
                      p: 1.5, 
                      bgcolor: alpha(groupColor, 0.1),
                      borderBottom: `1px solid ${alpha(groupColor, 0.3)}`,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="bold" 
                        sx={{ color: groupColor }}
                      >
                        {group}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={`${permissions.length} quyền`} 
                        sx={{ 
                          ml: 'auto',
                          bgcolor: alpha(groupColor, 0.2),
                          color: groupColor,
                          fontWeight: 'medium'
                        }} 
                      />
                    </Box>
                    <List dense sx={{ pt: 0.5, pb: 0.5 }}>
                      {permissions.map((permission) => (
                        <ListItem key={permission.id} disablePadding sx={{ px: 2, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckIcon 
                              fontSize="small" 
                              sx={{ color: groupColor }} 
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={permission.name}
                            secondary={permission.description}
                            primaryTypographyProps={{ 
                              variant: 'body2', 
                              fontWeight: 'medium',
                              sx: { color: theme.palette.text.primary }
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'caption',
                              sx: { color: theme.palette.text.secondary }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                );
              })}
            </Box>
          )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.primary.light, 0.05) }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            px: 3,
            boxShadow: 2
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleDetailDialog;
