import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout,
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const menuItems = [
    { icon: FiLayout, label: 'Dashboard', path: '/' },
    { icon: FiUsers, label: 'Users', path: '/' },
    { icon: FiSettings, label: 'Settings', path: '/settings', disabled: true },
  ];

  const sidebarContent = (
    <Box
      component={motion.div}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      sx={{
        width: collapsed ? 80 : 280,
        height: '100vh',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        zIndex: 1200,
        transition: 'width 0.3s ease',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          height: 80,
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FiLayout size={20} color="#FFFFFF" />
          </Box>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: 'text.primary',
                  }}
                >
                  AdminHub
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        {!isMobile && (
          <IconButton onClick={onToggle} size="small">
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.label} disablePadding sx={{ px: 2 }}>
            <Tooltip title={collapsed ? item.label : ''} placement="right">
              <ListItemButton
                component={Link}
                to={item.path}
                disabled={item.disabled}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  minHeight: 48,
                  px: 2,
                  backgroundColor: location.pathname === item.path ? 'primary.main' : 'transparent',
                  color: location.pathname === item.path ? '#FFFFFF' : 'text.primary',
                  '&:hover': {
                    backgroundColor: location.pathname === item.path ? 'primary.dark' : 'action.hover',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: 'center',
                    color: location.pathname === item.path ? '#FFFFFF' : 'inherit',
                  }}
                >
                  <item.icon size={20} />
                </ListItemIcon>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <ListItemText
                        primary={item.label}
                        sx={{
                          '& .MuiTypography-root': {
                            fontWeight: location.pathname === item.path ? 600 : 400,
                          },
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Profile */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
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
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Box>
                  <Box
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'text.primary',
                    }}
                  >
                    Admin User
                  </Box>
                  <Box
                    sx={{
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                    }}
                  >
                    admin@hub.com
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            sx={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1199,
            }}
          >
            {sidebarContent}
          </Box>
        )}
      </AnimatePresence>
    );
  }

  return sidebarContent;
};

export default Sidebar;
