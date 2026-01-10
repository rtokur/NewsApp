import { StyleSheet, View } from "react-native";
import { Skeleton } from "@/src/components/ui/Skeleton";

export function NewsDetailCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.sourceRow}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <View style={{ marginLeft: 12 }}>
            <Skeleton width={140} height={16} />
            <Skeleton width={90} height={12} style={{ marginTop: 6 }} />
          </View>
        </View>

        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            height={14}
            width="100%"
            style={{ marginBottom: 12 }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  content: {
    padding: 20,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
});
