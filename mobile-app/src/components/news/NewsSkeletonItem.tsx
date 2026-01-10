import { View, StyleSheet } from "react-native";
import { Skeleton } from "../ui/Skeleton";

export default function NewsCarouselCardSkeletonItem() {
  return (
    <View style={styles.container}>
      <Skeleton height={160} borderRadius={12} />
      <Skeleton height={18} style={{ marginTop: 12 }} />
      <Skeleton height={14} width="70%" style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
