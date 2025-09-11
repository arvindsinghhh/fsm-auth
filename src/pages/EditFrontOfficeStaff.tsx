import React, { useEffect, useState } from 'react';
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
import { editFrontOfficeStaff, fetchStaffDetail } from '../services/frontOfficeService';
import { FrontOfficeStaff, EditFrontOfficeStaffRequest } from '../types/frontOffice';

interface EditFrontOfficeStaffProps {
  staffId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditFrontOfficeStaff: React.FC<EditFrontOfficeStaffProps> = ({ staffId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<FrontOfficeStaff>>({});

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoading(true);
        const data = await fetchStaffDetail(staffId);
        setFormData(data.staff);
      } catch (err) {
        setError('Failed to load staff details');
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [staffId]);

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
      const updateData: EditFrontOfficeStaffRequest = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        status: formData.status || 'Active'
      };
      await editFrontOfficeStaff(staffId, updateData);
      onSuccess();
    } catch (err) {
      setError('Failed to update staff member. Please check your input and try again.');
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
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
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            required
            fullWidth
            label="Mobile Number"
            name="mobile"
            value={formData.mobile || ''}
            onChange={handleInputChange}
          />
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status || 'Active'}
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
          value={formData.address || ''}
          onChange={handleInputChange}
        />

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
            Update Staff Member
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditFrontOfficeStaff;
