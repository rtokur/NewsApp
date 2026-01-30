import { router, Stack } from "expo-router";
import { AuthProvider } from "@/src/context/AuthContext";
import { FavoritesProvider } from "@/src/context/FavoriteContext";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Linking from 'expo-linking';


export default function RootLayout() {
  
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { path, queryParams } = Linking.parse(event.url);
      
      if (path === 'reset-password' && queryParams?.token) {
        router.push(`/reset-password?token=${queryParams.token}`);
      }
    };
  
    const subscription = Linking.addEventListener('url', handleDeepLink);
  
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
  
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <FavoritesProvider>
          <Stack>
            <Stack.Screen
              name="(protected)"
              options={{
                headerShown: false,
                animation: "none",
              }}
            />

            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
                animation: "none",
              }}
            />
          </Stack>
        </FavoritesProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
