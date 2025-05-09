import React, { useContext, useState } from 'react';
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
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
  Badge
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LightMode, 
  DarkMode, 
  Menu as MenuIcon, 
  Home as HomeIcon,
  AddCircle as AddIcon,
  ViewList as ListIcon,
  AccountBalanceWallet as WalletIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { Web3Context } from '../context/Web3Context';
import toast from 'react-hot-toast';

const Layout = ({ children, toggleColorMode, mode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { 
    account, 
    connectWallet, 
    disconnectWallet, 
    network, 
    isDeployed, 
    contractAddress 
  } = useContext(Web3Context);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Truncate address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCopyAddress = () => {
    if (contractAddress) {
      navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      toast.success('Contract address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon />, disabled: false },
    { text: 'Issue Certificate', path: '/issue', icon: <AddIcon />, disabled: !isDeployed },
    { text: 'View Certificates', path: '/certificates', icon: <ListIcon />, disabled: !isDeployed },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        NFT Certificate Platform
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            disabled={item.disabled}
            sx={{ 
              color: 'inherit', 
              textDecoration: 'none',
              borderRadius: 1,
              m: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
              '&:hover': {
                bgcolor: 'action.hover',
              },
              ...((location.pathname === item.path) && {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                }
              })
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'inherit' : 'primary.main' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AnimatePresence>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar 
          position="sticky" 
          elevation={0} 
          sx={{ 
            bgcolor: theme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h6" 
                component={Link} 
                to="/" 
                sx={{ 
                  textDecoration: 'none', 
                  color: 'inherit', 
                  flexGrow: 1,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{ marginRight: '8px' }}
                >
                  🏆
                </motion.div>
                NFT Certificate Platform
              </Typography>
            </motion.div>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mx: 4 }}>
                {navItems.map((item) => (
                  <Button 
                    key={item.text}
                    color="inherit" 
                    component={Link} 
                    to={item.path} 
                    variant={location.pathname === item.path ? 'contained' : 'text'}
                    disabled={item.disabled}
                    startIcon={item.icon}
                    sx={{
                      px: 2,
                      '&.Mui-disabled': {
                        opacity: 0.6,
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}
            
            <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{ mr: 2 }}
              >
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            
            {account ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{network && network[0]}</Avatar>}
                  label={network || 'Unknown Network'}
                  size="small"
                  color="secondary"
                  sx={{ fontWeight: 500 }}
                />
                
                <Chip 
                  label={truncateAddress(account)}
                  size="small"
                  variant="outlined"
                  onClick={handleMenuOpen}
                  color="primary"
                  sx={{ 
                    background: 'rgba(63, 81, 181, 0.1)',
                    fontWeight: 500,
                    borderWidth: 2,
                    '&:hover': {
                      background: 'rgba(63, 81, 181, 0.2)',
                    }
                  }}
                />
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={disconnectWallet}>Disconnect Wallet</MenuItem>
                </Menu>
              </Box>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  color="primary" 
                  variant="contained" 
                  onClick={connectWallet}
                  startIcon={<WalletIcon />}
                >
                  Connect Wallet
                </Button>
              </motion.div>
            )}
          </Toolbar>
        </AppBar>

        <Drawer
          anchor={isMobile ? 'left' : 'top'}
          open={isMobile && drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary
            },
          }}
        >
          {drawer}
        </Drawer>
        
        <Container 
          maxWidth="lg" 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          sx={{ 
            mt: 4, 
            mb: 4,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Display contract info if deployed */}
          {isDeployed && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Paper 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: 2,
                  background: theme.palette.mode === 'light' ? '#e3f2fd' : '#1a2027',
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    Contract Address:
                  </Typography>
                  <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                    <Chip 
                      size="small" 
                      label={truncateAddress(contractAddress)}
                      deleteIcon={copied ? <CheckIcon sx={{ color: 'success.main' }} /> : <CopyIcon />}
                      onDelete={handleCopyAddress}
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </Tooltip>
                </Box>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Network: 
                  <Chip 
                    size="small" 
                    color="primary" 
                    label={network || 'Unknown'} 
                    sx={{ fontWeight: 500 }}
                  />
                </Typography>
              </Paper>
            </motion.div>
          )}
          
          {children}
        </Container>

        <Box 
          component="footer"
          sx={{ 
            py: 3, 
            px: 2, 
            mt: 'auto',
            backgroundColor: theme.palette.mode === 'light' 
              ? theme.palette.grey[100] 
              : theme.palette.grey[900],
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              NFT Certificate Platform - Open Source Project © {new Date().getFullYear()}
            </Typography>
          </Container>
        </Box>
      </Box>
    </AnimatePresence>
  );
};

export default Layout; 