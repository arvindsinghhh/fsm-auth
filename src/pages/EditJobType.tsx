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
} from '@mui/material';
import { editJobType, fetchJobTypeDetail } from '../services/jobTypeService';
import { EditJobTypeRequest } from '../types/jobType';

interface EditJobTypeProps {
  jobTypeId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditJobType: React.FC<EditJobTypeProps> = ({ jobTypeId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<EditJobTypeRequest>({
    name: '',
    status: 'Active'
  });

  useEffect(() => {
    const loadJobType = async () => {
      try {
        setLoading(true);
        const { jobType } = await fetchJobTypeDetail(jobTypeId);
        setFormData({
          name: jobType.name,
          status: jobType.status
        });
      } catch (err) {
        setError('Failed to load job type details');
      } finally {
        setLoading(false);
      }
    };

    loadJobType();
  }, [jobTypeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    try {
      await editJobType(jobTypeId, formData);
      onSuccess();
    } catch (err) {
      setError('Failed to update job type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
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
          label="Job Type Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
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
            Update Job Type
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditJobType;
