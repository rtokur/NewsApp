import { CircleButton } from "@/src/components/CircleButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Tabs, router } from "expo-router";
import { Text, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 75,
          paddingVertical: 12,
        },
        tabBarItemStyle: {
          height: 43,
          borderRadius: 23,
          marginHorizontal: 10,
          overflow: "hidden",
          marginTop: 10,
        },
        tabBarActiveBackgroundColor: "#007AFF",
        tabBarInactiveBackgroundColor: "transparent",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <CircleButton
              icon="menu"
              onPress={() => console.log("Menu button pressed")}
              style={{ marginLeft: 15, marginBottom: 10 }}
            />
          ),
          headerRight: () => (
            <>
              <CircleButton
                icon="search"
                onPress={() => router.push("/discover")}
                style={{ marginRight: 10, marginBottom: 10 }}
              />
              <CircleButton
                icon="bell"
                onPress={() => router.push("/notifications")}
                style={{ marginRight: 15, marginBottom: 10 }}
              />
            </>
          ),
          headerShadowVisible: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: focused ? 20 : 0,
                minWidth: focused ? 115 : 40,
                justifyContent: "center",
              }}
            >
              <FontAwesome
                name="home"
                size={22}
                color={focused ? "#fff" : "#6B7280"}
              />
              {focused && (
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: 6,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  Home
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: focused ? 20 : 0,
                minWidth: focused ? 115 : 40,
                justifyContent: "center",
              }}
            >
              <Fontisto
                name="world-o"
                size={21}
                color={focused ? "#fff" : "#6B7280"}
              />
              {focused && (
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: 8,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  Discover
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: focused ? 20 : 0,
                minWidth: focused ? 115 : 40,
                justifyContent: "center",
              }}
            >
              <FontAwesome
                name="bell"
                size={21}
                color={focused ? "#fff" : "#6B7280"}
              />
              {focused && (
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: 8,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  Alerts
                </Text>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
