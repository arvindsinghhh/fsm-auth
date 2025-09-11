import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Customer } from '../types/customer';
import BuildIcon from '@mui/icons-material/Build';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ConstructionIcon from '@mui/icons-material/Construction';

interface CustomerJobsProps {
  customer: Customer;
}

const CustomerJobs: React.FC<CustomerJobsProps> = ({ customer }) => {
  const getJobIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'maintenance':
        return <BuildIcon />;
      case 'repair':
        return <EngineeringIcon />;
      case 'installation':
        return <ConstructionIcon />;
      default:
        return <BuildIcon />;
    }
  };

  const getTimelineDotColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'grey';
    }
  };

  const getChipColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Customer Details</Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Typography><strong>Name:</strong> {customer.name}</Typography>
          <Typography><strong>Customer ID:</strong> {customer.customerId}</Typography>
          <Typography><strong>Email:</strong> {customer.email}</Typography>
          <Typography><strong>Mobile:</strong> {customer.mobile}</Typography>
          <Typography><strong>Status:</strong>{' '}
            <Chip
              label={customer.status}
              color={customer.status === 'Active' ? 'success' : 'default'}
              size="small"
            />
          </Typography>
          <Typography><strong>Registered On:</strong> {customer.registeredOn}</Typography>
          <Typography sx={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {customer.address}</Typography>
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>Job History</Typography>
      {customer.jobs.length > 0 ? (
        <Timeline>
          {customer.jobs.map((job) => (
            <TimelineItem key={job.id}>
              <TimelineOppositeContent color="text.secondary">
                {formatDateTime(job.createdAt)}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={getTimelineDotColor(job.status)}>
                  {getJobIcon(job.type)}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" component="span">
                    {job.type}
                  </Typography>
                  <Chip
                    label={job.status}
                    color={getChipColor(job.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Location: {job.location}
                  </Typography>
                  <Typography>{job.description}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <Typography color="text.secondary">No jobs found for this customer.</Typography>
      )}
    </Box>
  );
};

export default CustomerJobs;
