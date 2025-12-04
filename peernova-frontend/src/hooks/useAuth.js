import { useEffect, useState } from 'react';

function getInitialAuthState() {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
  };
}

function useAuth() {
  const [auth, setAuth] = useState(getInitialAuthState);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'token' || event.key === 'user') {
        setAuth(getInitialAuthState());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth(getInitialAuthState());
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null, isAuthenticated: false });
  };

  return {
    ...auth,
    login,
    logout,
  };
}

export default useAuth;


