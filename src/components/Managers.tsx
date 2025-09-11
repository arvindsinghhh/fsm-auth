import { type FC, type ReactElement } from 'react';
import { ListItemIcon, ListItemText, ListItemButton, Collapse } from '@mui/material';
import { useState } from 'react';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';

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
  icon: <DashboardIcon />,
    resource: 'dashboard',
    requiredAction: 'read'
  },
  {
    id: 'technicians',
    title: 'Technicians Manager',
  icon: <PeopleIcon />,
    resource: 'technicians-manager',
    requiredAction: 'read'
  },
  {
    id: 'user',
    title: 'User Manager',
  icon: <PeopleIcon />,
    resource: 'user-manager',
    requiredAction: 'read',
    subItems: [
      { 
        id: 'users-list',
        title: 'Users List',
  icon: <PersonIcon />,
        resource: 'user-manager',
        requiredAction: 'read'
      },
      { 
        id: 'roles',
        title: 'Roles & Permissions',
  icon: <SupervisorAccountIcon />,
        resource: 'user-manager',
        requiredAction: 'admin'
      }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory Manager',
  icon: <InventoryIcon />,
    resource: 'inventory-manager',
    requiredAction: 'read',
    subItems: [
      { 
        id: 'products',
        title: 'Products',
  icon: <ShoppingCartIcon />,
        resource: 'inventory-manager',
        requiredAction: 'read'
      },
      { 
        id: 'stock',
        title: 'Stock Management',
  icon: <StoreIcon />,
        resource: 'inventory-manager',
        requiredAction: 'write'
      }
    ]
  },
  {
    id: 'finance',
    title: 'Finance Manager',
  icon: <AssessmentIcon />,
    resource: 'finance-manager',
    requiredAction: 'read',
    subItems: [
      { 
        id: 'transactions',
        title: 'Transactions',
  icon: <PaymentIcon />,
        resource: 'finance-manager',
        requiredAction: 'read'
      },
      { 
        id: 'reports',
        title: 'Reports',
  icon: <AssessmentIcon />,
        resource: 'finance-manager',
        requiredAction: 'write'
      }
    ]
  },
  {
    id: 'security',
    title: 'Security Settings',
  icon: <SecurityIcon />,
    resource: 'security-manager',
    requiredAction: 'admin'
  },
  {
    id: 'settings',
    title: 'System Settings',
  icon: <SettingsIcon />,
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
  // Show all managers and subItems to every user
  const availableSubItems = item.subItems || [];

  const handleClick = () => {
    if (availableSubItems.length > 0) {
      setOpen(!open);
    }
    onSelect(item.id);
  };

  const isSelected = selected === item.id || 
    availableSubItems.some(subItem => selected === subItem.id);

  return (
    <>
      <ListItemButton 
        onClick={handleClick}
        selected={isSelected}
        sx={{ pl: 2 }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
  {availableSubItems.length > 0 && (open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </ListItemButton>
      {availableSubItems.length > 0 && (
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
