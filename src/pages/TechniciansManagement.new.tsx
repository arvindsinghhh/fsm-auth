import React, { useEffect, useState, useCallback } from 'react';
import { fetchTechnicians } from '../services/technicianService';
import { Technician } from '../types/technician';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
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
  Avatar,
  Chip,
  Paper,
  Tooltip,
  FormControl,
  InputLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const loadTechnicians = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTechnicians({ 
        search, 
        status, 
        from: dateRange.from, 
        to: dateRange.to,
        page,
        pageSize: rowsPerPage
      });
      if (data && data.technicians) {
        setTechnicians(data.technicians);
        setTotalElements(data.total || data.technicians.length);
      }
    } catch (error) {
      console.error('Failed to load technicians:', error);
    } finally {
      setLoading(false);
    }
  }, [search, status, dateRange, page, rowsPerPage]);

  useEffect(() => {
    loadTechnicians();
  }, [loadTechnicians]);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTechnician(null);
  };

  const handleSuccess = () => {
    loadTechnicians();
    handleCloseModal();
  };

  if (loading && technicians.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Technicians Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Technician
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Search by Name or Email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          variant="outlined"
          sx={{ minWidth: '300px', flex: 2 }}
        />
        <FormControl sx={{ minWidth: '200px', flex: 1 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={e => setStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={dateRange.from}
          onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
          sx={{ minWidth: '200px', flex: 1 }}
        />
        <TextField
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={dateRange.to}
          onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
          sx={{ minWidth: '200px', flex: 1 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Leads</TableCell>
              <TableCell>Availability</TableCell>
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
                  <TableCell>
                    <Switch
                      checked={tech.status === 'Active'}
                      onChange={() => {/* Add status toggle handler */}}
                    />
                  </TableCell>
                  <TableCell>{tech.assignedLeads?.length || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={tech.availability}
                      color={
                        tech.availability === 'Available' ? 'success' :
                        tech.availability === 'On Job' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedTechnician(tech);
                        setIsEditModalOpen(false);
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedTechnician(tech);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

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
          {selectedTechnician?.id && (
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
        maxWidth="lg"
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
        <DialogContent sx={{ mt: 2 }}>
          {selectedTechnician && (
            <Box>
              {/* Basic Info */}
              <Box sx={{ 
                display: 'flex',
                gap: 3,
                mb: 4,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1
              }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={selectedTechnician.profileImage}
                    sx={{ width: 120, height: 120 }}
                  >
                    {selectedTechnician.name[0]}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: selectedTechnician.status === 'Active' ? 'success.main' : 'error.main',
                      border: 2,
                      borderColor: 'background.paper'
                    }}
                  />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        {selectedTechnician.name}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {selectedTechnician.email}
                      </Typography>
                      <Typography color="text.secondary">
                        {selectedTechnician.mobile}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={selectedTechnician.availability}
                        color={
                          selectedTechnician.availability === 'Available' ? 'success' :
                          selectedTechnician.availability === 'On Job' ? 'warning' : 'default'
                        }
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Status: {selectedTechnician.status}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', gap: 4 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Active Jobs</Typography>
                      <Typography variant="h6">{selectedTechnician.activeJobsCount}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Completed Jobs</Typography>
                      <Typography variant="h6">{selectedTechnician.completedJobs}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Rating</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">{selectedTechnician.rating.toFixed(1)}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({selectedTechnician.totalFeedbacks} reviews)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Address */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Address</Typography>
                <Typography>{selectedTechnician.address}</Typography>
              </Paper>

              {/* Assigned Jobs */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Assigned Jobs</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Job ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Feedback</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedTechnician.assignedLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>{lead.id}</TableCell>
                          <TableCell>{lead.title}</TableCell>
                          <TableCell>{lead.customerName}</TableCell>
                          <TableCell>
                            <Chip
                              label={lead.status}
                              color={
                                lead.status === 'Completed' ? 'success' :
                                lead.status === 'In Progress' ? 'warning' :
                                lead.status === 'Cancelled' ? 'error' : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(lead.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {lead.customerFeedback ? (
                              <Tooltip title={lead.customerFeedback.comment}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography>{lead.customerFeedback.rating}/5</Typography>
                                  <IconButton size="small">
                                    <CommentIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Tooltip>
                            ) : lead.status === 'Completed' ? (
                              'Pending'
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TechniciansManagement;
