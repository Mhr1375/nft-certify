import React, { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Stack
} from '@mui/material';
import { Web3Context } from '../context/Web3Context';

const Home = () => {
  const { 
    account, 
    connectWallet, 
    isDeployed, 
    deployContract, 
    isDeploying,
    network 
  } = useContext(Web3Context);
  
  const [deployError, setDeployError] = useState(null);

  const handleDeployContract = async () => {
    try {
      setDeployError(null);
      await deployContract();
    } catch (error) {
      console.error("Failed to deploy contract:", error);
      setDeployError(error.message || "Failed to deploy contract. Please try again.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          NFT Certificate Platform
        </Typography>
        <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>
          Create, manage, and verify certificate NFTs on the blockchain
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        {!account ? (
          <Paper sx={{ p: 4, my: 4, background: "#f5f5f5" }}>
            <Typography variant="h6" gutterBottom>
              Connect Your Wallet to Begin
            </Typography>
            <Typography variant="body1" paragraph>
              To use this platform, you need to connect your Ethereum wallet.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          </Paper>
        ) : !isDeployed ? (
          <Paper sx={{ p: 4, my: 4, background: "#f5f5f5" }}>
            <Typography variant="h6" gutterBottom>
              Deploy NFT Certificate Contract
            </Typography>
            <Typography variant="body1" paragraph>
              Before you can issue certificates, you need to deploy the NFT contract.
            </Typography>
            
            {deployError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {deployError}
              </Alert>
            )}
            
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleDeployContract}
                disabled={isDeploying}
              >
                {isDeploying ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                    Deploying...
                  </>
                ) : "Deploy Contract"}
              </Button>
            </Stack>
            
            {network && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Connected to network: <strong>{network}</strong>
              </Typography>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea component={RouterLink} to="/issue">
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      Issue Certificate
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create and issue a new certificate NFT to a recipient
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea component={RouterLink} to="/certificates">
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      View Certificates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View, verify, and manage issued certificates
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Home; 