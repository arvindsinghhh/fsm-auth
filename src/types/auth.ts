// Role permissions
export interface Permission {
  resource: string;  // e.g., 'user-manager', 'inventory-manager'
  actions: Array<'read' | 'write' | 'delete' | 'admin'>;
}

// User role
export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

// Main User type
export interface User {
  id: string;
  email: string;
  userName: string;
  profileImage?: string;
  roleId: string;
  admin: boolean;
  roles: UserRole[];   // 👈 Use UserRole consistently
}

// Role update payload
export interface RoleUpdate {
  userId: string;
  roles: string[];  // Array of role IDs
}

// Authentication state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
