import React from 'react';
import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Role } from '../../../services/roleService';

interface SearchFiltersProps {
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
  roles: Role[];
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchKeyPress: (event: React.KeyboardEvent) => void;
  onSearchClick: () => void;
  onRefresh: () => void;
  onStatusFilterChange: (event: SelectChangeEvent) => void;
  onRoleFilterChange: (event: SelectChangeEvent) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  statusFilter,
  roleFilter,
  roles,
  onSearchChange,
  onSearchKeyPress,
  onSearchClick,
  onRefresh,
  onStatusFilterChange,
  onRoleFilterChange
}) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên, email, username..."
          value={searchTerm}
          onChange={onSearchChange}
          onKeyPress={onSearchKeyPress}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={onSearchClick}
          >
            Tìm kiếm
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={{ minWidth: '120px' }}
          >
            Làm mới
          </Button>
        </Box>
      </Grid>
      <Grid item xs={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel id="status-filter-label">Trạng thái</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Trạng thái"
            onChange={onStatusFilterChange}
            autoComplete="off"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="0">Hoạt động</MenuItem>
            <MenuItem value="1">Chưa kích hoạt</MenuItem>
            <MenuItem value="2">Đã khóa</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel id="role-filter-label">Vai trò</InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            label="Vai trò"
            onChange={onRoleFilterChange}
            autoComplete="off"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.name}>
                {role.name === 'ADMIN' ? 'Quản trị viên' :
                  role.name === 'MANAGER' ? 'Quản lý' :
                    role.name === 'GUEST' ? 'Khách' :
                      role.name === 'USER' ? 'Người dùng' :
                        role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
        {/* Nút làm mới đã được chuyển sang bên phải nút tìm kiếm */}
      </Grid>
    </Grid>
  );
};

export default SearchFilters;
