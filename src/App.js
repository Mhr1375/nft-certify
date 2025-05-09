import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Toaster } from 'react-hot-toast';

// Context
import { Web3Provider } from './context/Web3Context';

// Pages
import Home from './pages/Home';
import IssueCertificate from './pages/IssueCertificate';
import ViewCertificates from './pages/ViewCertificates';
import CertificateDetail from './pages/CertificateDetail';

// Components
import Layout from './components/Layout';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#3f51b5' : '#90caf9',
        light: mode === 'light' ? '#757de8' : '#c3fdff',
        dark: mode === 'light' ? '#002984' : '#5d99c6',
        contrastText: mode === 'light' ? '#fff' : '#000',
      },
      secondary: {
        main: mode === 'light' ? '#f50057' : '#ff80ab',
        light: mode === 'light' ? '#ff5983' : '#ffb2dd',
        dark: mode === 'light' ? '#c51162' : '#c94f7c',
        contrastText: mode === 'light' ? '#fff' : '#000',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      success: {
        main: '#4caf50',
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      info: {
        main: '#2196f3',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      }
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        letterSpacing: '0em',
      },
      h4: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 30,
            padding: '8px 16px',
            boxShadow: mode === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light' ? '0 4px 8px rgba(0,0,0,0.15)' : '0 4px 8px rgba(0,0,0,0.5)',
            },
          },
          contained: {
            '&:hover': {
              backgroundColor: mode === 'light' ? '#3949a3' : '#7fa9c9',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 4px 20px rgba(0,0,0,0.05)' 
              : '0 4px 20px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: mode === 'light' 
                ? '0 8px 30px rgba(0,0,0,0.1)' 
                : '0 8px 30px rgba(0,0,0,0.7)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 2px 12px rgba(0,0,0,0.05)' 
              : '0 2px 12px rgba(0,0,0,0.2)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  }), [mode, prefersDarkMode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <Router>
          <Layout toggleColorMode={toggleColorMode} mode={mode}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/issue" element={<IssueCertificate />} />
              <Route path="/certificates" element={<ViewCertificates />} />
              <Route path="/certificate/:id" element={<CertificateDetail />} />
            </Routes>
          </Layout>
        </Router>
      </Web3Provider>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.palette.mode === 'light' 
              ? '0 4px 12px rgba(0,0,0,0.1)' 
              : '0 4px 12px rgba(0,0,0,0.3)',
            borderRadius: 8,
            border: `1px solid ${theme.palette.divider}`,
          },
          success: {
            iconTheme: {
              primary: theme.palette.success.main,
              secondary: theme.palette.background.paper,
            },
          },
          error: {
            iconTheme: {
              primary: theme.palette.error.main,
              secondary: theme.palette.background.paper,
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App; 