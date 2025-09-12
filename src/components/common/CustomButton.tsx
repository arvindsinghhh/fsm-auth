import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';
import { alpha } from '@mui/material/styles';

type ButtonType = 'primary' | 'secondary' | 'error' | 'view';
type ButtonSize = 'small' | 'medium' | 'large';

interface StyledButtonProps extends ButtonProps {
  $buttonType?: ButtonType;
  $buttonSize?: ButtonSize;
}

interface CustomButtonProps extends Omit<ButtonProps, 'color' | 'variant' | 'size'> {
  buttonType?: ButtonType;
  size?: ButtonSize;
}

const StyledButton = styled(Button)<StyledButtonProps>(({ theme, $buttonType = 'primary', $buttonSize = 'medium' }) => {
  const getButtonStyles = () => {
    const sizeStyles = {
      small: {
        height: 32,
        padding: '0 12px',
        fontSize: '0.8125rem',
      },
      medium: {
        height: 40,
        padding: '0 20px',
        fontSize: '0.875rem',
      },
      large: {
        height: 48,
        padding: '0 28px',
        fontSize: '1rem',
      },
    };

    const baseStyles = {
      ...sizeStyles[$buttonSize],
      borderRadius: 8,
      fontWeight: 600,
      textTransform: 'none' as const,
      transition: theme.transitions.create(
        ['background-color', 'box-shadow', 'border-color', 'color'],
        { duration: 200 }
      ),
      '&:hover': {
        transform: 'translateY(-1px)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    };

    switch ($buttonType) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          '&:hover': {
            ...baseStyles['&:hover'],
            backgroundColor: theme.palette.primary.light,
            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
          },
          '&:active': {
            ...baseStyles['&:active'],
            backgroundColor: theme.palette.primary.dark,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
          border: `2px solid ${theme.palette.primary.main}`,
          '&:hover': {
            ...baseStyles['&:hover'],
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            borderColor: theme.palette.primary.light,
            color: theme.palette.primary.light,
          },
          '&:active': {
            ...baseStyles['&:active'],
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            borderColor: theme.palette.primary.dark,
            color: theme.palette.primary.dark,
          },
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
          boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`,
          '&:hover': {
            ...baseStyles['&:hover'],
            backgroundColor: theme.palette.error.light,
            boxShadow: `0 6px 16px ${alpha(theme.palette.error.main, 0.3)}`,
          },
          '&:active': {
            ...baseStyles['&:active'],
            backgroundColor: theme.palette.error.dark,
            boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`,
          },
        };
      case 'view':
        return {
          ...baseStyles,
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          color: theme.palette.primary.main,
          '&:hover': {
            ...baseStyles['&:hover'],
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
          '&:active': {
            ...baseStyles['&:active'],
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
        };
      default:
        return baseStyles;
    }
  };

  return getButtonStyles();
});

const CustomButton: React.FC<CustomButtonProps> = ({
  buttonType = 'primary',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <StyledButton $buttonType={buttonType} $buttonSize={size} {...props}>
      {children}
    </StyledButton>
  );
};

export default CustomButton;
