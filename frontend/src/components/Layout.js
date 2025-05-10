import React, { useState, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip,
  Avatar,
  Container,
  Paper,
  Chip,
  alpha,
  ListItemButton,
  Collapse,
  Stack,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  AccountBalanceWallet as WalletIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ExpandLess,
  ExpandMore,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { Web3Context } from '../context/Web3Context';
import { motion } from 'framer-motion';

const drawerWidth = 260;

// Helper function to truncate blockchain addresses
const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const Layout = ({ children, toggleColorMode, currentMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState('');
  const location = useLocation();
  const { 
    account, 
    connectWallet, 
    disconnectWallet, 
    network, 
    isDeployed, 
    contractAddress 
  } = useContext(Web3Context);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleExpandClick = (item) => {
    setExpandedItem(expandedItem === item ? '' : item);
  };

  const menuItems = [
    { 
      text: 'Home', 
      icon: <HomeIcon />, 
      path: '/' 
    },
    { 
      text: 'Issue Certificate', 
      icon: <AddIcon />, 
      path: '/issue' 
    },
    { 
      text: 'View Certificates', 
      icon: <ViewListIcon />, 
      path: '/certificates' 
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/settings' 
    },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  const drawer = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          py: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src="/logo192.png"
            alt="NFT Cert"
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 1,
              background: theme.palette.primary.main
            }}
          >
            N
          </Avatar>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            NFT Certificates
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      
      <Box sx={{ p: 2 }}>
        {account ? (
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 2,
              mb: 2,
              background: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="primary.main">
                Connected Wallet
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<WalletIcon />}
                sx={{ 
                  textTransform: 'none', 
                  justifyContent: 'flex-start',
                  borderRadius: 1.5,
                  py: 0.75
                }}
              >
                {truncateAddress(account)}
              </Button>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                Network: <Chip size="small" label={network || 'Unknown'} sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
              </Typography>
            </Stack>
          </Paper>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<WalletIcon />}
            onClick={connectWallet}
            sx={{ mb: 2, borderRadius: 1.5, py: 1 }}
          >
            Connect Wallet
          </Button>
        )}
      </Box>
      
      <Divider sx={{ mb: 1 }} />
      
      <List component="nav" sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          return (
            <motion.div
              key={item.text}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.18),
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? theme.palette.primary.main : 'inherit',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </motion.div>
          );
        })}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Box sx={{ p: 2, mt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Button
          fullWidth
          variant="outlined"
          color={currentMode === 'dark' ? 'secondary' : 'primary'}
          startIcon={currentMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          onClick={toggleColorMode}
          sx={{ mb: 2, borderRadius: 1.5 }}
        >
          {currentMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          NFT Certificate Platform v1.0
        </Typography>
      </Box>
    </motion.div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backdropFilter: 'blur(10px)',
          bgcolor: alpha(theme.palette.background.default, 0.8),
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            {location.pathname === '/' && (
              <Typography variant="h6" noWrap component="div" fontWeight={600}>
                Dashboard
              </Typography>
            )}
            {location.pathname === '/issue' && (
              <Typography variant="h6" noWrap component="div" fontWeight={600}>
                Issue Certificate
              </Typography>
            )}
            {location.pathname === '/certificates' && (
              <Typography variant="h6" noWrap component="div" fontWeight={600}>
                View Certificates
              </Typography>
            )}
            {location.pathname === '/settings' && (
              <Typography variant="h6" noWrap component="div" fontWeight={600}>
                Settings
              </Typography>
            )}
            {location.pathname.startsWith('/certificate/') && (
              <Typography variant="h6" noWrap component="div" fontWeight={600}>
                Certificate Details
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              color="inherit" 
              onClick={toggleColorMode}
              sx={{ ml: 1 }}
            >
              {currentMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            {!isMobile && (
              <>
                {account ? (
                  <Tooltip title={account}>
                    <Button 
                      color="inherit" 
                      startIcon={<WalletIcon />}
                      sx={{ 
                        ml: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        px: 2
                      }}
                    >
                      {truncateAddress(account)}
                    </Button>
                  </Tooltip>
                ) : (
                  <Button 
                    color="primary" 
                    variant="contained"
                    onClick={connectWallet} 
                    startIcon={<WalletIcon />}
                    sx={{ ml: 2 }}
                  >
                    Connect Wallet
                  </Button>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component={motion.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {/* Display contract info if deployed */}
          {isDeployed && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  background: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderRadius: 2
                }}
              >
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  Contract Address: 
                  <Chip 
                    size="small" 
                    label={truncateAddress(contractAddress)} 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontWeight: 600
                    }} 
                  />
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Network: 
                  <Chip 
                    size="small" 
                    color="primary" 
                    label={network || 'Unknown'} 
                  />
                </Typography>
              </Paper>
            </motion.div>
          )}
          
          {children}
          
          <Box 
            component="footer"
            sx={{ 
              mt: 6, 
              py: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              NFT Certificate Platform © 2023 | Open Source Project
            </Typography>
            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent="center" 
              mt={1}
            >
              <IconButton 
                size="small" 
                color="inherit"
                component="a"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 