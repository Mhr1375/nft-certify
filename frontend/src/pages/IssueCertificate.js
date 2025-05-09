import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  TextField, 
  Grid, 
  Alert, 
  CircularProgress,
  FormControl,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Card,
  Divider,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  CloudUpload as UploadIcon, 
  Person as PersonIcon, 
  School as SchoolIcon, 
  Description as DescriptionIcon, 
  EventNote as DateIcon,
  Check as CheckIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Web3Context } from '../context/Web3Context';
import { createCertificate } from '../utils/api';
import toast from 'react-hot-toast';

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const PreviewContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'center',
  border: `1px dashed ${theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[700]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'light' 
    ? alpha(theme.palette.primary.main, 0.05)
    : alpha(theme.palette.primary.dark, 0.1),
  position: 'relative',
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 30,
  padding: '10px 24px',
}));

const steps = ['Recipient Information', 'Certificate Details', 'Preview & Submit'];

const IssueCertificate = () => {
  const navigate = useNavigate();
  const { isDeployed } = useContext(Web3Context);
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_address: '',
    course_name: '',
    issue_date: new Date().toISOString().split('T')[0],
    description: '',
  });
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  useEffect(() => {
    // Check if contract is deployed
    if (!isDeployed) {
      navigate('/');
      toast.error('Contract not deployed. Please deploy a contract first.');
    }
  }, [isDeployed, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('image/')) {
        setValidationErrors({
          ...validationErrors,
          image: 'Please upload an image file (JPG, PNG, etc.)'
        });
        return;
      }
      
      setImage(file);
      setValidationErrors({
        ...validationErrors,
        image: '',
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0:
        if (!formData.recipient_name) errors.recipient_name = 'Recipient name is required';
        if (!formData.recipient_address) errors.recipient_address = 'Recipient address is required';
        if (formData.recipient_address && !formData.recipient_address.startsWith('0x')) {
          errors.recipient_address = 'Invalid Ethereum address format';
        }
        break;
      case 1:
        if (!formData.course_name) errors.course_name = 'Course name is required';
        if (!formData.issue_date) errors.issue_date = 'Issue date is required';
        break;
      case 2:
        if (!image) errors.image = 'Certificate image is required';
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Create form data for API
      const apiFormData = new FormData();
      Object.keys(formData).forEach(key => {
        apiFormData.append(key, formData[key]);
      });
      apiFormData.append('image', image);
      
      // Call API to create certificate
      const result = await createCertificate(apiFormData);
      
      setSuccess(true);
      toast.success('Certificate issued successfully!');
      setLoading(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate(`/certificate/${result.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error issuing certificate:', error);
      setError(error.message || 'Failed to issue certificate. Please try again.');
      toast.error('Failed to issue certificate');
      setLoading(false);
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} /> Recipient Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Recipient Name"
                  name="recipient_name"
                  value={formData.recipient_name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={loading || success}
                  error={!!validationErrors.recipient_name}
                  helperText={validationErrors.recipient_name}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Recipient Address (ETH Wallet)"
                  name="recipient_address"
                  value={formData.recipient_address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={loading || success}
                  placeholder="0x..."
                  error={!!validationErrors.recipient_address}
                  helperText={validationErrors.recipient_address}
                  InputProps={{
                    startAdornment: <WalletIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 1 }} /> Certificate Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Course Name"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={loading || success}
                  error={!!validationErrors.course_name}
                  helperText={validationErrors.course_name}
                  InputProps={{
                    startAdornment: <SchoolIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Issue Date"
                  name="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={loading || success}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!validationErrors.issue_date}
                  helperText={validationErrors.issue_date}
                  InputProps={{
                    startAdornment: <DateIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  disabled={loading || success}
                  placeholder="Provide details about this certificate and what it represents..."
                  InputProps={{
                    startAdornment: <DescriptionIcon color="action" sx={{ mt: 1, mr: 1 }} />,
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <UploadIcon sx={{ mr: 1 }} /> Certificate Image
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth error={!!validationErrors.image}>
                  <UploadButton
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    disabled={loading || success}
                  >
                    {image ? 'Change Image' : 'Upload Certificate Image'}
                    <VisuallyHiddenInput 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </UploadButton>
                  {validationErrors.image && (
                    <FormHelperText error>{validationErrors.image}</FormHelperText>
                  )}
                  
                  {image && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {image.name} ({Math.round(image.size / 1024)} KB)
                      </Typography>
                    </Box>
                  )}
                </FormControl>
                
                {preview && (
                  <PreviewContainer>
                    <img 
                      src={preview} 
                      alt="Certificate Preview" 
                      style={{ maxWidth: '100%', maxHeight: '300px' }} 
                    />
                  </PreviewContainer>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Card sx={{ p: 3, mt: 3, bgcolor: 'background.paper' }}>
                  <Typography variant="h6" gutterBottom>
                    Certificate Summary
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Recipient</Typography>
                      <Typography variant="body2">{formData.recipient_name}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Course</Typography>
                      <Typography variant="body2">{formData.course_name}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Issue Date</Typography>
                      <Typography variant="body2">{new Date(formData.issue_date).toLocaleDateString()}</Typography>
                    </Grid>
                    
                    {formData.description && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                        <Typography variant="body2">{formData.description}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        );
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 4,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Success indicator */}
          {success && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                bgcolor: 'rgba(255,255,255,0.9)', 
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <CheckIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: 'success.main',
                    mb: 2,
                  }} 
                />
              </motion.div>
              <Typography variant="h5" align="center" gutterBottom>
                Certificate Issued Successfully!
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                Redirecting to certificate details...
              </Typography>
            </Box>
          )}
          
          <Typography variant="h4" component="h1" gutterBottom>
            Issue New Certificate
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          <Stepper activeStep={activeStep} sx={{ mb: 4, pt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <form onSubmit={handleSubmit}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                startIcon={<BackIcon />}
                variant="outlined"
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ minWidth: 150 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                        Issuing...
                      </>
                    ) : 'Issue Certificate'}
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    onClick={handleNext}
                    endIcon={<NextIcon />}
                    disabled={loading}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default IssueCertificate; 