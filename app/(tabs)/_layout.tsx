import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";
import { Text, View } from 'react-native';

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
      overflow: 'hidden',
      marginTop: 10,
    },

    tabBarActiveBackgroundColor: '#007AFF',
    tabBarInactiveBackgroundColor: 'transparent',
  }}
>
 <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                paddingHorizontal: focused ? 20 : 0,
                minWidth: focused ? 90 : 40,
                justifyContent: 'center', }}>
              <FontAwesome
                name="home"
                size={22}
                color={focused ? '#fff' : '#6B7280'}
              />
              {focused && (
                <Text style={{ 
                    color: '#fff', 
                    marginLeft: 6,
                    fontSize: 13,
                    fontWeight: '500', }}>
                  Home
                </Text>
              )}
            </View>
          ),
        }}
      />

<Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: focused ? 20 : 0,
                minWidth: focused ? 100 : 40,
                justifyContent: 'center',
              }}
            >
              <FontAwesome
                name="search"
                size={21}
                color={focused ? '#fff' : '#6B7280'}
              />
              {focused && (
                <Text
                  style={{
                    color: '#fff',
                    marginLeft: 8,
                    fontSize: 13,
                    fontWeight: '500',
                  }}
                >
                  Search
                </Text>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: focused ? 20 : 0,
                minWidth: focused ? 130 : 40,
                justifyContent: 'center',
              }}
            >
              <FontAwesome
                name="bell"
                size={21}
                color={focused ? '#fff' : '#6B7280'}
              />
              {focused && (
                <Text
                  style={{
                    color: '#fff',
                    marginLeft: 8,
                    fontSize: 13,
                    fontWeight: '500',
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