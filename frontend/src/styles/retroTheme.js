import { createTheme } from '@mui/material/styles';

export const retroColors = {
  background: '#C0C0C0',
  primary: '#000080',
  secondary: '#A0A0A0',
  accent: '#E0F0FF',
  text: '#000000',
  hover: '#D0D0D0',
  border: '#808080',
  borderLight: '#FFFFFF',
  borderDark: '#404040',
  success: '#008000',
  warning: '#808000',
  error: '#800000',
};

export const retroTheme = createTheme({
  palette: {
    background: {
      default: retroColors.background,
      paper: retroColors.background,
    },
    primary: {
      main: retroColors.primary,
    },
    secondary: {
      main: retroColors.secondary,
    },
    text: {
      primary: retroColors.text,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", "MS Sans Serif", sans-serif',
    h1: {
      fontFamily: '"Press Start 2P", "Consolas", monospace',
      fontSize: '2rem',
    },
    h2: {
      fontFamily: '"Press Start 2P", "Consolas", monospace',
      fontSize: '1.75rem',
    },
    h3: {
      fontFamily: '"Press Start 2P", "Consolas", monospace',
      fontSize: '1.5rem',
    },
    h4: {
      fontFamily: '"Press Start 2P", "Consolas", monospace',
      fontSize: '1.25rem',
    },
    h5: {
      fontFamily: '"Press Start 2P", "Consolas", monospace',
      fontSize: '1.1rem',
    },
    h6: {
      fontFamily: '"Press Start 2P", "Consolas", monospace',
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          padding: '4px 8px',
          backgroundColor: retroColors.background,
          border: `2px solid ${retroColors.borderDark}`,
          borderTop: `2px solid ${retroColors.borderLight}`,
          borderLeft: `2px solid ${retroColors.borderLight}`,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: retroColors.hover,
          },
          '&:active': {
            borderTop: `2px solid ${retroColors.borderDark}`,
            borderLeft: `2px solid ${retroColors.borderDark}`,
            borderBottom: `2px solid ${retroColors.borderLight}`,
            borderRight: `2px solid ${retroColors.borderLight}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: retroColors.background,
          border: `2px solid ${retroColors.borderDark}`,
          borderTop: `2px solid ${retroColors.borderLight}`,
          borderLeft: `2px solid ${retroColors.borderLight}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: retroColors.background,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: retroColors.background,
          color: retroColors.text,
          boxShadow: 'none',
          borderBottom: `2px solid ${retroColors.borderDark}`,
        },
      },
    },
  },
});
