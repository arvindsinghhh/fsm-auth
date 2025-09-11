import React, { useEffect, useState, useCallback } from 'react';
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
  Chip,
  DialogActions,
  Paper,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import ContactsIcon from '@mui/icons-material/Contacts';
import { fetchFrontOfficeStaff, fetchStaffDetail } from '../services/frontOfficeService';
import { FrontOfficeStaff } from '../types/frontOffice';
import AddFrontOfficeStaff from './AddFrontOfficeStaff';
import EditFrontOfficeStaff from './EditFrontOfficeStaff';

const FrontOfficeManager: React.FC = () => {
  const [staff, setStaff] = useState<FrontOfficeStaff[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<FrontOfficeStaff | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const loadStaff = useCallback(() => {
    setLoading(true);
    fetchFrontOfficeStaff({ search, status, from: dateRange.from, to: dateRange.to })
      .then(data => setStaff(data.staff))
      .finally(() => setLoading(false));
  }, [search, status, dateRange]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const handleOpenEditModal = async (staffId: string) => {
    try {
      const response = await fetchStaffDetail(staffId);
      setSelectedStaff(response.staff);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch staff details:', error);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedStaff(null);
  };

  const handleSuccess = () => {
    loadStaff();
    handleCloseModal();
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card sx={{ maxWidth: '100%', margin: 'auto', mt: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Front Office Staff</Typography>
        
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
              Add Staff Member
            </Button>
          </Box>
        </Box>

        <TableContainer component={Box} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined On</TableCell>
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
                staff.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>{member.employeeId}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.mobile}</TableCell>
                    <TableCell>
                      <Chip 
                        label={member.status} 
                        color={member.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{member.joinDate}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsViewModalOpen(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenEditModal(member.id)}
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

      {/* Add Staff Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Add New Staff Member
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddFrontOfficeStaff
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Staff Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Staff Member
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedStaff && (
            <EditFrontOfficeStaff
              staffId={selectedStaff.id}
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Staff Modal */}
      <Dialog
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Staff Details
          <IconButton
            onClick={() => setIsViewModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedStaff && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ContactsIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Personal Information</Typography>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>Employee ID:</strong> {selectedStaff.employeeId}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Name:</strong> {selectedStaff.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {selectedStaff.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Mobile:</strong> {selectedStaff.mobile}
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Employment Details</Typography>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong>{' '}
                    <Chip 
                      label={selectedStaff.status} 
                      color={selectedStaff.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Join Date:</strong> {selectedStaff.joinDate}
                  </Typography>
                </Paper>

                <Paper sx={{ p: 3, gridColumn: '1 / -1' }}>
                  <Typography variant="h6" gutterBottom>Activity History</Typography>
                    {selectedStaff.activityHistory && selectedStaff.activityHistory.length > 0 ? (
                      <Timeline>
                        {selectedStaff.activityHistory.map((activity) => (
                          <TimelineItem key={activity.id}>
                            <TimelineOppositeContent color="text.secondary">
                              {formatDateTime(activity.timestamp)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineDot color={activity.type === 'Lead' ? 'primary' : 'secondary'} />
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="body2" color="text.secondary">
                                {activity.type} #{activity.referenceId}
                              </Typography>
                              <Typography>{activity.description}</Typography>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    ) : (
                      <Typography color="text.secondary">No activity recorded yet.</Typography>
                    )}
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default FrontOfficeManager;
