"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getProfile,
  isApiError,
  loginWithGoogleCode,
  loginUser,
  normalizeAuthErrorMessage,
  registerUser,
} from "@/lib/api/auth";
import {
  clearTokens,
  getAccessToken,
  migrateLegacyLocalStorageTokens,
  setTokens,
} from "@/lib/auth/tokenStorage";
import { clearCheckoutSuccessContext } from "@/lib/checkout/successContext";
import type {
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from "@/types/auth";

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (payload: GoogleLoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isAuthRejection = (error: unknown): boolean =>
  isApiError(error) &&
  (error.response?.status === 401 || error.response?.status === 403);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearTokens();
    clearCheckoutSuccessContext();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      return null;
    }

    try {
      const profile = await getProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      if (isAuthRejection(error)) {
        logout();
        return null;
      }
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      migrateLegacyLocalStorageTokens();

      if (!getAccessToken()) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const profile = await getProfile();
        if (isMounted) {
          setUser(profile);
        }
      } catch (error) {
        if (isAuthRejection(error)) {
          clearTokens();
          if (isMounted) {
            setUser(null);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      clearCheckoutSuccessContext();
      const tokens = await loginUser(payload);
      if (!tokens.access || !tokens.refresh) {
        throw new Error("Malformed login response.");
      }
      setTokens(tokens);
      await refreshUser();
    },
    [refreshUser],
  );

  const loginWithGoogle = useCallback(
    async (payload: GoogleLoginPayload) => {
      clearCheckoutSuccessContext();
      const tokens = await loginWithGoogleCode(payload);
      if (!tokens.access || !tokens.refresh) {
        throw new Error("Malformed Google login response.");
      }
      setTokens(tokens);
      await refreshUser();
    },
    [refreshUser],
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    await registerUser(payload);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && getAccessToken()),
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
      refreshUser,
    }),
    [isLoading, login, loginWithGoogle, logout, refreshUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
};

export { normalizeAuthErrorMessage };
