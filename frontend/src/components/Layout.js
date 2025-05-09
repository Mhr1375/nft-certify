import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Paper,
  Chip,
  Avatar
} from '@mui/material';
import { Web3Context } from '../context/Web3Context';

const Layout = ({ children }) => {
  const location = useLocation();
  const { 
    account, 
    connectWallet, 
    disconnectWallet, 
    network, 
    isDeployed, 
    contractAddress 
  } = useContext(Web3Context);

  // Truncate address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
            NFT Certificate Platform
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              variant={location.pathname === '/' ? 'outlined' : 'text'}
            >
              Home
            </Button>
            
            <Button 
              color="inherit" 
              component={Link} 
              to="/issue" 
              variant={location.pathname === '/issue' ? 'outlined' : 'text'}
              disabled={!isDeployed}
            >
              Issue Certificate
            </Button>
            
            <Button 
              color="inherit" 
              component={Link} 
              to="/certificates" 
              variant={location.pathname === '/certificates' ? 'outlined' : 'text'}
              disabled={!isDeployed}
            >
              View Certificates
            </Button>
            
            {account ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  avatar={<Avatar>{network && network[0]}</Avatar>}
                  label={network || 'Unknown Network'}
                  size="small"
                  color="secondary"
                />
                
                <Chip 
                  label={truncateAddress(account)}
                  size="small"
                  variant="outlined"
                  onClick={disconnectWallet}
                  color="default"
                  sx={{ background: 'rgba(255,255,255,0.2)' }}
                />
              </Box>
            ) : (
              <Button 
                color="inherit" 
                variant="outlined" 
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Display contract info if deployed */}
        {isDeployed && (
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#e3f2fd'
            }}
          >
            <Typography variant="body2">
              Contract Address: <Chip size="small" label={truncateAddress(contractAddress)} />
            </Typography>
            <Typography variant="body2">
              Network: <Chip size="small" color="primary" label={network || 'Unknown'} />
            </Typography>
          </Paper>
        )}
        
        {children}
      </Container>
    </>
  );
};

export default Layout; 