import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { departments, roles } from '../../data/dummyData';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  department: yup.string().required('Department is required'),
  role: yup.string().required('Role is required'),
});

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  role: '',
  status: 'Active',
};

const UserModal = ({ open, onClose, user, mode, onSubmit, loading, fetchingUser = false }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        user || defaultValues
      );
    }
  }, [open, user, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, id: user?.id });
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const title =
    mode === 'add' ? 'Add New User' : mode === 'view' ? 'View User' : 'Edit User';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {fetchingUser ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
        <Box
          component="form"
          id="user-form"
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="First Name"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
            disabled={mode === 'view'}
          />
          <TextField
            label="Last Name"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
            disabled={mode === 'view'}
          />
          <TextField
            label="Email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            disabled={mode === 'view'}
          />
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth disabled={mode === 'view'} error={!!errors.department}>
                <InputLabel>Department</InputLabel>
                <Select {...field} label="Department">
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
                {errors.department && (
                  <FormHelperText>{errors.department.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth disabled={mode === 'view'} error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Select {...field} label="Role">
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          {(mode === 'edit' || mode === 'view') && (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth disabled={mode === 'view'}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          )}
        </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          {mode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {mode !== 'view' && (
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            variant="contained"
            disabled={loading || fetchingUser}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : mode === 'add' ? 'Add User' : 'Save Changes'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
