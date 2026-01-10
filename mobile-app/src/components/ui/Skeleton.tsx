import { View, StyleSheet } from "react-native";

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}) {
  return (
    <View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E1E1E1",
  },
});
