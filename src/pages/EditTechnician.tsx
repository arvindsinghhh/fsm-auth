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
import { editTechnician, fetchTechnicianDetail } from '../services/technicianService';
import { Technician } from '../types/technician';

interface EditTechnicianProps {
  technicianId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditTechnician: React.FC<EditTechnicianProps> = ({ technicianId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Technician>>({});

  useEffect(() => {
    const loadTechnician = async () => {
      try {
        setLoading(true);
        const response = await fetchTechnicianDetail(technicianId);
        const technicianData = response.technician;
        
        if (!technicianData) {
          throw new Error('Technician not found');
        }

        setFormData({
          name: technicianData.name,
          email: technicianData.email,
          mobile: technicianData.mobile,
          status: technicianData.status,
          address: technicianData.address || '',
          // Include other fields that might be needed
          profileImage: technicianData.profileImage,
          availability: technicianData.availability,
          assignedLeads: technicianData.assignedLeads,
          completedJobs: technicianData.completedJobs,
          rating: technicianData.rating,
          totalFeedbacks: technicianData.totalFeedbacks,
          activeJobsCount: technicianData.activeJobsCount
        });
      } catch (err) {
        console.error('Failed to load technician:', err);
        setError('Failed to load technician details');
      } finally {
        setLoading(false);
      }
    };

    loadTechnician();
  }, [technicianId]);

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
      await editTechnician(technicianId, formData);
      onSuccess();
    } catch (err) {
      setError('Failed to update technician. Please check your input and try again.');
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

        {/* <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Specialization"
            name="specialization"
            value={formData.specialization || ''}
            onChange={handleInputChange}
            helperText="e.g., Electrical, Plumbing, HVAC"
          />
          <TextField
            fullWidth
            label="Experience (years)"
            name="experience"
            type="number"
            value={formData.experience || ''}
            onChange={handleInputChange}
            inputProps={{ min: 0 }}
          />
        </Box> */}

        {/* <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
          <TextField
            fullWidth
            label="Join Date"
            name="joinDate"
            type="date"
            value={formData.joinDate || ''}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box> */}

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
            Update Technician
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditTechnician;
