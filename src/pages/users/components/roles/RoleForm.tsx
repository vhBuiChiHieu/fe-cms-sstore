import React from 'react';
import {
  TextField,
  FormControl,
  FormHelperText,
  Box,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { RoleFormProps } from './types';

const RoleForm: React.FC<RoleFormProps> = ({ formData, errors, onChange }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography 
        variant="subtitle1" 
        fontWeight="600" 
        color="primary" 
        gutterBottom 
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <AddIcon fontSize="small" />
        Thông tin cơ bản
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          mt: 1,
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderRadius: 1,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <FormControl error={!!errors.name} fullWidth>
          <TextField
            label="Tên vai trò"
            name="name"
            value={formData.name}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.name}
            placeholder="Nhập tên vai trò"
            size="small"
            variant="outlined"
          />
          {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
        </FormControl>
        
        <TextField
          label="Mô tả"
          name="description"
          value={formData.description}
          onChange={onChange}
          fullWidth
          multiline
          rows={3}
          placeholder="Nhập mô tả cho vai trò này"
          size="small"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default RoleForm;
