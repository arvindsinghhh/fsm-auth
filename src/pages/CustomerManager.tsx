import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Paper,
  DialogActions,
  FormControl,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Customer, CustomerFilters } from '../types/customer';
import { fetchCustomers } from '../services/customerService';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import CustomerJobs from './CustomerJobs';

const CustomerManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { customers } = await fetchCustomers(filters);
      setCustomers(customers);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleFilterChange = (key: keyof CustomerFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsJobsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsJobsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSuccess = () => {
    loadCustomers();
    handleCloseModal();
  };

  return (
    <Card sx={{ maxWidth: '100%', margin: 'auto', mt: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Customer Management</Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
            <TextField
              fullWidth
              label="Search by Name or Email"
              value={filters.search || ''}
              onChange={e => handleFilterChange('search', e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>

          <Box sx={{ flex: '1 1 15%', minWidth: '150px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ''}
                label="Status"
                onChange={e => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: '1 1 15%', minWidth: '150px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Job Type</InputLabel>
              <Select
                value={filters.jobType || ''}
                label="Job Type"
                onChange={e => handleFilterChange('jobType', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Repair">Repair</MenuItem>
                <MenuItem value="Installation">Installation</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: '1 1 15%', minWidth: '150px' }}>
            <TextField
              fullWidth
              type="date"
              label="From Date"
              InputLabelProps={{ shrink: true }}
              value={filters.dateFrom || ''}
              onChange={e => handleFilterChange('dateFrom', e.target.value)}
              size="small"
            />
          </Box>

          <Box sx={{ flex: '1 1 15%', minWidth: '150px' }}>
            <TextField
              fullWidth
              type="date"
              label="To Date"
              InputLabelProps={{ shrink: true }}
              value={filters.dateTo || ''}
              onChange={e => handleFilterChange('dateTo', e.target.value)}
              size="small"
            />
          </Box>

          <Box sx={{ flex: '1 1 15%', minWidth: '150px' }}>
            <TextField
              fullWidth
              label="Location"
              value={filters.location || ''}
              onChange={e => handleFilterChange('location', e.target.value)}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: '1 1 auto', minWidth: '150px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Customer
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '10%' }}>Customer ID</TableCell>
                <TableCell sx={{ width: '15%' }}>Name</TableCell>
                <TableCell sx={{ width: '15%' }}>Email</TableCell>
                <TableCell sx={{ width: '12%' }}>Mobile</TableCell>
                <TableCell sx={{ width: '15%' }}>Address</TableCell>
                <TableCell sx={{ width: '8%' }}>Status</TableCell>
                <TableCell sx={{ width: '12%' }}>Registered On</TableCell>
                <TableCell sx={{ width: '13%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                customers.map(customer => (
                  <TableRow
                    key={customer.id}
                    onClick={() => handleRowClick(customer)}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>{customer.customerId}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.mobile}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        color={customer.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{customer.registeredOn}</TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsJobsModalOpen(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsEditModalOpen(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      {/* Add Customer Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Add New Customer
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddCustomer onSuccess={handleSuccess} onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Customer
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <EditCustomer
              customerId={selectedCustomer.id}
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Customer Jobs Modal */}
      <Dialog
        open={isJobsModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Customer Jobs History
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <CustomerJobs customer={selectedCustomer} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CustomerManager;
