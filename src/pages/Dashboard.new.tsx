import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Avatar,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import {
  Person,
  Settings,
  ExitToApp,
  CheckCircle,
  Notifications
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';

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

export const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const recentActivities = [
    { text: 'Successfully logged in', time: 'Just now', icon: <CheckCircle color="success" /> },
    { text: 'Profile updated', time: '2 hours ago', icon: <Person color="primary" /> },
    { text: 'Settings changed', time: 'Yesterday', icon: <Settings color="action" /> }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
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

      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(12, 1fr)'
          },
          gap: 3
        }}>
          {/* Welcome Card */}
          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <GradientBox>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2
              }}>
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
          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
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
          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
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
  );
};
