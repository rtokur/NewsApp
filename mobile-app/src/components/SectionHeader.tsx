import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
};

export default function SectionHeader({ title, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {onPress && (
        <Pressable onPress={onPress}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
  },
});
