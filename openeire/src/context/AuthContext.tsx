import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { loginUser, api } from "../services/api";

interface User {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  // Add other fields you expect
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (
    username: string,
    password: string,
    remember?: boolean
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  setAuthData: (data: { access: string; refresh: string; user?: User }) => void;
  refreshUser: () => Promise<void>; // 👈 NEW: Expose this function
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () =>
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken")
  );

  const [user, setUser] = useState<User | null>(null);

  // Define this function with useCallback so it's stable
  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get("auth/profile/");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  }, []);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (storedToken) {
      setAccessToken(storedToken);
      // Fetch user immediately if we have a token but no user data
      if (!user) {
        refreshUser();
      }
    }
  }, [refreshUser]); // Dependency added

  const login = async (
    username: string,
    password: string,
    remember: boolean = true
  ) => {
    const response = await loginUser({ username, password });

    if (remember) {
      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
    } else {
      sessionStorage.setItem("accessToken", response.access);
      sessionStorage.setItem("refreshToken", response.refresh);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    setAccessToken(response.access);
    await refreshUser(); // Load user data immediately
  };

  const setAuthData = (data: {
    access: string;
    refresh: string;
    user?: User;
  }) => {
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    setAccessToken(data.access);

    if (data.user) {
      setUser(data.user);
    } else {
      refreshUser();
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    setAccessToken(null);
    setUser(null);
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        setUser,
        login,
        logout,
        isAuthenticated,
        setAuthData,
        refreshUser, // 👈 Exporting it here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
