import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (event: React.FormEvent) => void;
  handleRefresh: () => void;
  handleOpenCreateDialog: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleRefresh,
  handleOpenCreateDialog
}) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSearch}>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ ml: 1 }}
                >
                  Tìm
                </Button>
              </Box>
            </form>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ mr: 1 }}
            >
              Làm mới
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="primary"
              onClick={handleOpenCreateDialog}
            >
              Thêm mới
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
