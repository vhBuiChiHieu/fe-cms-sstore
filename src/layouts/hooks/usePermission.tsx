import { useState, useEffect } from 'react';
import permissionService, { Permission } from '../../services/permissionService';
import logger from '../../utils/logger';

export const usePermission = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState<boolean>(false);

  // Lấy danh sách quyền hạn
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoadingPermissions(true);
        const result = await permissionService.getPermissions({ pageIndex: 1, pageSize: 100 });
        setPermissions(result.permissions);
      } catch (error) {
        logger.error('Lỗi khi tải danh sách quyền hạn:', error);
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  return {
    permissions,
    loadingPermissions
  };
};
