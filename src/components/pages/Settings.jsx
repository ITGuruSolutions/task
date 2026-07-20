import { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import { FiSliders, FiDatabase, FiActivity } from 'react-icons/fi';
import axios from 'axios';

import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';

function Settings({ darkMode, onDarkModeToggle }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL
    ? (import.meta.env.VITE_API_URL.startsWith('http')
        ? import.meta.env.VITE_API_URL
        : `${window.location.origin}${import.meta.env.VITE_API_URL}`)
    : `${window.location.origin}/api`;

  const appEnv = window.location.hostname.includes('vercel.app')
    ? 'production-cloud (Vercel)'
    : 'local-development';

  // Settings state (saved in local storage)
  const [defaultLimit, setDefaultLimit] = useState(() => {
    return Number(localStorage.getItem('um_default_limit') || '10');
  });
  const [latency, setLatency] = useState(() => {
    return Number(localStorage.getItem('um_api_latency') || '500');
  });
  const [resetting, setResetting] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleLimitChange = (event) => {
    const val = event.target.value;
    setDefaultLimit(val);
    localStorage.setItem('um_default_limit', String(val));
    toast.success(`Default rows set to ${val}`);
  };

  const handleLatencyChange = (event, newValue) => {
    setLatency(newValue);
    localStorage.setItem('um_api_latency', String(newValue));
  };

  const handleResetDatabase = async () => {
    setResetting(true);
    try {
      const response = await axios.post('/api/users/reset');
      toast.success(response.data?.message || 'Database reset successfully');
    } catch (err) {
      toast.error('Failed to reset database');
      console.error(err);
    } finally {
      setResetting(false);
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
        />

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, md: 3 },
          }}
        >
          <Container maxWidth="lg" sx={{ px: 0 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                System Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure the dashboard preferences, API latency simulations, and manage user mock database connections.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* General Preferences Card */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <FiSliders size={22} color="#2563EB" />
                      <Typography variant="h6" fontWeight={600}>
                        General Preferences
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={darkMode}
                            onChange={onDarkModeToggle}
                            color="primary"
                          />
                        }
                        label="Dark Theme Mode"
                      />

                      <FormControl fullWidth size="small">
                        <InputLabel>Default Rows Per Page</InputLabel>
                        <Select
                          value={defaultLimit}
                          onChange={handleLimitChange}
                          label="Default Rows Per Page"
                        >
                          <MenuItem value={10}>10 rows</MenuItem>
                          <MenuItem value={25}>25 rows</MenuItem>
                          <MenuItem value={50}>50 rows</MenuItem>
                          <MenuItem value={100}>100 rows</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Database & Mock API Card */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <FiDatabase size={22} color="#14B8A6" />
                      <Typography variant="h6" fontWeight={600}>
                        Mock DB & API Simulation
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Simulated Network Latency ({latency}ms)
                        </Typography>
                        <Slider
                          value={latency}
                          onChange={handleLatencyChange}
                          min={0}
                          max={3000}
                          step={100}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(val) => `${val}ms`}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            Database Connection Status
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Running on in-memory mock schema layer.
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="success.main" fontWeight={600}>
                          Connected
                        </Typography>
                      </Box>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleResetDatabase}
                        disabled={resetting}
                        startIcon={<FiDatabase />}
                        sx={{ mt: 1 }}
                      >
                        {resetting ? 'Resetting Data...' : 'Reset Mock Database'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* About / Version Info */}
              <Grid item xs={12}>
                <Card sx={{ p: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <FiActivity size={22} color="#F59E0B" />
                      <Typography variant="h6" fontWeight={600}>
                        System Status Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Backend URL:</strong> {apiBaseUrl}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>App Environment:</strong> {appEnv}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Client Version:</strong> v1.0.2 (React 19 + MUI v9 + Vite 8)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Settings;
