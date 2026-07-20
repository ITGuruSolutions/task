import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiBell,
  FiMoon,
  FiSun,
  FiMenu,
  FiChevronDown,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onMenuClick, darkMode, onDarkModeToggle, searchQuery = '', onSearchChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New user registered: Clementine Bauch', time: '5m ago' },
    { id: 2, text: 'User status changed: David Wilson', time: '1h ago' },
    { id: 3, text: 'Database synced with JSONPlaceholder', time: '2h ago' },
  ]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    handleNotificationMenuClose();
    toast.success('All notifications cleared');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const displayName = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : 'Admin';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        height: 80,
      }}
    >
      <Toolbar
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          px: { xs: 2, md: 3 },
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1,
          }}
        >
          {isMobile && (
            <IconButton onClick={onMenuClick} size="large">
              <FiMenu />
            </IconButton>
          )}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Box
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                color: 'text.primary',
              }}
            >
              User Management
            </Box>
          </Box>
        </Box>

        {/* Center Section - Search */}
        <Box
          sx={{
            flex: 2,
            maxWidth: 600,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <TextField
            fullWidth
            placeholder="Search users, departments, or roles..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch color="#64748B" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1E293B' : '#F8FAFC',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#F1F5F9',
                },
                '&.Mui-focused': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#0F172A' : '#FFFFFF',
                  boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
                },
              },
            }}
          />
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <IconButton onClick={onDarkModeToggle} size="large">
            {darkMode ? <FiSun /> : <FiMoon />}
          </IconButton>
          <IconButton onClick={handleNotificationMenuOpen} size="large" aria-label="Notifications">
            <Badge badgeContent={notifications.length} color="error">
              <FiBell />
            </Badge>
          </IconButton>
          <Box
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProfileMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 0.5,
              borderRadius: 2,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'secondary.main',
              }}
            >
              {initials}
            </Avatar>
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'text.primary',
                  }}
                >
                  {displayName}
                </Box>
                <FiChevronDown size={16} />
              </Box>
            )}
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                  minWidth: 200,
                  mt: 1,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Account Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                  minWidth: 320,
                  mt: 1,
                  p: 1,
                },
              },
            }}
          >
            <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
              {notifications.length > 0 && (
                <Button size="small" onClick={handleClearNotifications} sx={{ fontSize: '0.75rem' }}>
                  Clear All
                </Button>
              )}
            </Box>
            <Divider />
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No new notifications</Typography>
              </Box>
            ) : (
              notifications.map((notif) => (
                <MenuItem key={notif.id} onClick={handleNotificationMenuClose} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'normal', wordBreak: 'break-word', color: 'text.primary' }}>
                    {notif.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {notif.time}
                  </Typography>
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
