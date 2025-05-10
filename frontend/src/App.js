import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Web3Provider } from './context/Web3Context';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import IssueCertificate from './pages/IssueCertificate';
import ViewCertificates from './pages/ViewCertificates';
import CertificateDetail from './pages/CertificateDetail';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#3f51b5',
        light: mode === 'dark' ? '#c3fdff' : '#6573c3',
        dark: mode === 'dark' ? '#5d99c6' : '#2c387e',
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#f50057',
        light: mode === 'dark' ? '#ffc1e3' : '#ff5983',
        dark: mode === 'dark' ? '#bf5f82' : '#c51162',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f7fa',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: {
        fontSize: '3rem',
        fontWeight: 600,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontSize: '2.25rem',
        fontWeight: 600,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
        letterSpacing: '0.00735em',
      },
      button: {
        fontWeight: 500,
        letterSpacing: '0.02857em',
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: mode === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
          },
          contained: {
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'dark' 
              ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  }), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <Router>
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
              },
            }}
          />
          <Layout toggleColorMode={toggleColorMode} currentMode={mode}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/issue" element={<IssueCertificate />} />
              <Route path="/certificates" element={<ViewCertificates />} />
              <Route path="/certificate/:id" element={<CertificateDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;
