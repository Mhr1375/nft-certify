import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  OpenInNew as OpenIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  VerifiedUser as VerifiedIcon,
  GppBad as RevokedIcon,
  WifiProtectedSetup as BlockchainIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Web3Context } from '../context/Web3Context';
import { getCertificate, revokeCertificate } from '../utils/api';
import toast from 'react-hot-toast';

const CertificateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDeployed } = useContext(Web3Context);
  // NOTE: We might need account and contract for future functionality
  
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const data = await getCertificate(id);
        setCertificate(data);
        
        // Fetch metadata if token URI exists
        if (data.token_uri) {
          try {
            const metadataUrl = data.token_uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
            const response = await fetch(metadataUrl);
            const metadataJson = await response.json();
            setMetadata(metadataJson);
          } catch (err) {
            console.error('Error fetching metadata:', err);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching certificate:', error);
        setError('Failed to load certificate. Please try again.');
        toast.error('Failed to load certificate');
        setLoading(false);
      }
    };
    
    if (isDeployed && id) {
      fetchCertificate();
    }
  }, [isDeployed, id]);
  
  const handleRevokeClick = () => {
    setRevokeDialogOpen(true);
  };
  
  const handleRevokeConfirm = async () => {
    try {
      setRevoking(true);
      await revokeCertificate(id);
      
      // Update certificate
      const updatedCertificate = await getCertificate(id);
      setCertificate(updatedCertificate);
      
      setRevoking(false);
      setRevokeDialogOpen(false);
      toast.success('Certificate has been revoked');
    } catch (error) {
      console.error('Error revoking certificate:', error);
      setError('Failed to revoke certificate. Please try again.');
      toast.error('Failed to revoke certificate');
      setRevoking(false);
      setRevokeDialogOpen(false);
    }
  };
  
  const handleRevokeCancel = () => {
    setRevokeDialogOpen(false);
  };
  
  const handleCopyAddress = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const downloadCertificateImage = () => {
    if (metadata && metadata.image) {
      const imageUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `certificate-${id}.jpg`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          toast.success('Certificate image downloaded');
        })
        .catch(error => {
          console.error('Error downloading certificate:', error);
          toast.error('Failed to download certificate image');
        });
    }
  };
  
  if (!isDeployed) {
    return (
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 4, mt: 4, textAlign: 'center', borderRadius: 2 }} elevation={3}>
            <Typography variant="h5" gutterBottom>
              Contract Not Deployed
            </Typography>
            <Typography variant="body1" paragraph>
              You need to deploy the NFT contract before you can view certificates.
            </Typography>
            <Button onClick={() => navigate('/')} variant="contained" color="primary">
              Go to Home
            </Button>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, mt: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} to="/" color="inherit">
              Home
            </Link>
            <Link component={RouterLink} to="/certificates" color="inherit">
              Certificates
            </Link>
            <Typography color="text.primary">
              {loading ? 'Loading...' : certificate?.course_name || `Certificate #${id}`}
            </Typography>
          </Breadcrumbs>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh'
            }}
          >
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Loading certificate...
            </Typography>
          </Box>
        ) : !certificate ? (
          <Paper 
            sx={{ 
              p: 5, 
              textAlign: 'center', 
              borderRadius: 2, 
              backgroundColor: theme => alpha(theme.palette.error.main, 0.05)
            }}
            elevation={3}
          >
            <Typography variant="h4" component="h1" gutterBottom color="error.main">
              Certificate Not Found
            </Typography>
            <Typography variant="body1" paragraph>
              The certificate you're looking for doesn't exist or has been removed.
            </Typography>
            <Button 
              onClick={() => navigate('/certificates')} 
              variant="contained" 
              color="primary"
              startIcon={<BackIcon />}
              sx={{ mt: 2 }}
            >
              View All Certificates
            </Button>
          </Paper>
        ) : (
          <>
            {/* Status banner */}
            {certificate.revoked ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Paper 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    border: `1px solid ${theme.palette.error.main}`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <RevokedIcon color="error" fontSize="large" />
                  <Box>
                    <Typography variant="h6" color="error.main">
                      This Certificate Has Been Revoked
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This certificate is no longer valid. It may have been revoked due to an error or other reason.
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Paper 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${theme.palette.success.main}`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <VerifiedIcon color="success" fontSize="large" />
                  <Box>
                    <Typography variant="h6" color="success.main">
                      Valid Certificate
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This certificate is valid and verified on the blockchain. It can be trusted as authentic.
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            )}

            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }} elevation={3}>
              <Grid container>
                {/* Certificate image section */}
                <Grid item xs={12} md={6} sx={{ 
                  bgcolor: theme => theme.palette.mode === 'light' 
                    ? alpha(theme.palette.primary.main, 0.05)
                    : alpha(theme.palette.primary.dark, 0.2),
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: theme => `1px solid ${theme.palette.divider}`
                }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="certificate-image-container"
                  >
                    <Box sx={{ 
                      position: 'relative',
                      maxWidth: '100%',
                      boxShadow: theme => theme.palette.mode === 'light' 
                        ? '0 10px 30px rgba(0,0,0,0.15)' 
                        : '0 10px 30px rgba(0,0,0,0.3)',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: theme => `4px solid ${theme.palette.background.paper}`,
                    }}>
                      {metadata && metadata.image ? (
                        <Box>
                          <img 
                            src={metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} 
                            alt={`Certificate for ${certificate.recipient_name}`}
                            style={{ 
                              width: '100%', 
                              maxWidth: '450px', 
                              display: 'block',
                              backgroundColor: '#fff'
                            }}
                            onError={(e) => {
                              e.target.src = '/placeholder-certificate.png';
                            }}
                          />
                          
                          {/* Certificate status overlay */}
                          {certificate.revoked && (
                            <Box sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              right: 0, 
                              bottom: 0, 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(0,0,0,0.5)',
                            }}>
                              <Typography 
                                variant="h4" 
                                color="white" 
                                sx={{ 
                                  transform: 'rotate(-25deg)',
                                  border: '5px solid white',
                                  padding: '8px 16px',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  letterSpacing: 2
                                }}
                              >
                                Revoked
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box 
                          sx={{ 
                            height: '300px', 
                            width: '100%',
                            maxWidth: '450px',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: theme => theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
                            borderRadius: 1
                          }}
                        >
                          <Typography variant="body1" color="text.secondary">
                            No image available
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </motion.div>
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Tooltip title="Download Certificate Image">
                      <Button 
                        variant="outlined" 
                        startIcon={<DownloadIcon />}
                        onClick={downloadCertificateImage}
                        disabled={!(metadata && metadata.image)}
                      >
                        Download
                      </Button>
                    </Tooltip>
                    
                    {metadata && metadata.image && (
                      <Button
                        variant="outlined" 
                        startIcon={<OpenIcon />}
                        component={Link}
                        href={metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Full Size
                      </Button>
                    )}
                  </Box>
                </Grid>
                
                {/* Certificate details section */}
                <Grid item xs={12} md={6} sx={{ p: 4 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom 
                        sx={{ fontWeight: 'bold' }}
                      >
                        {certificate.course_name}
                      </Typography>
                      
                      {certificate.revoked ? (
                        <Chip 
                          label="Revoked" 
                          color="error" 
                          size="small" 
                          sx={{ height: 24 }}
                        />
                      ) : (
                        <Chip 
                          icon={<VerifiedIcon />}
                          label="Valid" 
                          color="success" 
                          size="small" 
                          sx={{ height: 24 }}
                        />
                      )}
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Recipient
                          </Typography>
                          <Typography variant="h6">
                            {certificate.recipient_name}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Issue Date
                          </Typography>
                          <Typography variant="h6">
                            {new Date(certificate.issue_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                        
                        {certificate.description && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Description
                            </Typography>
                            <Typography variant="body1">
                              {certificate.description}
                            </Typography>
                          </Box>
                        )}
                        
                        {metadata && metadata.attributes && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Attributes
                            </Typography>
                            <Grid container spacing={1}>
                              {metadata.attributes.map((attr, index) => (
                                <Grid item xs={6} key={index}>
                                  <Chip 
                                    label={`${attr.trait_type}: ${attr.value}`} 
                                    variant="outlined"
                                    size="small"
                                    sx={{ mt: 1 }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Stack>
                    </motion.div>
                    
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1 
                      }}>
                        <BlockchainIcon fontSize="small" color="primary" />
                        Blockchain Information
                      </Typography>
                      
                      <Card sx={{ 
                        p: 2, 
                        bgcolor: theme => alpha(theme.palette.background.default, 0.6)
                      }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Token ID
                              </Typography>
                              <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                                #{certificate.id}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Owner Address
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" fontFamily="monospace">
                                  {truncateAddress(certificate.owner)}
                                </Typography>
                                <Tooltip title="Copy Address">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleCopyAddress(certificate.owner, 'Owner address')}
                                  >
                                    {copied ? <CheckIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Metadata URI
                              </Typography>
                              <Button
                                size="small"
                                endIcon={<OpenIcon fontSize="small" />}
                                component={Link}
                                href={certificate.token_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Metadata
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Box>
                    
                    <Box sx={{ mt: 4 }}>
                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          startIcon={<BackIcon />}
                          onClick={() => navigate('/certificates')}
                        >
                          Back to Certificates
                        </Button>
                        
                        {!certificate.revoked && (
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleRevokeClick}
                          >
                            Revoke Certificate
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Information box */}
            <Box sx={{ mt: 4 }}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: theme => alpha(theme.palette.info.main, 0.05),
                border: theme => `1px solid ${alpha(theme.palette.info.main, 0.2)}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <InfoIcon color="info" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    About NFT Certificates
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  This certificate is stored on the blockchain as a Non-Fungible Token (NFT), making it tamper-proof and verifiable.
                  The owner can prove ownership by connecting their wallet. The metadata and image are stored on IPFS, a decentralized storage system.
                </Typography>
              </Paper>
            </Box>
          </>
        )}
        
        {/* Revoke Dialog */}
        <Dialog
          open={revokeDialogOpen}
          onClose={handleRevokeCancel}
          aria-labelledby="revoke-dialog-title"
          aria-describedby="revoke-dialog-description"
        >
          <DialogTitle id="revoke-dialog-title">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DeleteIcon color="error" />
              Revoke Certificate
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="revoke-dialog-description">
              Are you sure you want to revoke this certificate? This action cannot be undone.
              Once revoked, the certificate will be marked as invalid but will still remain on the blockchain.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleRevokeCancel} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleRevokeConfirm} 
              color="error" 
              variant="contained"
              disabled={revoking}
              startIcon={revoking ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            >
              {revoking ? 'Revoking...' : 'Revoke Certificate'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default CertificateDetail; 