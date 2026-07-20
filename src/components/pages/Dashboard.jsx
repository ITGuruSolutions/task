import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { Box, Grid, Typography, Container, Alert, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { FiUsers, FiBriefcase, FiFilter, FiActivity } from 'react-icons/fi';

import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';
import StatsCard from '../common/StatsCard';
import ActionBar from '../common/ActionBar';
import EmptyState from '../common/EmptyState';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { userApi } from '../../services/api';

const UserTable = lazy(() => import('../common/UserTable'));
const UserModal = lazy(() => import('../common/UserModal'));
const DeleteDialog = lazy(() => import('../common/DeleteDialog'));
const FilterDialog = lazy(() => import('../common/FilterDialog'));

function Dashboard({ darkMode, onDarkModeToggle }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [modalLoading, setModalLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);

  const fetchUsers = useCallback(async (showSuccessToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getUsers();
      setUsers(data);
      setFilteredUsers(data);
      if (showSuccessToast) {
        toast.success('Users loaded successfully');
      }
    } catch (err) {
      setError(err.message || 'Failed to load users. Please try again.');
      toast.error(err.message || 'Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const isFilteredView =
    searchQuery.length > 0 ||
    Object.values(filters).some((value) => value !== '');

  useEffect(() => {
    let result = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query)
      );
    }

    if (filters.department) {
      result = result.filter((user) => user.department === filters.department);
    }
    if (filters.status) {
      result = result.filter((user) => user.status === filters.status);
    }
    if (filters.firstName) {
      const firstNameQuery = filters.firstName.toLowerCase();
      result = result.filter((user) => user.firstName.toLowerCase().includes(firstNameQuery));
    }
    if (filters.lastName) {
      const lastNameQuery = filters.lastName.toLowerCase();
      result = result.filter((user) => user.lastName.toLowerCase().includes(lastNameQuery));
    }
    if (filters.email) {
      const emailQuery = filters.email.toLowerCase();
      result = result.filter((user) => user.email.toLowerCase().includes(emailQuery));
    }

    result.sort((a, b) => {
      if (sortBy === 'id') {
        const idA = String(a.id || '');
        const idB = String(b.id || '');
        const numA = Number(idA);
        const numB = Number(idB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        }
        return sortOrder === 'asc'
          ? idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' })
          : idB.localeCompare(idA, undefined, { numeric: true, sensitivity: 'base' });
      }

      let compareA;
      let compareB;

      switch (sortBy) {
        case 'firstName':
          compareA = (a.firstName || '').toLowerCase();
          compareB = (b.firstName || '').toLowerCase();
          break;
        case 'lastName':
          compareA = (a.lastName || '').toLowerCase();
          compareB = (b.lastName || '').toLowerCase();
          break;
        case 'name':
          compareA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase().trim();
          compareB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase().trim();
          break;
        case 'email':
          compareA = (a.email || '').toLowerCase();
          compareB = (b.email || '').toLowerCase();
          break;
        case 'department':
          compareA = (a.department || '').toLowerCase();
          compareB = (b.department || '').toLowerCase();
          break;
        case 'role':
          compareA = (a.role || '').toLowerCase();
          compareB = (b.role || '').toLowerCase();
          break;
        case 'status':
          compareA = (a.status || '').toLowerCase();
          compareB = (b.status || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
  }, [searchQuery, filters, sortBy, sortOrder, users]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleSortOrderChange = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      departments: [...new Set(users.map((u) => u.department))].length,
      filteredUsers: filteredUsers.length,
      activity: '+12%',
    }),
    [users, filteredUsers]
  );

  const handleResetFilters = () => {
    setFilters({ department: '', status: '', firstName: '', lastName: '', email: '' });
  };

  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setModalMode('add');
    setUserModalOpen(true);
  };

  const handleOpenViewModal = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setUserModalOpen(true);
  };

  const handleOpenEditModal = async (user) => {
    setModalMode('edit');
    setUserModalOpen(true);
    setFetchingUser(true);
    setSelectedUser(null);

    try {
      const apiUser = await userApi.getUser(user.id);
      setSelectedUser({
        ...apiUser,
        department: user.department,
        role: user.role,
        status: user.status,
      });
    } catch (err) {
      toast.error('Failed to load user details for editing');
      setUserModalOpen(false);
      setSelectedUser(null);
      console.error('Error fetching user for edit:', err);
    } finally {
      setFetchingUser(false);
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUserModalSubmit = async (userData) => {
    setModalLoading(true);

    try {
      if (modalMode === 'add') {
        const newUser = await userApi.createUser(userData);
        setUsers([...users, newUser]);
        toast.success('User added successfully');
      } else if (modalMode === 'edit') {
        await userApi.updateUser(userData.id, userData);
        setUsers(users.map((user) => (user.id === userData.id ? userData : user)));
        toast.success('User updated successfully');
      }

      setModalLoading(false);
      setUserModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setModalLoading(false);
      toast.error(`Failed to ${modalMode} user`);
      console.error(`Error ${modalMode}ing user:`, err);
    }
  };

  const handleDeleteConfirm = async () => {
    setModalLoading(true);

    try {
      await userApi.deleteUser(selectedUser.id);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setModalLoading(false);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success('User deleted successfully');
    } catch (err) {
      setModalLoading(false);
      toast.error('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          darkMode={darkMode}
          onDarkModeToggle={onDarkModeToggle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, md: 3 },
          }}
        >
          <Container maxWidth="xl" sx={{ px: 0 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                User Management Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage users efficiently with search, filters, sorting, pagination, and CRUD operations.
              </Typography>
            </Box>

            {error ? (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                action={
                  <Button color="inherit" size="small" onClick={() => fetchUsers(true)}>
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            ) : loading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                      icon={FiUsers}
                      title="Total Users"
                      value={stats.totalUsers}
                      trend="+5%"
                      color="primary"
                      delay={0}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                      icon={FiBriefcase}
                      title="Departments"
                      value={stats.departments}
                      trend="+2"
                      color="secondary"
                      delay={0.1}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                      icon={FiFilter}
                      title="Filtered Users"
                      value={stats.filteredUsers}
                      color="warning"
                      delay={0.2}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                      icon={FiActivity}
                      title="Today's Activity"
                      value={stats.activity}
                      color="success"
                      delay={0.3}
                    />
                  </Grid>
                </Grid>

                <ActionBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterOpen={filterOpen}
                  onFilterClick={() => setFilterOpen(!filterOpen)}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  sortOrder={sortOrder}
                  onSortOrderChange={handleSortOrderChange}
                  recordsPerPage={recordsPerPage}
                  onRecordsPerPageChange={setRecordsPerPage}
                  onAddUser={handleOpenAddModal}
                />

                {filteredUsers.length === 0 ? (
                  <EmptyState
                    onAddUser={handleOpenAddModal}
                    isFiltered={isFilteredView}
                    onClearFilters={() => {
                      setSearchQuery('');
                      handleResetFilters();
                    }}
                  />
                ) : (
                  <Suspense fallback={<LoadingSkeleton />}>
                    <UserTable
                      users={filteredUsers}
                      pageSize={recordsPerPage}
                      onPageSizeChange={setRecordsPerPage}
                      onView={handleOpenViewModal}
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteDialog}
                    />
                  </Suspense>
                )}
              </>
            )}
          </Container>
        </Box>
      </Box>

      <Suspense fallback={null}>
        <UserModal
          open={userModalOpen}
          onClose={() => {
            setUserModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          mode={modalMode}
          onSubmit={handleUserModalSubmit}
          loading={modalLoading}
          fetchingUser={fetchingUser}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteConfirm}
          userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
          loading={modalLoading}
        />

        <FilterDialog
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />
      </Suspense>
    </Box>
  );
}

export default Dashboard;
