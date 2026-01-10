import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { formatDate } from "../../utils/formatDate";
import { NewsDetail } from "../../types/newsDetail";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  news: NewsDetail;
}

export function NewsDetailCard({ news }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topBlurContainer} pointerEvents="none">
        <BlurView intensity={18} tint="light" style={styles.blur} />
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.98)",
            "rgba(255,255,255,0.85)",
            "rgba(255,255,255,0.55)",
            "rgba(255,255,255,0.25)",
            "rgba(255,255,255,0.0)",
          ]}
          locations={[0, 0.25, 0.5, 0.75, 1]}
          style={styles.gradient}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sourceRow}>
          <Image source={{ uri: news.source.logoUrl }} style={styles.logo} />
          <View>
            <Text style={styles.source}>{news.source.name}</Text>
            <Text style={styles.date}>{formatDate(news.publishedAt)}</Text>
          </View>
        </View>

        <Text style={styles.text}>{news.content}</Text>
      </ScrollView>
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
    overflow: "hidden",
  },
  content: {
    padding: 20,
    paddingTop: 35,
  },
  topBlurContainer: {
    position: "absolute",
    height: 35,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  source: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    lineHeight: 28,
    color: "#333",
    paddingBottom: 15,
  },
});
