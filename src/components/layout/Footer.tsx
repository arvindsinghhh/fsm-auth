import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const DRAWER_WIDTH = 280; // Match the drawer width from AppLayout

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
      }}
    >
      <Container 
        maxWidth={false}
        sx={{
          maxWidth: {
            xs: '100%',
            md: `calc(1200px - ${DRAWER_WIDTH}px)`,
          },
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Box sx={{ display: 'grid', gap: 4, py: 4, gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' } }}>
          <Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              FSM Admin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Field Service Management solution dedicated to revolutionizing how businesses 
              manage their operations with cutting-edge technology.
            </Typography>
            <Box sx={{ mt: 2, '& > a': { mr: 2 } }}>
              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit">
                <LinkedInIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' } }}>
              <Box>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Company
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', '& > a': { mt: 1 } }}>
                  <Link component={RouterLink} to="/about-us" color="text.secondary">
                    About Us
                  </Link>
                  <Link component={RouterLink} to="/contact" color="text.secondary">
                    Contact
                  </Link>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Services
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', '& > a': { mt: 1 } }}>
                  <Link component={RouterLink} to="/services/field" color="text.secondary">
                    Field Service
                  </Link>
                  <Link component={RouterLink} to="/services/scheduling" color="text.secondary">
                    Scheduling
                  </Link>
                  <Link component={RouterLink} to="/services/reporting" color="text.secondary">
                    Reporting
                  </Link>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Legal
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', '& > a': { mt: 1 } }}>
                  <Link component={RouterLink} to="/privacy" color="text.secondary">
                    Privacy Policy
                  </Link>
                  <Link component={RouterLink} to="/terms" color="text.secondary">
                    Terms of Use
                  </Link>
                  <Link component={RouterLink} to="/cookies" color="text.secondary">
                    Cookie Policy
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box py={3} display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} FSM Admin. All rights reserved.
          </Typography>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Link component={RouterLink} to="/privacy" color="text.secondary" sx={{ mr: 2 }}>
              Privacy
            </Link>
            <Link component={RouterLink} to="/terms" color="text.secondary" sx={{ mr: 2 }}>
              Terms
            </Link>
            <Link component={RouterLink} to="/cookies" color="text.secondary">
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
