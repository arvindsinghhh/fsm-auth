import React, { useState } from 'react';
import { addTechnician } from '../services/technicianService';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';


interface TechnicianFormData {
  name: string;
  email: string;
  mobile: string;
  status: 'Active' | 'Inactive';
  address: string;
}

interface AddTechnicianProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddTechnician: React.FC<AddTechnicianProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<TechnicianFormData>({
    name: '',
    email: '',
    mobile: '',
    status: 'Active',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<'Active' | 'Inactive'>) => {
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
      await addTechnician(formData);
      onSuccess();
    } catch (err) {
      setError('Failed to add technician. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            required
            fullWidth
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
          />
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleSelectChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          label="Address"
          name="address"
          multiline
          rows={3}
          value={formData.address}
          onChange={handleInputChange}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            sx={{ 
              color: '#546FFF',
              borderColor: '#546FFF',
              '&:hover': {
                borderColor: '#7C91FF',
                color: '#7C91FF',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ 
              bgcolor: '#546FFF',
              '&:hover': {
                bgcolor: '#7C91FF',
              }
            }}
          >
            Add Technician
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTechnician;
