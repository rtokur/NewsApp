import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder,
}: Props) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={22} color="#8E8E93" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <Pressable onPress={onClear}>
          <Ionicons name="close-circle" size={20} color="#8E8E93" />
        </Pressable>
      ) : (
        <Ionicons name="filter" size={22} color="#8E8E93" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginTop: 25,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111111",
    marginLeft: 12,
  },
});
