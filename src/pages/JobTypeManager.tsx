import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Paper,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import TimerIcon from '@mui/icons-material/Timer';
import { JobType } from '../types/jobType';
import { fetchJobTypes, deleteJobType } from '../services/jobTypeService';
import AddJobType from './AddJobType';
import EditJobType from './EditJobType';

const JobTypeManager: React.FC = () => {
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState<JobType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadJobTypes = useCallback(async () => {
    setLoading(true);
    try {
      const { jobTypes } = await fetchJobTypes();
      setJobTypes(jobTypes);
    } catch (error) {
      console.error('Failed to load job types:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobTypes();
  }, [loadJobTypes]);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedJobType(null);
  };

  const handleSuccess = () => {
    loadJobTypes();
    handleCloseModal();
  };

  const handleDelete = async () => {
    if (!selectedJobType) return;
    
    setDeleteLoading(true);
    try {
      await deleteJobType(selectedJobType.id);
      handleSuccess();
    } catch (error) {
      console.error('Failed to delete job type:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: '100%', margin: 'auto', mt: 2, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Job Types</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Job Type
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Type ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                jobTypes.map(jobType => (
                  <TableRow key={jobType.id}>
                    <TableCell>{jobType.jobTypeId}</TableCell>
                    <TableCell>{jobType.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={jobType.status}
                        color={jobType.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedJobType(jobType);
                          setIsViewModalOpen(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedJobType(jobType);
                          setIsEditModalOpen(true);
                        }}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedJobType(jobType);
                          setIsDeleteModalOpen(true);
                        }}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      {/* Add Job Type Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add New Job Type
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddJobType onSuccess={handleSuccess} onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>

      {/* Edit Job Type Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Job Type
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedJobType && (
            <EditJobType
              jobTypeId={selectedJobType.id}
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the job type "{selectedJobType?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Job Type Modal */}
      <Dialog
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Job Type Details
          <IconButton
            onClick={() => setIsViewModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedJobType && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Basic Information</Typography>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>Job Type ID:</strong> {selectedJobType.jobTypeId}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Name:</strong> {selectedJobType.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong>{' '}
                    <Chip 
                      label={selectedJobType.status} 
                      color={selectedJobType.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong> {selectedJobType.description || 'N/A'}
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TimerIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Service Details</Typography>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>Duration:</strong> {selectedJobType.duration ? `${selectedJobType.duration} minutes` : 'N/A'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Price:</strong> {selectedJobType.price ? `$${selectedJobType.price}` : 'N/A'}
                  </Typography>
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

export default JobTypeManager;
