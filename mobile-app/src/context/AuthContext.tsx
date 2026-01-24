import { router } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { loginRequest, meRequest, registerRequest } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAccesssToken, getAccessToken, clearTokens, setRefreshToken } from "../utils/storage";
import { User } from "../types/user";
import { getItem } from "expo-secure-store";

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  initialized: boolean;
  logIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
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
})

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const shouldRemember = await AsyncStorage.getItem("rememberMe");
        const token = await getAccessToken();
  
        if (shouldRemember !== "true") {
          await clearTokens();
          setIsLoggedIn(false);
          setUser(null);
          return;
        } 
        if (token) {
          const me = await meRequest();
          setUser(me);
          setIsLoggedIn(true);
          router.replace("/");
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
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
  
      const response = await loginRequest({ email, password });
  
      if (!response?.accessToken) {
        throw new Error("INVALID_CREDENTIALS");
      }
  
      await setAccesssToken(response.accessToken);
      await setRefreshToken(response.refreshToken);      
      await AsyncStorage.setItem("rememberMe", rememberMe ? "true" : "false");
      const me = await meRequest();
      setUser(me);
      setIsLoggedIn(true);
      router.replace("/");
    } catch (error) {
      setIsLoggedIn(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const register = async (
    email: string,
    password: string,
    fullName: string,
  ) => {
    try {
      setLoading(true);
  
      await registerRequest({ email, password, fullName });

      setIsLoggedIn(true);
      router.back();
    } catch (error) {
      setIsLoggedIn(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const forgotPassword = async (
    email: string,
  ) => {
    try {
      setLoading(true);
  
      //await forgotPasswordRequest({email});

      setIsLoggedIn(true);
      router.back();
    } catch (error) {
      setIsLoggedIn(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }


  const logOut = async () => {
    await clearTokens();
    await AsyncStorage.removeItem("rememberMe");
    setIsLoggedIn(false);
    setUser(null);
    router.replace("/login")
  }

  return (
    <AuthContext.Provider value={{user, isLoggedIn, loading, initialized, logIn, register, forgotPassword,logOut}}>
      {children}
    </AuthContext.Provider>
  )
}

