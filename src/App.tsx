import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
// ...existing code...
import { AppLayout } from './components/layout/AppLayout';
import AppRoutes from './routes';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#546FFF',
      light: '#7C91FF',
      dark: '#4559CC',
    },
    secondary: {
      main: '#7C91FF',
      light: '#A3B2FF',
      dark: '#546FFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '8px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <AppRoutes />
                  </AppLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
