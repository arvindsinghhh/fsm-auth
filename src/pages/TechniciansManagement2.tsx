import React, { useEffect, useState } from 'react';
import { fetchTechnicians, fetchTechnicianDetail } from '../services/technicianService';
import { Technician } from '../types/technician';
import AddTechnician from './AddTechnician';
import EditTechnician from './EditTechnician';
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
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TechnicianList: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTechnicians({ search, status, from: dateRange.from, to: dateRange.to })
      .then(data => setTechnicians(data.technicians || []))
      .finally(() => setLoading(false));
  }, [search, status, dateRange]);

  const handleEditClick = async (techId: string) => {
    try {
      const techData = await fetchTechnicianDetail(techId);
      setSelectedTechnician(techData);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch technician details:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleViewClick = async (techId: string) => {
    try {
      const techData = await fetchTechnicianDetail(techId);
      setSelectedTechnician(techData);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch technician details:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedTechnician(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    // Refresh the technicians list
    fetchTechnicians({ search, status, from: dateRange.from, to: dateRange.to })
      .then(data => setTechnicians(data.technicians || []));
  };

  return (
    <>
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
                      <TableCell>{tech.assignedLeads || 0}</TableCell>
                      <TableCell>{tech.joinDate}</TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleViewClick(tech.id)} 
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="secondary" 
                          onClick={() => handleEditClick(tech.id)}
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
      </Card>

      {/* Add Technician Modal */}
      <Dialog 
        open={isAddModalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Add New Technician
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddTechnician onSuccess={handleSuccess} onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>

      {/* Edit Technician Modal */}
      <Dialog 
        open={isEditModalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Technician
          <IconButton
            aria-label="close"
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

      {/* View Technician Modal */}
      <Dialog 
        open={isViewModalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Technician Details
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTechnician && (
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {selectedTechnician.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {selectedTechnician.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Mobile:</strong> {selectedTechnician.mobile}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {selectedTechnician.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Address:</strong> {selectedTechnician.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Join Date:</strong> {selectedTechnician.joinDate}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TechnicianList;
