import { View, StyleSheet } from "react-native";
import { Skeleton } from "../ui/Skeleton";

export default function NewsListItemSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={100} height={100} borderRadius={10} />

      <View style={styles.content}>
        <Skeleton width={60} height={12} />

        <Skeleton height={16} style={{ marginTop: 10 }} />
        <Skeleton width="80%" height={16} style={{ marginTop: 6 }} />

        <View style={styles.sourceRow}>
          <Skeleton width={20} height={20} borderRadius={10} />
          <Skeleton width={80} height={12} style={{ marginLeft: 6 }} />
          <Skeleton width={50} height={12} style={{ marginLeft: 6 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 8,
    },
    content: {
      flex: 1,
      marginLeft: 10,
      justifyContent: "space-between",
    },
    sourceRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
  });
  