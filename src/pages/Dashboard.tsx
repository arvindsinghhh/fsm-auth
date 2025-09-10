import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Person,
  Settings,
  ExitToApp,
  CheckCircle,
  Notifications,
  Menu as MenuIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';
import { managers, SidebarItem } from '../components/Managers';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%'
}));

const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.common.white
}));

// Create a styled Grid component that accepts Grid props
const DRAWER_WIDTH = 280;

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleManagerSelect = (id: string) => {
    setSelectedManager(id);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: DRAWER_WIDTH, bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" noWrap>
            FSM Admin
        </Typography>
      </Box>
      <List component="nav">
        {managers.map((manager) => (
          <SidebarItem
            key={manager.id}
            item={manager}
            selected={selectedManager}
            onSelect={handleManagerSelect}
          />
        ))}
      </List>
    </Box>
  );

  const recentActivities = [
    { text: 'Successfully logged in', time: 'Just now', icon: <CheckCircle color="success" /> },
    { text: 'Profile updated', time: '2 hours ago', icon: <Person color="primary" /> },
    { text: 'Settings changed', time: 'Yesterday', icon: <Settings color="action" /> }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: 1,
            borderColor: 'divider'
          }
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main content area */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            ml: { md: `${DRAWER_WIDTH}px` }, 
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } 
          }}
          color="transparent" 
          elevation={1}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {managers.find(m => m.id === selectedManager)?.title || 'Dashboard'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user?.email?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {user?.email}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 3,
            mt: '64px', // Height of AppBar
            ml: { md: `${DRAWER_WIDTH}px` },
            width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` }
          }}
        >
          <Container maxWidth="xl">
            <Box 
              component="main"
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(12, 1fr)'
                },
                gap: 3
              }}>
              {/* Welcome Card */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                <StyledPaper elevation={2}>
                  <Typography variant="h5" gutterBottom>
                    Welcome back!
                  </Typography>
                  <Typography color="textSecondary">
                    Here's what's happening with your account today.
                  </Typography>
                </StyledPaper>
              </Box>

              {/* Stats Card */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                <GradientBox>
                  <Typography variant="h6" gutterBottom>
                    System Status
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography variant="h4">99.9%</Typography>
                      <Typography variant="body2">Uptime</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4">45ms</Typography>
                      <Typography variant="body2">Latency</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4">0</Typography>
                      <Typography variant="body2">Errors</Typography>
                    </Box>
                  </Box>
                </GradientBox>
              </Box>

              {/* Activity Feed */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 8' } }}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <List>
                      {recentActivities.map((activity, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemIcon>
                              {activity.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={activity.text}
                              secondary={activity.time}
                            />
                          </ListItem>
                          {index < recentActivities.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>

              {/* Quick Actions */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Actions
                    </Typography>
                    <List>
                      <ListItemButton>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText primary="View Profile" />
                      </ListItemButton>
                      <ListItemButton>
                        <ListItemIcon>
                          <Settings />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                      </ListItemButton>
                      <ListItemButton>
                        <ListItemIcon>
                          <Notifications />
                        </ListItemIcon>
                        <ListItemText primary="Notifications" />
                      </ListItemButton>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
