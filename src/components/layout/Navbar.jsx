import { useState } from 'react';
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

const Navbar = ({ onMenuClick, darkMode, onDarkModeToggle, searchQuery = '', onSearchChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch color="#64748B" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#F8FAFC',
                '&:hover': {
                  backgroundColor: '#F1F5F9',
                },
                '&.Mui-focused': {
                  backgroundColor: '#FFFFFF',
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
          <IconButton size="large">
            <Badge badgeContent={3} color="error">
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
              border: '1px solid transparent',
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
              AD
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
                  Admin
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
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: 200,
                mt: 1,
              },
            }}
          >
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Account Settings</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
