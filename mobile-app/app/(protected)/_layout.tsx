import { AuthContext } from "@/src/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator } from "react-native";

export default function ProtectedLayout() {
  const { isLoggedIn } = useContext(AuthContext);
  const { initialized } = useContext(AuthContext);

  if (!initialized) {
    return <ActivityIndicator />;
  }  

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
      <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="news/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="news/list"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
      name="profile/reading-history" 
      options={{ headerShown: false }} 
      />
      <Stack.Screen 
      name="profile/edit-profile"
      options={{ headerShown: false }}
      />
      <Stack.Screen 
      name="profile/change-password"
      options={{ headerShown: false }}
      />
      <Stack.Screen
      name="profile/change-email"
      options={{ headerShown: false }}
      />
    </Stack>
  );
}
