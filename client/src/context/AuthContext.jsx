import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, clearToken, getToken, setToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  // Restore the session from a saved token on first load.
  useEffect(() => {
    if (!getToken()) return;
    authApi
      .me()
      .then(({ user: u }) => setUser(u))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = ({ token, user: u }) => {
    setToken(token);
    setUser(u);
    return u;
  };

  const login = async (credentials) => handleAuth(await authApi.login(credentials));
  const register = async (details) => handleAuth(await authApi.register(details));
  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
