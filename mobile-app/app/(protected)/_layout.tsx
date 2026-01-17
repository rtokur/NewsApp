import { AuthContext } from "@/src/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export default function ProtectedLayout() {
  const { isLoggedIn } = useContext(AuthContext);
  const { initialized } = useContext(AuthContext);

  if (!initialized) {
    return null;
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
    </Stack>
  );
}
