import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle } from '@mui/icons-material';
import toast from 'react-hot-toast';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
}));

const SuccessIcon = styled(CheckCircle)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2)
}));

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast.success('Password reset instructions sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset instructions. Please try again.');
    }
  };

  if (submitted) {
    return (
      <Container component="main" maxWidth="sm">
        <StyledPaper elevation={3}>
          <SuccessIcon />
          <Typography component="h1" variant="h4" gutterBottom>
            Check your email
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" paragraph>
            We've sent password reset instructions to:
          </Typography>
          <Typography variant="body1" align="center" sx={{ fontWeight: 'medium' }} gutterBottom>
            {email}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
              >
                Return to login
              </Button>
            </Link>
          </Box>
        </StyledPaper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h4" gutterBottom>
          Reset your password
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send reset instructions'
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button color="primary">
                Back to login
              </Button>
            </Link>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};
