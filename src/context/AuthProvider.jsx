import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth-context.js';

const AUTH_STORAGE_KEY = 'um_auth_user';
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'admin';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const login = (username, password) => {
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (normalizedUsername !== VALID_USERNAME || normalizedPassword !== VALID_PASSWORD) {
      return { success: false, error: 'Invalid username or password' };
    }

    const authUser = { username: VALID_USERNAME, role: 'admin' };
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return { success: true };
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      ready,
      login,
      logout,
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
