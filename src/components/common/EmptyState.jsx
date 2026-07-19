import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';

const EmptyState = ({ onAddUser }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 12,
        px: 3,
      }}
    >
      <Box
        component={motion.div}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <FiUsers size={48} color="#2563EB" />
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
        }}
      >
        No Users Found
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          mb: 3,
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        Get started by adding your first user to the system.
      </Typography>
      <Button
        variant="contained"
        onClick={onAddUser}
        startIcon={<FiUsers />}
        sx={{
          px: 4,
          py: 1.5,
        }}
      >
        Add User
      </Button>
    </Box>
  );
};

export default EmptyState;
