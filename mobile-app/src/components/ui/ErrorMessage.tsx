import Feather from "@expo/vector-icons/Feather";
import { Text, View, StyleSheet } from "react-native";
type Props = {
  message: string | null;
};

export default function ErrorMessage({ message }: Props) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Feather name="alert-circle" size={16} color={"#DC2626"} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    gap: 8,
  },
  text: {
    color: "#DC2626",
    fontSize: 14,
    flex: 1,
  },
});
