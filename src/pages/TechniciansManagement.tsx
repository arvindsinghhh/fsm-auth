import React, { useEffect, useState, useCallback } from 'react';
import { fetchTechnicians, fetchTechnicianDetail } from '../services/technicianService';
import { Technician } from '../types/technician';
import {
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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddTechnician from './AddTechnician';
import EditTechnician from './EditTechnician';

const TechniciansManagement: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadTechnicians = useCallback(() => {
    setLoading(true);
    fetchTechnicians({ search, status, from: dateRange.from, to: dateRange.to })
      .then(data => setTechnicians(data.technicians || []))
      .finally(() => setLoading(false));
  }, [search, status, dateRange]);

  useEffect(() => {
    loadTechnicians();
  }, [loadTechnicians]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenEditModal = async (techId: string) => {
    try {
      const response = await fetchTechnicianDetail(techId);
      setSelectedTechnician(response.technician);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch technician details:', error);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTechnician(null);
  };

  const handleSuccess = () => {
    loadTechnicians();
    handleCloseModal();
  };

  return (
    <Card sx={{ maxWidth: '100%', margin: 'auto', mt: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Technicians</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ flex: '1 1 30%' }}>
            <TextField
              fullWidth
              label="Search by Name or Email"
              value={search}
              onChange={e => setSearch(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ flex: '1 1 15%' }}>
            <Select
              fullWidth
              value={status}
              onChange={e => setStatus(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </Box>
          <Box sx={{ flex: '1 1 15%' }}>
            <TextField
              fullWidth
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={dateRange.from}
              onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
              size="small"
            />
          </Box>
          <Box sx={{ flex: '1 1 15%' }}>
            <TextField
              fullWidth
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={dateRange.to}
              onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
              size="small"
            />
          </Box>
          <Box sx={{ flex: '1 1 15%' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setIsAddModalOpen(true)}
              sx={{ height: '40px' }}
            >
              Add Technician
            </Button>
          </Box>
        </Box>
        <TableContainer component={Box} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned Leads</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                technicians.map(tech => (
                  <TableRow key={tech.id}>
                    <TableCell>{tech.name}</TableCell>
                    <TableCell>{tech.email}</TableCell>
                    <TableCell>{tech.mobile}</TableCell>
                    <TableCell>{tech.status}</TableCell>
                    <TableCell>{tech.assignedLeads}</TableCell>
                    <TableCell>{tech.joinDate}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedTechnician(tech);
                          setIsEditModalOpen(false);
                        }}
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setSelectedTechnician(tech);
                          setIsEditModalOpen(true);
                        }}
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

      <Dialog
        open={isAddModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Add New Technician
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddTechnician
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Technician
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTechnician && (
            <EditTechnician
              technicianId={selectedTechnician.id}
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedTechnician) && !isEditModalOpen}
        onClose={() => setSelectedTechnician(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Technician Details
          <IconButton
            onClick={() => setSelectedTechnician(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTechnician && (
            <Box sx={{ 
              py: 2,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 3,
              '& .detail-item': {
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: 1
              }
            }}>
              <Box className="detail-item">
                <Typography variant="overline" color="primary" gutterBottom>Personal Information</Typography>
                <Typography variant="h6" gutterBottom>{selectedTechnician.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedTechnician.email}<br />
                  {selectedTechnician.mobile}
                </Typography>
              </Box>
              
              <Box className="detail-item">
                <Typography variant="overline" color="primary" gutterBottom>Status & Role</Typography>
                <Typography variant="h6" gutterBottom>
                  {selectedTechnician.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned Leads: {selectedTechnician.assignedLeads || 0}
                </Typography>
              </Box>

              <Box className="detail-item">
                <Typography variant="overline" color="primary" gutterBottom>Location</Typography>
                <Typography variant="body1">{selectedTechnician.address || 'No address provided'}</Typography>
              </Box>

              <Box className="detail-item">
                <Typography variant="overline" color="primary" gutterBottom>Employment Details</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Join Date: {selectedTechnician.joinDate}
                </Typography>
                {selectedTechnician.specialization && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Specialization: {selectedTechnician.specialization}
                  </Typography>
                )}
                {selectedTechnician.experience && (
                  <Typography variant="body2" color="text.secondary">
                    Experience: {selectedTechnician.experience} years
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TechniciansManagement;
