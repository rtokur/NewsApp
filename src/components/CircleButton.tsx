import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

type Props = {
  icon: keyof typeof Feather.glyphMap | keyof typeof AntDesign.glyphMap;
  onPress: () => void;
  style?: ViewStyle;
};

export function CircleButton({ icon, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon in Feather.glyphMap ? (
        <Feather
          name={icon as keyof typeof Feather.glyphMap}
          size={20}
          color="black"
        />
      ) : (
        <AntDesign
          name={icon as keyof typeof AntDesign.glyphMap}
          size={20}
          color="black"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
