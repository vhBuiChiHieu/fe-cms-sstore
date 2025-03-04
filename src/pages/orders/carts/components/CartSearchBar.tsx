import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface CartSearchBarProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (event: React.FormEvent) => void;
  onRefresh: () => void;
  error: string | null;
}

const CartSearchBar: React.FC<CartSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onRefresh,
  error,
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <form onSubmit={onSearch} style={{ width: '100%', maxWidth: '500px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm kiếm theo email, tên người dùng..."
            value={searchTerm}
            onChange={onSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </form>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Làm mới
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
};

export default CartSearchBar;
