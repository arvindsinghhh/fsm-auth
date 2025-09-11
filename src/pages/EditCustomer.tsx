import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { editCustomer, fetchCustomerDetails } from '../services/customerService';
import { EditCustomerRequest, Customer } from '../types/customer';

interface EditCustomerProps {
  customerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditCustomer: React.FC<EditCustomerProps> = ({ customerId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Customer>>({});

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setLoading(true);
        const { customer } = await fetchCustomerDetails(customerId);
        setFormData(customer);
      } catch (err) {
        setError('Failed to load customer details');
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [customerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e: SelectChangeEvent<'Active' | 'Inactive'>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value as 'Active' | 'Inactive'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.mobile) {
      setError('Name, email and mobile number are required');
      setLoading(false);
      return;
    }

    try {
      const updateData: EditCustomerRequest = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address || '',
        status: formData.status || 'Active'
      };
      await editCustomer(customerId, updateData);
      onSuccess();
    } catch (err) {
      setError('Failed to update customer. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
        />

        <TextField
          required
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={handleInputChange}
        />

        <TextField
          required
          fullWidth
          label="Mobile Number"
          name="mobile"
          value={formData.mobile || ''}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          label="Address"
          name="address"
          multiline
          rows={3}
          value={formData.address || ''}
          onChange={handleInputChange}
        />

        <FormControl fullWidth required>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status || 'Active'}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Update Customer
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditCustomer;
