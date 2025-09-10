import { User } from '../types/auth';

export const checkPermission = (user: User | null, resource: string, requiredAction: 'read' | 'write' | 'delete' | 'admin'): boolean => {
  if (!user) return false;

  return user.roles.some(role =>
    role.permissions.some(permission =>
      permission.resource === resource &&
      permission.actions.includes(requiredAction)
    )
  );
};

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.roles.some(role => 
    role.permissions.some(permission => 
      permission.resource === 'user-manager' && permission.actions.includes('admin')
    )
  );
};

export const getUserPermissions = (user: User | null): { [key: string]: Array<'read' | 'write' | 'delete' | 'admin'> } => {
  if (!user) return {};

  const permissions: { [key: string]: Array<'read' | 'write' | 'delete' | 'admin'> } = {};
  
  user.roles.forEach(role => {
    role.permissions.forEach(permission => {
      if (!permissions[permission.resource]) {
        permissions[permission.resource] = [];
      }
      // Combine existing and new actions, removing duplicates
      permissions[permission.resource] = Array.from(new Set([
        ...(permissions[permission.resource] || []),
        ...permission.actions
      ]));
    });
  });

  return permissions;
};
