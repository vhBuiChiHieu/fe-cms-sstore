export {};

// Thông tin tài khoản cơ bản
export interface Account {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  userInfoId?: string;
  status: number | string;
  role?: string;
  selectedRoles?: { id: string; name: string; description?: string }[];
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
} 