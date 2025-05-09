import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControlLabel, 
  Switch, 
  Divider, 
  Alert,
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Link,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  InfoOutlined as InfoIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Web3Context } from '../context/Web3Context';
import { getSettings, saveSettings } from '../utils/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { account } = useContext(Web3Context);

  const [settings, setSettings] = useState({
    useMockContract: true,
    useMockIPFS: true,
    networkRpcUrl: 'http://localhost:8545',
    contractAddress: '',
    pinataApiKey: '',
    pinataSecretKey: '',
  });
  
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Load current settings when component mounts
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings. Please try again.');
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setSettings({
      ...settings,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await saveSettings(settings);
      setSaved(true);
      toast.success('Settings saved successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SettingsIcon sx={{ mr: 2, color: 'primary.main', fontSize: 30 }} />
            <Typography variant="h4">
              Platform Settings
            </Typography>
          </Box>
          
          {saved && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Settings saved successfully! Changes will take effect after restarting the servers.
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Blockchain Settings Card */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader 
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WalletIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">Blockchain Settings</Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={settings.useMockContract} 
                          onChange={handleChange}
                          name="useMockContract"
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>Use mock blockchain (for development)</Typography>
                          <Tooltip title="When enabled, certificates are stored in memory and not on an actual blockchain">
                            <IconButton size="small" sx={{ ml: 1 }}>
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Network RPC URL"
                      name="networkRpcUrl"
                      value={settings.networkRpcUrl}
                      onChange={handleChange}
                      disabled={settings.useMockContract}
                      helperText={
                        <span>
                          Example: https://mainnet.infura.io/v3/YOUR-PROJECT-ID or http://localhost:8545 for local networks
                          <Link 
                            href="https://infura.io/register" 
                            target="_blank" 
                            sx={{ ml: 1, fontSize: '0.8rem' }}
                          >
                            Get Infura key
                          </Link>
                        </span>
                      }
                    />
                    
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Contract Address"
                      name="contractAddress"
                      value={settings.contractAddress}
                      onChange={handleChange}
                      disabled={settings.useMockContract}
                      helperText="The deployed NFT certificate contract address"
                    />
                    
                    {/* Connection status */}
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Wallet connection status:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color={account ? "success.main" : "error.main"}>
                        {account ? "Connected" : "Not connected"}
                      </Typography>
                      {account && (
                        <Tooltip title={account}>
                          <Typography variant="body2" sx={{ ml: 1, fontFamily: 'monospace' }}>
                            {account.substring(0, 6)}...{account.substring(account.length - 4)}
                          </Typography>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* IPFS Settings Card */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader 
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CloudUploadIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">IPFS Settings</Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={settings.useMockIPFS} 
                          onChange={handleChange}
                          name="useMockIPFS"
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>Use mock IPFS (for development)</Typography>
                          <Tooltip title="When enabled, certificate images and metadata are stored locally, not on IPFS">
                            <IconButton size="small" sx={{ ml: 1 }}>
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Pinata API Key"
                      name="pinataApiKey"
                      value={settings.pinataApiKey}
                      onChange={handleChange}
                      disabled={settings.useMockIPFS}
                      helperText={
                        <span>
                          Your Pinata API key for IPFS storage
                          <Link 
                            href="https://app.pinata.cloud/register" 
                            target="_blank" 
                            sx={{ ml: 1, fontSize: '0.8rem' }}
                          >
                            Create Pinata account
                          </Link>
                        </span>
                      }
                    />
                    
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Pinata Secret Key"
                      name="pinataSecretKey"
                      value={settings.pinataSecretKey}
                      onChange={handleChange}
                      type="password"
                      disabled={settings.useMockIPFS}
                      helperText="Your Pinata secret key"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button 
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadSettings}
                disabled={loading}
              >
                Refresh
              </Button>
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
                size="large"
              >
                Save Settings
              </Button>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Settings; 