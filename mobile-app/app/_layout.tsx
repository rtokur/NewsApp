import { Stack } from "expo-router";
import { AuthProvider } from "@/src/context/AuthContext";
import React from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
