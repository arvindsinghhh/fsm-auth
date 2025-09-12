import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AttachMoney } from '@mui/icons-material';
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
  totalTechnicians: number;
  totalFrontOfficeStaff: number;
  totalCustomers: number;
  activeJobs: number;
  totalJobs: number;
  totalRevenue: number;
  totalPendingAmount: number;
}

interface JobsByType {
  name: string;
  count: number;
  revenue: number;
}

interface JobsByLocation {
  location: string;
  count: number;
  revenue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7300'];

// Mock data
const mockData = {
  metrics: {
    totalTechnicians: 45,
    totalFrontOfficeStaff: 15,
    totalCustomers: 850,
    activeJobs: 120,
    totalJobs: 1250,
    totalRevenue: 425000,
    totalPendingAmount: 85000,
  },
  jobsByType: [
    { name: 'AC Repair', count: 150, revenue: 75000 },
    { name: 'Plumbing', count: 85, revenue: 42500 },
    { name: 'Electrical', count: 65, revenue: 32500 },
    { name: 'Appliance Repair', count: 50, revenue: 25000 },
    { name: 'HVAC Maintenance', count: 45, revenue: 22500 },
    { name: 'General Maintenance', count: 40, revenue: 20000 },
  ],
  jobsByLocation: [
    { location: 'Downtown', count: 120, revenue: 60000 },
    { location: 'North Side', count: 90, revenue: 45000 },
    { location: 'South Side', count: 70, revenue: 35000 },
    { location: 'East Side', count: 45, revenue: 22500 },
    { location: 'West Side', count: 40, revenue: 20000 },
  ],
};

export const Dashboard = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [metrics] = useState<DashboardMetrics>(mockData.metrics);
  const [jobsByType] = useState<JobsByType[]>(mockData.jobsByType);
  const [jobsByLocation] = useState<JobsByLocation[]>(mockData.jobsByLocation);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar removed – Dashboard is now standalone */}

      <Box sx={{ flexGrow: 1 }}>
      

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ flexGrow: 1, p: 3, mt: '64px', width: '100%' }}
        >
          <Container maxWidth="xl">
            {/* Header with Title and Date Filters */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
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
            </Box>

            {/* Key Metrics Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="subtitle2">Total Technicians</Typography>
                  <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>{metrics.totalTechnicians}</Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="subtitle2">Front-office Staff</Typography>
                  <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>{metrics.totalFrontOfficeStaff}</Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="subtitle2">Total Customers</Typography>
                  <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>{metrics.totalCustomers}</Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="subtitle2">Active Jobs</Typography>
                  <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>{metrics.activeJobs}</Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="subtitle2">Total Jobs</Typography>
                  <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>{metrics.totalJobs}</Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="subtitle2">Total Revenue</Typography>
                  <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                    ${metrics.totalRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="subtitle2">Pending Amount</Typography>
                  <Typography variant="h4" sx={{ mt: 1, mb: 1 }} color="error.main">
                    ${metrics.totalPendingAmount.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Popular Service Locations and Job Types */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
              {/* Popular Job Types */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Popular Job Types</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jobsByType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Number of Jobs" />
                        <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              {/* Popular Service Locations */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Popular Service Locations</Typography>
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

            {/* Detailed Tables */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              {/* Jobs by Type Table */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Jobs by Type Breakdown</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Job Type</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {jobsByType.map((type) => (
                        <TableRow key={type.name}>
                          <TableCell>{type.name}</TableCell>
                          <TableCell align="right">{type.count}</TableCell>
                          <TableCell align="right">${type.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Jobs by Location Table */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Jobs by Location Breakdown</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Location</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {jobsByLocation.map((location) => (
                        <TableRow key={location.location}>
                          <TableCell>{location.location}</TableCell>
                          <TableCell align="right">{location.count}</TableCell>
                          <TableCell align="right">${location.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
