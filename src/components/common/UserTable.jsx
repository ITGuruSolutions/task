import { useMemo, useState, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const MotionIconButton = motion(IconButton);

const UserTable = ({ users, onView, onEdit, onDelete, pageSize, onPageSizeChange }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: pageSize || 10,
  });

  useEffect(() => {
    setPaginationModel({
      page: 0,
      pageSize: pageSize || 10,
    });
  }, [pageSize, users.length]);

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 80,
        sortable: false,
      },
      {
        field: 'firstName',
        headerName: 'First Name',
        flex: 1,
        minWidth: 130,
        sortable: false,
      },
      {
        field: 'lastName',
        headerName: 'Last Name',
        flex: 1,
        minWidth: 130,
        sortable: false,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1.5,
        minWidth: 220,
        sortable: false,
      },
      {
        field: 'department',
        headerName: 'Department',
        flex: 1,
        minWidth: 130,
        sortable: false,
      },
      {
        field: 'role',
        headerName: 'Role',
        flex: 1,
        minWidth: 150,
        sortable: false,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 1,
              backgroundColor:
                params.value === 'Active'
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
              color: params.value === 'Active' ? '#22C55E' : '#EF4444',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {params.value}
          </Box>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
            <Tooltip title="View Details">
              <MotionIconButton
                size="small"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onView(params.row)}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'primary.main',
                  },
                }}
              >
                <FiEye size={16} />
              </MotionIconButton>
            </Tooltip>
            <Tooltip title="Edit User">
              <MotionIconButton
                size="small"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(params.row)}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'primary.main',
                  },
                }}
              >
                <FiEdit size={16} />
              </MotionIconButton>
            </Tooltip>
            <Tooltip title="Delete User">
              <MotionIconButton
                size="small"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(params.row)}
                sx={{
                  border: '1px solid',
                  borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#FECACA',
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.05)' : '#FEF2F2',
                  color: '#EF4444',
                  '&:hover': {
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                  },
                }}
              >
                <FiTrash2 size={16} />
              </MotionIconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  );

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        height: { xs: 480, sm: 540, md: 600 },
        width: '100%',
        minWidth: 0,
        '& .MuiDataGrid-root': {
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          color: 'text.primary',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#334155' : '#F8FAFC',
            borderBottom: '2px solid',
            borderColor: 'divider',
            '& .MuiDataGrid-columnHeader': {
              fontWeight: 700,
              color: 'text.primary',
            },
          },
          '& .MuiDataGrid-row': {
            borderColor: 'divider',
            '&:nth-of-type(even)': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
            },
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.08)',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.12)',
            },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid',
            borderColor: 'divider',
          },
        },
      }}
    >
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {
          setPaginationModel(model);
          if (model.pageSize !== pageSize) {
            onPageSizeChange?.(model.pageSize);
          }
        }}
        paginationMode="client"
        disableRowSelectionOnClick
        disableColumnMenu
        autoHeight={false}
      />
    </Box>
  );
};

export default UserTable;
