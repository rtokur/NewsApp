import { router, Stack } from "expo-router";
import { CircleButton } from "@/src/components/ui/CircleButton";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="news/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="news/list"
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
    </Stack>
  );
}
