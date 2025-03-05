import React from 'react';
import {
  Box,
  Divider,
  Typography
} from '@mui/material';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Divider />
    </Box>
  );
};

export default PageHeader;
