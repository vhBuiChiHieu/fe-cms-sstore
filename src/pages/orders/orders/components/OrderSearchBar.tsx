import React from 'react';
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { OrderStatus } from '../../../../services/orderService';

interface OrderSearchBarProps {
  searchTerm: string;
  statusFilter: string;
  statuses: OrderStatus[];
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchKeyPress: (event: React.KeyboardEvent) => void;
  onSearchClick: () => void;
  onRefresh: () => void;
  onStatusFilterChange: (event: SelectChangeEvent) => void;
}

const OrderSearchBar: React.FC<OrderSearchBarProps> = ({
  searchTerm,
  statusFilter,
  statuses,
  onSearchChange,
  onSearchKeyPress,
  onSearchClick,
  onRefresh,
  onStatusFilterChange,
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
        value={searchTerm}
        onChange={onSearchChange}
        onKeyPress={onSearchKeyPress}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ flexGrow: 1 }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="status-filter-label">Trạng thái</InputLabel>
        <Select
          labelId="status-filter-label"
          id="status-filter"
          value={statusFilter}
          label="Trạng thái"
          onChange={onStatusFilterChange}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {statuses.map((status) => (
            <MenuItem key={status.id} value={status.id.toString()}>
              {status.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onSearchClick}
          startIcon={<SearchIcon />}
        >
          Tìm kiếm
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={onRefresh}
        >
          Làm mới
        </Button>
      </Box>
    </Box>
  );
};

export default OrderSearchBar;
