import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  }
  interface PaletteOptions {
    neutral: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#546FFF',
      light: '#7C91FF',
      dark: '#4055CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#7C91FF',
      light: '#A3B2FF',
      dark: '#6374CC',
      contrastText: '#FFFFFF',
    },
    neutral: {
      100: '#F7F9FC',
      200: '#EDF1F7',
      300: '#E4E9F2',
      400: '#C5CEE0',
      500: '#8F9BB3',
      600: '#6E7891',
      700: '#2E3A59',
      800: '#222B45',
      900: '#1A1F33',
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#222B45',
      secondary: '#8F9BB3',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          padding: '8px 20px',
          minHeight: '40px',
          minWidth: '120px',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(84, 111, 255, 0.2)',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          minHeight: '32px',
          minWidth: '100px',
        },
        sizeLarge: {
          padding: '10px 24px',
          minHeight: '48px',
          minWidth: '140px',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(84, 111, 255, 0.2)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #EDF1F7',
          padding: '16px',
        },
        head: {
          backgroundColor: '#F7F9FC',
          color: '#2E3A59',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#E4E9F2',
            },
            '&:hover fieldset': {
              borderColor: '#C5CEE0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#546FFF',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        outlined: {
          borderColor: '#E4E9F2',
          '&:hover': {
            backgroundColor: '#F7F9FC',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 8,
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          '&.list-container': {
            padding: '24px',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '16px 0',
          '& .MuiListItem-root': {
            borderRadius: 8,
            marginBottom: '8px',
            '&:last-child': {
              marginBottom: 0,
            },
          },
        },
      },
    },
  },
});

export default theme;
