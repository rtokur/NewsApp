import { Stack } from "expo-router";
import { AuthProvider } from "@/src/context/AuthContext";
import { FavoritesProvider } from "@/src/context/FavoriteContext";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
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
