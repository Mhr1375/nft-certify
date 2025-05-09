import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context
import { Web3Provider } from './context/Web3Context';

// Pages
import Home from './pages/Home';
import IssueCertificate from './pages/IssueCertificate';
import ViewCertificates from './pages/ViewCertificates';
import CertificateDetail from './pages/CertificateDetail';

// Components
import Layout from './components/Layout';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/issue" element={<IssueCertificate />} />
              <Route path="/certificates" element={<ViewCertificates />} />
              <Route path="/certificate/:id" element={<CertificateDetail />} />
            </Routes>
          </Layout>
        </Router>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;
