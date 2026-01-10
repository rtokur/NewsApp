import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { timeAgo } from "../../utils/timeAgo";
import { NewsDetail } from "../../types/newsDetail";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  news: NewsDetail;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function NewsDetailHeader({ news }: Props) {
  return (
    <>
      <ImageBackground source={{ uri: news.imageUrl }} style={styles.bg}>
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>
          <Text style={styles.category}>{news.category.name}</Text>
          <Text style={styles.title} numberOfLines={4}>{news.title}</Text>

          <View style={styles.row}>
            <Text style={styles.meta}>Trending</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.meta}>{timeAgo(news.publishedAt)}</Text>
          </View>
        </View>
      </ImageBackground>

      <SafeAreaView edges={["top"]} style={styles.header}>
        <Pressable onPress={router.back}>
          <BlurView intensity={25} tint="dark" style={styles.icon}>
            <MaterialIcons name="arrow-back-ios-new" size={22} color="#fff" />
          </BlurView>
        </Pressable>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <BlurView intensity={25} tint="dark" style={styles.icon}>
            <Feather name="bookmark" size={22} color="#fff" />
          </BlurView>
          <BlurView intensity={25} tint="dark" style={styles.icon}>
            <Feather name="share-2" size={22} color="#fff" />
          </BlurView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  bg: {
    justifyContent: "flex-end",
    width: "100%",
    height: SCREEN_HEIGHT * 0.4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  category: {
    backgroundColor: "#007AFF",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 30,
    includeFontPadding: false,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  meta: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  dot: { marginHorizontal: 8, color: "rgba(255,255,255,0.8)" },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    padding: 11,
    borderRadius: 24,
    overflow: "hidden",
  },
});
