import { type FC, type ReactElement } from 'react';
import { ListItemIcon, ListItemText, ListItemButton, Collapse } from '@mui/material';
import {
  SupervisorAccount,
  People,
  ShoppingCart,
  Inventory,
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore,
  Person,
  Store,
  Payment,
  Security,
  Dashboard,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ManagerItem {
  id: string;
  title: string;
  icon: ReactElement;
  resource: string;
  requiredAction: 'read' | 'write' | 'delete' | 'admin';
  subItems?: {
    id: string;
    title: string;
    icon: ReactElement;
    resource: string;
    requiredAction: 'read' | 'write' | 'delete' | 'admin';
  }[];
}

// Define all managers here - easy to add new ones
export const managers: ManagerItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <Dashboard />,
    resource: 'dashboard',
    requiredAction: 'read'
  },
  {
    id: 'user',
    title: 'User Manager',
    icon: <People />,
    resource: 'user-manager',
    requiredAction: 'read',
    subItems: [
      { 
        id: 'users-list',
        title: 'Users List',
        icon: <Person />,
        resource: 'user-manager',
        requiredAction: 'read'
      },
      { 
        id: 'roles',
        title: 'Roles & Permissions',
        icon: <SupervisorAccount />,
        resource: 'user-manager',
        requiredAction: 'admin'
      }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory Manager',
    icon: <Inventory />,
    resource: 'inventory-manager',
    requiredAction: 'read',
    subItems: [
      { 
        id: 'products',
        title: 'Products',
        icon: <ShoppingCart />,
        resource: 'inventory-manager',
        requiredAction: 'read'
      },
      { 
        id: 'stock',
        title: 'Stock Management',
        icon: <Store />,
        resource: 'inventory-manager',
        requiredAction: 'write'
      }
    ]
  },
  {
    id: 'finance',
    title: 'Finance Manager',
    icon: <Assessment />,
    resource: 'finance-manager',
    requiredAction: 'read',
    subItems: [
      { 
        id: 'transactions',
        title: 'Transactions',
        icon: <Payment />,
        resource: 'finance-manager',
        requiredAction: 'read'
      },
      { 
        id: 'reports',
        title: 'Reports',
        icon: <Assessment />,
        resource: 'finance-manager',
        requiredAction: 'write'
      }
    ]
  },
  {
    id: 'security',
    title: 'Security Settings',
    icon: <Security />,
    resource: 'security-manager',
    requiredAction: 'admin'
  },
  {
    id: 'settings',
    title: 'System Settings',
    icon: <Settings />,
    resource: 'system-settings',
    requiredAction: 'admin'
  }
];

interface SidebarItemProps {
  item: ManagerItem;
  selected: string | null;
  onSelect: (id: string) => void;
}

export const SidebarItem: FC<SidebarItemProps> = ({ item, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const { hasPermission } = useAuth();

  // Check if the user has permission for this item
  const hasItemPermission = hasPermission(item.resource, item.requiredAction);

  // Check permissions for sub-items
  const availableSubItems = item.subItems?.filter(subItem => 
    hasPermission(subItem.resource, subItem.requiredAction)
  );

  // If neither the item nor its subitems are accessible, don't render anything
  if (!hasItemPermission && (!availableSubItems || availableSubItems.length === 0)) {
    return null;
  }

  const handleClick = () => {
    if (availableSubItems && availableSubItems.length > 0) {
      setOpen(!open);
    }
    onSelect(item.id);
  };

  const isSelected = selected === item.id || 
    availableSubItems?.some(subItem => selected === subItem.id);

  return (
    <>
      <ListItemButton 
        onClick={handleClick}
        selected={isSelected}
        sx={{ pl: 2 }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {availableSubItems && availableSubItems.length > 0 && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      {availableSubItems && availableSubItems.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {availableSubItems.map((subItem) => (
            <ListItemButton
              key={subItem.id}
              onClick={() => onSelect(subItem.id)}
              selected={selected === subItem.id}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>{subItem.icon}</ListItemIcon>
              <ListItemText primary={subItem.title} />
            </ListItemButton>
          ))}
        </Collapse>
      )}
    </>
  );
};
