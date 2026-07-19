import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const ActionBar = ({
  searchQuery,
  onSearchChange,
  filterOpen,
  onFilterClick,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  recordsPerPage,
  onRecordsPerPageChange,
  onAddUser,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        flexWrap: 'wrap',
        mb: 3,
        p: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        border: '1px solid #E2E8F0',
      }}
    >
      {/* Search */}
      <TextField
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: <FiSearch style={{ marginRight: 8, color: '#64748B' }} />,
        }}
        sx={{
          flex: isMobile ? 1 : 'auto',
          minWidth: isMobile ? '100%' : 250,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
        size="small"
      />

      {/* Filter Button */}
      <Button
        variant={filterOpen ? 'contained' : 'outlined'}
        onClick={onFilterClick}
        startIcon={<FiFilter />}
        sx={{
          borderRadius: 2,
          minWidth: 100,
        }}
        size="small"
      >
        Filter
      </Button>

      {/* Sort */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="firstName">First Name</MenuItem>
          <MenuItem value="lastName">Last Name</MenuItem>
          <MenuItem value="name">Full Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="department">Department</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </Select>
      </FormControl>

      {/* Sort Order */}
      <Button
        variant="outlined"
        onClick={onSortOrderChange}
        sx={{
          borderRadius: 2,
          minWidth: 50,
        }}
        size="small"
      >
        {sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
      </Button>

      {/* Records Per Page */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Rows</InputLabel>
        <Select
          value={recordsPerPage}
          onChange={(e) => onRecordsPerPageChange(e.target.value)}
          label="Rows"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>

      {/* Add User Button */}
      <Button
        variant="contained"
        onClick={onAddUser}
        startIcon={<FiPlus />}
        sx={{
          borderRadius: 2,
          ml: 'auto',
          minWidth: 120,
        }}
        size="small"
      >
        Add User
      </Button>
    </Box>
  );
};

export default ActionBar;
