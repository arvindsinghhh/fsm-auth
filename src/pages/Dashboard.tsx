import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
   Box,
  Button,
  Card,
  CardContent,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  ExitToApp,
  Menu as MenuIcon,
  AttachMoney
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

const DRAWER_WIDTH = 280;

interface DashboardMetrics {
  totalRevenue: number;
  totalPendingAmount: number;
}

interface JobsByType {
  name: string;
  count: number;
}

interface JobsByLocation {
  location: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Mock data
const mockData = {
  metrics: {
    totalRevenue: 425000,
    totalPendingAmount: 85000,
  },
  jobsByType: [
    { name: 'Repair', count: 150 },
    { name: 'Installation', count: 85 },
    { name: 'Maintenance', count: 65 },
    { name: 'Inspection', count: 50 },
  ],
  jobsByLocation: [
    { location: 'New York', count: 120 },
    { location: 'Los Angeles', count: 90 },
    { location: 'Chicago', count: 70 },
    { location: 'Houston', count: 45 },
    { location: 'Miami', count: 25 },
  ],
};

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [metrics] = useState<DashboardMetrics>(mockData.metrics);
  const [jobsByType] = useState<JobsByType[]>(mockData.jobsByType);
  const [jobsByLocation] = useState<JobsByLocation[]>(mockData.jobsByLocation);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar removed – Dashboard is now standalone */}

      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="fixed" 
          sx={{ width: '100%' }}
          color="transparent" 
          elevation={1}
        >
          <Toolbar>
              {/* {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )} */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            </Box> */}
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ flexGrow: 1, p: 3, mt: '64px', width: '100%' }}
        >
          <Container maxWidth="xl">
            {/* Date Filters */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </LocalizationProvider>
            </Box>

            {/* Revenue Section */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoney color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Revenue</Typography>
                  </Box>
                  <Typography variant="h4">
                    ${metrics.totalRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoney color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Pending Amount</Typography>
                  </Box>
                  <Typography variant="h4" color="error">
                    ${metrics.totalPendingAmount.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Charts */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Jobs by Type
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jobsByType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Jobs by Location
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={jobsByLocation}
                          dataKey="count"
                          nameKey="location"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        >
                          {jobsByLocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
