import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { FiUsers, FiFilter } from 'react-icons/fi';

const EmptyState = ({ onAddUser, isFiltered = false, onClearFilters }) => {
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
        {isFiltered ? (
          <FiFilter size={48} color="#2563EB" />
        ) : (
          <FiUsers size={48} color="#2563EB" />
        )}
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
        }}
      >
        {isFiltered ? 'No Matching Users' : 'No Users Found'}
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
        {isFiltered
          ? 'Try adjusting your search or filters to find what you are looking for.'
          : 'Get started by adding your first user to the system.'}
      </Typography>
      {isFiltered ? (
        <Button variant="outlined" onClick={onClearFilters} startIcon={<FiFilter />}>
          Clear Filters
        </Button>
      ) : (
        <Button variant="contained" onClick={onAddUser} startIcon={<FiUsers />}>
          Add User
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
