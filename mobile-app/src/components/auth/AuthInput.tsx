import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";

type Props = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: "default" | "email-address";
};

export default function AuthInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secure = false,
  keyboardType = "default",
}: Props) {
  const [isSecure, setIsSecure] = useState(secure);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <Feather name={icon} size={20} color="#8E8E93" />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize="none"
          style={styles.input}
        />

        {secure && (
          <Pressable onPress={() => setIsSecure(!isSecure)}>
            <Feather
              name={isSecure ? "eye-off" : "eye"}
              size={20}
              color="#8E8E93"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: "#F2F2F7",
    height: 50,
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111111",
  },
});
