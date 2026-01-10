import { View, StyleSheet } from "react-native";
import { Skeleton } from "@/src/components/ui/Skeleton";

export default function BreakingNewsSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton height={200} borderRadius={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
