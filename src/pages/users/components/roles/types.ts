import { Permission } from '../../../../services/permissionService';
import { Role } from '../../../../services/roleService';

// Interface cho props của dialog thêm vai trò
export interface AddRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (roleData: RoleFormData) => void;
  onRoleAdded?: () => void;
}

// Interface cho dữ liệu form vai trò
export interface RoleFormData {
  name: string;
  description: string;
  permissionIds: (string | number)[];
}

// Interface cho dữ liệu gửi lên API
export interface RoleApiData {
  name: string;
  description: string;
  permissions: { id: number }[];
}

// Interface cho props của component form thông tin vai trò
export interface RoleFormProps {
  formData: RoleFormData;
  errors: {
    name?: string;
    form?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Interface cho props của component danh sách quyền
export interface PermissionListProps {
  permissions: Permission[];
  selectedPermissionIds: (string | number)[];
  searchQuery: string;
  loadingPermissions: boolean;
  permissionError: string | null;
  onTogglePermission: (permissionId: string | number) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

// Interface cho props của component quyền đã chọn
export interface SelectedPermissionsProps {
  selectedPermissions: Permission[];
  onTogglePermission: (permissionId: string | number) => void;
  onClearAll: () => void;
}

// Interface cho props của dialog chỉnh sửa vai trò
export interface EditRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onRoleUpdated?: () => void;
  role: Role | null;
  loading: boolean;
}
