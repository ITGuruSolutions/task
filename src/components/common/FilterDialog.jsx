import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  TextField,
} from '@mui/material';
import { motion } from 'framer-motion';
import { departments } from '../../data/dummyData';

const FilterDialog = ({ open, onClose, filters, onFilterChange, onReset }) => {
  const handleFilterChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const hasActiveFilters =
    filters.department ||
    filters.status ||
    filters.firstName ||
    filters.lastName ||
    filters.email;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          component: motion.div,
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.2 },
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Filter Users
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <TextField
            label="First Name"
            value={filters.firstName || ''}
            onChange={(e) => handleFilterChange('firstName', e.target.value)}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={filters.lastName || ''}
            onChange={(e) => handleFilterChange('lastName', e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={filters.email || ''}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={filters.department || ''}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              label="Department"
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {filters.firstName && (
                <Chip
                  label={`First Name: ${filters.firstName}`}
                  onDelete={() => handleFilterChange('firstName', '')}
                  size="small"
                />
              )}
              {filters.lastName && (
                <Chip
                  label={`Last Name: ${filters.lastName}`}
                  onDelete={() => handleFilterChange('lastName', '')}
                  size="small"
                />
              )}
              {filters.email && (
                <Chip
                  label={`Email: ${filters.email}`}
                  onDelete={() => handleFilterChange('email', '')}
                  size="small"
                />
              )}
              {filters.department && (
                <Chip
                  label={`Department: ${filters.department}`}
                  onDelete={() => handleFilterChange('department', '')}
                  size="small"
                />
              )}
              {filters.status && (
                <Chip
                  label={`Status: ${filters.status}`}
                  onDelete={() => handleFilterChange('status', '')}
                  size="small"
                />
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onReset} variant="outlined">
          Reset All
        </Button>
        <Button onClick={onClose} variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
