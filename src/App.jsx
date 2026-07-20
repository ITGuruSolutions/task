import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { lightTheme, darkTheme } from './theme/theme';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/pages/Dashboard';
import Login from './components/pages/Login';
import NotFound from './components/pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard
                darkMode={darkMode}
                onDarkModeToggle={() => setDarkMode((prev) => !prev)}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/users" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
