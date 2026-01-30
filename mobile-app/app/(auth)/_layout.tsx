import { CircleButton } from "@/src/components/ui/CircleButton";
import { router, Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <CircleButton
              icon="arrow-back-ios-new"
              iconType="material"
              onPress={() => router.back()}
              style={{ marginBottom: 10 }}
            />
          ),
        }}
      />

      <Stack.Screen
        name="reset-password"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
