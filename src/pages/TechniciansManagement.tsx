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
  Avatar,
  Chip,
  Paper,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
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

  const loadTechnicians = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTechnicians({ 
        search, 
        status, 
        from: dateRange.from, 
        to: dateRange.to 
      });
      if (data && data.technicians) {
        setTechnicians(data.technicians);
      }
    } catch (error) {
      console.error('Failed to load technicians:', error);
    } finally {
      setLoading(false);
    }
  }, [search, status, dateRange]);

  useEffect(() => {
    loadTechnicians();
  }, [loadTechnicians]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenEditModal = async (techId: string) => {
    try {
      const response = await fetchTechnicianDetail(techId);
      // For now, using dummy data
      const dummyTechnician: Technician = {
        id: techId,
        name: response?.technician?.name || 'Unknown',
        email: response?.technician?.email || 'email@example.com',
        mobile: response?.technician?.mobile || 'N/A',
        status: (response?.technician?.status || 'Active') as 'Active' | 'Inactive',
        address: response?.technician?.address || 'N/A',
        profileImage: '',
        availability: 'Available' as const,
        activeJobsCount: 3,
        completedJobs: 45,
        rating: 4.5,
        totalFeedbacks: 38,
        assignedLeads: [
          {
            id: 'JOB001',
            title: 'AC Repair',
            customerName: 'John Doe',
            status: 'In Progress' as const,
            date: '2025-09-12',
            customerFeedback: undefined
          },
          {
            id: 'JOB002',
            title: 'Electrical Maintenance',
            customerName: 'Jane Smith',
            status: 'Completed' as const,
            date: '2025-09-10',
            customerFeedback: {
              rating: 5,
              comment: 'Excellent service, very professional',
              date: '2025-09-10'
            }
          },
          {
            id: 'JOB003',
            title: 'Plumbing Work',
            customerName: 'Mike Johnson',
            status: 'Pending' as const,
            date: '2025-09-13',
            customerFeedback: undefined
          }
        ]
      };
      setSelectedTechnician(dummyTechnician);
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
              sx={{ 
                height: '40px',
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
                    <TableCell>{tech.assignedLeads?.length || 0}</TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ 
                          mr: 1,
                          color: '#546FFF',
                          borderColor: '#546FFF',
                          '&:hover': {
                            borderColor: '#7C91FF',
                            color: '#7C91FF',
                          }
                        }}
                        onClick={() => {
                          // Create dummy data for viewing
                          const dummyLead = {
                            id: 'JOB001',
                            title: 'AC Repair',
                            customerName: 'John Doe',
                            status: 'In Progress' as const,
                            date: '2025-09-12'
                          };
                          const dummyLead2 = {
                            id: 'JOB002',
                            title: 'Electrical Maintenance',
                            customerName: 'Jane Smith',
                            status: 'Completed' as const,
                            date: '2025-09-10',
                            customerFeedback: {
                              rating: 5,
                              comment: 'Excellent service, very professional',
                              date: '2025-09-10'
                            }
                          };
                          const viewData: Technician = {
                            ...tech,
                            availability: 'Available',
                            activeJobsCount: 3,
                            completedJobs: 45,
                            rating: 4.5,
                            totalFeedbacks: 38,
                            assignedLeads: [dummyLead, dummyLead2]
                          };
                          setSelectedTechnician(viewData);
                          setIsEditModalOpen(false);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          // Create dummy data for editing
                          setSelectedTechnician({
                            ...tech,
                            availability: 'Available' as const,
                            activeJobsCount: 3,
                            completedJobs: 45,
                            rating: 4.5,
                            totalFeedbacks: 38,
                            assignedLeads: [
                              {
                                id: 'JOB001',
                                title: 'AC Repair',
                                customerName: 'John Doe',
                                status: 'In Progress' as const,
                                date: '2025-09-12',
                                customerFeedback: undefined
                              },
                              {
                                id: 'JOB002',
                                title: 'Electrical Maintenance',
                                customerName: 'Jane Smith',
                                status: 'Completed' as const,
                                date: '2025-09-10',
                                customerFeedback: {
                                  rating: 5,
                                  comment: 'Excellent service, very professional',
                                  date: '2025-09-10'
                                }
                              }
                            ]
                          });
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
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
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
            <Box sx={{ py: 1 }}>
              {/* Header Section */}
              <Box sx={{ 
                display: 'flex',
                gap: 3,
                mb: 4,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1
              }}>
                {/* Profile Picture */}
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={selectedTechnician.profileImage || undefined}
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
                      bgcolor: selectedTechnician.status === 'Active' ? 'success.main' : 'text.disabled',
                      border: 2,
                      borderColor: 'background.paper'
                    }}
                  />
                </Box>

                {/* Basic Info */}
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        {selectedTechnician.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {selectedTechnician.email}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {selectedTechnician.mobile}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={selectedTechnician.availability}
                        color={selectedTechnician.availability === 'Available' ? 'success' : 
                               selectedTechnician.availability === 'On Job' ? 'warning' : 'default'}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Status: {selectedTechnician.status}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Active Jobs</Typography>
                      <Typography variant="h6">{selectedTechnician.activeJobsCount}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Completed Jobs</Typography>
                      <Typography variant="h6">{selectedTechnician.completedJobs}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Rating</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">{(selectedTechnician.rating || 0).toFixed(1)}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({selectedTechnician.totalFeedbacks || 0} reviews)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Address Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Address</Typography>
                <Paper sx={{ p: 2 }}>
                  <Typography>{selectedTechnician.address}</Typography>
                </Paper>
              </Box>

              {/* Assigned Jobs Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Current Jobs & Leads</Typography>
                <TableContainer component={Paper}>
                  <Table>
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
                      {(selectedTechnician.assignedLeads || []).map((lead) => (
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
                          <TableCell>{lead.date}</TableCell>
                          <TableCell>
                            {lead.customerFeedback ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>{lead.customerFeedback.rating}/5</Typography>
                                <Tooltip title={lead.customerFeedback.comment}>
                                  <IconButton size="small">
                                    <CommentIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
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
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedTechnician(selectedTechnician);
                    setIsEditModalOpen(true);
                  }}
                >
                  Update Details
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TechniciansManagement;
