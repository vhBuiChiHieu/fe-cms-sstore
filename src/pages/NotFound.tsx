import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            py: 8,
            px: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            backgroundColor: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '8px',
              backgroundColor: 'lightblue',
            },
          }}
        >
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 120, 
              color: 'lightblue',
              mb: 2 
            }} 
          />
          
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '5rem', md: '8rem' },
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              mb: 2,
            }}
          >
            404
          </Typography>
          
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 'medium',
              color: '#555',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Trang không tìm thấy
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              textAlign: 'center',
              mb: 4,
              maxWidth: '80%',
            }}
          >
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              backgroundColor: 'lightblue',
              '&:hover': {
                backgroundColor: '#7fbddb',
              },
            }}
          >
            Quay lại trang chủ
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;
