import { router } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { loginRequest, registerRequest, forgotPasswordRequest } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isLoggedIn: boolean;
  loading: boolean;
  initialized: boolean;
  logIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const shouldRemember = await AsyncStorage.getItem("rememberMe");
        const token = await AsyncStorage.getItem("accessToken");
  
        if (shouldRemember === "true" && token) {
          setIsLoggedIn(true);
        } else {
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("rememberMe");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsLoggedIn(false);
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
  
      await AsyncStorage.setItem("accessToken", response.accessToken);
      await AsyncStorage.setItem("refreshToken", response.refreshToken);      
      await AsyncStorage.setItem("rememberMe", rememberMe ? "true" : "false");
      
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
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("rememberMe");
    setIsLoggedIn(false);
    router.replace("/login")
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, loading, initialized, logIn, register, forgotPassword,logOut}}>
      {children}
    </AuthContext.Provider>
  )
}

