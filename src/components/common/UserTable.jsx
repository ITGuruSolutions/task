import { useMemo, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const UserTable = ({ users, onView, onEdit, onDelete, pageSize }) => {
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <motion.button
              type="button"
              aria-label={`View ${params.row.firstName} ${params.row.lastName}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onView(params.row)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiEye size={16} color="#64748B" />
            </motion.button>
            <motion.button
              type="button"
              aria-label={`Edit ${params.row.firstName} ${params.row.lastName}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(params.row)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiEdit size={16} color="#64748B" />
            </motion.button>
            <motion.button
              type="button"
              aria-label={`Delete ${params.row.firstName} ${params.row.lastName}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(params.row)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiTrash2 size={16} color="#EF4444" />
            </motion.button>
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
        height: 600,
        width: '100%',
        '& .MuiDataGrid-root': {
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #F1F5F9',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#F8FAFC',
            borderBottom: '2px solid #E2E8F0',
            '& .MuiDataGrid-columnHeader': {
              fontWeight: 600,
              color: '#1E293B',
            },
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#F8FAFC',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #E2E8F0',
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
        onPaginationModelChange={setPaginationModel}
        paginationMode="client"
        disableRowSelectionOnClick
        disableColumnMenu
        autoHeight={false}
      />
    </Box>
  );
};

export default UserTable;
