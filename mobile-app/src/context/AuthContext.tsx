import { router } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { loginRequest, registerRequest } from "../services/authService";
import { getMyProfile } from "../services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAccesssToken,
  getAccessToken,
  clearTokens,
  setRefreshToken,
} from "../utils/storage";
import { User } from "../types/user";

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  initialized: boolean;
  logIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: false,
  initialized: false,
  logIn: async () => {},
  register: async () => {},
  forgotPassword: async () => {},
  logOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("AUTH CHECK START");

      try {
        const shouldRemember = await AsyncStorage.getItem("rememberMe");
        console.log("rememberMe value:", shouldRemember);

        if (shouldRemember !== "true") {
          console.log("Remember me disabled, skipping auth check");
          setIsLoggedIn(false);
          setUser(null);
          setInitialized(true);
          return;
        }

        const token = await getAccessToken();
        console.log("Access token exists:", Boolean(token));

        if (!token) {
          console.log("No token found, clearing auth state");
          await AsyncStorage.removeItem("rememberMe");
          setIsLoggedIn(false);
          setUser(null);
          setInitialized(true);
          return;
        }

        console.log("Fetching user profile");
        const me = await getMyProfile();
        console.log("User profile loaded:", me?.email);

        setUser(me);
        setIsLoggedIn(true);
      } catch (error: any) {
        console.error(
          "Auth check error:",
          error?.response?.status,
          error?.message
        );

        if (error?.response?.status === 401) {
          console.log("Token invalid or expired, clearing auth data");
          await clearTokens();
          await AsyncStorage.removeItem("rememberMe");
        }

        setIsLoggedIn(false);
        setUser(null);
      } finally {
        console.log("Auth check completed");
        setInitialized(true);
      }
    };

    checkAuth();
  }, []);

  const logIn = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      setLoading(true);
      console.log("Login started");

      const response = await loginRequest({ email, password });
      console.log("Login response received");

      if (!response?.accessToken) {
        throw new Error("INVALID_CREDENTIALS");
      }

      await setAccesssToken(response.accessToken);
      await setRefreshToken(response.refreshToken);
      await AsyncStorage.setItem(
        "rememberMe",
        rememberMe ? "true" : "false"
      );

      console.log("Tokens stored, fetching user profile");

      const me = await getMyProfile();
      console.log("User profile fetched");

      setUser(me);
      setIsLoggedIn(true);
      router.replace("/");
    } catch (error: any) {
      console.error(
        "Login error:",
        error?.response?.status,
        error?.message
      );
      setIsLoggedIn(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      setLoading(true);
      console.log("Registration started");

      await registerRequest({ email, password, fullName });
      console.log("Registration successful");

      router.replace("/login");
    } catch (error: any) {
      console.error(
        "Registration error:",
        error?.response?.status,
        error?.message
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      console.log("Forgot password request started");

      // await forgotPasswordRequest({ email });

      router.back();
    } catch (error: any) {
      console.error(
        "Forgot password error:",
        error?.response?.status,
        error?.message
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    console.log("Logout initiated");
    await clearTokens();
    await AsyncStorage.removeItem("rememberMe");
    setIsLoggedIn(false);
    setUser(null);
    router.replace("/login");
  };

  const refreshUser = async () => {
    try {
      console.log("Refreshing user data");
      const me = await getMyProfile();
      setUser(me);
      console.log("User data refreshed");
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        initialized,
        logIn,
        register,
        forgotPassword,
        logOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
