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
  Stack,
  alpha,
  useTheme,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Wallet as WalletIcon, 
  Add as AddIcon, 
  ViewList as ViewListIcon, 
  ArrowForward as ArrowForwardIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { Web3Context } from '../context/Web3Context';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Home = () => {
  const theme = useTheme();
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 3, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Container 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        pt: 0,
        pb: 0,
        overflow: 'hidden'
      }}
    >
      <Grid 
        container 
        spacing={1} 
        alignItems="stretch"
        sx={{ 
          width: '100%', 
          flexGrow: 1 
        }}
      >
        <Grid item xs={12} md={5} sx={{
          textAlign: { xs: 'center', md: 'left' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}>
          <MotionBox
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.7rem', sm: '2rem', md: '2.4rem' },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
                mb: 0.5,
                mt: 0
              }}
            >
              NFT Certificate Platform
            </Typography>
            <Typography 
              variant="body1" 
              component="h2" 
              color="textSecondary" 
              sx={{ 
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                mb: 1,
                mt: 0
              }}
            >
              Create, manage, and verify certificate NFTs on the blockchain
            </Typography>
            
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                mb: { xs: 1, md: 1.5 },
                mt: 0,
                justifyContent: { xs: 'center', md: 'flex-start' } 
              }}
            >
              {[
                { icon: <ShieldIcon />, label: "Secure", color: "primary" },
                { icon: <VerifiedIcon />, label: "Verifiable", color: "secondary" },
                { icon: <SpeedIcon />, label: "Fast", color: "primary" }
              ].map((feature, index) => (
                <Chip
                  key={index}
                  icon={feature.icon}
                  label={feature.label}
                  size="medium"
                  sx={{
                    height: 32,
                    fontSize: '0.85rem',
                    bgcolor: alpha(theme.palette[feature.color].main, 0.08),
                    color: theme.palette[feature.color].dark,
                    borderColor: alpha(theme.palette[feature.color].main, 0.2),
                    '& .MuiChip-icon': {
                      color: theme.palette[feature.color].main
                    }
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>

            {isDeployed && (
              <MotionBox
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                sx={{ 
                  mt: 3,
                  display: { xs: 'block', md: 'none' }
                }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  sx={{ 
                    mb: 1.5,
                    fontSize: '1.15rem',
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Get Started
                </Typography>
                
                <Grid container spacing={2}>
                  {[
                    {
                      title: "Issue Certificate",
                      description: "Create and issue new certificate NFTs",
                      icon: <AddIcon />,
                      color: "primary",
                      to: "/issue"
                    },
                    {
                      title: "View Certificates",
                      description: "Browse and manage your certificates",
                      icon: <ViewListIcon />,
                      color: "secondary",
                      to: "/certificates"
                    }
                  ].map((card, index) => (
                    <Grid item xs={6} component={motion.div} variants={itemVariants} key={index}>
                      <MotionCard 
                        whileHover={{ 
                          translateY: -4,
                          boxShadow: `0px 4px 12px ${alpha(theme.palette[card.color].main, 0.15)}` 
                        }}
                        sx={{ 
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: `1px solid ${alpha(theme.palette[card.color].main, 0.3)}`,
                          background: alpha(theme.palette[card.color].main, 0.03),
                          position: 'relative',
                          height: '100%'
                        }}
                      >
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0,
                            left: 0, 
                            right: 0,
                            height: '4px', 
                            bgcolor: theme.palette[card.color].main
                          }}
                        />
                        <CardContent sx={{ 
                          p: 1,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          textAlign: 'center'
                        }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette[card.color].main, 0.15),
                                color: theme.palette[card.color].main,
                                width: 45,
                                height: 45,
                                mb: 1.5
                              }}
                            >
                              {card.icon}
                            </Avatar>
                            <Typography 
                              variant="subtitle1" 
                              component="div" 
                              fontWeight={600}
                              sx={{ fontSize: '1rem' }}
                            >
                              {card.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ fontSize: '0.85rem', mt: 0.5 }}
                            >
                              {card.description}
                            </Typography>
                          </Box>
                          <Button 
                            variant="contained"
                            color={card.color}
                            size="medium"
                            endIcon={<ArrowForwardIcon />}
                            component={RouterLink}
                            to={card.to}
                            sx={{ 
                              fontSize: '0.85rem',
                              textTransform: 'none',
                              mt: 2
                            }}
                          >
                            Go
                          </Button>
                        </CardContent>
                      </MotionCard>
                    </Grid>
                  ))}
                </Grid>
              </MotionBox>
            )}
          </MotionBox>
        </Grid>

        <Grid item xs={12} md={7} sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}>
          {!account ? (
            <MotionPaper
              elevation={0}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ 
                p: { xs: 2.5, sm: 3 }, 
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${theme.palette.divider}`,
                maxWidth: '600px',
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 3px 10px ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '4px', 
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mr: 2,
                    width: 45,
                    height: 45
                  }}
                >
                  <WalletIcon sx={{ fontSize: '1.4rem' }} />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    fontWeight={600}
                    sx={{ fontSize: '1.1rem', mb: 0.8 }}
                  >
                    Connect Your Wallet
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph 
                    sx={{ 
                      mb: 2,
                      fontSize: '0.9rem'
                    }}
                  >
                    Connect with MetaMask or another web3 wallet to access features.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={connectWallet}
                    startIcon={<WalletIcon />}
                    size="medium"
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      py: 0.7,
                      px: 2
                    }}
                  >
                    Connect Wallet
                  </Button>
                </Box>
              </Box>
            </MotionPaper>
          ) : !isDeployed ? (
            <MotionPaper
              elevation={0}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ 
                p: { xs: 2.5, sm: 3 }, 
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${theme.palette.divider}`,
                maxWidth: '600px',
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 3px 10px ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '4px', 
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                }}
              />
            
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mr: 2,
                    width: 45,
                    height: 45
                  }}
                >
                  <ShieldIcon sx={{ fontSize: '1.4rem' }} />
                </Avatar>
                <Box sx={{ width: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    fontWeight={600}
                    sx={{ fontSize: '1.1rem', mb: 0.8 }}
                  >
                    Deploy NFT Certificate Contract
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph 
                    sx={{ 
                      mb: 2,
                      fontSize: '0.9rem'
                    }}
                  >
                    Deploy the NFT contract to start issuing certificates.
                  </Typography>
                  
                  {deployError && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 2,
                        fontSize: '0.85rem',
                        py: 0.5
                      }}
                    >
                      {deployError}
                    </Alert>
                  )}
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleDeployContract}
                    disabled={isDeploying}
                    size="medium"
                    sx={{
                      borderRadius: 1.5,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      py: 0.7,
                      px: 2
                    }}
                  >
                    {isDeploying ? (
                      <>
                        <CircularProgress size={18} sx={{ mr: 1 }} color="inherit" />
                        Deploying...
                      </>
                    ) : "Deploy Contract"}
                  </Button>
                  
                  {network && (
                    <Typography variant="caption" sx={{ mt: 1.5, display: 'block', color: 'text.secondary', fontSize: '0.8rem' }}>
                      Connected to network: <strong>{network}</strong>
                    </Typography>
                  )}
                </Box>
              </Box>
            </MotionPaper>
          ) : (
            <Grid container spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {[
                {
                  title: "Issue Certificate",
                  description: "Create and issue new certificate NFTs",
                  icon: <AddIcon />,
                  color: "primary",
                  to: "/issue"
                },
                {
                  title: "View Certificates",
                  description: "Browse and manage your certificates",
                  icon: <ViewListIcon />,
                  color: "secondary",
                  to: "/certificates"
                }
              ].map((card, index) => (
                <Grid item xs={6} component={motion.div} variants={itemVariants} key={index}>
                  <MotionCard 
                    whileHover={{ 
                      translateY: -4,
                      boxShadow: `0px 4px 12px ${alpha(theme.palette[card.color].main, 0.15)}` 
                    }}
                    sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: `1px solid ${alpha(theme.palette[card.color].main, 0.3)}`,
                      background: alpha(theme.palette[card.color].main, 0.03),
                      position: 'relative',
                      height: '100%',
                      aspectRatio: '1/1',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0,
                        left: 0, 
                        right: 0,
                        height: '4px', 
                        bgcolor: theme.palette[card.color].main
                      }}
                    />
                    <CardContent sx={{ 
                      p: 1.5,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette[card.color].main, 0.15),
                            color: theme.palette[card.color].main,
                            width: 60,
                            height: 60,
                            mb: 2
                          }}
                        >
                          {card.icon}
                        </Avatar>
                        <Typography 
                          variant="h6" 
                          component="div" 
                          fontWeight={600}
                          sx={{ fontSize: '1.2rem' }}
                        >
                          {card.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="text.secondary" 
                          sx={{ fontSize: '0.9rem', mt: 1 }}
                        >
                          {card.description}
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained"
                        color={card.color}
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        component={RouterLink}
                        to={card.to}
                        sx={{ 
                          fontSize: '0.9rem',
                          textTransform: 'none',
                          mt: 3
                        }}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 