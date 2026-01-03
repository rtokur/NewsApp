import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BreakingNewsCarousel } from "../components/BreakingNewsCarousel";
import NewsListItem from "../components/NewsListItem";
import SectionHeader from "../components/SectionHeader";
import { newsList } from "../data/newsList";
import { getTopHeadlines } from "../services/gnews";

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breakingNewsData = useMemo(() => {
    return data.map((item, index) => ({
      id: item.url || index.toString(),
      title: item.title,
      image: item.image,
      category: "Breaking",
      sourceName: item.source?.name ?? "Unknown",
      date: new Date(item.publishedAt).toLocaleDateString("en-US"),
    }));
  }, [data]);

  useEffect(() => {
    let isMounted = true;
    getTopHeadlines({ topic: "technology", lang: "en", max: 10 })
      .then((response) => {
        if (isMounted) {
          setData(response.articles);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Failed to fetch top headlines");
          setLoading(false);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right", "top"]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right", "top"]}>
        <Text
          style={{
            color: "red",
            fontSize: 18,
            textAlign: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <FlatList
        data={newsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewsListItem
            item={item}
            onPress={() =>
              router.push({ pathname: "/news/[id]", params: { id: item.id } })
            }
          />
        )}
        ListHeaderComponent={
          <>
            <SectionHeader
              title="Breaking News"
              onPress={() => console.log("Viewall")}
            />
            <BreakingNewsCarousel data={breakingNewsData} />
            <SectionHeader
              title="Recommendation"
              onPress={() => console.log("Viewall")}
            />
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
});
