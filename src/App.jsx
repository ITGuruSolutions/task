import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, Grid, Typography, Container, Alert } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { FiUsers, FiBriefcase, FiFilter, FiActivity } from 'react-icons/fi';

import theme from './theme/theme';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import StatsCard from './components/common/StatsCard';
import ActionBar from './components/common/ActionBar';
import EmptyState from './components/common/EmptyState';
import LoadingSkeleton from './components/common/LoadingSkeleton';
import NotFound from './components/pages/NotFound';
import { userApi } from './services/api';

const UserTable = lazy(() => import('./components/common/UserTable'));
const UserModal = lazy(() => import('./components/common/UserModal'));
const DeleteDialog = lazy(() => import('./components/common/DeleteDialog'));
const FilterDialog = lazy(() => import('./components/common/FilterDialog'));

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Search, Filter, Sort state
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
  
  // Modal state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userApi.getUsers();
        setUsers(data);
        setFilteredUsers(data);
        toast.success('Users loaded successfully');
      } catch (err) {
        setError('Failed to load users. Please try again.');
        toast.error('Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Search
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

    // Filter
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

    // Sort
    result.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case 'firstName':
          compareA = a.firstName.toLowerCase();
          compareB = b.firstName.toLowerCase();
          break;
        case 'lastName':
          compareA = a.lastName.toLowerCase();
          compareB = b.lastName.toLowerCase();
          break;
        case 'name':
          compareA = `${a.firstName} ${a.lastName}`.toLowerCase();
          compareB = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'email':
          compareA = a.email.toLowerCase();
          compareB = b.email.toLowerCase();
          break;
        case 'department':
          compareA = a.department.toLowerCase();
          compareB = b.department.toLowerCase();
          break;
        case 'status':
          compareA = a.status.toLowerCase();
          compareB = b.status.toLowerCase();
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

  const handleMobileMenuOpen = () => {
    setMobileOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileOpen(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('add');
    setUserModalOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({ department: '', status: '', firstName: '', lastName: '', email: '' });
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setUserModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUserModalSubmit = async (userData) => {
    setModalLoading(true);
    
    try {
      if (modalMode === 'add') {
        const newUser = await userApi.createUser(userData);
        setUsers([...users, { ...newUser, status: 'Active', joinDate: new Date().toISOString().split('T')[0] }]);
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" />
      
      <Routes>
        <Route path="/" element={
          <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggle={handleToggleSidebar}
              mobileOpen={mobileOpen}
              onMobileClose={handleMobileMenuClose}
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
                onMenuClick={handleMobileMenuOpen}
                darkMode={darkMode}
                onDarkModeToggle={handleDarkModeToggle}
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
                  {/* Page Header */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                      User Management Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage users efficiently with search, filters, sorting, pagination, and CRUD operations.
                    </Typography>
                  </Box>

                  {error ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  ) : loading ? (
                    <LoadingSkeleton />
                  ) : (
                    <>
                      {/* Statistics Cards */}
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

                      {/* Action Bar */}
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
                        onAddUser={handleAddUser}
                      />

                      {/* User Table */}
                      {filteredUsers.length === 0 ? (
                        <EmptyState onAddUser={handleAddUser} />
                      ) : (
                        <Suspense fallback={<LoadingSkeleton />}>
                          <UserTable
                            users={filteredUsers}
                            pageSize={recordsPerPage}
                            onView={handleViewUser}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
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
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </Suspense>
          </Box>
        } />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/users" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
