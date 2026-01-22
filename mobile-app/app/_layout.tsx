import { Stack } from "expo-router";
import { AuthProvider } from "@/src/context/AuthContext";
import { FavoritesProvider } from "@/src/context/FavoriteContext";
import React from "react";

export default function RootLayout() {
  return (
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
  );
}
