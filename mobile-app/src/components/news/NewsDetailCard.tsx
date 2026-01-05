import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { formatDate } from "../../utils/formatDate";
import { NewsDetail } from "../../types/newsDetail";

interface Props {
  news: NewsDetail;
}

export function NewsDetailCard({ news }: Props) {
  return (
    <View style={styles.card}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sourceRow}>
          <Image source={{ uri: news.sourceLogoUrl }} style={styles.logo} />
          <View>
            <Text style={styles.source}>{news.source}</Text>
            <Text style={styles.date}>
              {formatDate(news.publishedAt)}
            </Text>
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
    lineHeight: 26,
    color: "#333",
  },
});
