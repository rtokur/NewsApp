import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Material from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

type IconType = "feather" | "antdesign" | "material";

type Props = {
  icon: string;
  iconType: IconType;
  onPress: () => void;
  style?: ViewStyle;
};

export function CircleButton({ icon, iconType, onPress, style }: Props) {
  const renderIcon = () => {
    switch (iconType) {
      case "feather":
        return <Feather name={icon as any} size={20} color="black" />;
      case "antdesign":
        return <AntDesign name={icon as any} size={20} color="black" />;
      case "material":
        return <Material name={icon as any} size={20} color="black" />;
      default:
        return null;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
    >
      {renderIcon()}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
