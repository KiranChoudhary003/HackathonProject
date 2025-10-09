import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'auth.patient';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          setUser(parsed.user || null);
          setToken(parsed.token);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (payload) => {
    // payload expected: { token, user }
    setUser(payload?.user || null);
    setToken(payload?.token || null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: payload?.user || null, token: payload?.token || null }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ user, token, loading, isAuthenticated: Boolean(token), login, logout }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


