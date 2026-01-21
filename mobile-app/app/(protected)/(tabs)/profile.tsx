import { AuthContext } from "@/src/context/AuthContext";
import { useContext } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const authContext = useContext(AuthContext)
  return (
    <SafeAreaView>
      <Pressable 
      onPress={authContext.logOut}
      style = {{backgroundColor: "blue", height: 50, width: 100}}>
        <Text> Log Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}