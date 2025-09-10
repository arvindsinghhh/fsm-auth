import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import type { Technician } from '../types/managers';

// Mock data
const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '+1234567890',
    joinDate: '2023-01-15',
    status: 'active',
    totalLeads: 45,
    rating: 4.5
  },
  // Add more mock data as needed
];

const columns: Column<Technician>[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'mobile', label: 'Mobile', minWidth: 100 },
  { id: 'joinDate', label: 'Join Date', minWidth: 100 },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    format: (value: string) => value.toUpperCase()
  },
  { id: 'totalLeads', label: 'Total Leads', minWidth: 100 },
  { id: 'rating', label: 'Rating', minWidth: 100 }
];

export const TechniciansPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAddTechnician = () => {
    setSelectedTechnician(null);
    setOpenModal(true);
  };

  const handleEditTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
    setOpenModal(true);
  };

  const handleSaveTechnician = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle save logic here
    setOpenModal(false);
  };

  const filteredTechnicians = mockTechnicians.filter(tech => 
    filterStatus === 'all' ? true : tech.status === filterStatus
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Technicians Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddTechnician}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white'
          }}
        >
          Add Technician
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }
        }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={filterStatus}
              label="Status Filter"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <DataTable
        columns={columns}
        data={filteredTechnicians}
        title="Technicians List"
        onEdit={handleEditTechnician}
      />

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={selectedTechnician ? 'Edit Technician' : 'Add Technician'}
        actions={
          <>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button
              onClick={handleSaveTechnician}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white'
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <Box component="form" onSubmit={handleSaveTechnician} sx={{ pt: 2 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              defaultValue={selectedTechnician?.name}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              defaultValue={selectedTechnician?.email}
              required
            />
            <TextField
              fullWidth
              label="Mobile"
              defaultValue={selectedTechnician?.mobile}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                defaultValue={selectedTechnician?.status || 'active'}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
