
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login session after page refresh
  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const data = await getCurrentUser();

        if (active) {
          setUser(data.user);
        }
      } catch (error) {
        if (active) {
          setUser(null);

          if (error.response?.status !== 401) {
            console.error(
              "Failed to restore authentication:",
              error
            );
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  // Login
  async function login(credentials) {
    const data = await loginUser(credentials);

    setUser(data.user);

    return data;
  }

  // Register
  async function register(userData) {
    return await registerUser(userData);
  }

  // Logout
  async function logout() {
    await logoutUser();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
