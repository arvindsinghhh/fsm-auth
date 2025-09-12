import React from 'react';
import { Card, CardProps, styled } from '@mui/material';

interface CustomCardProps extends CardProps {
  hoverable?: boolean;
  glassy?: boolean;
}

const StyledCard = styled(Card)<CustomCardProps>(({ theme, hoverable, glassy }) => ({
  borderRadius: 16,
  background: glassy 
    ? `linear-gradient(145deg, ${theme.palette.background.paper}F0, ${theme.palette.background.paper}E0)`
    : theme.palette.background.paper,
  backdropFilter: glassy ? 'blur(8px)' : 'none',
  boxShadow: glassy 
    ? '0 8px 32px rgba(0, 0, 0, 0.08)'
    : '0 4px 20px rgba(0, 0, 0, 0.05)',
  border: glassy 
    ? '1px solid rgba(255, 255, 255, 0.18)'
    : 'none',
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: 200,
  }),
  ...(hoverable && {
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
    },
  }),
}));

const CustomCard: React.FC<CustomCardProps> = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};

export default CustomCard;
