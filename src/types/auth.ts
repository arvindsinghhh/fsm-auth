export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;  // e.g., 'user-manager', 'inventory-manager'
  actions: Array<'read' | 'write' | 'delete' | 'admin'>;
}

export interface User {
  id: string;
  email: string;
  roles: UserRole[];
}

export interface RoleUpdate {
  userId: string;
  roles: string[];  // Array of role IDs
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
