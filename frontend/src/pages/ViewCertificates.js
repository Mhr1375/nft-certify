import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  alpha,
  Skeleton,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ArrowUpward as SortAscIcon,
  ArrowDownward as SortDescIcon
} from '@mui/icons-material';
import { Web3Context } from '../context/Web3Context';
import { getCertificates } from '../utils/api';
import toast from 'react-hot-toast';
import ImagePlaceholder from '../components/ImagePlaceholder';

const ViewCertificates = () => {
  const navigate = useNavigate();
  const { isDeployed } = useContext(Web3Context);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filteredCertificates, setFilteredCertificates] = useState([]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await getCertificates();
      setCertificates(data);
      setFilteredCertificates(data);
      setLoading(false);
      toast.success('Certificates loaded successfully');
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Failed to load certificates. Please try again.');
      toast.error('Failed to load certificates');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDeployed) {
      fetchCertificates();
    }
  }, [isDeployed]);
  
  // Filter certificates when search or filter changes
  useEffect(() => {
    if (!certificates.length) {
      setFilteredCertificates([]);
      return;
    }
    
    let result = [...certificates];
    
    // Apply filters
    if (filterBy !== 'all') {
      result = result.filter(cert => {
        if (filterBy === 'revoked') return cert.revoked;
        if (filterBy === 'active') return !cert.revoked;
        return true;
      });
    }
    
    // Apply search query
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(cert => 
        cert.recipient_name.toLowerCase().includes(searchLower) || 
        cert.course_name.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.issue_date);
      const dateB = new Date(b.issue_date);
      return sortDirection === 'desc' 
        ? dateB - dateA  // Newest first
        : dateA - dateB; // Oldest first
    });
    
    setFilteredCertificates(result);
  }, [certificates, search, filterBy, sortDirection]);

  const handleRefresh = () => {
    if (isDeployed) {
      fetchCertificates();
    }
  };
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prevSort => prevSort === 'desc' ? 'asc' : 'desc');
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
            <Button 
              component={RouterLink} 
              to="/" 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
            >
              Go to Home
            </Button>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
  };

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 4, mt: 4, borderRadius: 2 }} elevation={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 3,
              gap: 2
            }}
          >
            <Typography variant="h4" component="h1" fontWeight={600}>
              Certificates
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Certificates">
                <IconButton 
                  onClick={handleRefresh} 
                  disabled={loading}
                  color="primary"
                  sx={{ 
                    animation: loading ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Button 
                component={RouterLink} 
                to="/issue" 
                variant="contained" 
                color="primary"
              >
                Issue New Certificate
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {/* Search and filter controls */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 4,
              mt: 3
            }}
          >
            <TextField
              label="Search Certificates"
              variant="outlined"
              fullWidth
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by recipient or course name..."
              sx={{ flexGrow: 1 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="filter-label">Filter By</InputLabel>
                <Select
                  labelId="filter-label"
                  value={filterBy}
                  onChange={handleFilterChange}
                  label="Filter By"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">All Certificates</MenuItem>
                  <MenuItem value="active">Active Only</MenuItem>
                  <MenuItem value="revoked">Revoked Only</MenuItem>
                </Select>
              </FormControl>
              
              <Tooltip title={`Sort by Date: ${sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}`}>
                <Button 
                  variant="outlined" 
                  onClick={toggleSortDirection}
                  startIcon={sortDirection === 'desc' ? <SortDescIcon /> : <SortAscIcon />}
                >
                  {sortDirection === 'desc' ? 'Newest' : 'Oldest'}
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Card sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" height={140} animation="wave" />
                    <CardContent>
                      <Skeleton variant="text" height={30} width="70%" animation="wave" />
                      <Skeleton variant="text" height={24} animation="wave" />
                      <Skeleton variant="text" height={24} width="60%" animation="wave" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : filteredCertificates.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                my: 5, 
                py: 5,
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                border: theme => `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              {search || filterBy !== 'all' ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 5, 0] }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <FilterIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  </motion.div>
                  <Typography variant="h6" gutterBottom>
                    No certificates match your search
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Try changing your search or filter settings
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => {
                      setSearch('');
                      setFilterBy('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <ImagePlaceholder 
                      height="100px" 
                      text="No certificates" 
                      iconSize="large" 
                    />
                  </motion.div>
                  <Typography variant="h6" gutterBottom>
                    No certificates found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start by issuing your first certificate
                  </Typography>
                  <Button 
                    component={RouterLink} 
                    to="/issue" 
                    variant="contained" 
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Issue a Certificate
                  </Button>
                </>
              )}
            </Box>
          ) : (
            <>
              {/* Filter results summary */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredCertificates.length} of {certificates.length} certificates
                  {filterBy !== 'all' && ` (${filterBy === 'revoked' ? 'Revoked' : 'Active'} only)`}
                  {search && ` matching "${search}"`}
                </Typography>
              </Box>
              
              <AnimatePresence>
                <Grid container spacing={3}>
                  {filteredCertificates.map((certificate, index) => (
                    <Grid item xs={12} sm={6} md={4} key={certificate.id}>
                      <motion.div
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layoutId={`certificate-${certificate.id}`}
                      >
                        <Card 
                          sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            borderRadius: 2,
                            position: 'relative',
                            overflow: 'visible',
                            '&::before': certificate.revoked ? {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              borderRadius: 2,
                              background: 'repeating-linear-gradient(45deg, rgba(255,0,0,0.05), rgba(255,0,0,0.05) 10px, rgba(0,0,0,0) 10px, rgba(0,0,0,0) 20px)',
                              zIndex: 1,
                              pointerEvents: 'none'
                            } : {}
                          }}
                        >
                          <CardActionArea 
                            component={RouterLink} 
                            to={`/certificate/${certificate.id}`}
                            sx={{ 
                              flexGrow: 1, 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'stretch'
                            }}
                          >
                            <CardMedia
                              component="div"
                              sx={{ 
                                height: 160, 
                                objectFit: 'cover', 
                                background: theme => theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
                                borderBottom: theme => `1px solid ${theme.palette.divider}`,
                                minHeight: '160px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Box 
                                component="img"
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  opacity: 1,
                                  transition: 'opacity 0.3s ease'
                                }}
                                src={certificate.token_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                alt={`Certificate for ${certificate.recipient_name}`}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                              <Box 
                                sx={{ 
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <ImagePlaceholder 
                                  height="160px" 
                                  text="Certificate Image" 
                                  iconSize="medium" 
                                />
                              </Box>
                            </CardMedia>
                            <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                              {certificate.revoked && (
                                <Chip 
                                  label="Revoked" 
                                  color="error" 
                                  size="small"
                                  sx={{ 
                                    position: 'absolute',
                                    top: -20,
                                    right: 16,
                                    fontWeight: 'bold',
                                    borderRadius: '4px'
                                  }}
                                />
                              )}
                              
                              <Typography 
                                variant="h6" 
                                component="div" 
                                gutterBottom 
                                noWrap
                                sx={{ 
                                  fontWeight: 600,
                                  color: certificate.revoked ? 'text.disabled' : 'text.primary'
                                }}
                              >
                                {certificate.course_name}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography 
                                    variant="body2" 
                                    color={certificate.revoked ? 'text.disabled' : 'text.secondary'}
                                    sx={{ fontWeight: 500 }}
                                  >
                                    Recipient:
                                  </Typography>
                                  <Typography variant="body2">
                                    {certificate.recipient_name}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography 
                                    variant="body2" 
                                    color={certificate.revoked ? 'text.disabled' : 'text.secondary'}
                                    sx={{ fontWeight: 500 }}
                                  >
                                    Issued:
                                  </Typography>
                                  <Typography variant="body2">
                                    {new Date(certificate.issue_date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography 
                                    variant="body2" 
                                    color={certificate.revoked ? 'text.disabled' : 'text.secondary'}
                                    sx={{ fontWeight: 500 }}
                                  >
                                    Token:
                                  </Typography>
                                  <Typography variant="body2" fontFamily="monospace">
                                    #{certificate.id}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ mt: 2 }}>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color={certificate.revoked ? 'inherit' : 'primary'}
                                  sx={{ 
                                    width: '100%',
                                    opacity: certificate.revoked ? 0.7 : 1
                                  }}
                                >
                                  View Details
                                </Button>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </AnimatePresence>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ViewCertificates; 