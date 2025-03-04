import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
  Stack,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
} from '@mui/icons-material';
import { CartAccount } from '../../../../services/cartService';
import { formatDate } from '../../../../utils/formatters';

interface UserInfoCardProps {
  account: CartAccount;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ account }) => {
  return (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 1 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="medium">
            Thông tin người dùng
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Họ và tên:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {account.firstName} {account.lastName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Email:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {account.mail}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Số điện thoại:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {account.phone || 'Không có'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CakeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Ngày sinh:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(account.dateOfBirth, '-')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
