import { Dimensions, StyleSheet, View } from "react-native";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function NewsDetailHeaderSkeleton() {
  return (
    <>
      <View style={styles.bg}>
        <View style={styles.content}>
          <Skeleton
            width={90}
            height={26}
            borderRadius={13}
            style={{ marginBottom: 12 }}
          />
          <Skeleton height={26} width="90%" />
          <Skeleton height={26} width="80%" style={{ marginTop: 6 }} />
          <Skeleton height={18} width={140} style={{ marginTop: 10 }} />
        </View>
      </View>

      <SafeAreaView edges={["top"]} style={styles.header}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <Skeleton width={44} height={44} borderRadius={22} />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.4,
    justifyContent: "flex-end",
    backgroundColor: "#E1E1E1",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
