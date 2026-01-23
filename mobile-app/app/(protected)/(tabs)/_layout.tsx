import { CircleButton } from "@/src/components/ui/CircleButton";
import { AuthContext } from "@/src/context/AuthContext";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs, router } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function TabsLayout() {
  const {isLoggedIn} = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Redirect href="/login"/>
  }
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 75,
          paddingVertical: 12,
          paddingHorizontal: 12, 
        },        
        tabBarItemStyle: {
          height: 43,
          borderRadius: 23,
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
              iconType="antdesign"
              onPress={() => console.log("Menu button pressed")}
              style={{ marginLeft: 15, marginBottom: 10 }}
            />
          ),
          headerRight: () => (
            <>
              <CircleButton
                icon="search"
                iconType="feather"
                onPress={() => router.push("/discover")}
                style={{ marginRight: 10, marginBottom: 10 }}
              />
              <CircleButton
                icon="bell"
                iconType="feather"
                onPress={() => router.push("/favorites")}
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
                minWidth: focused ? 120 : 40,
                justifyContent: "center",
              }}
            >
              <FontAwesome
                name="home"
                size={20}
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
                minWidth: focused ? 120 : 40,
                justifyContent: "center",
              }}
            >
              <Fontisto
                name="world-o"
                size={20}
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
                  Discover
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                minWidth: focused ? 120 : 40,
                justifyContent: "center",
              }}
            >
              <Feather
                name="bookmark"
                size={20}
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
                  Favorites
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                minWidth: focused ? 120 : 40,
                justifyContent: "center",
              }}
            >
              <Ionicons
              name="person-outline"
              size={20} 
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
                  Profile
                </Text>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
