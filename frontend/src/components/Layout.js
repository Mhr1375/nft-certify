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
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  AccountBalanceWallet as WalletIcon,
  Settings as SettingsIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Web3Context } from '../context/Web3Context';

const drawerWidth = 240;

// Helper function to truncate blockchain addresses
const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Issue Certificate', icon: <AddIcon />, path: '/issue' },
    { text: 'View Certificates', icon: <ViewListIcon />, path: '/certificates' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          NFT Certificates
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {account ? (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<WalletIcon />}
            sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
          >
            {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            startIcon={<WalletIcon />}
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )}
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            NFT Certificate Platform
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {account ? (
              <Tooltip title={account}>
                <Button color="inherit" startIcon={<WalletIcon />}>
                  {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                </Button>
              </Tooltip>
            ) : (
              <Button color="inherit" onClick={connectWallet} startIcon={<WalletIcon />}>
                Connect Wallet
              </Button>
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
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
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
      </Box>
    </Box>
  );
};

export default Layout; 