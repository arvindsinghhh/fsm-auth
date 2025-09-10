import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
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

const renderActions = (technician: Technician) => {
  const handleEdit = () => {
    // Handle edit action
  };

  const handleDelete = () => {
    // Handle delete action
  };

  return (
    <Box>
      <Button onClick={handleEdit}>Edit</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </Box>
  );
};

export const TechniciansManagement = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Technicians Management
        </Typography>
      </Box>

      <DataTable<Technician>
        columns={columns}
        data={mockTechnicians}
        title="Technicians"
        onEdit={(technician) => console.log('Edit:', technician)}
        onDelete={(technician) => console.log('Delete:', technician)}
      />
    </Box>
  );
};
